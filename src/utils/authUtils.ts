export const SUPER_ADMIN_ROLE_KEY = "super_admin";

export const isSuperAdmin = (user: any): boolean => {
  if (!user) return false;

  if (Array.isArray(user.roles)) {
    if (user.roles.some((r: any) => r === SUPER_ADMIN_ROLE_KEY)) {
      return true;
    }
  }

  return false;
};

export const hasDashboardAccess = (user: any): boolean => {
  if (!user) return false;

  if (isSuperAdmin(user)) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some(
      (role: any) =>
        role?.permissions &&
        Array.isArray(role.permissions) &&
        role.permissions.length > 0,
    );
  }

  return false;
};
