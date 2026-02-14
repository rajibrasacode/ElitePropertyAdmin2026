"use client";
import React from "react";
import { MdAdd, MdSearch, MdMoreHoriz, MdCampaign, MdCheckCircle, MdPauseCircle, MdSchedule, MdBarChart, MdEdit, MdPlayArrow, MdDelete } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

import { useRouter } from "next/navigation";
import { getCampaignsService, deleteCampaignService, updateCampaignService } from "@/services/campaigns.service";

export default function CampaignsPage() {
    const { currentTheme } = useTheme();
    const router = useRouter();
    const [campaigns, setCampaigns] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Fetch Campaigns
    const fetchCampaigns = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCampaignsService();
            const list = Array.isArray(response?.data) ? response.data : [];

            if (list.length > 0 || response?.is_success) {
                setCampaigns(list);
                return;
            }

            setCampaigns([]);
            setError(response?.message || "Failed to fetch campaigns");
        } catch (err) {
            console.error("Error fetching campaigns:", err);
            const fallback = "Failed to load campaigns.";
            const errorMessage =
                (err as any)?.message ||
                (err as any)?.error ||
                (err as any)?.response?.data?.message ||
                (err as any)?.response?.data?.error ||
                fallback;
            setError(errorMessage);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCampaigns();
    }, []);

    // Handle Click Outside Menu
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await deleteCampaignService(id);
            setCampaigns(prev => prev.filter(c => c.id !== id));
            setActiveMenuId(null);
        } catch (err) {
            console.error("Failed to delete campaign:", err);
            alert("Failed to delete campaign");
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await updateCampaignService(id, { status: newStatus });
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
            setActiveMenuId(null);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 min-h-screen pb-10">

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
                        onClick={() => router.push('/campaigns/add')}
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
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center text-red-500">
                        {error}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-60">
                        <p>No campaigns found. Create one to get started.</p>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group backdrop-blur-md relative"
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
                                        <p className="text-xs font-medium" style={{ color: currentTheme.textColor }}>
                                            {Array.isArray(campaign.channel) ? campaign.channel.join(", ") : campaign.campaign_type}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleMenu(campaign.id, e)}
                                        className="hover:opacity-80 p-1 rounded-full hover:bg-black/5 transition-colors"
                                        style={{ color: currentTheme.textColor }}
                                    >
                                        <MdMoreHoriz size={24} />
                                    </button>

                                    {activeMenuId === campaign.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
                                            style={{
                                                backgroundColor: currentTheme.cardBg,
                                                borderColor: currentTheme.borderColor,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex flex-col py-1">
                                                <button
                                                    className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                    style={{ color: currentTheme.headingColor }}
                                                >
                                                    <MdBarChart size={18} className="opacity-70" />
                                                    View Analytics
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/campaigns/edit/${campaign.id}`)}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                    style={{ color: currentTheme.headingColor }}
                                                >
                                                    <MdEdit size={18} className="opacity-70" />
                                                    Edit Campaign
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                    style={{ color: currentTheme.textColor }}
                                                >
                                                    {campaign.status === 'active' ? <MdPauseCircle size={18} className="text-amber-500" /> : <MdPlayArrow size={18} className="text-emerald-500" />}
                                                    {campaign.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                                                </button>
                                                <div className="h-px mx-4 my-1 opacity-20" style={{ backgroundColor: currentTheme.borderColor }} />
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors flex items-center gap-2"
                                                >
                                                    <MdDelete size={18} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.background }}>
                                    <p className="text-xs font-bold uppercase" style={{ color: currentTheme.textColor, opacity: 0.8 }}>Reach</p>
                                    <p className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>
                                        {campaign.reach || "-"}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.background }}>
                                    <p className="text-xs font-bold uppercase" style={{ color: currentTheme.textColor, opacity: 0.8 }}>Clicks</p>
                                    <p className="text-lg font-bold" style={{ color: currentTheme.headingColor }}>
                                        {campaign.clicks || "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: currentTheme.borderColor }}>
                                <div className="flex items-center gap-1.5">
                                    {campaign.status === 'active' && <MdCheckCircle className="text-emerald-500" size={16} />}
                                    {(campaign.status === 'inactive' || campaign.status === 'paused') && <MdPauseCircle className="text-amber-500" size={16} />}
                                    {campaign.status === 'draft' && <MdSchedule className="text-blue-500" size={16} />}

                                    <span className={`text-xs font-bold capitalize ${campaign.status === 'active' ? 'text-emerald-600' :
                                        (campaign.status === 'inactive' || campaign.status === 'paused') ? 'text-amber-600' :
                                            'text-blue-600'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <p className="text-xs font-bold" style={{ color: currentTheme.textColor }}>
                                    {campaign.scheduled_start_date ? new Date(campaign.scheduled_start_date).toLocaleDateString() : 'TBD'}
                                    {campaign.scheduled_end_date ? ` - ${new Date(campaign.scheduled_end_date).toLocaleDateString()}` : ''}
                                </p>
                            </div>
                        </div>
                    )))}
            </div>
        </div>
    );
}
