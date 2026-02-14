"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
    MdArrowBack, MdSave, MdCalendarToday, MdAccessTime, MdTitle,
    MdEmail, MdPublic, MdHome, MdAttachMoney, MdWarning, MdPeople,
    MdWork, MdFamilyRestroom, MdSchool, MdLocationOn, MdCategory,
    MdCheckBox, MdCheckBoxOutlineBlank, MdFilterList
} from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";

// --- Styles & Sub-components ---
const inputStyle = `
    w-full h-[42px] rounded-lg border px-3 pl-10 text-sm outline-none transition-all
    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
`;

const iconWrapperStyle = "absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none";
const labelStyle = "block text-xs font-extrabold uppercase tracking-wide mb-1.5 opacity-90";
const sectionHeaderStyle = "flex items-center gap-2 mb-5 pb-3 border-b border-dashed";

const InputField = ({ label, icon, children }: any) => {
    const { currentTheme } = useTheme();
    return (
        <div className="relative">
            <label className={labelStyle} style={{ color: currentTheme.headingColor }}>{label}</label>
            <div className="relative">
                <div className={iconWrapperStyle} style={{ color: currentTheme.textColor }}>{icon}</div>
                {children}
            </div>
        </div>
    );
};

export default function EditCampaignPage() {
    const { currentTheme } = useTheme();
    const router = useRouter();
    const params = useParams();
    const campaignId = params.id;

    const [formData, setFormData] = useState({
        // Basic Info
        name: "",
        campaign_type: "",
        status: "active",
        channel: [] as string[],
        use_ai_personalization: false,

        // Schedule
        scheduled_start_date: "",
        scheduled_end_date: "",
        scheduled_start_time: "",
        scheduled_end_time: "",

        // Content
        subject_line: "",
        email_content: "",

        // Targeting
        geographic_scope_type: "",
        property_type: "",
        min_price: "",
        max_price: "",
        distress_indicators: [] as string[],

        // Demographics
        last_qualification: "",
        age_range: "",
        ethnicity: "",
        salary_range: "",
        marital_status: "",
        employment_status: "",
        home_ownership_status: "",

        // Buyer Geography
        buyer_country: "",
        buyer_state: "",
        buyer_counties: "",
        buyer_city: "",
        buyer_districts: "",
        buyer_parish: "",

        // Seller Geography
        seller_country: "",
        seller_state: "",
        seller_counties: "",
        seller_city: "",
        seller_districts: "",
        seller_parish: "",
        seller_keywords: ""
    });

    useEffect(() => {
        // TODO: Fetch campaign details by campaignId and setFormData
        if (campaignId) {
            console.log("Fetching campaign data for ID:", campaignId);
            // Simulate fetching data
            // setFormData({ ...fetchedData });
        }
    }, [campaignId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleArrayCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: 'channel' | 'distress_indicators') => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentArray = prev[arrayName];
            if (checked) {
                return { ...prev, [arrayName]: [...currentArray, value] };
            } else {
                return { ...prev, [arrayName]: currentArray.filter(item => item !== value) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updating campaign:", formData);
        alert("Campaign Updated!");
        router.push("/campaigns");
    };

    // --- Styling ---
    const cardStyle = {
        backgroundColor: currentTheme.cardBg,
        border: `1px solid ${currentTheme.borderColor}`,
        borderRadius: '12px',
        padding: '24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-20 fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/campaigns" className="p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0">
                        <MdArrowBack size={22} color={currentTheme.textColor} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: currentTheme.headingColor }}>Edit Marketing Campaign</h1>
                        <p className="text-xs opacity-60" style={{ color: currentTheme.textColor }}>Update campaign details and settings</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => router.push('/campaigns')} className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-black/5 whitespace-nowrap" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 md:flex-none px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 whitespace-nowrap" style={{ backgroundColor: currentTheme.primary }}>
                        <MdSave size={18} />
                        <span>Update Campaign</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- 1. Basic Information --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12">
                                <InputField label="Campaign Name *" icon={<MdTitle />}>
                                    <input required minLength={3} maxLength={100} name="name" placeholder="Summer Property Campaign" value={formData.name} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Campaign Type *" icon={<MdCategory />}>
                                    <select required name="campaign_type" value={formData.campaign_type} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="">Select Type</option>
                                        <option value="buyer_finder">Buyer Finder</option>
                                        <option value="seller_finder">Seller Finder</option>
                                        <option value="distressed_property">Distressed Property</option>
                                        <option value="wholesale">Wholesale</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Status *" icon={<MdFilterList />}>
                                    <select required name="status" value={formData.status} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12">
                                <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Marketing Channels *</label>
                                <div className="grid grid-cols-2  gap-3">
                                    {['email', 'sms', 'social_media', 'direct_mail'].map((channel) => {
                                        const isChecked = formData.channel.includes(channel);
                                        return (
                                            <label key={channel} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all w-full select-none ${isChecked ? 'shadow-md transform scale-[1.02]' : 'hover:bg-black/5'}`}
                                                style={{ borderColor: isChecked ? 'transparent' : currentTheme.borderColor, backgroundColor: isChecked ? currentTheme.primary : 'transparent', color: isChecked ? '#fff' : currentTheme.textColor }}>
                                                <div className={`text-xl ${isChecked ? 'text-white' : 'opacity-40'}`}>
                                                    {isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                                </div>
                                                <span className={`text-sm font-bold capitalize ${isChecked ? 'text-white' : ''}`}>{channel}</span>
                                                <input type="checkbox" value={channel} checked={isChecked} onChange={(e) => handleArrayCheckboxChange(e, 'channel')} className="hidden" />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="col-span-12">
                                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all w-full select-none ${formData.use_ai_personalization ? 'shadow-md transform scale-[1.02]' : 'hover:bg-black/5'}`}
                                    style={{ borderColor: formData.use_ai_personalization ? 'transparent' : currentTheme.borderColor, backgroundColor: formData.use_ai_personalization ? currentTheme.primary : 'transparent', color: formData.use_ai_personalization ? '#fff' : currentTheme.textColor }}>
                                    <div className={`text-xl ${formData.use_ai_personalization ? 'text-white' : 'opacity-40'}`}>
                                        {formData.use_ai_personalization ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                    </div>
                                    <span className={`text-sm font-bold ${formData.use_ai_personalization ? 'text-white' : ''}`}>Use AI Personalization</span>
                                    <input type="checkbox" name="use_ai_personalization" checked={formData.use_ai_personalization} onChange={handleCheckboxChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. Schedule --- */}
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Campaign Schedule</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Start Date *" icon={<MdCalendarToday />}>
                                    <input required type="date" name="scheduled_start_date" value={formData.scheduled_start_date} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="End Date *" icon={<MdCalendarToday />}>
                                    <input required type="date" name="scheduled_end_date" value={formData.scheduled_end_date} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Start Time *" icon={<MdAccessTime />}>
                                    <input required type="time" name="scheduled_start_time" value={formData.scheduled_start_time} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="End Time *" icon={<MdAccessTime />}>
                                    <input required type="time" name="scheduled_end_time" value={formData.scheduled_end_time} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. Content --- */}
                <div style={cardStyle}>
                    <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">3</div>
                        <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Message Content</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                        <div className="col-span-12">
                            <InputField label="Email Subject Line *" icon={<MdTitle />}>
                                <input required minLength={5} maxLength={150} name="subject_line" placeholder="Exclusive Investment Opportunity" value={formData.subject_line} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                            </InputField>
                        </div>
                        <div className="col-span-12">
                            <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Email Content *</label>
                            <textarea required name="email_content" rows={6} placeholder="Dear investor, we have an exciting opportunity..." value={formData.email_content} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500 resize-none" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}></textarea>
                        </div>
                    </div>
                </div>

                {/* --- 4. Targeting --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">4</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Targeting Criteria</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Geographic Scope" icon={<MdPublic />}>
                                    <select name="geographic_scope_type" value={formData.geographic_scope_type} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="">Select Scope</option>
                                        <option value="city">City</option>
                                        <option value="state">State</option>
                                        <option value="county">County</option>
                                        <option value="zip_code">Zip Code</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Property Type" icon={<MdHome />}>
                                    <input name="property_type" placeholder="Residential" value={formData.property_type} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Min Price" icon={<MdAttachMoney />}>
                                    <input type="number" name="min_price" placeholder="100000" value={formData.min_price} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Max Price" icon={<MdAttachMoney />}>
                                    <input type="number" name="max_price" placeholder="500000" value={formData.max_price} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12">
                                <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Distress Indicators</label>
                                <div className="grid grid-cols-2  gap-3">
                                    {['foreclosure', 'tax_lien'].map((indicator) => {
                                        const isChecked = formData.distress_indicators.includes(indicator);
                                        return (
                                            <label key={indicator} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all w-full select-none ${isChecked ? 'shadow-md transform scale-[1.02]' : 'hover:bg-black/5'}`}
                                                style={{ borderColor: isChecked ? 'transparent' : currentTheme.borderColor, backgroundColor: isChecked ? currentTheme.primary : 'transparent', color: isChecked ? '#fff' : currentTheme.textColor }}>
                                                <div className={`text-xl ${isChecked ? 'text-white' : 'opacity-40'}`}>
                                                    {isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                                </div>
                                                <span className={`text-sm font-bold capitalize ${isChecked ? 'text-white' : ''}`}>{indicator.replace('_', ' ')}</span>
                                                <input type="checkbox" value={indicator} checked={isChecked} onChange={(e) => handleArrayCheckboxChange(e, 'distress_indicators')} className="hidden" />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 5. Demographics --- */}
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm">5</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Demographics</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Qualification" icon={<MdSchool />}>
                                    <input name="last_qualification" placeholder="pre_qualified" value={formData.last_qualification} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Age Range" icon={<MdPeople />}>
                                    <input name="age_range" placeholder="25-35" value={formData.age_range} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Ethnicity" icon={<MdPeople />}>
                                    <input name="ethnicity" placeholder="asian" value={formData.ethnicity} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Salary Range" icon={<MdAttachMoney />}>
                                    <input name="salary_range" placeholder="50000-75000" value={formData.salary_range} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Marital Status" icon={<MdFamilyRestroom />}>
                                    <select name="marital_status" value={formData.marital_status} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="">Select Status</option>
                                        <option value="married">Married</option>
                                        <option value="single">Single</option>
                                        <option value="divorced">Divorced</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Employment Status" icon={<MdWork />}>
                                    <select name="employment_status" value={formData.employment_status} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="">Select Status</option>
                                        <option value="employed">Employed</option>
                                        <option value="self_employed">Self Employed</option>
                                        <option value="retired">Retired</option>
                                    </select>
                                </InputField>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <InputField label="Home Ownership" icon={<MdHome />}>
                                    <select name="home_ownership_status" value={formData.home_ownership_status} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}>
                                        <option value="">Select Status</option>
                                        <option value="own_home">Own Home</option>
                                        <option value="rent_home">Rent Home</option>
                                    </select>
                                </InputField>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 6. Geography --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Buyer Geo */}
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">6</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Buyer Geography</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            {['Country', 'State', 'Counties', 'City', 'Districts', 'Parish'].map((field) => (
                                <div key={field} className="col-span-12 sm:col-span-6">
                                    <InputField label={field} icon={<MdLocationOn />}>
                                        <input name={`buyer_${field.toLowerCase()}`} placeholder={field} value={(formData as any)[`buyer_${field.toLowerCase()}`]} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                    </InputField>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seller Geo */}
                    <div style={cardStyle}>
                        <div className={sectionHeaderStyle} style={{ borderColor: currentTheme.borderColor }}>
                            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">7</div>
                            <h2 className="text-sm font-bold ml-1" style={{ color: currentTheme.headingColor }}>Seller Geography & Keywords</h2>
                        </div>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                            {['Country', 'State', 'Counties', 'City', 'Districts', 'Parish'].map((field) => (
                                <div key={field} className="col-span-12 sm:col-span-6">
                                    <InputField label={field} icon={<MdLocationOn />}>
                                        <input name={`seller_${field.toLowerCase()}`} placeholder={field} value={(formData as any)[`seller_${field.toLowerCase()}`]} onChange={handleChange} className={inputStyle} style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }} />
                                    </InputField>
                                </div>
                            ))}
                            <div className="col-span-12">
                                <label className={labelStyle} style={{ color: currentTheme.headingColor }}>Seller Keywords</label>
                                <textarea name="seller_keywords" rows={3} maxLength={1000} placeholder="motivated seller, distressed property..." value={formData.seller_keywords} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500 resize-none" style={{ backgroundColor: currentTheme.background, borderColor: currentTheme.borderColor, color: currentTheme.textColor }}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
