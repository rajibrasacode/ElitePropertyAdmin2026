"use client";
import React, { useState } from "react";
import { MdAdd, MdArrowForward, MdSecurity, MdBusiness, MdHeadsetMic, MdMoreHoriz } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

// Dummy Data
const roles = [
    {
        id: 1,
        name: "Super Admin",
        description: "Full system access & configuration control.",
        usersCount: 3,
        icon: <MdSecurity size={24} className="text-white" />,
        color: "bg-[#1E3A8A]", // Royal Blue
    },
    {
        id: 2,
        name: "Property Manager",
        description: "Listing & agent management.",
        usersCount: 12,
        icon: <MdBusiness size={24} className="text-white" />,
        color: "bg-[#0F766E]", // Teal
    },
    {
        id: 3,
        name: "Support Agent",
        description: "Customer service & ticket handling.",
        usersCount: 8,
        icon: <MdHeadsetMic size={24} className="text-white" />,
        color: "bg-[#B45309]", // Amber
    },
];

export default function RolesPage() {
    const { currentTheme } = useTheme();
    const [expandedRole, setExpandedRole] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedRole(expandedRole === id ? null : id);
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>Access Control</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
                        Configure roles and manage user assignments.
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold text-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                >
                    <MdAdd size={20} />
                    <span>Add New Role</span>
                </button>
            </div>

            <div className="grid gap-4">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${expandedRole === role.id ? "shadow-md" : "hover:shadow-sm"}`}
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: expandedRole === role.id ? currentTheme.primary : currentTheme.borderColor
                        }}
                    >
                        {/* Header */}
                        <div
                            onClick={() => toggleExpand(role.id)}
                            className="p-5 cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${role.color}`}>
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold" style={{ color: currentTheme.headingColor }}>{role.name}</h3>
                                    <p className="text-sm mt-0.5" style={{ color: currentTheme.textColor }}>{role.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textColor, opacity: 0.7 }}>{role.usersCount} Users</p>
                                </div>

                                <button
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80 ${expandedRole === role.id ? "rotate-90 text-white" : ""}`}
                                    style={{
                                        backgroundColor: expandedRole === role.id ? currentTheme.primary : currentTheme.background,
                                        color: expandedRole === role.id ? 'white' : currentTheme.textColor
                                    }}
                                >
                                    <MdArrowForward size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedRole === role.id && (
                            <div className="border-t p-6" style={{ backgroundColor: currentTheme.background + '80', borderColor: currentTheme.borderColor }}>
                                <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                    <table className="w-full text-left">
                                        <thead className="border-b" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>User Name</th>
                                                <th className="px-6 py-3 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Email Address</th>
                                                <th className="px-6 py-3 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Status</th>
                                                <th className="px-6 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                                            <tr className="hover:bg-gray-500/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border"
                                                            style={{
                                                                backgroundColor: currentTheme.background,
                                                                borderColor: currentTheme.borderColor,
                                                                color: currentTheme.primary
                                                            }}
                                                        >
                                                            JD
                                                        </div>
                                                        <span className="font-bold text-sm" style={{ color: currentTheme.primary }}>John Doe</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm" style={{ color: currentTheme.textColor }}>john.doe@example.com</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="hover:text-opacity-80 p-1" style={{ color: currentTheme.textColor }}>
                                                        <MdMoreHoriz size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
