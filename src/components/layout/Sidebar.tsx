"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
    MdDashboard,
    MdSecurity,
    MdAdminPanelSettings,
    MdSettings,
    MdChevronRight,
    MdChevronLeft,
    MdLogout,
    MdClose,
    MdBusiness,
    MdPeople,
    MdCampaign
} from "react-icons/md";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { currentTheme } = useTheme();
    const { logout } = useAuth();

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    const isActiveLink = (path: string) => pathname === path;

    // 🔹 Theme-Aware Nav Link
    const NavLink = ({
        name,
        icon,
        path,
        isSub = false
    }: { name: string; icon: React.ReactNode; path: string; isSub?: boolean }) => {
        const active = isActiveLink(path);

        return (
            <Link
                href={path}
                className={`
          relative flex items-center gap-3 px-3.5 py-2.5 mx-3 mb-1 rounded-[10px] transition-all duration-200 group
          ${active
                        ? "shadow-md translate-x-1"
                        : "opacity-70 hover:opacity-100 hover:bg-white/10"
                    }
          ${collapsed && !mobileOpen ? "justify-center px-0" : ""}
        `}
                style={{
                    backgroundColor: active ? currentTheme.primary : 'transparent',
                    color: active ? '#ffffff' : currentTheme.sidebarText,
                }}
            >
                {/* Icon */}
                <span className={`
            relative z-10 transition-transform duration-200
            ${active ? "text-white" : "group-hover:scale-105"}
        `}>
                    {icon}
                </span>

                {/* Text */}
                {(!collapsed || mobileOpen) && (
                    <span className={`relative z-10 text-[13px] font-medium tracking-wide ${active ? "opacity-100 font-bold" : "opacity-90"}`}>
                        {name}
                    </span>
                )}
            </Link>
        );
    };

    const SectionLabel = ({ label }: { label: string }) => (
        (!collapsed || mobileOpen) ? (
            <div className="px-5 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider opacity-50" style={{ color: currentTheme.sidebarText }}>
                {label}
            </div>
        ) : (
            <div className="h-4"></div>
        )
    );

    return (
        <>
            <div
                className={`fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside
                className={`
            fixed md:sticky top-0 left-0 h-screen z-[90] transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col
            ${mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full md:translate-x-0"}
            ${collapsed ? "md:w-[80px]" : "md:w-[260px]"}
        `}
                style={{ backgroundColor: currentTheme.sidebarBg }}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-center relative border-b border-white/10 shrink-0">
                    <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed && !mobileOpen ? "scale-90" : ""}`}>
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            B
                        </div>

                        {(!collapsed || mobileOpen) && (
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold tracking-tight leading-none" style={{ color: currentTheme.sidebarText }}>Boltz</h1>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60" style={{ color: currentTheme.sidebarText }}>Admin Portal</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden absolute top-6 right-4 hover:opacity-80"
                        style={{ color: currentTheme.sidebarText }}
                    >
                        <MdClose size={22} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">

                    <NavLink name="Dashboard" icon={<MdDashboard size={20} />} path="/dashboard" />

                    <SectionLabel label="Management" />
                    <NavLink name="Properties" icon={<MdBusiness size={20} />} path="/properties" />
                    <NavLink name="Users & Agents" icon={<MdPeople size={20} />} path="/users" />
                    <NavLink name="Campaigns" icon={<MdCampaign size={20} />} path="/campaigns" />

                    <SectionLabel label="System" />
                    <NavLink name="Access Roles" icon={<MdAdminPanelSettings size={20} />} path="/roles" />
                    <NavLink name="Permissions" icon={<MdSecurity size={20} />} path="/permissions" />
                    <NavLink name="Settings" icon={<MdSettings size={20} />} path="/settings" />
                </nav>

                {/* Footer User */}
                <div className="p-4 border-t border-white/10 shrink-0 bg-black/10">
                    <div className={`
                  flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group
                  ${collapsed && !mobileOpen ? "justify-center border-0 bg-transparent p-0" : ""}
               `}>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-transparent transition-colors shadow-sm" style={{ color: currentTheme.sidebarText }}>
                            JD
                        </div>

                        {(!collapsed || mobileOpen) && (
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate !text-white" style={{ color: '#FFFFFF' }}>John Doe</h4>
                                <p className="text-[10px] font-medium truncate opacity-70 !text-white" style={{ color: '#FFFFFF' }}>Super Admin</p>
                            </div>
                        )}

                        {(!collapsed || mobileOpen) && (
                            <button
                                onClick={() => { logout(); router.push('/login'); }}
                                className="text-white/50 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-white/10"
                                title="Logout"
                            >
                                <MdLogout size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex absolute -right-3 top-24 w-6 h-6 border rounded-full items-center justify-center shadow-lg hover:scale-110 transition-all z-50"
                    style={{
                        backgroundColor: currentTheme.sidebarBg,
                        borderColor: currentTheme.sidebarText,
                        color: currentTheme.sidebarText
                    }}
                >
                    {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
