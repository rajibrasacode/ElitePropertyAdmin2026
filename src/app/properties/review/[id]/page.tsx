"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineBedroomParent, MdOutlineBathroom, MdSquareFoot, MdLocationOn, MdArrowBack, MdCheck, MdClose, MdConstruction, MdGarage, MdOutlineLocalParking, MdCalendarToday, MdLandscape, MdHouse, MdCheckCircle, MdMonetizationOn, MdBuild } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getPropertyByIdService } from "@/services/properties.service";
import { PropertyData } from "@/types/properties.types";

export default function ReviewPropertyPage() {
    const { currentTheme } = useTheme();
    const params = useParams(); // To get property ID from URL
    const router = useRouter();
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!params.id) return;
            try {
                setLoading(true);
                const data = await getPropertyByIdService(params.id as string);
                setProperty(data);
                if (data && data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
            } catch (err: any) {
                console.error("Failed to fetch property:", err);
                setError("Failed to load property details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id]);

    const handleApprove = () => {
        if (window.confirm("Are you sure you want to approve this property?")) {
            alert("Property Approved Successfully!");
            router.push("/properties");
        }
    };

    const handleReject = () => {
        if (window.confirm("Are you sure you want to reject this property?")) {
            alert("Property Rejected.");
            router.push("/properties");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-red-500 text-xl font-bold">{error || "Property not found"}</div>
                <Link href="/properties">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Back to Listings
                    </button>
                </Link>
            </div>
        );
    }



    // Default image if none exist
    // Determined image to display
    const displayImage = selectedImage || (property.images && property.images.length > 0
        ? property.images[0]
        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000");

    return (
        <div className="mx-auto space-y-8 pb-20">

            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Link href="/properties" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: currentTheme.textColor }}>
                    <MdArrowBack size={20} />
                    <span className="font-bold">Back to Listings</span>
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={handleReject}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2"
                    >
                        <MdClose size={18} />
                        Reject Property
                    </button>
                    <button
                        onClick={handleApprove}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        <MdCheck size={18} />
                        Approve Property
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Image */}
                    <div className="aspect-video w-full rounded-2xl relative shadow-sm overflow-hidden group bg-gray-100">
                        <img
                            src={displayImage}
                            alt={property.street_address}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                        <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm" style={{ color: currentTheme.headingColor }}>
                                {property.transaction_type || "Sale"}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm bg-emerald-500`}>
                                Active
                            </span>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {property.images && property.images.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {property.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${selectedImage === img ? 'ring-2 ring-offset-1 ring-blue-500 border-transparent scale-95' : 'border-transparent hover:opacity-80'}`}
                                    style={{ borderColor: selectedImage === img ? currentTheme.primary : 'transparent' }}
                                >
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Property Description */}
                    {/* Property Description */}
                    <div className="space-y-6">

                        {/* Description - Theme Aware */}
                        <div className="rounded-3xl border shadow-sm transition-all hover:shadow-md overflow-hidden relative"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>

                            {/* Subtle top decoration line */}
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>

                            <div className="p-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                    About this Property
                                </h2>
                                <p className="leading-relaxed whitespace-pre-line text-lg opacity-90" style={{ color: currentTheme.textColor }}>
                                    {property.property_description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Property Specifications - Clean & Brochure Style */}
                        <div className="rounded-3xl border shadow-sm p-8"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <MdCheckCircle size={20} />
                                </div>
                                Property Specifications
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm">
                                {[
                                    { label: "Property Type", value: property.property_type },
                                    { label: "Year Built", value: property.year_built },
                                    { label: "Transaction Type", value: property.transaction_type },
                                    { label: "Asking Price", value: property.asking_price ? `$${property.asking_price.toLocaleString()}` : null },
                                    { label: "Condition", value: property.interior_condition },
                                    { label: "Lot Size", value: property.lot_size ? `${property.lot_size} sqft` : null },
                                    { label: "Garage Spaces", value: property.garage_spaces || "None" },
                                    { label: "Parking Spaces", value: property.parking_spaces || "None" },
                                    { label: "Roof Status", value: property.roof_status },
                                    { label: "Roof Age", value: property.roof_age },
                                    { label: "County", value: property.county },
                                    { label: "Listing ID", value: `#${property.id}` },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 pb-2 border-b border-dashed"
                                        style={{ borderColor: currentTheme.borderColor }}>
                                        <span className="opacity-60 font-medium text-xs uppercase tracking-wide" style={{ color: currentTheme.textColor }}>{item.label}</span>
                                        <span className="font-bold text-base" style={{ color: currentTheme.headingColor }}>{item.value || "N/A"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Renovation Report */}
                        <div className="rounded-3xl border shadow-sm p-8"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                    <MdConstruction size={20} />
                                </div>
                                Renovation Report
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { label: "Exterior Paint", value: property.exterior_paint_required },
                                    { label: "New Flooring", value: property.new_floor_required },
                                    { label: "Kitchen Reno", value: property.kitchen_renovation_required },
                                    { label: "Bathroom Reno", value: property.bathroom_renovation_required },
                                    { label: "Drywall Repair", value: property.drywall_repair_required },
                                    { label: "Interior Paint", value: property.interior_paint_required },
                                ].filter(item => item.value).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30"
                                        style={{ borderColor: currentTheme.borderColor, backgroundColor: `${currentTheme.cardBg || 'transparent'}` }}>
                                        <div className="p-1.5 rounded-full bg-rose-500/10 text-rose-500">
                                            <MdBuild size={14} />
                                        </div>
                                        <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{item.label}</span>
                                    </div>
                                ))}

                                {![property.exterior_paint_required, property.new_floor_required, property.kitchen_renovation_required, property.bathroom_renovation_required, property.drywall_repair_required, property.interior_paint_required].some(Boolean) && (
                                    <div className="col-span-full flex items-center gap-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600">
                                        <MdCheckCircle size={20} />
                                        <span className="font-medium">No major renovations required. Move-in ready condition.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seller Notes - Only if exists */}
                        {property.seller_notes && (
                            <div className="rounded-3xl border shadow-sm p-6"
                                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg" style={{ color: currentTheme.headingColor }}>
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <MdCalendarToday size={20} />
                                    </div>
                                    Seller Notes
                                </h3>
                                <p className="leading-relaxed opacity-90 whitespace-pre-line" style={{ color: currentTheme.textColor }}>
                                    {property.seller_notes}
                                </p>
                            </div>
                        )}

                        {/* Financials - Dynamic Primary Color Card */}
                        {(property.arv !== undefined || property.repair_estimate !== undefined || property.holding_costs !== undefined || property.assignment_fee !== undefined) && (
                            <div className="relative overflow-hidden rounded-3xl shadow-lg p-8"
                                style={{ backgroundColor: currentTheme.cardBg, border: `1px solid ${currentTheme.borderColor}` }}>

                                {/* Dynamic Primary color wash */}
                                <div className="absolute inset-0 opacity-5" style={{ backgroundColor: currentTheme.primary }}></div>

                                <div className="relative z-10">
                                    <h3 className="font-bold mb-6 text-xl flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                        <div className="p-2 rounded-lg bg-opacity-10" style={{ backgroundColor: `${currentTheme.primary}20` }}>
                                            <MdMonetizationOn style={{ color: currentTheme.primary }} size={24} />
                                        </div>
                                        Investment Summary
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            property.arv !== undefined ? { label: "After Repair Value", value: property.arv } : null,
                                            property.repair_estimate !== undefined ? { label: "Est. Repair Costs", value: property.repair_estimate } : null,
                                            property.holding_costs !== undefined ? { label: "Holding Costs", value: property.holding_costs } : null,
                                            property.assignment_fee !== undefined ? { label: "Assignment Fee", value: property.assignment_fee } : null,
                                        ].filter(item => item !== null).map((item: any, i) => (
                                            <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl border bg-opacity-30 h-full justify-center"
                                                style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                                <span className="text-xs font-bold uppercase tracking-wider opacity-60 truncate w-full"
                                                    style={{ color: currentTheme.textColor }} title={item.label}>
                                                    {item.label}
                                                </span>
                                                <span className="font-bold text-lg sm:text-xl break-words leading-tight"
                                                    style={{ color: currentTheme.headingColor }}>
                                                    ${item.value?.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Key Info & actions */}
                <div
                    className="space-y-6 self-start"
                    style={{ position: "sticky", top: "1.5rem" }}
                >

                    {/* Key Specs Card */}
                    <div className="p-6 rounded-2xl border shadow-sm space-y-6"
                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>

                        <div>
                            <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: currentTheme.headingColor }}>{property.street_address}</h1>
                            <div className="flex items-center gap-1 opacity-70" style={{ color: currentTheme.textColor }}>
                                <MdLocationOn />
                                <span className="text-sm font-medium">{property.city}, {property.state} {property.zip_code}</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold" style={{ color: currentTheme.primary }}>
                            ${property.listing_price?.toLocaleString() || "N/A"}
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-y" style={{ borderColor: currentTheme.borderColor }}>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{property.bedrooms}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdOutlineBedroomParent /> Beds
                                </div>
                            </div>
                            <div className="text-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{property.bathrooms}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdOutlineBathroom /> Baths
                                </div>
                            </div>
                            <div className="text-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{property.square_feet}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdSquareFoot /> Sqft
                                </div>
                            </div>
                        </div>

                        {/* Agent Info - Placeholder as API lacks agent data currently */}
                        <div className="flex items-center gap-3 pt-2">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                                alt="Elite Realty"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>Elite Realty</div>
                                <div className="text-xs opacity-70" style={{ color: currentTheme.textColor }}>Listing Agent</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Metadata */}
                    <div className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                        <h3 className="font-bold text-sm uppercase opacity-70" style={{ color: currentTheme.textColor }}>Property Metadata</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Property ID</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>#{property.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Date Listed</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>
                                    {property.listing_date ? new Date(property.listing_date).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Property Type</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>
                                    {property.property_type || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Last Updated</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>
                                    {property.updated_at ? new Date(property.updated_at).toLocaleDateString() : "Recently"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}
