"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { MdSearch, MdNotifications, MdMail, MdMenu } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider"; // Importing useTheme
import { useAuth } from "@/providers/AuthProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentTheme } = useTheme(); // Getting current theme
    const { user } = useAuth(); // Get user from AuthContext

    // Get initials or default to "A"
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "A";

    return (
        <div
            className="flex min-h-screen font-sans"
            style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.textColor
            }}
        >
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">

                {/* Header */}
                <div className="sticky top-0 z-40 px-6 pt-4 pb-2">
                    <header
                        className="h-[72px] px-6 rounded-2xl backdrop-blur-md border shadow-sm flex items-center justify-between transition-all duration-300"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6', // Adding opacity
                            borderColor: currentTheme.borderColor
                        }}
                    >

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden hover:opacity-80"
                                style={{ color: currentTheme.textColor }}
                            >
                                <MdMenu size={24} />
                            </button>

                            <div className="hidden sm:block">
                                <h2 className="text-lg font-bold tracking-tight animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-blue-500 pr-1" style={{ color: currentTheme.headingColor }}>
                                    Welcome Back, Rajib!
                                </h2>
                                <style jsx>{`
                                    @keyframes typing {
                                        0% { width: 0 }
                                        50% { width: 100% }
                                        90% { width: 100% }
                                        100% { width: 0 }
                                    }
                                    .animate-typing {
                                        animation: typing 6s steps(40, end) infinite;
                                        max-width: fit-content;
                                    }
                                `}</style>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="hidden md:flex items-center border rounded-lg px-4 py-2 w-80 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
                            style={{
                                backgroundColor: currentTheme.background,
                                borderColor: currentTheme.borderColor
                            }}
                        >
                            <MdSearch className="text-lg opacity-50" style={{ color: currentTheme.textColor }} />
                            <input
                                type="text"
                                placeholder="Search system..."
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full font-medium placeholder-opacity-50 placeholder-[var(--placeholder-color)]"
                                style={{
                                    color: currentTheme.textColor,
                                    '--placeholder-color': currentTheme.textColor
                                } as React.CSSProperties}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors" style={{ color: currentTheme.textColor }}>
                                <MdMail size={20} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors relative" style={{ color: currentTheme.textColor }}>
                                <MdNotifications size={20} />
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                            </button>
                            <div className="h-8 w-px mx-1 bg-black/10"></div>
                            <div
                                className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-md cursor-pointer hover:brightness-110"
                                style={{ backgroundColor: currentTheme.primary }}
                            >
                                {initials}
                            </div>
                        </div>
                    </header>
                </div>

                {/* Page Content - with dynamic scrollbar color if possible or just standard content */}
                <div className="flex-1 px-6 py-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
