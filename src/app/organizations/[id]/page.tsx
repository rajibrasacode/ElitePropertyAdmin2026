"use client";

import { useTheme } from "@/providers/ThemeProvider";
import {
    getOrganizationById,
    getOrganizationUsers,
    getOrganizationRoles,
    getOrganizationPlans,
    addUserToOrganization,
    removeUserFromOrganization,
    removeOrganizationPlan,
    updateOrganization
} from "@/services/organization.service";
import { Organization } from "@/types/organization.types";
import { getUsers } from "@/services/user.service";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdArrowBack,
    MdBusiness,
    MdPersonAdd,
    MdDelete,
    MdEmail,
    MdPhone,
    MdSecurity,
    MdLocalOffer,
    MdWarning,
    MdEdit,
    MdCheck,
    MdClear,
    MdPeople
} from "react-icons/md";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function OrganizationDetailsPage() {
    const { currentTheme } = useTheme();
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'plans' | 'roles'>('users');

    // Add User Modal State
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [addingUser, setAddingUser] = useState(false);

    // Remove Confirm State
    const [confirmAction, setConfirmAction] = useState<{ type: 'user' | 'plan', id: number } | null>(null);
    const [removing, setRemoving] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', industry: '', logo_url: '' });
    const [updating, setUpdating] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");



    const fetchData = async () => {
        if (!id || isNaN(id)) return;

        setLoading(true);
        try {
            // 1. Fetch Organization Details (Critical)
            let orgData: any;
            try {
                orgData = await getOrganizationById(id);
                // Handle potential data wrapping
                if (orgData.data) orgData = orgData.data;

                setOrganization(orgData);
                setEditFormData({
                    name: orgData.name || '',
                    industry: orgData.industry || '',
                    logo_url: orgData.logo_url || ''
                });
            } catch (err) {
                console.error("Critical: Failed to fetch organization details", err);
                setOrganization(null);
                return; // Stop if main org fetch fails
            }

            // 2. Fetch Related Data (Non-Critical) - Fail metrics gracefully
            const [usersData, rolesData, plansData] = await Promise.all([
                getOrganizationUsers(id).catch(err => {
                    console.warn("Failed to fetch users", err);
                    return [];
                }),
                getOrganizationRoles(id).catch(err => {
                    console.warn("Failed to fetch roles", err);
                    return [];
                }),
                getOrganizationPlans(id).catch(err => {
                    console.warn("Failed to fetch plans", err);
                    return [];
                })
            ]);

            setUsers(Array.isArray(usersData) ? usersData : (usersData as any).data || []);
            setRoles(Array.isArray(rolesData) ? rolesData : (rolesData as any).data || []);
            console.log("Roles Data Debug:", Array.isArray(rolesData) ? rolesData : (rolesData as any).data || []);
            setPlans(Array.isArray(plansData) ? plansData : (plansData as any).data || []);

        } catch (error) {
            console.error("Unexpected error in fetchData", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!roles.length) {
            setSelectedRoleId("");
            return;
        }

        const hasSelectedRole = roles.some((role) => {
            const roleId = String(role.id || role.Id || role._id || "");
            return roleId === selectedRoleId;
        });

        if (!selectedRoleId || !hasSelectedRole) {
            const firstRoleId = String(roles[0]?.id || roles[0]?.Id || roles[0]?._id || "");
            setSelectedRoleId(firstRoleId);
        }
    }, [roles, selectedRoleId]);

    const handleAddUserInit = async () => {
        setIsAddUserModalOpen(true);
        try {
            const res = await getUsers({ limit: 100 }); // Fetch potential users
            const allUsers = Array.isArray(res) ? res : res.data || [];
            // Filter users not already in the organization
            const existingUserIds = new Set(users.map(u => u.id));
            setAvailableUsers(allUsers.filter((u: any) => !existingUserIds.has(u.id)));
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleAddUser = async () => {
        if (!selectedUserId) return;
        setAddingUser(true);
        try {
            await addUserToOrganization(id, { user_id: Number(selectedUserId) });
            setIsAddUserModalOpen(false);
            setSelectedUserId("");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to add user", error);
        } finally {
            setAddingUser(false);
        }
    };

    const handleUpdateOrganization = async () => {
        setUpdating(true);
        try {
            await updateOrganization(id, editFormData);
            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Failed to update organization", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveConfirm = async () => {
        if (!confirmAction) return;
        setRemoving(true);
        try {
            if (confirmAction.type === 'user') {
                await removeUserFromOrganization(id, confirmAction.id);
            } else if (confirmAction.type === 'plan') {
                await removeOrganizationPlan(id, confirmAction.id);
            }
            setConfirmAction(null);
            fetchData();
        } catch (error) {
            console.error(`Failed to remove ${confirmAction.type}`, error);
        } finally {
            setRemoving(false);
        }
    };

    const roleModules = [
        { key: "campaign", label: "Campaigns", icon: <MdLocalOffer size={16} /> },
        { key: "properties", label: "Properties", icon: <MdBusiness size={16} /> },
        { key: "users", label: "Users", icon: <MdPeople size={16} /> },
    ];

    const roleActions = [
        { key: "view", label: "View" },
        { key: "create", label: "Create" },
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" },
    ];

    const selectedRole = roles.find((role) => {
        const roleId = String(role.id || role.Id || role._id || "");
        return roleId === selectedRoleId;
    });

    const selectedRoleName = selectedRole?.role || selectedRole?.name || selectedRole?.Name || selectedRole?.label || "Unknown Role";
    const selectedRoleDisplayName = String(selectedRoleName).replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    const selectedRoleDescription = selectedRole?.role_title || selectedRole?.description || selectedRole?.title || "Custom defined role with specific permission sets.";

    // Helper to check if a permission exists in the role's permissions array
    const checkPermission = (role: any, module: string, action: string) => {
        if (!role || !role.permissions || !Array.isArray(role.permissions)) {
            return false;
        }

        // Check if permission exists in the array
        // Permissions can be strings "module.action" or objects { permission_name: "module.action" }
        return role.permissions.some((p: any) => {
            const permissionString = typeof p === 'string' ? p : (p.permission_name || p.name || "");

            // Exact match "module.action"
            if (permissionString === `${module}.${action}`) return true;

            // Wildcard match "module.*"
            if (permissionString === `${module}.*`) return true;

            // Super wildcard "*"
            if (permissionString === "*") return true;

            return false;
        });
    };

    if (loading && !organization) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg font-bold animate-pulse" style={{ color: currentTheme.textColor }}>
                Loading Organization Details...
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-2xl font-bold text-red-500">Organization Not Found</div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto min-h-screen pb-20">

            {/* Header / Nav - Matching Property Details */}
            <div className="flex items-center justify-between  mb-2">
                <Link href="/organizations" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: currentTheme.textColor }}>
                    <MdArrowBack size={20} />
                    <span className="font-bold">Back to Organizations</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">

                {/* LEFT COLUMN - Sticky Profile & Actions */}
                <div className="lg:col-span-4 xl:col-span-3 sticky top-6 space-y-6">
                    {/* Organization Profile Card */}
                    <div className="rounded-2xl border shadow-sm overflow-hidden relative group"
                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
                    >
                        {/* Decorative Top Banner */}
                        <div className="h-24 w-full relative" style={{ backgroundColor: `${currentTheme.primary}15` }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                        </div>

                        <div className="px-6 pb-6 -mt-10 relative">
                            {/* Logo */}
                            <div className="h-20 w-20 rounded-2xl shadow-lg flex items-center justify-center text-3xl font-bold uppercase overflow-hidden border-4 mb-4"
                                style={{
                                    backgroundColor: currentTheme.cardBg,
                                    borderColor: currentTheme.cardBg,
                                    color: currentTheme.primary
                                }}
                            >
                                {organization.logo_url ? (
                                    <img src={organization.logo_url} alt={organization.name || "Org"} className="h-full w-full object-cover" />
                                ) : (
                                    (organization.name || "Org").slice(0, 2)
                                )}
                            </div>

                            {/* Info */}
                            <div className="mb-6">
                                <h1 className="text-xl font-bold leading-tight mb-2" style={{ color: currentTheme.headingColor }}>
                                    {organization.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-sm opacity-80 mb-1" style={{ color: currentTheme.textColor }}>
                                    <MdBusiness size={14} />
                                    <span>{organization.industry || "Unspecified Industry"}</span>
                                </div>
                            </div>

                            {/* Edit Action */}
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all hover:bg-black/5 flex items-center justify-center gap-2"
                                style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            >
                                <MdEdit size={16} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Tabs & Content */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="rounded-2xl border shadow-sm p-6 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>

                        {/* Header / Breadcrumbs Area */}
                        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: currentTheme.borderColor }}>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: currentTheme.textColor }}>
                                <span className="cursor-pointer hover:underline" onClick={() => router.push('/organizations')}>Organizations</span>
                                <span>/</span>
                                <span>{activeTab}</span>
                            </div>
                        </div>

                        {/* Secondary Navigation (Tabs) */}
                        <div>
                            <div className="flex items-center gap-1 border-b" style={{ borderColor: currentTheme.borderColor }}>
                                {[
                                    { id: 'users', label: 'Users', icon: MdPersonAdd, count: users.length },
                                    { id: 'plans', label: 'Plans', icon: MdLocalOffer, count: plans.length },
                                    { id: 'roles', label: 'Roles', icon: MdSecurity, count: roles.length },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as any)}
                                        className={`relative px-6 py-3 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === item.id
                                            ? 'opacity-100'
                                            : 'opacity-60 hover:opacity-100 hover:bg-black/5'
                                            }`}
                                        style={{
                                            color: activeTab === item.id ? currentTheme.primary : currentTheme.textColor
                                        }}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                        <span className="bg-black/5 px-1.5 py-0.5 rounded text-[10px] ml-1 opacity-70">
                                            {item.count}
                                        </span>
                                        {activeTab === item.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: currentTheme.primary }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="animate-in fade-in zoom-in-95 duration-200 min-h-[500px]">

                            {/* USERS - Modern Datatable List */}
                            {activeTab === 'users' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm opacity-70 font-medium" style={{ color: currentTheme.textColor }}>
                                            Managing access for {users.length} users
                                        </div>
                                        <button
                                            onClick={handleAddUserInit}
                                            className="px-4 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
                                            style={{ backgroundColor: currentTheme.primary }}
                                        >
                                            <MdPersonAdd size={16} /> Add User
                                        </button>
                                    </div>

                                    <div className="rounded-xl border shadow-sm overflow-hidden"
                                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b text-xs font-bold uppercase tracking-wider opacity-60 bg-black/[0.02]"
                                                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                                        <th className="py-4 px-6">User</th>
                                                        <th className="py-4 px-6">Contact</th>
                                                        <th className="py-4 px-6">Role</th>
                                                        <th className="py-4 px-6 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm divide-y" style={{ borderColor: currentTheme.borderColor }}>
                                                    {users.length > 0 ? users.map((user) => (
                                                        <tr key={user.id} className="hover:bg-black/[0.01] transition-colors">
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-sm shadow-inner"
                                                                        style={{ color: currentTheme.headingColor }}>
                                                                        {user.first_name?.[0] || user.username?.[0] || "U"}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold" style={{ color: currentTheme.headingColor }}>{user.first_name} {user.last_name}</div>
                                                                        <div className="text-xs opacity-60 font-mono" style={{ color: currentTheme.textColor }}>@{user.username}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="space-y-1">
                                                                    {user.email && (
                                                                        <div className="flex items-center gap-2 text-xs" style={{ color: currentTheme.textColor }}>
                                                                            <MdEmail size={14} className="opacity-50" /> {user.email}
                                                                        </div>
                                                                    )}
                                                                    {user.phone_number && (
                                                                        <div className="flex items-center gap-2 text-xs" style={{ color: currentTheme.textColor }}>
                                                                            <MdPhone size={14} className="opacity-50" /> {user.phone_number}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white"
                                                                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                    Active
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6 text-right">
                                                                <button
                                                                    onClick={() => setConfirmAction({ type: 'user', id: user.id })}
                                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors opacity-70 hover:opacity-100"
                                                                    title="Remove User"
                                                                >
                                                                    <MdDelete size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={4} className="py-16 text-center">
                                                                <div className="flex flex-col items-center gap-3 opacity-50">
                                                                    <div className="p-4 rounded-full bg-black/5">
                                                                        <MdPersonAdd size={32} />
                                                                    </div>
                                                                    <p className="font-medium">No users found.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PLANS - Pricing Card Style */}
                            {activeTab === 'plans' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm opacity-70 font-medium" style={{ color: currentTheme.textColor }}>
                                            Managing {plans.length} plans
                                        </div>
                                        <button
                                            onClick={() => console.log("Add Plan clicked")}
                                            className="px-4 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
                                            style={{ backgroundColor: currentTheme.primary }}
                                        >
                                            <MdLocalOffer size={16} /> Add Plan
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                        {plans.length > 0 ? plans.map((plan) => (
                                            <div key={plan.id} className="relative flex flex-col border rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg bg-gradient-to-b from-white to-gray-50/50"
                                                style={{ borderColor: currentTheme.borderColor }}>
                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
                                                    style={{ color: currentTheme.primary }}></div>

                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="font-bold text-lg" style={{ color: currentTheme.headingColor }}>{plan.name}</div>
                                                    <button
                                                        onClick={() => setConfirmAction({ type: 'plan', id: plan.id })}
                                                        className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>

                                                <div className="mb-6">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-extrabold" style={{ color: currentTheme.primary }}>${plan.price}</span>
                                                        <span className="text-xs font-bold uppercase opacity-60" style={{ color: currentTheme.textColor }}>/mo</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto border-t pt-4" style={{ borderColor: currentTheme.borderColor }}>
                                                    <p className="text-sm opacity-70 leading-relaxed" style={{ color: currentTheme.textColor }}>
                                                        {plan.description || "Contains: Standard features, basic support, single user license."}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl flex flex-col items-center gap-3"
                                                style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                                <div className="p-4 rounded-full bg-black/5 opacity-50">
                                                    <MdLocalOffer size={32} />
                                                </div>
                                                <span className="opacity-60 font-medium">No subscription plans active.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ROLES - Cards + Right Side Permissions */}
                            {activeTab === 'roles' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm opacity-70 font-medium" style={{ color: currentTheme.textColor }}>
                                            {roles.length} Custom Roles
                                        </div>
                                        <button
                                            onClick={() => console.log("Add Role clicked")}
                                            className="px-4 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
                                            style={{ backgroundColor: currentTheme.primary }}
                                        >
                                            <MdSecurity size={16} /> Add Role
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                                        <div className="xl:col-span-4 space-y-4">
                                            {roles.length > 0 ? roles.map((role, idx) => {
                                                const roleName = role.role || role.name || role.Name || role.label || "Unknown Role";
                                                const displayName = String(roleName).replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                                                const roleId = String(role.id || role.Id || role._id || idx);
                                                const roleDescription = role.role_title || role.description || role.title || "Custom defined role with specific permission sets.";
                                                const isSelected = roleId === selectedRoleId;

                                                return (
                                                    <div
                                                        key={roleId}
                                                        onClick={() => setSelectedRoleId(roleId)}
                                                        className={`group relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer ${isSelected ? 'shadow-md' : 'hover:shadow-md'}`}
                                                        style={{
                                                            borderColor: isSelected ? currentTheme.primary : currentTheme.borderColor,
                                                            backgroundColor: currentTheme.cardBg
                                                        }}
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full opacity-100 transition-opacity"
                                                            style={{ backgroundColor: isSelected ? currentTheme.primary : `${currentTheme.primary}40` }}></div>

                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="p-3 rounded-xl transition-colors shadow-sm"
                                                                style={{ backgroundColor: currentTheme.primary + '15', color: currentTheme.primary }}>
                                                                <MdSecurity size={24} />
                                                            </div>
                                                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-gray-100 text-gray-500 font-bold border border-gray-200">
                                                                ID: {roleId}
                                                            </span>
                                                        </div>

                                                        <div className="mb-2">
                                                            <h3 className="font-bold text-lg mb-1" style={{ color: currentTheme.headingColor }}>
                                                                {displayName}
                                                            </h3>
                                                            <p className="text-sm opacity-70 leading-relaxed line-clamp-2 min-h-[2.5em]" style={{ color: currentTheme.textColor }}>
                                                                {roleDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }) : (
                                                <div className="py-16 text-center border-2 border-dashed rounded-2xl flex flex-col items-center gap-3"
                                                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                                    <div className="p-4 rounded-full bg-black/5 opacity-50">
                                                        <MdSecurity size={32} />
                                                    </div>
                                                    <span className="opacity-60 font-medium">No custom roles defined.</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="xl:col-span-8">
                                            {selectedRole ? (
                                                <div className="rounded-2xl border overflow-hidden shadow-sm bg-white"
                                                    style={{ borderColor: currentTheme.borderColor }}>
                                                    <div className="p-6 border-b" style={{ borderColor: currentTheme.borderColor }}>
                                                        <h3 className="font-bold text-lg mb-1" style={{ color: currentTheme.headingColor }}>
                                                            {selectedRoleDisplayName}
                                                        </h3>
                                                        <p className="text-sm opacity-70 leading-relaxed" style={{ color: currentTheme.textColor }}>
                                                            {selectedRoleDescription}
                                                        </p>
                                                    </div>

                                                    <div className="bg-gray-50/50 p-4 xl:p-0">
                                                        <table className="w-full text-left border-collapse table-fixed">
                                                            <thead>
                                                                <tr className="border-b" style={{ borderColor: currentTheme.borderColor }}>
                                                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider opacity-50 w-1/3 text-left">Module</th>
                                                                    {roleActions.map(action => (
                                                                        <th key={action.key} className="py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider opacity-50">{action.label}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                                                                {roleModules.map((module) => (
                                                                    <tr key={module.key} className="bg-transparent hover:bg-black/[0.02] transition-colors">
                                                                        <td className="py-3 px-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <span style={{ color: currentTheme.primary }} className="opacity-80">{module.icon}</span>
                                                                                <span className="font-bold text-xs" style={{ color: currentTheme.headingColor }}>{module.label}</span>
                                                                            </div>
                                                                        </td>
                                                                        {roleActions.map((action) => {
                                                                            const hasAccess = checkPermission(selectedRole, module.key, action.key);

                                                                            return (
                                                                                <td key={action.key} className="py-3 px-4 text-center">
                                                                                    {hasAccess ? (
                                                                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 shadow-sm">
                                                                                            <MdCheck size={14} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 opacity-30">
                                                                                            <MdClear size={14} />
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-16 text-center border-2 border-dashed rounded-2xl flex flex-col items-center gap-3"
                                                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                                    <div className="p-4 rounded-full bg-black/5 opacity-50">
                                                        <MdSecurity size={32} />
                                                    </div>
                                                    <span className="opacity-60 font-medium">Select a role to view permissions.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {
                isAddUserModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300"
                            style={{ backgroundColor: currentTheme.cardBg }}
                        >
                            <h2 className="text-xl font-bold mb-4" style={{ color: currentTheme.headingColor }}>Add User to Organization</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2 ml-1" style={{ color: currentTheme.textColor }}>Select User</label>
                                {availableUsers.length > 0 ? (
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2"
                                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                                    >
                                        <option value="" disabled>Select a user...</option>
                                        {availableUsers.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.first_name} {user.last_name} ({user.email || user.username})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 rounded-xl border bg-yellow-50 text-yellow-700 text-sm flex items-center gap-2">
                                        <MdWarning /> No available users to add.
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold border transition-colors hover:bg-black/5 text-sm"
                                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddUser}
                                    disabled={addingUser || !selectedUserId}
                                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 text-sm"
                                    style={{ backgroundColor: currentTheme.primary }}
                                >
                                    {addingUser ? "Adding..." : "Add User"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Organization Modal */}
            {
                isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300"
                            style={{ backgroundColor: currentTheme.cardBg }}
                        >
                            <h2 className="text-xl font-bold mb-6" style={{ color: currentTheme.headingColor }}>Edit Organization</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1 opacity-80" style={{ color: currentTheme.textColor }}>Organization Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2"
                                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 opacity-80" style={{ color: currentTheme.textColor }}>Industry</label>
                                    <input
                                        type="text"
                                        value={editFormData.industry}
                                        onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                                        className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2"
                                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                                        placeholder="e.g. Real Estate"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 opacity-80" style={{ color: currentTheme.textColor }}>Logo URL</label>
                                    <input
                                        type="text"
                                        value={editFormData.logo_url}
                                        onChange={(e) => setEditFormData({ ...editFormData, logo_url: e.target.value })}
                                        className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2"
                                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold border transition-colors hover:bg-black/5 text-sm"
                                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateOrganization}
                                    disabled={updating || !editFormData.name}
                                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 text-sm"
                                    style={{ backgroundColor: currentTheme.primary }}
                                >
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Confirmation Modal for Removes */}
            <ConfirmModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleRemoveConfirm}
                title={`Remove ${confirmAction?.type === 'user' ? 'User' : 'Plan'}`}
                message={`Are you sure you want to remove this ${confirmAction?.type}?`}
                confirmLabel="Remove"
                confirmButtonColor="#ef4444"
                isLoading={removing}
            />


        </div>
    );
}
