export const SUPER_ADMIN_ROLE_KEY = "super_admin";
export const ENTERPRIZE_ROLE_KEY = "enterprise_role";

// Matches both string roles ("super_admin") and object roles ({ Name: "super_admin" } or { name: "super_admin" })
const matchesRole = (r: any, key: string): boolean =>
  r === key || r?.Name === key || r?.name === key;

export const isSuperAdmin = (user: any): boolean => {
  if (!user) return false;
  if (Array.isArray(user.roles)) {
    return user.roles.some((r: any) => matchesRole(r, SUPER_ADMIN_ROLE_KEY));
  }
  return false;
};

export const isEnterpriseAdmin = (user: any): boolean => {
  if (!user) return false;
  if (Array.isArray(user.roles)) {
    return user.roles.some((r: any) => matchesRole(r, ENTERPRIZE_ROLE_KEY));
  }
  return false;
};

// Only super_admin and enterprise_role are allowed to access the dashboard
export const hasDashboardAccess = (user: any): boolean => {
  return isSuperAdmin(user) || isEnterpriseAdmin(user);
};
