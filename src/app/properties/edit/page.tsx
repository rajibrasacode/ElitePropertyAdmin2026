"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
    MdArrowBack, MdSave, MdCloudUpload, MdLocationOn,
    MdHome, MdAttachMoney, MdBuild, MdDescription,
    MdCalendarToday, MdMeetingRoom, MdBathtub, MdSquareFoot,
    MdGarage, MdDirectionsCar, MdAspectRatio, MdConstruction, MdBrush,
    MdCheck, MdRealEstateAgent, MdNotes, MdImage, MdWarning, MdLayers,
    MdApartment, MdMap, MdPlace, MdLocalOffer, MdMoneyOff, MdDesignServices, MdKingBed,
    MdCheckBox, MdCheckBoxOutlineBlank, MdDelete
} from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

// Mock Data for Filling the Form
const mockPropertyData = {
    street_address: "123 Main St",
    unit_apt: "Apt 4B",
    city: "Beverly Hills",
    state: "CA",
    zip_code: "90210",
    county: "Los Angeles",
    property_type: "Single-Family",
    bedrooms: "5",
    bathrooms: "4",
    square_feet: "4500",
    lot_size: "0.5 Acres",
    year_built: "2018",
    garage_spaces: "3",
    parking_spaces: "2",
    roof_age: "5",
    roof_status: "Excellent",
    interior_condition: "Excellent",
    exterior_paint_required: false,
    new_floor_required: false,
    kitchen_renovation_required: false,
    bathroom_renovation_required: false,
    drywall_repair_required: false,
    interior_paint_required: false,
    listing_price: "2500000",
    asking_price: "2600000",
    arv: "3000000",
    repair_estimate: "50000",
    holding_costs: "2000",
    assignment_fee: "15000",
    transaction_type: "Cash",
    property_description: "Experience the epitome of luxury living in this stunning Beverly Hills villa. Featuring breathtaking views, a private infinity pool, and state-of-the-art amenities.",
    seller_notes: "Motivated seller, looking for a quick close.",
    images: [] as File[] // In a real app, this would be URLs
};

