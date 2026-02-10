"use client";
import React from "react";
import { MdAdd, MdSearch, MdMoreHoriz, MdCampaign, MdCheckCircle, MdPauseCircle, MdSchedule } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

const campaigns = [
    {
        id: 1,
        name: "Summer Villa Sale",
        status: "Active",
        reach: "12,500",
        clicks: "450",
        budget: "$5,000",
        spent: "$1,200",
        startDate: "Jun 01, 2025",
        endDate: "Aug 31, 2025",
        platform: "Google Ads"
    },
    {
        id: 2,
        name: "Downtown Apartments Promo",
        status: "Paused",
        reach: "8,200",
        clicks: "310",
        budget: "$3,000",
        spent: "$2,800",
        startDate: "Jan 15, 2025",
        endDate: "Mar 15, 2025",
        platform: "Facebook"
    },
    {
        id: 3,
        name: "New Agent Recruitment",
        status: "Scheduled",
        reach: "-",
        clicks: "-",
        budget: "$1,500",
        spent: "$0",
        startDate: "Sep 01, 2025",
        endDate: "Oct 30, 2025",
        platform: "LinkedIn"
    },
];

export default function CampaignsPage() {
    const { currentTheme } = useTheme();

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>Marketing Campaigns</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>Track and manage marketing efforts across platforms.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" size={20} style={{ color: currentTheme.textColor }} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                            style={{
                                backgroundColor: currentTheme.cardBg,
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.textColor
                            }}
                        />
                    </div>
                    <button
                        className="px-5 py-2.5 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold text-sm flex items-center gap-2"
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        <MdAdd size={20} />
                        Create Campaign
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group backdrop-blur-md"
                        style={{
                            backgroundColor: currentTheme.cardBg + 'E6',
                            borderColor: currentTheme.borderColor
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
                                    style={{ backgroundColor: currentTheme.primary }}
                                >
                                    <MdCampaign />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold line-clamp-1" style={{ color: currentTheme.headingColor }}>{campaign.name}</h3>
                                    <p className="text-xs font-medium" style={{ color: currentTheme.textColor }}>{campaign.platform}</p>
                                </div>
                            </div>
                            <button className="hover:opacity-80" style={{ color: currentTheme.textColor }}>
                                <MdMoreHoriz size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.background }}>
                                <p className="text-xs font-bold uppercase" style={{ color: currentTheme.textColor, opacity: 0.8 }}>Reach</p>
                                <p className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>{campaign.reach}</p>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.background }}>
                                <p className="text-xs font-bold uppercase" style={{ color: currentTheme.textColor, opacity: 0.8 }}>Clicks</p>
                                <p className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>{campaign.clicks}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: currentTheme.borderColor }}>
                            <div className="flex items-center gap-1.5">
                                {campaign.status === 'Active' && <MdCheckCircle className="text-emerald-500" size={16} />}
                                {campaign.status === 'Paused' && <MdPauseCircle className="text-amber-500" size={16} />}
                                {campaign.status === 'Scheduled' && <MdSchedule className="text-blue-500" size={16} />}

                                <span className={`text-xs font-bold ${campaign.status === 'Active' ? 'text-emerald-600' :
                                    campaign.status === 'Paused' ? 'text-amber-600' : 'text-blue-600'
                                    }`}>
                                    {campaign.status}
                                </span>
                            </div>
                            <p className="text-xs font-bold" style={{ color: currentTheme.textColor }}>{campaign.startDate} - {campaign.endDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
