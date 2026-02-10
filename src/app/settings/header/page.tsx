"use client";
import React from "react";
import { MdSave, MdUndo, MdAddPhotoAlternate, MdLink, MdTextFields, MdViewList } from "react-icons/md";

export default function HeaderSettingsPage() {
    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Header Configuration</h1>
                    <p className="text-slate-500 font-medium text-sm">Customize the main navigation and branding of the user site.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-sm flex items-center gap-2">
                        <MdUndo size={18} />
                        Reset
                    </button>
                    <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg shadow-sm hover:bg-blue-800 transition-all font-bold text-sm flex items-center gap-2">
                        <MdSave size={20} />
                        Publish Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Logo Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                            <MdAddPhotoAlternate size={22} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Brand Logo</h2>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 mb-3 shadow-sm">
                            <span className="text-2xl font-bold">Logo</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600">Click to upload</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (Max 2MB)</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo Alt Text</label>
                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Elite Property" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo Link</label>
                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" defaultValue="/" />
                        </div>
                    </div>
                </div>

                {/* Navigation Items - Based on header-config-docs.md */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <MdViewList size={22} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Navigation Menu</h2>
                        </div>
                        <button className="text-sm font-bold text-blue-700 hover:underline">+ Add Item</button>
                    </div>

                    <div className="space-y-3">
                        {/* Mock Nav Items */}
                        {['Features', 'Pricing', 'Testimonials'].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                                <div className="cursor-move text-slate-300 hover:text-slate-600">⋮⋮</div>
                                <div className="flex-1 grid grid-cols-12 gap-4">
                                    <div className="col-span-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                                        <input type="text" defaultValue={item} className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none text-sm font-bold text-slate-700" />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">URL</label>
                                        <input type="text" defaultValue={`#${item.toLowerCase()}`} className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none text-sm text-slate-500" />
                                    </div>
                                    <div className="col-span-4 flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Action</label>
                                        <div className="flex gap-2">
                                            <button className="p-1 text-slate-400 hover:text-blue-600"><MdLink /></button>
                                            <button className="p-1 text-slate-400 hover:text-rose-600">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Configuration */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                                <MdTextFields size={22} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">CTA Button</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Button Text</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" defaultValue="Start Free Trial" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Button URL</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" defaultValue="#signup" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox text-blue-600 rounded" defaultChecked />
                                    <span className="text-sm font-medium text-slate-600">Show on Desktop</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox text-blue-600 rounded" defaultChecked />
                                    <span className="text-sm font-medium text-slate-600">Show on Mobile</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Preview</p>
                        <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                <div className="flex gap-3">
                                    <div className="w-12 h-2 bg-slate-100 rounded"></div>
                                    <div className="w-12 h-2 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                            <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">Start Free Trial</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
