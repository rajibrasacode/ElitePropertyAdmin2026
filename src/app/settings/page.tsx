"use client";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { MdCheck, MdColorLens, MdPalette, MdSave, MdUndo, MdPerson, MdMail, MdLock, MdNotifications } from "react-icons/md";

export default function SettingsPage() {
    const { currentTheme, savedTheme, setPreviewTheme, saveTheme, cancelPreview, setCustomColor, presets } = useTheme();

    const hasChanges = JSON.stringify(currentTheme) !== JSON.stringify(savedTheme);

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>System Settings</h1>
                    <p className="text-sm font-medium opacity-70" style={{ color: currentTheme.textColor }}>Customize application appearance and preferences.</p>
                </div>

                {hasChanges && (
                    <div className="flex gap-3 animate-fade-in">
                        <button
                            onClick={cancelPreview}
                            className="px-5 py-2.5 border rounded-lg hover:brightness-95 font-bold text-sm flex items-center gap-2"
                            style={{
                                backgroundColor: currentTheme.cardBg,
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.textColor
                            }}
                        >
                            <MdUndo size={18} />
                            Discard Changes
                        </button>
                        <button
                            onClick={saveTheme}
                            className="px-6 py-2.5 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold text-sm flex items-center gap-2"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <MdSave size={20} />
                            Save Theme
                        </button>
                    </div>
                )}
            </div>

            {/* THEME & APPEARANCE SECTION */}
            <div
                className="p-6 rounded-2xl border shadow-sm space-y-6 backdrop-blur-md"
                style={{
                    backgroundColor: currentTheme.cardBg + 'E6',
                    borderColor: currentTheme.borderColor
                }}
            >
                <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: currentTheme.borderColor }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: currentTheme.background, color: currentTheme.primary }}>
                        <MdColorLens size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Visual Theme</h2>
                        <p className="text-xs opacity-60" style={{ color: currentTheme.textColor }}>Pick a preset or customize colors. Changes are previewed instantly.</p>
                    </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {presets.map((theme) => (
                        <button
                            key={theme.name}
                            onClick={() => setPreviewTheme(theme)}
                            className={`
                                relative group p-1 rounded-xl border-2 transition-all text-left flex flex-col gap-2 hover:-translate-y-1 overflow-hidden
                                ${currentTheme.name === theme.name
                                    ? "shadow-md"
                                    : "border-transparent hover:shadow-sm"}
                            `}
                            style={{
                                borderColor: currentTheme.name === theme.name ? currentTheme.primary : 'transparent'
                            }}
                        >
                            <div className="h-16 w-full rounded-lg flex overflow-hidden shadow-sm border border-slate-200/50">
                                <div className="w-1/3 h-full flex items-center justify-center" style={{ background: theme.sidebarBg }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                </div>
                                <div className="w-2/3 h-full bg-slate-50 relative p-2" style={{ background: theme.background }}>
                                    <div className="w-8 h-2 rounded-[2px] mb-1 opacity-20" style={{ background: theme.primary }}></div>
                                    <div className="w-full h-8 rounded-[4px] bg-white shadow-sm border border-slate-100"></div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-center w-full block py-1" style={{ color: currentTheme.textColor }}>{theme.name}</span>
                            {currentTheme.name === theme.name && (
                                <div className="absolute top-2 right-2 text-white rounded-full p-0.5 shadow-sm z-10" style={{ backgroundColor: currentTheme.primary }}>
                                    <MdCheck size={12} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom Color Pickers */}
                <div className="pt-4 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: currentTheme.textColor, opacity: 0.7 }}>Advanced Customization</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold mb-2" style={{ color: currentTheme.textColor }}>Primary Accent</label>
                            <div className="flex items-center gap-3 p-2 rounded-lg border group" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                                <input
                                    type="color"
                                    value={currentTheme.primary}
                                    onChange={(e) => setCustomColor("primary", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <span className="text-xs font-mono uppercase" style={{ color: currentTheme.textColor }}>{currentTheme.primary}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2" style={{ color: currentTheme.textColor }}>Sidebar Background</label>
                            <div className="flex items-center gap-3 p-2 rounded-lg border group" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                                <input
                                    type="color"
                                    value={currentTheme.sidebarBg}
                                    onChange={(e) => setCustomColor("sidebarBg", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <span className="text-xs font-mono uppercase" style={{ color: currentTheme.textColor }}>{currentTheme.sidebarBg}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2" style={{ color: currentTheme.textColor }}>Main Background</label>
                            <div className="flex items-center gap-3 p-2 rounded-lg border group" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                                <input
                                    type="color"
                                    value={currentTheme.background}
                                    onChange={(e) => setCustomColor("background", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <span className="text-xs font-mono uppercase" style={{ color: currentTheme.textColor }}>{currentTheme.background}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STANDARD SETTINGS (Rest of the page) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div
                    className="p-6 rounded-2xl border shadow-sm space-y-6 backdrop-blur-md"
                    style={{
                        backgroundColor: currentTheme.cardBg + 'E6',
                        borderColor: currentTheme.borderColor
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: currentTheme.background, color: currentTheme.primary }}>
                            <MdPerson size={22} />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Admin Profile</h2>
                    </div>

                    <div className="flex items-center gap-6 pb-6 border-b" style={{ borderColor: currentTheme.borderColor }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 shadow-sm" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.cardBg, color: currentTheme.textColor }}>
                            JD
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ color: currentTheme.primary }}>John Doe</h3>
                            <p className="text-sm font-medium opacity-80 mb-2" style={{ color: currentTheme.textColor }}>Super Admin</p>
                            <button className="text-sm font-bold hover:underline" style={{ color: currentTheme.primary }}>Change Avatar</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: currentTheme.textColor, opacity: 0.7 }}>First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg text-sm font-medium focus:ring-2 outline-none"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        borderColor: currentTheme.borderColor,
                                        color: currentTheme.headingColor,
                                        '--tw-ring-color': currentTheme.primary + '40'
                                    } as React.CSSProperties}
                                    defaultValue="John"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: currentTheme.textColor, opacity: 0.7 }}>Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg text-sm font-medium focus:ring-2 outline-none"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        borderColor: currentTheme.borderColor,
                                        color: currentTheme.headingColor,
                                        '--tw-ring-color': currentTheme.primary + '40'
                                    } as React.CSSProperties}
                                    defaultValue="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: currentTheme.textColor, opacity: 0.7 }}>Email Address</label>
                            <div className="relative">
                                <MdMail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textColor }} />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm font-medium focus:ring-2 outline-none"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        borderColor: currentTheme.borderColor,
                                        color: currentTheme.headingColor,
                                        '--tw-ring-color': currentTheme.primary + '40'
                                    } as React.CSSProperties}
                                    defaultValue="admin@eliteproperty.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Notifications */}
                <div className="space-y-8">
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-6 backdrop-blur-md"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: currentTheme.borderColor
                        }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: currentTheme.background, color: currentTheme.primary }}>
                                <MdLock size={22} />
                            </div>
                            <h2 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Security</h2>
                        </div>

                        <div className="space-y-4">
                            <button
                                className="w-full py-2.5 border rounded-lg font-bold text-sm hover:brightness-95 transition-colors"
                                style={{
                                    backgroundColor: currentTheme.background,
                                    borderColor: currentTheme.borderColor,
                                    color: currentTheme.textColor
                                }}
                            >
                                Change Password
                            </button>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium" style={{ color: currentTheme.headingColor }}>Two-Factor Authentication</span>
                                <div className="w-10 h-5 rounded-full cursor-pointer relative" style={{ backgroundColor: currentTheme.borderColor }}>
                                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-6 backdrop-blur-md"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: currentTheme.borderColor
                        }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: currentTheme.background, color: currentTheme.primary }}>
                                <MdNotifications size={22} />
                            </div>
                            <h2 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Notifications</h2>
                        </div>

                        <div className="space-y-3">
                            {['Email Alerts', 'Push Notifications', 'Weekly Digest'].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                    <span className="text-sm font-medium" style={{ color: currentTheme.headingColor }}>{item}</span>
                                    <input type="checkbox" defaultChecked className="form-checkbox rounded" style={{ color: currentTheme.primary }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
