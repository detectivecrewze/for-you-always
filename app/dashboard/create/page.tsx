"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// --- WIZARD STEPS DEFINITION ---
const BASE_STEPS = [
    { id: "setup", name: "Setup", icon: "palette", title: "Theme & Names" },
    { id: "page-manager", name: "Page Manager", icon: "dashboard_customize", title: "Choose Your Pages" },
];

const PAGE_TYPES = [
    { id: "page-2", type: "greeting", name: "Greeting Card", icon: "favorite" },
    { id: "page-3", type: "music", name: "Music Player", icon: "library_music" },
    { id: "page-4", type: "wrapped", name: "Our Vibe", icon: "auto_awesome" },
    { id: "page-5", type: "quiz", name: "Love Quiz", icon: "quiz" },
    { id: "page-6", type: "gallery", name: "Photo Gallery", icon: "photo_library" },
    { id: "page-7", type: "map", name: "Our Journey", icon: "location_on" },
    { id: "page-8", type: "letter", name: "Love Letter", icon: "history_edu" },
    { id: "page-9", type: "lock", name: "Final Lock", icon: "lock" },
    { id: "page-10", type: "infinity", name: "Infinity Scroll", icon: "all_inclusive" },
];

export default function WizardEditor() {
    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<any>({
        theme: {
            backgroundColor: "#F5E6D3",
            fontDisplay: "Playfair Display, serif",
            fontSans: "Poppins, sans-serif",
            particles: "hearts"
        },
        login: {
            password: "",
            title: "Private Access",
            instruction: "Enter our special date"
        },
        metadata: {
            customerName: "Recipient Name"
        },
        enabledPages: ["page-1", "page-2"], // Default pages
        pages: []
    });

    // Handle Wizard Steps based on Enabled Pages
    const wizardSteps: any[] = [
        ...BASE_STEPS,
        ...PAGE_TYPES.filter(p => config.enabledPages.includes(p.id))
            .map(p => ({ id: p.id, name: p.name, icon: p.icon, title: p.name, type: p.type }))
    ];

    const currentStep = wizardSteps[currentStepIdx];

    // --- SYNC WITH IFRAME ---
    useEffect(() => {
        const syncWithIframe = () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: "SYNC_CONFIG",
                    config: config
                }, "*");

                // Also navigate the preview to the current page
                if (currentStep && currentStep.id) {
                    iframeRef.current.contentWindow.postMessage({
                        type: "NAVIGATE_TO_PAGE",
                        pageId: currentStep.id === 'setup' ? 'page-1' : currentStep.id
                    }, "*");
                }
            }
        };

        const timeoutId = setTimeout(syncWithIframe, 500); // Debounce sync
        return () => clearTimeout(timeoutId);
    }, [config, currentStepIdx]);

    const handleFieldChange = (category: string, field: string, value: any) => {
        setConfig((prev: any) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const togglePage = (pageId: string) => {
        setConfig((prev: any) => {
            const enabled = prev.enabledPages.includes(pageId);
            return {
                ...prev,
                enabledPages: enabled
                    ? prev.enabledPages.filter((id: string) => id !== pageId)
                    : [...prev.enabledPages, pageId]
            };
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("projects")
                .insert([{
                    name: config.metadata.customerName || "Untitled Project",
                    theme_type: "valentine",
                    recipient_name: config.metadata.customerName,
                    config: config,
                    is_live: false
                }]);

            if (error) throw error;
            alert("Project saved successfully!");
            router.push("/dashboard");
        } catch (err: any) {
            alert("Error saving: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="w-10 h-10 relative overflow-hidden rounded-lg">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </Link>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <h1 className="font-bold text-gray-900 truncate max-w-[200px]">
                        {config.metadata.customerName || "New Project"}
                    </h1>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-full">Valentine Admin</span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2">
                        {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                        Save Progress
                    </button>
                    <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white border-r border-gray-100 flex flex-col overflow-y-auto shrink-0 p-4">
                    <div className="space-y-1">
                        {wizardSteps.map((step, idx) => (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStepIdx(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentStepIdx === idx
                                    ? "bg-rose-50 text-rose-600 shadow-sm"
                                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-lg ${currentStepIdx === idx ? "text-rose-500" : "text-gray-300"}`}>
                                    {step.icon}
                                </span>
                                {step.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Editor Area */}
                <div className="flex-1 bg-white overflow-y-auto p-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">{currentStep?.icon}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-gray-900">{currentStep?.title}</h2>
                                <p className="text-sm text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Step {currentStepIdx + 1} of {wizardSteps.length}</p>
                            </div>
                        </div>

                        {/* STEP CONTENT SWITCHER */}
                        {currentStep?.id === "setup" && (
                            <div className="space-y-8">
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-rose-500">person</span> Identity
                                    </h3>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-rose-500 outline-none transition-all font-bold"
                                            value={config.metadata.customerName}
                                            onChange={(e) => handleFieldChange("metadata", "customerName", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-rose-500">lock</span> Login Security
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-rose-500 outline-none transition-all font-bold"
                                                value={config.login.password}
                                                onChange={(e) => handleFieldChange("login", "password", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Page Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-rose-500 outline-none transition-all font-bold"
                                                value={config.login.title}
                                                onChange={(e) => handleFieldChange("login", "title", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep?.id === "page-manager" && (
                            <div className="grid grid-cols-1 gap-3">
                                {PAGE_TYPES.map((page) => (
                                    <div key={page.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.enabledPages.includes(page.id) ? "bg-rose-500 text-white" : "bg-white text-gray-400"}`}>
                                            <span className="material-symbols-outlined">{page.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{page.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{page.type}</p>
                                        </div>
                                        <button
                                            onClick={() => togglePage(page.id)}
                                            className={`w-12 h-6 rounded-full relative transition-all ${config.enabledPages.includes(page.id) ? "bg-green-500" : "bg-gray-200"}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.enabledPages.includes(page.id) ? "left-7" : "left-1"}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* DYNAMIC PAGE EDITORS (Example for Greeting) */}
                        {currentStep?.type === "greeting" && (
                            <div className="space-y-6">
                                <div className="bg-gray-100/50 p-8 rounded-[40px] space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all font-bold shadow-sm"
                                            value={config.greeting?.title || "Happy Valentine's Day"}
                                            onChange={(e) => handleFieldChange("greeting", "title", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Heartfelt Message</label>
                                        <textarea
                                            rows={5}
                                            className="w-full px-6 py-4 bg-white border-none rounded-3xl focus:ring-2 focus:ring-rose-500 transition-all font-medium shadow-sm resize-none"
                                            value={config.greeting?.message || ""}
                                            onChange={(e) => handleFieldChange("greeting", "message", e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-16 pt-8 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentStepIdx === 0}
                                className="flex items-center gap-2 font-bold text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all"
                            >
                                <span className="material-symbols-outlined">arrow_back</span> Back
                            </button>
                            {currentStepIdx < wizardSteps.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStepIdx(prev => prev + 1)}
                                    className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center gap-2"
                                >
                                    Next Step <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                                >
                                    Finish & Save <span className="material-symbols-outlined">celebration</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Area (Right) */}
                <aside className="w-[450px] bg-gray-900 p-8 flex items-center justify-center shrink-0">
                    <div className="w-full max-w-[320px] aspect-[9/19] bg-black rounded-[50px] border-[10px] border-gray-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 w-full h-8 bg-gray-800 flex items-center justify-center z-10">
                            <div className="w-20 h-4 bg-black rounded-full"></div>
                        </div>
                        <iframe
                            ref={iframeRef}
                            src="/themes/valentine/index.html?preview=wizard"
                            className="w-full h-full border-none"
                            title="Live Preview"
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
}
