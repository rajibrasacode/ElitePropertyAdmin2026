"use client";

import React from "react";
import { MdOutlineBedroomParent, MdOutlineBathroom, MdSquareFoot, MdLocationOn, MdArrowBack, MdCheck, MdClose } from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock data to simulate fetching a property by ID
// In a real app, you would fetch this based on the ID from the URL
const propertyData = {
    id: 1,
    title: "Luxury Villa in Beverly Hills",
    description: "Experience the epitome of luxury living in this stunning Beverly Hills villa. Featuring breathtaking views, a private infinity pool, and state-of-the-art amenities, this property offers an unparalleled lifestyle. The open-concept living area is perfect for entertaining, while the master suite provides a serene retreat.",
    location: "Beverly Hills, CA",
    price: "$2,500,000",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: "Active",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
    type: "Sale",
    propertyType: "Single-Family",
    features: [
        "Swimming Pool", "Garden", "Garage", "Home Theater", "Wine Cellar", "Smart Home System"
    ],
    agent: {
        name: "Agent Smith",
        email: "agent.smith@eliteproperty.com",
        phone: "+1 (555) 123-4567"
    },
    images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600596542815-2a429bf784b0?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3"
    ]
};

export default function ReviewPropertyPage() {
    const { currentTheme } = useTheme();
    const params = useParams(); // To get property ID from URL in the future
    const router = useRouter();

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

    return (
        <div className=" mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Image */}
                    <div className="aspect-video w-full rounded-2xl relative shadow-sm overflow-hidden group">
                        <img
                            src={propertyData.image}
                            alt={propertyData.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        <div className="absolute bottom-4 left-4 flex gap-2">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm" style={{ color: currentTheme.headingColor }}>
                                {propertyData.type}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${propertyData.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                {propertyData.status}
                            </span>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-4 gap-4">
                        {propertyData.images.map((img, idx) => (
                            <div key={idx} className="aspect-video rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Property Description */}
                    <div className="p-8 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>
                        <h2 className="text-xl font-bold" style={{ color: currentTheme.headingColor }}>About this Property</h2>
                        <p className="leading-relaxed opacity-80" style={{ color: currentTheme.textColor }}>
                            {propertyData.description}
                        </p>

                        <div className="pt-6 mt-6 border-t grid grid-cols-2 md:grid-cols-3 gap-4" style={{ borderColor: currentTheme.borderColor }}>
                            {propertyData.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: currentTheme.headingColor }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - Key Info & actions */}
                <div className="space-y-6">

                    {/* Key Specs Card */}
                    <div className="p-6 rounded-2xl border shadow-sm space-y-6"
                        style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}>

                        <div>
                            <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: currentTheme.headingColor }}>{propertyData.title}</h1>
                            <div className="flex items-center gap-1 opacity-70" style={{ color: currentTheme.textColor }}>
                                <MdLocationOn />
                                <span className="text-sm font-medium">{propertyData.location}</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold" style={{ color: currentTheme.primary }}>
                            {propertyData.price}
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-y" style={{ borderColor: currentTheme.borderColor }}>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{propertyData.beds}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdOutlineBedroomParent /> Beds
                                </div>
                            </div>
                            <div className="text-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{propertyData.baths}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdOutlineBathroom /> Baths
                                </div>
                            </div>
                            <div className="text-center border-l" style={{ borderColor: currentTheme.borderColor }}>
                                <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.headingColor }}>{propertyData.sqft}</div>
                                <div className="text-xs font-bold uppercase opacity-60 flex justify-center items-center gap-1" style={{ color: currentTheme.textColor }}>
                                    <MdSquareFoot /> Sqft
                                </div>
                            </div>
                        </div>

                        {/* Agent Info */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div>
                                <div className="font-bold text-sm" style={{ color: currentTheme.headingColor }}>{propertyData.agent.name}</div>
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
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>#{propertyData.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Date Listed</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>Feb 14, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Last Updated</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>2 days ago</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: currentTheme.textColor }}>Views</span>
                                <span className="font-bold" style={{ color: currentTheme.headingColor }}>1,245</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
