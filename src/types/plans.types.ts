export interface PlanPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface PlanPermissionsMap {
  [module: string]: PlanPermission;
}

export interface PlanRoleUser {
  id: number | string;
  username?: string;
}

export interface PlanRole {
  Id: number;
  Name: string;
  role_title: string;
  permissions: Array<{ id: number; permissions: PlanPermissionsMap }>;
  users?: PlanRoleUser[];
  user_count?: number;
}

export interface PlanOrganization {
  id: number;
  name: string;
  industry: string;
  size: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatures {
  [key: string]: string | number | boolean;
}

export interface PlanUserSummary {
  id: number | string;
  username?: string;
}

export interface PlanSubscriptionSummary {
  id: number | string;
  user_id?: number | string;
  plan_id?: number | string;
  status?: string;
}

export interface PlanUsageCounts {
  organizationCount?: number;
  subscriptionCount?: number;
  userCount?: number;
}

export interface Plan {
  id: number;
  name: string;
  display_name: string;
  description: string;
  price: number;
  billing_cycle: string;
  plan_type: string;
  role: PlanRole;
  role_id: number;
  organization: PlanOrganization | null;
  organization_id: number | null;
  is_active: boolean;
  features: PlanFeatures | string[];
  created_at: string;
  updated_at: string;
  organizations?: PlanOrganization[];
  organization_count?: number;
  organizations_count?: number;
  users?: PlanUserSummary[];
  user_count?: number;
  users_count?: number;
  subscriptions?: PlanSubscriptionSummary[];
  subscription_count?: number;
  subscriptions_count?: number;
}

// Pagination
export interface PlanPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedPlansResponse {
  is_success: boolean;
  message: string;
  data: Plan[];
  pagination: PlanPagination;
}

// Payload for POST /plans
export type CreatePlanPayload = {
  name: string;
  display_name: string;
  description: string;
  price: number;
  billing_cycle: string;
  plan_type: string;
  role_id: number;
  organization_id: number;
  is_active: boolean;
  features: string[];
};

// Payload for PUT /plans/:id
export type UpdatePlanPayload = Partial<CreatePlanPayload>;
