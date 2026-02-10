"use client";
import React from "react";
import { MdTrendingUp, MdPeopleOutline, MdOutlineHomeWork, MdOutlineCampaign, MdMoreHoriz, MdArrowOutward, MdStar, MdLocationOn } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

// 🔹 Stat Card
const StatCard = ({ title, value, trend, trendValue, icon, colorClass }: any) => {
    const { currentTheme } = useTheme();

    return (
        <div
            className="p-6 rounded-2xl border shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group backdrop-blur-md"
            style={{
                backgroundColor: currentTheme.cardBg + 'E6',
                borderColor: currentTheme.borderColor
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm transition-transform duration-300 group-hover:scale-105
        ${colorClass}
      `}>
                    {icon}
                </div>
                <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    {trend === 'up' ? '↗' : '↘'} {trendValue}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: currentTheme.textColor, opacity: 0.7 }}>{title}</h3>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>{value}</h2>
            </div>
        </div>
    )
};

export default function DashboardPage() {
    const { currentTheme } = useTheme();
    const [timeRange, setTimeRange] = React.useState("Year");

    const stats = [
        { title: "Total Revenue", value: "$168,240", trend: "up", trendValue: "12.5%", icon: <MdTrendingUp className="text-white" />, colorClass: "bg-[#1E3A8A]" }, // Royal Blue
        { title: "Active Users", value: "22,567", trend: "up", trendValue: "8.2%", icon: <MdPeopleOutline className="text-white" />, colorClass: "bg-[#0F766E]" }, // Teal
        { title: "Properties", value: "984", trend: "up", trendValue: "3.1%", icon: <MdOutlineHomeWork className="text-white" />, colorClass: "bg-[#B45309]" }, // Amber
        { title: "Campaigns", value: "42", trend: "down", trendValue: "1.4%", icon: <MdOutlineCampaign className="text-white" />, colorClass: "bg-[#7E22CE]" }, // Purple
    ];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Modified Financial Chart (Dual Bar Chart) */}
                <div
                    className="xl:col-span-2 p-6 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[420px] backdrop-blur-md"
                    style={{
                        backgroundColor: currentTheme.cardBg + 'E6',
                        borderColor: currentTheme.borderColor
                    }}
                >

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Financial Performance</h3>
                            <p className="text-xs mt-0.5" style={{ color: currentTheme.textColor }}>Revenue vs Expenses (Current Year)</p>
                        </div>
                        <div className="flex p-1 rounded-lg border" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor }}>
                            {["Week", "Month", "Year"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all`}
                                    style={{
                                        backgroundColor: timeRange === t ? currentTheme.cardBg : 'transparent',
                                        color: timeRange === t ? currentTheme.headingColor : currentTheme.textColor,
                                        boxShadow: timeRange === t ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.primary }}></div>
                            <span className="text-xs font-bold" style={{ color: currentTheme.textColor }}>Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: currentTheme.primary }}></div>
                            <span className="text-xs font-bold" style={{ color: currentTheme.textColor }}>Expenses</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2">
                        {(() => {
                            const data = {
                                "Week": {
                                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                    income: [20, 45, 30, 80, 55, 40, 60],
                                    expenses: [15, 30, 20, 60, 40, 25, 45]
                                },
                                "Month": {
                                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                                    income: [65, 80, 55, 90],
                                    expenses: [40, 60, 45, 70]
                                },
                                "Year": {
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    income: [40, 60, 50, 75, 60, 80, 55, 85, 65, 90, 70, 95],
                                    expenses: [30, 45, 35, 50, 40, 55, 30, 60, 45, 65, 50, 70]
                                }
                            }[timeRange as "Week" | "Month" | "Year"];

                            return data.labels.map((label, i) => {
                                const h1 = data.income[i];
                                const h2 = data.expenses[i];

                                return (
                                    <div key={label} className="flex-1 flex flex-col justify-end items-center gap-1 group h-full relative">
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            {label}: ${h1}k / ${h2}k
                                        </div>

                                        <div className="w-full flex justify-center items-end gap-0.5 sm:gap-1 h-full">
                                            {/* Income Bar */}
                                            <div
                                                className="w-1.5 sm:w-2.5 rounded-t-full transition-all duration-500 hover:brightness-110 relative group/bar"
                                                style={{
                                                    height: `${h1}%`,
                                                    backgroundColor: currentTheme.primary
                                                }}
                                            ></div>
                                            {/* Expense Bar */}
                                            <div
                                                className="w-1.5 sm:w-2.5 rounded-t-full transition-all duration-500 hover:brightness-110 relative group/bar"
                                                style={{
                                                    height: `${h2}%`,
                                                    backgroundColor: currentTheme.primary,
                                                    opacity: 0.3
                                                }}
                                            ></div>
                                        </div>

                                        {/* Label */}
                                        <span className="text-[10px] font-bold uppercase mt-2 hidden sm:block truncate w-full text-center" style={{ color: currentTheme.textColor }}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* Activity (Reverted from Pie Chart) */}
                <div
                    className="p-6 rounded-2xl border shadow-sm flex flex-col backdrop-blur-md"
                    style={{
                        backgroundColor: currentTheme.cardBg + 'E6',
                        borderColor: currentTheme.borderColor
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Latest Activity</h3>
                        <button className="p-1 rounded-md hover:opacity-80" style={{ color: currentTheme.textColor }}>
                            <MdMoreHoriz size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors group cursor-pointer">
                                <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0
                            ${i % 2 === 0
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-teal-50 text-teal-700"}
                        `}>
                                    {i % 2 === 0 ? <MdOutlineHomeWork size={20} /> : <MdPeopleOutline size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold transition-colors truncate" style={{ color: currentTheme.headingColor }}>
                                            {i % 2 === 0 ? "Property Listed" : "New User Signup"}
                                        </p>
                                        <span className="text-[10px] whitespace-nowrap ml-2" style={{ color: currentTheme.textColor }}>2m</span>
                                    </div>
                                    <p className="text-xs mt-0.5 truncate" style={{ color: currentTheme.textColor }}>
                                        {i % 2 === 0 ? "Villa in Beverly Hills added" : "John Smith created an account"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full mt-4 py-3 rounded-xl border text-xs font-bold hover:brightness-95 transition-colors flex items-center justify-center gap-2"
                        style={{
                            borderColor: currentTheme.borderColor,
                            color: currentTheme.textColor
                        }}
                    >
                        View Full History <MdArrowOutward />
                    </button>
                </div>
            </div>

            {/* NEW SECTION: Top Agents & Recent Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top Agents */}
                <div
                    className="p-6 rounded-2xl border shadow-sm backdrop-blur-md"
                    style={{
                        backgroundColor: currentTheme.cardBg + 'E6',
                        borderColor: currentTheme.borderColor
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Top Performing Agents</h3>
                        <button className="text-xs font-bold hover:underline" style={{ color: currentTheme.primary }}>View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border hover:shadow-sm transition-all" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.background }}>
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Agent" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>Agent Name {i}</h4>
                                    <div className="flex items-center gap-1 text-xs mt-1" style={{ color: currentTheme.textColor }}>
                                        <MdStar className="text-amber-400" />
                                        <span>4.{8 + i} (1{i}2 Reviews)</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold" style={{ color: currentTheme.primary }}>${i * 120}k</p>
                                    <p className="text-[10px]" style={{ color: currentTheme.textColor }}>Sales</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Properties */}
                <div
                    className="p-6 rounded-2xl border shadow-sm backdrop-blur-md"
                    style={{
                        backgroundColor: currentTheme.cardBg + 'E6',
                        borderColor: currentTheme.borderColor
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>Recent Listings</h3>
                        <button className="text-xs font-bold hover:underline" style={{ color: currentTheme.primary }}>View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl border hover:shadow-sm transition-all bg-white" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.background }}>
                                <div className="w-20 h-16 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>{/* Placeholder for real image */}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-sm font-bold line-clamp-1" style={{ color: currentTheme.headingColor }}>Modern Apartment {i}</h4>
                                    <div className="flex items-center gap-1 text-xs mt-1 opacity-80" style={{ color: currentTheme.textColor }}>
                                        <MdLocationOn size={14} />
                                        <span>Downtown, City</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center text-right">
                                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">For Sale</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
