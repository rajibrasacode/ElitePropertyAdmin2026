
/**
 * Authentication Utilities
 * Centralized logic for user authorization and role management
 */

// Define super admin constants
// We use ID 6 as the primary super admin ID based on current configuration
export const SUPER_ADMIN_ID = 6;
export const SUPER_ADMIN_ROLE_NAME = 'Super Admin';

/**
 * Checks if a user is a Super Admin based on ID or Role
 * This provides a dynamic way to identify super admins without relying on hardcoded emails
 */
export const isSuperAdmin = (user: any): boolean => {
    if (!user) return false;

    // Check by ID (handling string/number mismatch)
    const userId = Number(user.id);
    if (!isNaN(userId) && userId === SUPER_ADMIN_ID) {
        return true;
    }

    // Check by Role Name (if 'role' property exists as a string)
    if (user.role === SUPER_ADMIN_ROLE_NAME) {
        return true;
    }

    // Check inside roles array (if 'roles' property exists as an array)
    if (user.roles && Array.isArray(user.roles)) {
        return user.roles.some((r: any) =>
            (r.Name && r.Name === SUPER_ADMIN_ROLE_NAME) ||
            (r.role_title && r.role_title === SUPER_ADMIN_ROLE_NAME)
        );
    }

    return false;
};

/**
 * Checks if a user has access to the admin dashboard.
 * Access is granted if:
 * 1. User is Super Admin
 * 2. User has assigned roles WITH meaningful permissions
 */
export const hasDashboardAccess = (user: any): boolean => {
    if (!user) return false;

    // Super Admin always has access
    if (isSuperAdmin(user)) {
        // console.log("Access Granted: User is Super Admin", user.id);
        return true;
    }

    // Users with assigned roles have access ONLY if those roles contain permissions
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        // Check if ANY of the roles have a permissions array that is not empty
        const hasPermissions = user.roles.some((role: any) =>
            role.permissions &&
            Array.isArray(role.permissions) &&
            role.permissions.length > 0
        );

        if (hasPermissions) {
            // console.log("Access Granted: User has roles with permissions", user.roles);
            return true;
        }
    }

    console.warn("Access Denied: User is not Super Admin and has no valid permissions.", user);
    return false;
};
