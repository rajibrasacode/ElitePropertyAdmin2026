"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deletePlanService,
  getAllPlansService,
  getPlanUsageCountsService,
} from "@/services/plans.service";
import type { Plan, PlanPagination, PlanUsageCounts } from "@/types/plans.types";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export function usePlans() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [pagination, setPagination] = useState<PlanPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQueryState] = useState(
    searchParams.get("search") ?? "",
  );
  const [filterType, setFilterTypeState] = useState(
    searchParams.get("plan_type") ?? "all",
  );
  const [filterStatus, setFilterStatusState] = useState(
    searchParams.get("is_active") !== null
      ? searchParams.get("is_active") === "true"
        ? "active"
        : "inactive"
      : "all",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1),
  );
  const [limit, setLimitState] = useState(
    Number(searchParams.get("limit") ?? 10),
  );
  const [planUsageById, setPlanUsageById] = useState<
    Record<number, PlanUsageCounts>
  >({});
  const [isPlanUsageLoading, setIsPlanUsageLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFetched = useRef(false);
  const usageRequestRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPlanUsage = useCallback(async (nextPlans: Plan[]) => {
    const requestId = ++usageRequestRef.current;

    if (nextPlans.length === 0) {
      setPlanUsageById({});
      setIsPlanUsageLoading(false);
      return;
    }

    setIsPlanUsageLoading(true);

    try {
      const usageMap = await getPlanUsageCountsService(
        nextPlans.map((plan) => plan.id),
      );

      if (usageRequestRef.current !== requestId) {
        return;
      }

      setPlanUsageById(usageMap);
    } catch {
      if (usageRequestRef.current !== requestId) {
        return;
      }

      setPlanUsageById({});
    } finally {
      if (usageRequestRef.current === requestId) {
        setIsPlanUsageLoading(false);
      }
    }
  }, []);

  const updateURL = useCallback(
    (
      search: string,
      type: string,
      status: string,
      page: number,
      lim: number,
    ) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(lim));
      if (search.trim()) params.set("search", search.trim());
      if (type !== "all") params.set("plan_type", type);
      if (status !== "all") params.set("is_active", String(status === "active"));
      router.replace(`/plans?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const fetchPlans = useCallback(
    async (
      page = 1,
      search = searchQuery,
      type = filterType,
      status = filterStatus,
      lim = limit,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllPlansService({
          page,
          limit: lim,
          search: search.trim() || undefined,
          plan_type: type !== "all" ? type : undefined,
          is_active: status === "all" ? undefined : status === "active",
        });
        setPlans(res.data);
        setPagination(res.pagination);
        setCurrentPage(page);
        setPlanUsageById({});
        void fetchPlanUsage(res.data);
        updateURL(search, type, status, page, lim);
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to load plans";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [
      searchQuery,
      filterType,
      filterStatus,
      limit,
      fetchPlanUsage,
      updateURL,
    ],
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchPlans(currentPage, searchQuery, filterType, filterStatus);
  }, [currentPage, fetchPlans, filterStatus, filterType, searchQuery]);

  const setSearchQuery = (value: string) => {
    setSearchQueryState(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPlans(1, value, filterType, filterStatus);
    }, 400);
  };

  const setFilterType = (value: string) => {
    setFilterTypeState(value);
    fetchPlans(1, searchQuery, value, filterStatus);
  };

  const setFilterStatus = (value: string) => {
    setFilterStatusState(value);
    fetchPlans(1, searchQuery, filterType, value);
  };

  const handleSetPage = (page: number) => {
    fetchPlans(page, searchQuery, filterType, filterStatus, limit);
  };

  const setLimit = (value: number) => {
    setLimitState(value);
    fetchPlans(1, searchQuery, filterType, filterStatus, value);
  };

  const initiateDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await deletePlanService(deleteId);
      setPlans((prev) => prev.filter((plan) => plan.id !== deleteId));
      setPlanUsageById((prev) => {
        const next = { ...prev };
        delete next[deleteId];
        return next;
      });
      showSuccessToast("Plan deleted successfully");
    } catch {
      showErrorToast("Failed to delete plan");
    } finally {
      setIsDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const resetFilters = () => {
    setSearchQueryState("");
    setFilterTypeState("all");
    setFilterStatusState("all");
    setLimitState(10);
    fetchPlans(1, "", "all", "all", 10);
  };

  return {
    plans,
    pagination,
    currentPage,
    loading,
    error,
    mounted,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    resetFilters,
    deleteId,
    isDeleteLoading,
    planUsageById,
    isPlanUsageLoading,
    initiateDelete,
    cancelDelete,
    confirmDelete,
    limit,
    setLimit,
    handleSetPage,
    refetch: () => fetchPlans(currentPage),
  };
}
