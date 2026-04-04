import { privetApi } from "@/services/axios";
import { getUsers } from "@/services/user.service";
import type {
  CreatePlanPayload,
  PaginatedPlansResponse,
  Plan,
  PlanUsageCounts,
  UpdatePlanPayload,
} from "@/types/plans.types";

export interface GetPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  plan_type?: string;
  is_active?: boolean;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const normalizeCollection = (payload: unknown): UnknownRecord[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return payload.data.filter(isRecord);
  }

  if (isRecord(payload.data) && Array.isArray(payload.data.data)) {
    return payload.data.data.filter(isRecord);
  }

  return [];
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const getNestedRecord = (record: UnknownRecord, key: string): UnknownRecord | null =>
  isRecord(record[key]) ? record[key] : null;

const getSet = <T,>(map: Record<number, Set<T>>, key: number): Set<T> => {
  if (!map[key]) {
    map[key] = new Set<T>();
  }

  return map[key];
};

const getPlanIdFromSubscription = (record: UnknownRecord): number | null => {
  const planRecord =
    getNestedRecord(record, "plan") ??
    getNestedRecord(record, "subscription_plan");

  return (
    toNumber(record.plan_id) ??
    toNumber(record.planId) ??
    toNumber(planRecord?.id)
  );
};

const getUserIdFromSubscription = (
  record: UnknownRecord,
): string | number | null => {
  const userRecord = getNestedRecord(record, "user");
  const userId = record.user_id ?? record.userId ?? userRecord?.id;

  if (typeof userId === "string" || typeof userId === "number") {
    return userId;
  }

  return null;
};

// GET /plans - all plans with pagination + server-side search/filter
export const getAllPlansService = async (
  params: GetPlansParams = {},
): Promise<PaginatedPlansResponse> => {
  const { page = 1, limit = 6, search, plan_type, is_active } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (plan_type) query.set("plan_type", plan_type);
  if (is_active !== undefined) query.set("is_active", String(is_active));

  const res = await privetApi.get(`/plans?${query.toString()}`);
  const body = res.data;
  return {
    is_success: body?.is_success ?? true,
    message: body?.message ?? "",
    data: Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [],
    pagination: body?.pagination ?? { total: 0, page: 1, limit, totalPages: 1 },
  };
};

// GET /plans/active - public, no auth needed
export const getActivePlansService = async (): Promise<Plan[]> => {
  const res = await privetApi.get("/plans/active");
  const body = res.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
};

// GET /plans/:id
export const getPlanByIdService = async (id: number | string): Promise<Plan> => {
  const res = await privetApi.get(`/plans/${id}`);
  const body = res.data;
  return body?.data ?? body;
};

// POST /plans - Super Admin only
export const createPlanService = async (
  payload: CreatePlanPayload,
): Promise<{ message: string; data: Plan }> => {
  const res = await privetApi.post("/plans", payload);
  return res.data;
};

// PUT /plans/:id - Super Admin only
export const updatePlanService = async (
  id: number | string,
  payload: UpdatePlanPayload,
): Promise<{ message: string; data: Plan }> => {
  const res = await privetApi.put(`/plans/${id}`, payload);
  return res.data;
};

// DELETE /plans/:id - Super Admin only
export const deletePlanService = async (id: number | string): Promise<void> => {
  await privetApi.delete(`/plans/${id}`);
};

export const getPlanUsageCountsService = async (
  planIds: number[],
): Promise<Record<number, PlanUsageCounts>> => {
  const uniquePlanIds = [...new Set(planIds.filter((id) => Number.isFinite(id)))];
  const usageMap = Object.fromEntries(
    uniquePlanIds.map((id) => [
      id,
      { organizationCount: 0, subscriptionCount: 0, userCount: 0 },
    ]),
  ) as Record<number, PlanUsageCounts>;

  if (uniquePlanIds.length === 0) {
    return usageMap;
  }

  const planIdSet = new Set(uniquePlanIds);
  const userIdsByPlan: Record<number, Set<string | number>> = {};
  const subscriptionIdsByPlan: Record<number, Set<string | number>> = {};

  const [usersResult, subscriptionsResult] = await Promise.allSettled([
    getUsers({ page: 1, limit: 5000 }),
    privetApi.get("/subscriptions"),
  ]);

  if (usersResult.status === "fulfilled") {
    const users = normalizeCollection(usersResult.value);

    for (const userRecord of users) {
      const subscriptionRecord = getNestedRecord(userRecord, "subscription");
      const planRecord = subscriptionRecord
        ? getNestedRecord(subscriptionRecord, "plan")
        : null;
      const planId = toNumber(planRecord?.id);

      if (!planId || !planIdSet.has(planId)) {
        continue;
      }

      if (typeof userRecord.id === "string" || typeof userRecord.id === "number") {
        getSet(userIdsByPlan, planId).add(userRecord.id);
      }

      if (
        subscriptionRecord &&
        (typeof subscriptionRecord.id === "string" ||
          typeof subscriptionRecord.id === "number")
      ) {
        getSet(subscriptionIdsByPlan, planId).add(subscriptionRecord.id);
      }
    }
  }

  if (subscriptionsResult.status === "fulfilled") {
    const subscriptions = normalizeCollection(subscriptionsResult.value.data);
    const subscriptionUserIdsByPlan: Record<number, Set<string | number>> = {};

    subscriptions.forEach((subscriptionRecord, index) => {
      const planId = getPlanIdFromSubscription(subscriptionRecord);

      if (!planId || !planIdSet.has(planId)) {
        return;
      }

      const subscriptionId =
        typeof subscriptionRecord.id === "string" ||
        typeof subscriptionRecord.id === "number"
          ? subscriptionRecord.id
          : `${planId}-${index}`;

      getSet(subscriptionIdsByPlan, planId).add(subscriptionId);

      const userId = getUserIdFromSubscription(subscriptionRecord);
      if (userId !== null) {
        getSet(subscriptionUserIdsByPlan, planId).add(userId);
      }
    });

    uniquePlanIds.forEach((planId) => {
      if (subscriptionUserIdsByPlan[planId]) {
        usageMap[planId].userCount = Math.max(
          usageMap[planId].userCount ?? 0,
          subscriptionUserIdsByPlan[planId].size,
        );
      }
    });
  }

  uniquePlanIds.forEach((planId) => {
    if (userIdsByPlan[planId]) {
      usageMap[planId].userCount = Math.max(
        usageMap[planId].userCount ?? 0,
        userIdsByPlan[planId].size,
      );
    }

    if (subscriptionIdsByPlan[planId]) {
      usageMap[planId].subscriptionCount = subscriptionIdsByPlan[planId].size;
    }
  });

  return usageMap;
};