export default function EditPropertyPage() {
    const { currentTheme } = useTheme();
    const router = useRouter();
    const params = useParams();

    const [formData, setFormData] = useState(mockPropertyData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFormData(prev => ({ ...prev, images: Array.from(e.target.files || []) }));
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated Data:", formData);
        router.push("/properties");
    };

    // --- Responsive High Contrast Layout ---
    const cardStyle = {
        backgroundColor: currentTheme.cardBg,
        border: `1px solid ${currentTheme.borderColor}`,
        borderRadius: '12px',
        padding: '24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const
    };

    const inputStyle = `
        w-full h-[42px] rounded-lg border px-3 pl-10 text-sm outline-none transition-all
        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    `;

    const iconWrapperStyle = "absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none";
    const labelStyle = "block text-xs font-extrabold uppercase tracking-wide mb-1.5 opacity-90";
    const sectionHeaderStyle = "flex items-center gap-2 mb-5 pb-3 border-b border-dashed";

    const InputField = ({ label, icon, children }: any) => (
        <div className="relative">
            <label className={labelStyle} style={{ color: currentTheme.headingColor }}>{label}</label>
            <div className="relative">
                <div className={iconWrapperStyle} style={{ color: currentTheme.textColor }}>{icon}</div>
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-20 fade-in-up">

            {/* Header - Responsive Flex */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/properties" className="p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0">
                        <MdArrowBack size={22} color={currentTheme.textColor} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: currentTheme.headingColor }}>Edit Property</h1>
                        <p className="text-xs opacity-60" style={{ color: currentTheme.textColor }}>Editing: {formData.street_address}</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => router.push('/properties')} className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-black/5 whitespace-nowrap" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>Cancel</button>
                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2 whitespace-nowrap transition-colors" style={{ borderColor: currentTheme.borderColor }}>
                        <MdDelete size={18} />
                        <span>Delete</span>
                    </button>
                    <button onClick={handleUpdate} className="flex-1 md:flex-none px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 whitespace-nowrap" style={{ backgroundColor: currentTheme.primary }}>
                        <MdSave size={18} />
                        <span>Update Property</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">

                {/* --- ADDRESS & SPECS --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Property Address</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 lg:col-span-8">
                                <InputField label="Street Address *" icon={<MdLocationOn />}>
                                    <input required name="street_address" placeholder="123 Main St" value={formData.street_address} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <InputField label="Unit/Apt *" icon={<MdApartment />}>
                                    <input required name="unit_apt" placeholder="Apt 4B" value={formData.unit_apt} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>

                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="City *" icon={<MdLocationOn />}>
                                    <input required name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="County *" icon={<MdMap />}>
                                    <input required name="county" placeholder="County" value={formData.county} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>

                            <div className="col-span-6 sm:col-span-6">
                                <InputField label="State *" icon={<MdPlace />}>
                                    <input required name="state" placeholder="State" value={formData.state} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-6 sm:col-span-6">
                                <InputField label="Zip Code *" icon={<MdPinDropIcon />}>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" style={{ color: currentTheme.textColor }}>#</div>
                                    <input required name="zip_code" placeholder="Zip" value={formData.zip_code} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Property Specs</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Property Type *" icon={<MdHome />}>
                                    <select required name="property_type" value={formData.property_type} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option>Residential</option><option>Commercial</option><option>Industrial</option><option>Land</option><option>Multi-Family</option><option>Single-Family</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Year Built *" icon={<MdCalendarToday />}>
                                    <input required type="number" name="year_built" placeholder="Year" value={formData.year_built} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>

                            <div className="col-span-12 sm:col-span-4">
                                <InputField label="Lot Size *" icon={<MdAspectRatio />}>
                                    <input required name="lot_size" placeholder="SqFt/Acres" value={formData.lot_size} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-6 sm:col-span-4">
                                <InputField label="Beds *" icon={<MdKingBed />}>
                                    <input required type="number" name="bedrooms" placeholder="3" value={formData.bedrooms} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-6 sm:col-span-4">
                                <InputField label="Baths *" icon={<MdBathtub />}>
                                    <input required type="number" name="bathrooms" placeholder="2" value={formData.bathrooms} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>

                            <div className="col-span-12 sm:col-span-4">
                                <InputField label="Sq Ft *" icon={<MdSquareFoot />}>
                                    <input required type="number" name="square_feet" placeholder="2500" value={formData.square_feet} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-6 sm:col-span-4">
                                <InputField label="Garage" icon={<MdGarage />}>
                                    <input required type="number" name="garage_spaces" placeholder="2" value={formData.garage_spaces} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-6 sm:col-span-4">
                                <InputField label="Parking" icon={<MdDirectionsCar />}>
                                    <input required type="number" name="parking_spaces" placeholder="4" value={formData.parking_spaces} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONDITION & FINANCIALS --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">3</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Condition</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5 mb-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Roof Age" icon={<MdCalendarToday />}>
                                    <input required name="roof_age" placeholder="Yr" value={formData.roof_age} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Roof Status" icon={<MdConstruction />}>
                                    <select required name="roof_status" value={formData.roof_status} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Replace</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 md:col-span-12">
                                <InputField label="Interior Condition" icon={<MdBrush />}>
                                    <select required name="interior_condition" value={formData.interior_condition} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                                    </select>
                                </InputField>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Renovations Required?</label>
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    { name: 'exterior_paint_required', label: 'Ext. Paint' },
                                    { name: 'new_floor_required', label: 'New Floors' },
                                    { name: 'kitchen_renovation_required', label: 'Kitchen' },
                                    { name: 'bathroom_renovation_required', label: 'Bathrooms' },
                                    { name: 'drywall_repair_required', label: 'Drywall' },
                                    { name: 'interior_paint_required', label: 'Int. Paint' },
                                ].map((item) => {
                                    const isChecked = (formData as any)[item.name];
                                    return (
                                        <label key={item.name}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all w-full select-none
                                            ${isChecked ? 'shadow-md transform scale-[1.02]' : 'hover:bg-black/5'}`}
                                            style={{
                                                borderColor: isChecked ? 'transparent' : currentTheme.borderColor,
                                                backgroundColor: isChecked ? currentTheme.primary : 'transparent',
                                                color: isChecked ? '#fff' : currentTheme.textColor
                                            }}
                                        >
                                            <div className={`text-xl ${isChecked ? 'text-white' : 'opacity-40'}`}>
                                                {isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                            </div>
                                            <span className={`text-sm font-bold ${isChecked ? 'text-white' : ''}`}>
                                                {item.label}
                                            </span>
                                            <input type="checkbox" name={item.name} checked={isChecked} onChange={handleCheckboxChange} className="hidden" />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">4</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Financials</h2>
                        </div>

                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Listing Price *" icon={<span className="font-bold">$</span>}>
                                    <input required type="number" name="listing_price" placeholder="0" value={formData.listing_price} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor, fontWeight: 'bold' }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Asking Price *" icon={<span className="font-bold">$</span>}>
                                    <input required type="number" name="asking_price" placeholder="0" value={formData.asking_price} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor, fontWeight: 'bold' }} />
                                </InputField>
                            </div>

                            <div className="col-span-12">
                                <InputField label="Transaction Type *" icon={<MdRealEstateAgent />}>
                                    <select required name="transaction_type" value={formData.transaction_type} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option>Cash</option><option>Financing</option><option>Assignment</option><option>Wholesale</option>
                                    </select>
                                </InputField>
                            </div>

                            {[
                                { n: 'arv', l: 'ARV', i: <MdLocalOffer /> }, { n: 'repair_estimate', l: 'Repair Estimate', i: <MdBuild /> },
                                { n: 'holding_costs', l: 'Holding Costs', i: <MdMoneyOff /> }, { n: 'assignment_fee', l: 'Assignment Fee', i: <MdAttachMoney /> }
                            ].map(f => (
                                <div key={f.n} className="col-span-12 sm:col-span-6">
                                    <InputField label={`${f.l} *`} icon={f.i}>
                                        <input required type="number" name={f.n} placeholder="0" value={(formData as any)[f.n]} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                    </InputField>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- INFO & IMAGES --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">5</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Additional Info</h2>
                        </div>
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex-1">
                                <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Property Description</label>
                                <textarea name="property_description" placeholder="Description..." value={formData.property_description} onChange={handleChange} className="w-full h-24 rounded-lg border p-3 text-sm outline-none focus:border-blue-500 resize-none" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}></textarea>
                            </div>
                            <div className="flex-1">
                                <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Seller Notes (Private)</label>
                                <textarea name="seller_notes" placeholder="Notes..." value={formData.seller_notes} onChange={handleChange} className="w-full h-20 rounded-lg border p-3 text-sm outline-none focus:border-blue-500 resize-none" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}></textarea>
                            </div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">6</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Property Images</h2>
                        </div>

                        <div className="border-2 border-dashed rounded-xl flex-1 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 transition-all group min-h-[200px]" style={{ borderColor: currentTheme.borderColor }}>
                            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload-smart" />
                            <label htmlFor="file-upload-smart" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                                <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                                    <MdCloudUpload size={32} />
                                </div>
                                <h3 className="text-sm font-bold mb-1" style={{ color: currentTheme.headingColor }}>Drop files here or click to upload</h3>
                                {formData.images.length > 0 ? (
                                    <div className="mt-2 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                        {formData.images.length} files selected
                                    </div>
                                ) : (
                                    <p className="text-xs opacity-50" style={{ color: currentTheme.textColor }}>Support for bulk upload (Max 5MB)</p>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

// Fallback if MdPinDropIcon not explicit in react-icons/md
const MdPinDropIcon = (props: any) => <MdLocationOn {...props} />;
