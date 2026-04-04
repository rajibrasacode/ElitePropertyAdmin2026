import type { Plan, PlanUsageCounts } from "@/types/plans.types";

export interface PlanDeleteGuard {
  isBlocked: boolean;
  reasons: string[];
  tooltip: string;
}

const pluralize = (count: number, singular: string) =>
  count === 1 ? singular : `${singular}s`;

const toCount = (value: unknown): number | null => {
  if (Array.isArray(value)) {
    return value.length;
  }

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

const firstAvailableCount = (...values: unknown[]): number => {
  for (const value of values) {
    const count = toCount(value);
    if (count !== null) {
      return Math.max(0, count);
    }
  }

  return 0;
};

export const getPlanDeleteGuard = (
  plan: Plan,
  usage?: PlanUsageCounts,
  options?: { isChecking?: boolean },
): PlanDeleteGuard => {
  if (options?.isChecking) {
    return {
      isBlocked: true,
      reasons: ["Checking linked organizations, subscriptions, and users"],
      tooltip: "Checking linked organizations, subscriptions, and users...",
    };
  }

  const organizationCount = firstAvailableCount(
    usage?.organizationCount,
    plan.organization_count,
    plan.organizations_count,
    plan.organizations,
    plan.organization ? 1 : null,
    plan.organization_id ? 1 : null,
  );

  const subscriptionCount = firstAvailableCount(
    usage?.subscriptionCount,
    plan.subscription_count,
    plan.subscriptions_count,
    plan.subscriptions,
  );

  const userCount = firstAvailableCount(
    usage?.userCount,
    plan.user_count,
    plan.users_count,
    plan.users,
    plan.role?.user_count,
    plan.role?.users,
  );

  const reasons: string[] = [];

  if (organizationCount > 0) {
    if (organizationCount === 1 && plan.organization?.name) {
      reasons.push(`linked to organization "${plan.organization.name}"`);
    } else {
      reasons.push(
        `linked to ${organizationCount} ${pluralize(organizationCount, "organization")}`,
      );
    }
  }

  if (subscriptionCount > 0) {
    reasons.push(
      `used by ${subscriptionCount} ${pluralize(subscriptionCount, "subscription")}`,
    );
  }

  if (userCount > 0) {
    reasons.push(`assigned to ${userCount} ${pluralize(userCount, "user")}`);
  }

  if (reasons.length === 0) {
    return {
      isBlocked: false,
      reasons: [],
      tooltip: "Delete Plan",
    };
  }

  return {
    isBlocked: true,
    reasons,
    tooltip: `Delete disabled: ${reasons.join("; ")}.`,
  };
};
