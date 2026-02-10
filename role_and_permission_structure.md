# Role and Permission Structure (Reference from ElitePropertyFrontend2025)

This document outlines the existing role and permission architecture found in the `ElitePropertyFrontend2025` project. Use this as a guide for implementing the Admin Portal.

## 1. Data Models & Types (`src/types/auth.types.ts`)

The system uses a granular **CRUD** (Create, Read, Update, Delete) permission model for specific resources (e.g., **Campaigns** and **Properties**).

### Role Structure
```typescript
interface Role {
  Id: number;
  Name: string;         // e.g., "super_admin", "agent"
  role_title: string;   // Display name
  permissions: RolePermission[];
}
```

### Permission Structure
Permissions are grouped by module (Campaign, Properties, etc.), and each module has 4 access flags:

```typescript
interface CrudPermissions {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

interface RolePermission {
  id: number;
  permissions: {
    campaign: CrudPermissions;
    properties: CrudPermissions;
  };
}
```

## 2. Frontend State Management (`src/contexts/AuthContext.tsx`)

The `AuthContext` is responsible for deriving and providing permission state to the rest of the application.

*   **Current User State**: Stores the full user object including their assigned roles.
*   **Derived Logic**:
    *   **isSuperAdmin**: Checked if `user.roles` contains `Id: 1` OR `Name: "super_admin"`.
    *   **permissions**: Extracted from `user.roles[0].permissions[0]`.
    *   **Memoization**: Extensive use of `useMemo` to ensure these values are stable and don't cause unnecessary re-renders.

## 3. API Services (`src/services/rbac.service.ts`)

There is a dedicated RBAC service file handling all role-related API calls.

| Function | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `getMyPermissionsService` | `GET` | `/rbac/my-permissions` | Gets permissions for the logged-in user. |
| `getRolesService` | `GET` | `/rbac/roles` | Fetches a list of all available roles. |
| `createRoleService` | `POST` | `/rbac/roles` | Creates a new role. |
| `getRolePermissionsByIdService` | `GET` | `/rbac/roles/${id}` | Gets specific permissions for a role ID. |
| `updateRolePermissionsByIdService` | `PATCH` | `/rbac/roles/${id}` | Updates permissions for a role ID. |
| `deleteRoleByIdService` | `DELETE` | `/rbac/roles/${id}` | Deletes a role. |

## 4. Permission Management UI (`src/app/(main)/permission/page.tsx`)

This page allows Admins to configure what each role can do.

### Core Logic
*   **Select Role**: A dropdown to select which Role to edit (e.g., "Manager", "Sales").
*   **Matrix UI**: Displays a grid of checkboxes for `Campaign` and `Property` modules against `View`, `Create`, `Edit`, `Delete` actions.

### Logic Rules
1.  **Dependency**: If **View** is unchecked, all other permissions (Create, Edit, Delete) are automatically unchecked and disabled.
2.  **Super Admin Default**: The Super Admin role has all permissions enabled by default and they are widely locked (cannot be unchecked).

### Saving Logic
Constructs a payload with the updated boolean flags and calls `updateRolePermissionsByIdService`.

```typescript
// Example Payload
const payload = {
  permission: [
    {
      campaign: {
        add: true,
        view: true,
        edit: false,
        delete: false,
      },
      properties: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
    },
  ],
};
```
