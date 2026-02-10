"use client";
import React, { useState } from "react";
import { MdSearch, MdFilterList, MdMoreHoriz, MdBlock, MdCheckCircle, MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

const users = [
    {
        id: 1,
        name: "Michael Scott",
        email: "michael@dundermifflin.com",
        role: "Property Manager",
        status: "Active",
        joinDate: "Jan 12, 2024",
        propertiesListed: 15
    },
    {
        id: 2,
        name: "Dwight Schrute",
        email: "dwight@farms.com",
        role: "Agent",
        status: "Active",
        joinDate: "Feb 05, 2024",
        propertiesListed: 42
    },
    {
        id: 3,
        name: "Jim Halpert",
        email: "jim@sales.com",
        role: "User",
        status: "Inactive",
        joinDate: "Mar 10, 2024",
        propertiesListed: 0
    }
];

export default function UsersPage() {
    const { currentTheme } = useTheme();

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>User Management</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>Control user access, roles, and account status.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" size={20} style={{ color: currentTheme.textColor }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                            style={{
                                backgroundColor: currentTheme.cardBg,
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.textColor
                            }}
                        />
                    </div>
                    <button
                        className="px-4 py-2.5 border rounded-lg hover:brightness-95 font-bold text-sm flex items-center gap-2 transition-all"
                        style={{
                            backgroundColor: currentTheme.cardBg,
                            borderColor: currentTheme.borderColor,
                            color: currentTheme.headingColor
                        }}
                    >
                        <MdFilterList size={18} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div
                className="rounded-2xl border shadow-sm overflow-hidden backdrop-blur-md"
                style={{
                    backgroundColor: currentTheme.cardBg + 'E6',
                    borderColor: currentTheme.borderColor
                }}
            >
                <table className="w-full text-left">
                    <thead className="border-b" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>User Profile</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Role</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Contact Info</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase" style={{ color: currentTheme.textColor }}>Stats</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-500/5 transition-colors border-b last:border-0"
                                style={{ borderColor: currentTheme.borderColor }}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold border"
                                            style={{
                                                backgroundColor: currentTheme.background,
                                                borderColor: currentTheme.borderColor,
                                                color: currentTheme.headingColor
                                            }}
                                        >
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{user.name}</p>
                                            <p className="text-xs" style={{ color: currentTheme.textColor }}>Joined {user.joinDate}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === 'Property Manager' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        user.role === 'Agent' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: currentTheme.textColor }}>
                                            <MdOutlineMail /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: currentTheme.textColor }}>
                                            <MdOutlinePhone /> +1 234 567 890
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.status === 'Active' ? (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                            <MdCheckCircle size={16} /> Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: currentTheme.textColor }}>
                                            <MdBlock size={16} /> Inactive
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold" style={{ color: currentTheme.headingColor }}>
                                    {user.propertiesListed} <span className="text-xs font-normal" style={{ color: currentTheme.textColor }}>Listings</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="p-2 rounded-full transition-all hover:bg-gray-500/10"
                                        style={{ color: currentTheme.textColor }}
                                    >
                                        <MdMoreHoriz size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
