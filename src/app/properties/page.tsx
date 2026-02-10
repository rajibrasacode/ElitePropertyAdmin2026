"use client";
import React, { useState } from "react";
import { MdAdd, MdSearch, MdFilterList, MdMoreHoriz, MdOutlineBedroomParent, MdOutlineBathroom, MdSquareFoot, MdLocationOn } from "react-icons/md";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";

const initialProperties = [
    {
        id: 1,
        title: "Luxury Villa in Beverly Hills",
        location: "Beverly Hills, CA",
        price: "$2,500,000",
        beds: 5,
        baths: 4,
        sqft: 4500,
        status: "Active",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        type: "Sale",
        propertyType: "Single-Family"
    },
    {
        id: 2,
        title: "Modern Apartment Downtown",
        location: "New York, NY",
        price: "$4,500/mo",
        beds: 2,
        baths: 2,
        sqft: 1200,
        status: "Pending",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        type: "Rent",
        propertyType: "Multi-Family"
    },
    {
        id: 3,
        title: "Cozy Cottage by the Lake",
        location: "Lake Tahoe, NV",
        price: "$850,000",
        beds: 3,
        baths: 2,
        sqft: 1800,
        status: "Sold",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2565&ixlib=rb-4.0.3",
        type: "Sale",
        propertyType: "Single-Family"
    },
    {
        id: 4,
        title: "Industrial Warehouse",
        location: "Austin, TX",
        price: "$1,200,000",
        beds: 0,
        baths: 1,
        sqft: 15000,
        status: "Active",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        type: "Sale",
        propertyType: "Industrial"
    },
    {
        id: 5,
        title: "Seaside Mansion",
        location: "Miami, FL",
        price: "$5,500,000",
        beds: 6,
        baths: 7,
        sqft: 6500,
        status: "Active",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        type: "Sale",
        propertyType: "Single-Family"
    },
    {
        id: 6,
        title: "Modern Loft in Arts District",
        location: "Los Angeles, CA",
        price: "$3,200/mo",
        beds: 1,
        baths: 1,
        sqft: 950,
        status: "Active",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        type: "Rent",
        propertyType: "Multi-Family"
    }
];

export default function PropertiesPage() {
    const { currentTheme } = useTheme();
    const [properties, setProperties] = useState(initialProperties);
    const [showFilters, setShowFilters] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    const handleActivate = (id: number) => {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p));
        setActiveMenuId(null);
    };

    const handleDeactivate = (id: number) => {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Pending' } : p));
        setActiveMenuId(null);
    };

    // Filter States
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterListingType, setFilterListingType] = useState("All"); // Sale/Rent
    const [filterPropertyType, setFilterPropertyType] = useState("All"); // Single Family, etc.
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProperties = properties.filter(property => {
        // Parse price (remove $ and , and /mo)
        const rawPrice = parseInt(property.price.replace(/[$,]/g, '').split('/')[0]);

        const matchesStatus = filterStatus === "All" || property.status === filterStatus;
        const matchesListingType = filterListingType === "All" || property.type === filterListingType;
        const matchesPropertyType = filterPropertyType === "All" || property.propertyType === filterPropertyType;
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMinPrice = minPrice === "" || rawPrice >= parseInt(minPrice);
        const matchesMaxPrice = maxPrice === "" || rawPrice <= parseInt(maxPrice);
        const matchesBeds = beds === "" || property.beds >= parseInt(beds);
        const matchesBaths = baths === "" || property.baths >= parseInt(baths);

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

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.headingColor }}>Property Listings</h1>
                    <p className="font-medium text-sm" style={{ color: currentTheme.textColor }}>Manage all properties displayed on the user site.</p>
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
                        <Link href="/properties/add" className="flex-1 sm:flex-none">
                            <button
                                className="w-full px-5 py-2.5 text-white rounded-lg shadow-sm hover:brightness-110 transition-all font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                style={{ backgroundColor: currentTheme.primary }}
                            >
                                <MdAdd size={20} />
                                Add Property
                            </button>
                        </Link>
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
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                        <div
                            key={property.id}
                            className="rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer backdrop-blur-md"
                            style={{
                                backgroundColor: currentTheme.cardBg + 'E6',
                                borderColor: currentTheme.borderColor
                            }}
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 w-full relative">
                                <img
                                    src={property.image}
                                    alt={property.title}
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
                                    {property.type}
                                </div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${property.status === 'Active' ? 'bg-emerald-500' :
                                    property.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}>
                                    {property.status}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold line-clamp-1 transition-colors" style={{ color: currentTheme.headingColor }}>{property.title}</h3>
                                    <p className="text-lg font-bold" style={{ color: currentTheme.primary }}>{property.price}</p>
                                </div>

                                <div className="flex items-center gap-1 text-sm mb-4" style={{ color: currentTheme.textColor }}>
                                    <MdLocationOn size={16} />
                                    <p>{property.location}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-3 border-t" style={{ borderColor: currentTheme.borderColor }}>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdOutlineBedroomParent />
                                            <span className="text-xs font-bold">Beds</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.beds}</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdOutlineBathroom />
                                            <span className="text-xs font-bold">Baths</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.baths}</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                        <div className="flex items-center gap-1.5 mb-1" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
                                            <MdSquareFoot />
                                            <span className="text-xs font-bold">Sqft</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: currentTheme.headingColor }}>{property.sqft}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: currentTheme.borderColor }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: currentTheme.borderColor }}></div>
                                        <span className="text-xs font-medium" style={{ color: currentTheme.textColor }}>Agent Smith</span>
                                    </div>
                                    <div className="relative">
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
                                                    <Link href={`/properties/review`} className="w-full">
                                                        <button
                                                            className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                            style={{ color: currentTheme.headingColor }}
                                                        >
                                                            Review Property
                                                        </button>
                                                    </Link>
                                                    <Link href={`/properties/edit`} className="w-full">
                                                        <button
                                                            className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-black/5 transition-colors flex items-center gap-2"
                                                            style={{ color: currentTheme.headingColor }}
                                                        >
                                                            Edit Property
                                                        </button>
                                                    </Link>

                                                    {property.status === 'Active' ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeactivate(property.id);
                                                            }}
                                                            className="px-4 py-2.5 text-left text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleActivate(property.id);
                                                            }}
                                                            className="px-4 py-2.5 text-left text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                    <div className="h-px bg-black/5 my-1" style={{ backgroundColor: currentTheme.borderColor }}></div>
                                                    <button
                                                        className="px-4 py-2.5 text-left text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2"
                                                    >
                                                        Delete Property
                                                    </button>
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
        </div>
    );
}
