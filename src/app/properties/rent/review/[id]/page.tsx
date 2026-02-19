"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineBedroomParent, MdOutlineBathroom, MdSquareFoot, MdLocationOn, MdArrowBack, MdCheckCircle, MdCalendarToday, MdHouse, MdConstruction, MdAirlineSeatReclineNormal, MdPets, MdAttachMoney, MdSmokeFree, MdWater, MdPool, MdLocalParking, MdWifi, MdSecurity, MdFitnessCenter, MdElevator, MdBalcony, MdKitchen, MdAcUnit, MdLocalLaundryService } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PropertyData } from "@/types/properties.types";
// import { getPropertyByIdService } from "@/services/properties.service"; // Removed
import { staticRentalProperties } from "../../page"; // Import static data

export default function RentReviewPropertyPage() {
    const { currentTheme } = useTheme();
    const params = useParams(); // To get property ID from URL
    const router = useRouter();

    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!params.id) return;
            setLoading(true);
            try {
                // Determine source of static data (active or pending)
                // For simplicity, we just look in the exported staticRentalProperties which we populated with both in the listing page logic?
                // Wait, in previous step I only exported staticRentalProperties (active + pending were merged or separate?)
                // Accessing the file content again shows I defined `staticRentalProperties` which included one pending item at the end.
                // So I can just search in that array.

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const foundProperty = staticRentalProperties.find(p => p.id.toString() === params.id);

                if (foundProperty) {
                    setProperty(foundProperty);
                    if (foundProperty.images && foundProperty.images.length > 0) {
                        setSelectedImage(foundProperty.images[0]);
                    }
                } else {
                    setError("Property not found");
                }
            } catch (err: any) {
                console.error("Failed to fetch property:", err);
                setError(err.message || "Failed to load property details");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id]);

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
                <Link href="/properties/rent">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Back to Rent Listings
                    </button>
                </Link>
            </div>
        );
    }

    const displayImage = selectedImage || (property.images && property.images.length > 0
        ? property.images[0]
        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000");

    return (
        <div className="mx-auto space-y-8 pb-20">

            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Link href="/properties/rent" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: currentTheme.textColor }}>
                    <MdArrowBack size={20} />
                    <span className="font-bold">Back to Rent Listings</span>
                </Link>
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
                                {property.listing_type || "Rent"}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${property.status === 'Pending' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                                {property.status === 'Pending' ? 'Pending' : 'Active'}
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

                    {/* Details Sections */}
                    <div className="space-y-6">

                        {/* Description */}
                        <div className="rounded-3xl border shadow-sm transition-all hover:shadow-md overflow-hidden relative"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
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

                        {/* Rental Specifications */}
                        <div className="rounded-3xl border shadow-sm p-8"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <MdCheckCircle size={20} />
                                </div>
                                Rental Specifications
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm">
                                {[
                                    { label: "Property Type", value: property.property_type },
                                    { label: "Year Built", value: property.year_built },
                                    { label: "Rent Price", value: property.rent_price ? `$${property.rent_price.toLocaleString()}/${property.rent_frequency === 'Monthly' ? 'mo' : 'yr'}` : null },
                                    { label: "Security Deposit", value: property.security_deposit ? `$${property.security_deposit.toLocaleString()}` : null },
                                    { label: "Available From", value: property.available_from ? new Date(property.available_from).toLocaleDateString() : "Now" },
                                    { label: "Lease Duration", value: property.lease_duration ? `${property.lease_duration} Months` : null },
                                    { label: "Application Fee", value: property.application_fee ? `$${property.application_fee.toLocaleString()}` : "None" },
                                    { label: "Move-in Fees", value: property.move_in_fees ? `$${property.move_in_fees.toLocaleString()}` : "None" },
                                    { label: "Smoking Policy", value: property.smoking_policy || "Not Specified" },
                                    { label: "Furnished", value: property.is_furnished ? "Yes" : "No" },
                                    { label: "Pets Allowed", value: property.pets_allowed ? "Yes" : "No" },
                                    { label: "Garage Spaces", value: property.garage_spaces || "None" },
                                    { label: "Parking Spaces", value: property.parking_spaces || "None" },
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

                        {/* Utilities Included */}
                        {property.utilities_included && property.utilities_included.length > 0 && (
                            <div className="rounded-3xl border shadow-sm p-8"
                                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                        <MdWater size={20} />
                                    </div>
                                    Utilities Included
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {property.utilities_included.map((utility, idx) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-lg border text-sm font-semibold flex items-center gap-2"
                                            style={{ borderColor: currentTheme.borderColor, color: currentTheme.headingColor }}>
                                            <MdCheckCircle className="text-blue-500" size={16} />
                                            {utility}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="rounded-3xl border shadow-sm p-8"
                                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <MdFitnessCenter size={20} />
                                    </div>
                                    Amenities
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {property.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30"
                                            style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                            <div className="p-1 rounded-full bg-purple-500/10 text-purple-500">
                                                <MdCheckCircle size={16} />
                                            </div>
                                            <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Conditions & Additional Info */}
                        <div className="rounded-3xl border shadow-sm p-8"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: currentTheme.headingColor }}>
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                    <MdConstruction size={20} />
                                </div>
                                Condition & Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                    <div className="p-1 rounded-full bg-blue-500/10 text-blue-500"><MdHouse size={16} /></div>
                                    <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{property.interior_condition || "Standard"} Condition</span>
                                </div>
                                {property.is_furnished && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                        <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-500"><MdAirlineSeatReclineNormal size={16} /></div>
                                        <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>Furnished</span>
                                    </div>
                                )}
                                {property.pets_allowed && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"><MdPets size={16} /></div>
                                        <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>Pets Allowed</span>
                                    </div>
                                )}
                                {property.smoking_policy === "Not Allowed" && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-opacity-30" style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBg }}>
                                        <div className="p-1 rounded-full bg-red-500/10 text-red-500"><MdSmokeFree size={16} /></div>
                                        <span className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>No Smoking</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seller/Landlord Notes */}
                        {property.seller_notes && (
                            <div className="rounded-3xl border shadow-sm p-6"
                                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg" style={{ color: currentTheme.headingColor }}>
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <MdCalendarToday size={20} />
                                    </div>
                                    Landlord Notes
                                </h3>
                                <p className="leading-relaxed opacity-90 whitespace-pre-line" style={{ color: currentTheme.textColor }}>
                                    {property.seller_notes}
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Column - Key Info */}
                <div className="space-y-6 self-start" style={{ position: "sticky", top: "1.5rem" }}>

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
                            ${(property.rent_price || 0).toLocaleString()}
                            <span className="text-lg text-gray-400 font-normal ml-1">/mo</span>
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

                        {/* Security Deposit & Lease */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="opacity-70" style={{ color: currentTheme.textColor }}>Security Deposit</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>${(property.security_deposit || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="opacity-70" style={{ color: currentTheme.textColor }}>Lease Duration</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>{property.lease_duration || 12} Months</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="opacity-70" style={{ color: currentTheme.textColor }}>Available From</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>{property.available_from ? new Date(property.available_from).toLocaleDateString() : "Now"}</span>
<span className="font-bold" style={{ color: currentTheme.headingColor }}>{property.available_from || "Now"}</span>
                            </div>
                        </div>

                        {/* Agent */}
                        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: currentTheme.borderColor }}>
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
                </div>

            </div>
        </div>
    );
}
