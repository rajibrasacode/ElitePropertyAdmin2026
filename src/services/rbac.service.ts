import { privetApi } from "@/services/axios";
import type {
  RbacRole,
  CreateRolePayload,
  UpdateRolePermissionsPayload,
  MyPermissionsResponse,
  PermissionsMatrix,
  PermissionsMap,
  ModuleKey,
  ActionKey,
} from "@/types/rbac.type";

export const getAllRoles = async (): Promise<RbacRole[]> => {
  const res = await privetApi.get<RbacRole[]>(`/rbac/roles`);
  return Array.isArray(res.data) ? res.data : (res.data as any).data;
};

export const getRoleById = async (id: number): Promise<RbacRole> => {
  const res = await privetApi.get<RbacRole>(`/rbac/roles/${id}`);
  return (res.data as any).data ?? res.data;
};

export const createRole = async (
  payload: CreateRolePayload,
): Promise<RbacRole> => {
  const res = await privetApi.post<RbacRole>(`/rbac/roles`, payload);
  return (res.data as any).data ?? res.data;
};

export const updateRolePermissions = async (
  id: number,
  payload: UpdateRolePermissionsPayload,
): Promise<RbacRole> => {
  const permissions = payload.permissions ?? payload.permission?.[0] ?? {};
  const requestBody = { permission: [permissions] };
  const res = await privetApi.patch<RbacRole>(`/rbac/roles/${id}`, requestBody);
  return (res.data as any).data ?? res.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await privetApi.delete(`/rbac/roles/${id}`);
};

export const getMyPermissions = async (): Promise<MyPermissionsResponse> => {
  const res =
    await privetApi.get<MyPermissionsResponse>(`/rbac/my-permissions`);
  return (res.data as any).data ?? res.data;
};

export const MODULE_CONFIG: {
  key: ModuleKey;
  label: string;
}[] = [
  { key: "campaign", label: "Campaigns" },
  { key: "properties", label: "Properties" },
  { key: "user_management", label: "User Management" },
];

export const ACTION_CONFIG: {
  key: ActionKey;
  label: string;
}[] = [
  { key: "add", label: "Add" },
  { key: "view", label: "View" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export const MODULE_KEYS = MODULE_CONFIG.map((m) => m.key);
export const ACTION_KEYS = ACTION_CONFIG.map((a) => a.key);

// API uses "properties" as canonical key. "property" is kept as a legacy alias.
const API_KEY_NORMALISE: Record<string, ModuleKey> = {
  campaign: "campaign",
  properties: "properties",
  property: "properties",
  user_management: "user_management",
};

export function mapPermissionsToMatrix(
  permissionEntries: RbacRole["permissions"],
): PermissionsMatrix {
  const matrix = MODULE_KEYS.reduce((acc, mod) => {
    acc[mod] = ACTION_KEYS.reduce(
      (a, act) => {
        a[act] = false;
        return a;
      },
      {} as Record<ActionKey, boolean>,
    );
    return acc;
  }, {} as PermissionsMatrix);

  const permMap = permissionEntries?.[0]?.permissions ?? {};

  (Object.keys(permMap) as string[]).forEach((rawKey) => {
    const mod = API_KEY_NORMALISE[rawKey];
    if (!mod || !matrix[mod]) return;

    const modulePerms = permMap[rawKey as keyof typeof permMap];
    if (!modulePerms) return;

    (Object.keys(modulePerms) as ActionKey[]).forEach((act) => {
      if (act in matrix[mod]) {
        matrix[mod][act] = modulePerms[act] ?? false;
      }
    });
  });

  return matrix;
}

export function mapMatrixToPermissionsMap(
  matrix: PermissionsMatrix,
): PermissionsMap {
  return MODULE_KEYS.reduce((acc, mod) => {
    acc[mod] = ACTION_KEYS.reduce(
      (a, act) => {
        a[act] = matrix[mod]?.[act] ?? false;
        return a;
      },
      {} as Record<ActionKey, boolean>,
    );
    return acc;
  }, {} as PermissionsMap);
}
