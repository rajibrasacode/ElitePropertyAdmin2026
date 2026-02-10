"use client";
import React, { useState } from "react";
import { MdSave, MdRestartAlt, MdOutlineShield, MdLockOutline, MdCampaign, MdBusiness, MdPeople, MdSettings } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

const permissionsData = {
    campaign: { view: true, create: false, edit: false, delete: false },
    properties: { view: true, create: true, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false }
};

const modules = [
    { key: "campaign", label: "Campaigns", icon: <MdCampaign size={20} /> },
    { key: "properties", label: "Properties", icon: <MdBusiness size={20} /> },
    { key: "users", label: "Users", icon: <MdPeople size={20} /> },
    { key: "settings", label: "Settings", icon: <MdSettings size={20} /> },
];

const actions = [
    { key: "view", label: "View" },
    { key: "create", label: "Create" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
];

export default function PermissionsPage() {
    const { currentTheme } = useTheme();
    const [selectedRole, setSelectedRole] = useState("manager");
    const [permissions, setPermissions] = useState<any>(permissionsData);

    const handleToggle = (moduleKey: string, actionKey: string) => {
        setPermissions((prev: any) => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                [actionKey]: !prev[moduleKey][actionKey],
            },
        }));
    };

    return (
        <div className="max-w-[1600px] mx-auto py-4 space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>Permissions Matrix</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>Define granular capability sets for each user role.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 border rounded-lg text-sm font-bold hover:brightness-95 transition-all shadow-sm flex items-center gap-2"
                        style={{
                            backgroundColor: currentTheme.cardBg,
                            borderColor: currentTheme.borderColor,
                            color: currentTheme.textColor
                        }}
                    >
                        <MdRestartAlt size={16} />
                        Reset Defaults
                    </button>
                    <button
                        className="px-5 py-2 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold flex items-center gap-2 text-sm"
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        <MdSave size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Context Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div
                        className="p-5 rounded-2xl shadow-sm border flex flex-col gap-4 sticky top-24 backdrop-blur-md"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: currentTheme.borderColor
                        }}
                    >
                        <div className="w-10 h-10 rounded-lg text-white flex items-center justify-center text-xl shadow-md" style={{ backgroundColor: currentTheme.primary }}>
                            <MdOutlineShield />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Role Context</h2>
                            <p className="text-xs mt-1" style={{ color: currentTheme.textColor }}>Select role to modify permissions:</p>
                        </div>

                        <div className="relative">
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm"
                                style={{
                                    backgroundColor: currentTheme.background,
                                    borderColor: currentTheme.borderColor,
                                    color: currentTheme.headingColor
                                }}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="super_admin">Super Admin</option>
                                <option value="manager">Property Manager</option>
                                <option value="agent">Sales Agent</option>
                                <option value="customer">Customer</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]" style={{ color: currentTheme.textColor }}>▼</div>
                        </div>

                        {selectedRole === 'super_admin' && (
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 text-amber-800 font-medium text-xs">
                                <MdLockOutline size={16} className="shrink-0" />
                                <p>System Locked: Super Admin permissions cannot be modified.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Matrix */}
                <div className="lg:col-span-3">
                    <div
                        className="rounded-2xl shadow-sm border overflow-hidden backdrop-blur-md"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: currentTheme.borderColor
                        }}
                    >
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                                    <th className="text-left px-6 py-4 font-bold uppercase tracking-wider text-xs w-1/3" style={{ color: currentTheme.textColor }}>Target Module</th>
                                    {actions.map(action => (
                                        <th key={action.key} className="px-4 py-4 font-bold uppercase tracking-wider text-center text-xs" style={{ color: currentTheme.textColor }}>
                                            {action.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                                {modules.map((module) => (
                                    <tr key={module.key} className="hover:bg-gray-500/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="" style={{ color: currentTheme.textColor }}>{module.icon}</span>
                                                <p className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{module.label}</p>
                                            </div>
                                        </td>
                                        {actions.map((action) => {
                                            const isChecked = permissions[module.key]?.[action.key] ?? false;
                                            const isDisabled = action.key !== 'view' && !permissions[module.key]?.view;
                                            const isSuperAdmin = selectedRole === 'super_admin';

                                            return (
                                                <td key={action.key} className="px-4 py-4 text-center">
                                                    <label className={`
                                                inline-flex items-center justify-center cursor-pointer
                                                ${isSuperAdmin || isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                                              `}>
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={isSuperAdmin ? true : isChecked}
                                                            onChange={() => !isSuperAdmin && !isDisabled && handleToggle(module.key, action.key)}
                                                            disabled={isDisabled || isSuperAdmin}
                                                        />
                                                        {/* Corporate Toggle Switch */}
                                                        <div
                                                            className={`
                                                      w-10 h-5 rounded-full transition-colors duration-200 ease-in-out relative
                                                  `}
                                                            style={{
                                                                backgroundColor: isChecked || isSuperAdmin ? currentTheme.primary : currentTheme.borderColor
                                                            }}
                                                        >
                                                            <div className={`
                                                        absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200
                                                        ${isChecked || isSuperAdmin ? "translate-x-5" : "translate-x-0"}
                                                      `}></div>
                                                        </div>
                                                    </label>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
