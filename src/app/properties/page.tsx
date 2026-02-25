"use client";
import React, { useState, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdMoreHoriz, MdOutlineBedroomParent, MdOutlineBathroom, MdSquareFoot, MdLocationOn, MdChevronLeft, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { getProperties, getPendingProperties, deletePropertyByIdService, approveProperty, rejectProperty } from "@/services/properties.service";
import { PropertyData } from "@/types/properties.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useModulePermission } from "@/hooks/useModulePermission";

export default function PropertiesPage() {
    const { currentTheme } = useTheme();
    const router = useRouter();
    const { permissionReady, can } = useModulePermission("properties");
    const canViewProperties = can("view");
    const canAddProperties = can("add");
    const canEditProperties = can("edit");
    const canDeleteProperties = can("delete");
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all'); // Tab State
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<number | string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 9,
        total: 0,
        totalPages: 1
    });

    // Filter States
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterListingType, setFilterListingType] = useState("All"); // Sale/Rent
    const [filterPropertyType, setFilterPropertyType] = useState("All"); // Single Family, etc.
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State for Approve/Reject
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
    const [pendingPropertyId, setPendingPropertyId] = useState<number | string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // To trigger re-fetch

    // Open Modal Handlers
    const onApproveClick = (id: number | string) => {
        setPendingPropertyId(id);
        setPendingAction('approve');
        setIsActionModalOpen(true);
        setActiveMenuId(null); // Close dropdown
    };

    const onRejectClick = (id: number | string) => {
        setPendingPropertyId(id);
        setPendingAction('reject');
        setIsActionModalOpen(true);
        setActiveMenuId(null); // Close dropdown
    };

    // Confirm Action Helper
    const handleConfirmAction = async () => {
        if (!pendingPropertyId || !pendingAction) return;

        setActionLoading(true);
        try {
            if (pendingAction === 'approve') {
                await approveProperty(pendingPropertyId);
                showSuccessToast("Property approved successfully!");
            } else {
                await rejectProperty(pendingPropertyId);
                showSuccessToast("Property rejected successfully!");
            }
            // Trigger refresh
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            console.error(`Failed to ${pendingAction} property`, error);
            const errorMessage = error?.message || error?.error || `Failed to ${pendingAction} property.`;
            showErrorToast(errorMessage);
        } finally {
            setActionLoading(false);
            setIsActionModalOpen(false);
            setPendingAction(null);
            setPendingPropertyId(null);
        }
    };

    useEffect(() => {
        if (!permissionReady) return;
        if (!canViewProperties) {
            setProperties([]);
            setLoading(false);
            return;
        }

        const fetchProperties = async () => {
            setLoading(true);
            try {
                let response;
                if (activeTab === 'pending') {
                    response = await getPendingProperties({
                        page: pagination.page,
                        limit: pagination.limit,
                        search: searchQuery,
                        // type: filterListingType !== "All" ? filterListingType : undefined // Pending might not support filters yet, or keep it consistent
                    });
                } else {
                    response = await getProperties({
                        page: pagination.page,
                        limit: pagination.limit,
                        search: searchQuery,
                        type: filterListingType !== "All" ? filterListingType : undefined
                    });
                }

                setProperties(response.data);
                if (response.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: response.pagination.total,
                        totalPages: response.pagination.totalPages
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch properties", error);
                setError("Failed to connect to the server. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchProperties();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [pagination.page, searchQuery, filterListingType, activeTab, refreshKey, permissionReady, canViewProperties]); // Added refreshKey dependency

    const handleActivate = (id: number) => {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p));
        setActiveMenuId(null);
    };

    const handleDeactivate = (id: number) => {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Pending' } : p));
        setActiveMenuId(null);
    };

    const filteredProperties = properties.filter(property => {
        // Parse price (remove $ and , and /mo) - use listing_price from API
        const rawPrice = property.listing_price || 0;

        // Status is not in API yet, assume active
        const status = activeTab === 'pending' ? 'Pending' : "Active";

        // If we are in 'pending' tab, ignore the filterStatus logic unless we want to filter within pending (which is usually just Pending)
        // If we are in 'all' tab, we use the filterStatus
        const matchesStatus = activeTab === 'pending' ? true : (filterStatus === "All" || status === filterStatus);

        const listingType = property.transaction_type || "Sale";
        const matchesListingType = filterListingType === "All" || listingType === filterListingType;

        const propType = property.property_type || "Single-Family";
        const matchesPropertyType = filterPropertyType === "All" || propType === filterPropertyType;

        const title = property.street_address || "Untitled Property";
        const location = `${property.city}, ${property.state}`;
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMinPrice = minPrice === "" || rawPrice >= parseInt(minPrice);
        const matchesMaxPrice = maxPrice === "" || rawPrice <= parseInt(maxPrice);
        const matchesBeds = beds === "" || (property.bedrooms || 0) >= parseInt(beds);
        const matchesBaths = baths === "" || (property.bathrooms || 0) >= parseInt(baths);

        return matchesStatus && matchesListingType && matchesPropertyType && matchesSearch &&
            matchesMinPrice && matchesMaxPrice && matchesBeds && matchesBaths;
    });

    const resetFilters = () => {
        setFilterStatus("All");
        setFilterListingType("All");
        setFilterPropertyType("All");
        setMinPrice("");
        setMaxPrice("");
        setBeds("");
        setBaths("");
        setSearchQuery("");
    };

    const initiateDelete = (id: number | string) => {
        if (!canDeleteProperties) return;
        setDeleteId(id);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        if (!deleteId || !canDeleteProperties) return;
        setIsDeleteLoading(true);
        try {
            await deletePropertyByIdService(String(deleteId));
            setProperties(prev => prev.filter(p => p.id !== deleteId));
            setPagination(prev => ({
                ...prev,
                total: Math.max(0, prev.total - 1)
            }));
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete property:", error);
            // Ideally show a toast here
            alert("Failed to delete property. Please try again.");
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const handleApprove = async (id: number | string) => {
        if (!canEditProperties) return;
        if (window.confirm("Are you sure you want to approve this property?")) {
            try {
                console.log(`[Page] Approving property ID: ${id}`);
                await approveProperty(id);
                showSuccessToast("Property approved successfully!");
                setProperties(prev => prev.filter(p => p.id !== id));
                setPagination(prev => ({
                    ...prev,
                    total: Math.max(0, prev.total - 1)
                }));
                setActiveMenuId(null);
            } catch (error: any) {
                console.error("Failed to approve property", error);
                const errorMessage = error?.message || error?.error || "Failed to approve property.";
                showErrorToast(errorMessage);
            }
        }
    }

    const handleReject = async (id: number | string) => {
        if (!canEditProperties) return;
        if (window.confirm("Are you sure you want to reject this property?")) {
            try {
                console.log(`[Page] Rejecting property ID: ${id}`);
                await rejectProperty(id);
                showSuccessToast("Property rejected successfully!");
                setProperties(prev => prev.filter(p => p.id !== id));
                setPagination(prev => ({
                    ...prev,
                    total: Math.max(0, prev.total - 1)
                }));
                setActiveMenuId(null);
            } catch (error: any) {
                console.error("Failed to reject property", error);
                const errorMessage = error?.message || error?.error || "Failed to reject property.";
                showErrorToast(errorMessage);
            }
        }
    }

    if (!loading && permissionReady && !canViewProperties) {
        return (
            <div className="max-w-[1600px] mx-auto py-10">
                <div className="rounded-xl border px-5 py-4 text-sm font-medium" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                    You do not have `view` permission for Properties.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
            <ConfirmModal
                isOpen={canDeleteProperties && !!deleteId}
                onClose={() => !isDeleteLoading && setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone."
                confirmLabel="Delete Property"
                isLoading={isDeleteLoading}
            />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>Property Listings</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>Manage all properties displayed on the user site.</p>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mt-4 p-1 rounded-lg border w-fit" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                        <button
                            onClick={() => { setActiveTab('all'); setPagination(p => ({ ...p, page: 1 })); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'all' ? 'shadow-sm' : 'hover:bg-black/5 opacity-60'}`}
                            style={{
                                backgroundColor: activeTab === 'all' ? currentTheme.primary : 'transparent',
                                color: activeTab === 'all' ? '#fff' : currentTheme.textColor
                            }}
                        >
                            Active Listings
                        </button>
                        <button
                            onClick={() => { setActiveTab('pending'); setPagination(p => ({ ...p, page: 1 })); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'pending' ? 'shadow-sm' : 'hover:bg-black/5 opacity-60'}`}
                            style={{
                                backgroundColor: activeTab === 'pending' ? currentTheme.primary : 'transparent',
                                color: activeTab === 'pending' ? '#fff' : currentTheme.textColor
                            }}
                        >
                            Pending Approval
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group w-full sm:w-auto">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" size={20} style={{ color: currentTheme.textColor }} />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 w-full sm:w-64 transition-all"
                            style={{
                                backgroundColor: currentTheme.cardBg,
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.textColor
                            }}
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2.5 border rounded-lg hover:brightness-95 font-bold text-sm flex items-center justify-center gap-2 transition-all flex-1 sm:flex-none ${showFilters ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
                            style={{
                                backgroundColor: showFilters ? currentTheme.cardBg : currentTheme.cardBg,
                                borderColor: showFilters ? currentTheme.primary : currentTheme.borderColor,
                                color: showFilters ? currentTheme.primary : currentTheme.headingColor
                            }}
                        >
                            <MdFilterList size={18} />
                            Filter
                        </button>
                        {canAddProperties && (
                            <Link href="/properties/add" className="flex-1 sm:flex-none">
                                <button
                                    className="w-full px-5 py-2.5 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                    style={{ backgroundColor: currentTheme.primary }}
                                >
                                    <MdAdd size={20} />
                                    Add Property
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Panel - Expanded with Smart Filters */}
            {showFilters && (
                <div className="p-6 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-top-2 mb-6"
                    style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {/* 1. Property Type (Smart Filter) */}
                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Property Type</label>
                            <select
                                value={filterPropertyType}
                                onChange={(e) => setFilterPropertyType(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm font-medium outline-none focus:border-blue-500 cursor-pointer"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            >
                                <option value="All">All Types</option>
                                <option>Single-Family</option>
                                <option>Multi-Family</option>
                                <option>Residential</option>
                                <option>Commercial</option>
                                <option>Industrial</option>
                                <option>Land</option>
                            </select>
                        </div>

                        {/* 2. Listing Status */}
                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Listing Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm font-medium outline-none focus:border-blue-500 cursor-pointer"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            >
                                <option value="All">All Statuses</option>
                                <option>Active</option>
                                <option>Pending</option>
                                <option>Sold</option>
                            </select>
                        </div>

                        {/* 3. Transaction Type */}
                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Transaction</label>
                            <select
                                value={filterListingType}
                                onChange={(e) => setFilterListingType(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm font-medium outline-none focus:border-blue-500 cursor-pointer"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            >
                                <option value="All">All Transactions</option>
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>

                        {/* 4. Reset Button (Aligns with inputs) */}


                        {/* Row 2: Price & Specs */}
                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Min Price</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm outline-none focus:border-blue-500"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Max Price</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm outline-none focus:border-blue-500"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Min Beds</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={beds}
                                onChange={(e) => setBeds(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm outline-none focus:border-blue-500"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-extrabold uppercase tracking-wide opacity-60" style={{ color: currentTheme.textColor }}>Min Baths</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={baths}
                                onChange={(e) => setBaths(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border text-sm outline-none focus:border-blue-500"
                                style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}
                            />
                        </div>

                        {/* Reset Button (Last Item) */}
                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="h-10 px-5 w-full rounded-lg text-xs font-bold uppercase tracking-wide border border-dashed hover:border-solid hover:bg-red-50 text-red-500 transition-all flex items-center justify-center gap-2"
                                style={{ borderColor: currentTheme.borderColor }}
                            >
                                Reset Filters
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-80">
                        <div className="text-red-500 mb-2 font-bold text-lg">Network Error</div>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                        <div
                            onClick={() => router.push(`/properties/review/${property.id}${activeTab === 'pending' ? '?source=pending' : ''}`)}
                            key={property.id}
                            className="rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer backdrop-blur-md"
                            style={{
                                backgroundColor: currentTheme.cardBg + 'E6',
                                borderColor: currentTheme.borderColor
                            }}
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 w-full relative overflow-hidden">
                                <img
                                    src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"}
                                    alt={property.street_address || "Property"}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

                                <div
                                    className="absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        color: '#0f172a'
                                    }}
                                >
                                    {property.transaction_type}
                                </div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${activeTab === 'pending' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                                    {activeTab === 'pending' ? 'Pending' : 'Active'}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold line-clamp-1 transition-colors" style={{ color: currentTheme.headingColor }}>{property.street_address}</h3>
                                    <p className="text-lg font-bold" style={{ color: currentTheme.primary }}>${property.listing_price?.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-1 text-sm mb-4" style={{ color: currentTheme.textColor }}>
                                    <MdLocationOn size={16} />
                                    <p>{property.city}, {property.state}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-3 border-t" style={{ borderColor: currentTheme.borderColor }}>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdOutlineBedroomParent />
                                            <span className="text-xs font-bold">Beds</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.bedrooms}</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdOutlineBathroom />
                                            <span className="text-xs font-bold">Baths</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.bathrooms}</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdSquareFoot />
                                            <span className="text-xs font-bold">Sqft</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.square_feet}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: currentTheme.borderColor }}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                                            alt="Agent"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <span className="text-xs font-medium" style={{ color: currentTheme.textColor }}>Atanu Karmakar</span>
                                    </div>
                                    <div className="relative">
                                        {(canViewProperties || canEditProperties || canDeleteProperties) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === property.id ? null : property.id);
                                                }}
                                                className="hover:opacity-80 p-1 rounded-full hover:bg-black/5 transition-colors"
                                                style={{ color: currentTheme.textColor }}
                                            >
                                                <MdMoreHoriz size={20} />
                                            </button>
                                        )}

                                        {/* Dropdown Menu */}
                                        {activeMenuId === property.id && (
                                            <div
                                                className="absolute bottom-full right-0 mb-2 w-48 rounded-xl shadow-xl border overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2"
                                                style={{
                                                    backgroundColor: currentTheme.cardBg,
                                                    borderColor: currentTheme.borderColor
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="flex flex-col py-1">
                                                    {canViewProperties && (
                                                        <Link href={`/properties/review/${property.id}`} className="w-full">
                                                            <button
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                                style={{ color: currentTheme.headingColor }}
                                                            >
                                                                Review Property
                                                            </button>
                                                        </Link>
                                                    )}
                                                    {canEditProperties && (
                                                        <Link href={`/properties/edit/${property.id}`} className="w-full">
                                                            <button
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                                style={{ color: currentTheme.headingColor }}
                                                            >
                                                                Edit Property
                                                            </button>
                                                        </Link>
                                                    )}

                                                    {canEditProperties && (
                                                        activeTab === 'all' ? (
                                                            <button
                                                                className="px-4 py-2.5 text-left text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onApproveClick(property.id); }}
                                                                className="px-4 py-2.5 text-left text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                                                            >
                                                                Approve
                                                            </button>
                                                        )
                                                    )}

                                                    {(canDeleteProperties || (canEditProperties && activeTab !== 'all')) && (
                                                        <div className="h-px bg-black/5 my-1" style={{ backgroundColor: currentTheme.borderColor }}></div>
                                                    )}

                                                    {activeTab === 'all' ? (
                                                        canDeleteProperties && (
                                                            <button
                                                                onClick={() => initiateDelete(property.id)}
                                                                className="px-4 py-2.5 text-left text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2"
                                                            >
                                                                Delete Property
                                                            </button>
                                                        )
                                                    ) : (
                                                        canEditProperties && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onRejectClick(property.id); }}
                                                                className="px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                                                            >
                                                                Reject Property
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center opacity-50">
                        <p className="text-lg font-bold">No properties found matching your filters.</p>
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-500 mt-2 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && !error && properties.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t mt-8" style={{ borderColor: currentTheme.borderColor }}>

                    <div className="text-sm opacity-70" style={{ color: currentTheme.textColor }}>
                        Showing <span className="font-bold">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-bold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-bold">{pagination.total}</span> entries
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="p-2 rounded-lg border hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            style={{
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.headingColor
                            }}
                        >
                            <MdChevronLeft size={20} />
                        </button>

                        {/* Page Numbers Logic - Simplified for now to show surrounding pages */}
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            // Logic to show pages around current page
                            let pageNum = pagination.page;
                            if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                            } else {
                                pageNum = pagination.page - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${pagination.page === pageNum
                                        ? 'text-white shadow-md transform scale-105'
                                        : 'hover:bg-black/5'
                                        }`}
                                    style={{
                                        backgroundColor: pagination.page === pageNum ? currentTheme.primary : 'transparent',
                                        color: pagination.page === pageNum ? '#fff' : currentTheme.textColor
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="p-2 rounded-lg border hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            style={{
                                borderColor: currentTheme.borderColor,
                                color: currentTheme.headingColor
                            }}
                        >
                            <MdChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={pendingAction === 'approve' ? "Approve Property" : "Reject Property"}
                message={pendingAction === 'approve'
                    ? "Are you sure you want to approve this property? It will become active immediately."
                    : "Are you sure you want to reject this property? This action cannot be undone."}
                confirmLabel={pendingAction === 'approve' ? "Approve" : "Reject"}
                isLoading={actionLoading}
                confirmButtonColor={pendingAction === 'approve' ? currentTheme.primary : '#ef4444'}
            />
        </div>
    );
}
