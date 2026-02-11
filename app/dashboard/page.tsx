"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-display font-bold text-gray-900 italic lowercase tracking-tight">for you, always.</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/projects" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm">
                        My Projects
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm">
                        Settings
                    </Link>
                </nav>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-[10px] uppercase tracking-widest font-black text-rose-600 mb-2">Pro Plan</p>
                    <p className="text-xs text-rose-900 font-bold mb-3">Unlimited themes & assets unlocked.</p>
                    <button className="w-full py-2 bg-white text-rose-600 text-[10px] font-black uppercase tracking-tighter rounded-lg shadow-sm">Manage Plan</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900">Welcome back!</h1>
                        <p className="text-gray-400 text-sm">You have {projects.length} active digital gifts.</p>
                    </div>
                    <Link href="/dashboard/create" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all">
                        <span className="text-xl">+</span> Create New Project
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Views</p>
                        <p className="text-4xl font-display font-bold text-gray-900">0</p>
                        <p className="text-xs text-green-500 font-bold mt-2">↑ 0% from last week</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Projects</p>
                        <p className="text-4xl font-display font-bold text-gray-900">{projects.length.toString().padStart(2, '0')}</p>
                        <p className="text-xs text-gray-400 font-bold mt-2">Ready to share</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Storage Used</p>
                        <p className="text-4xl font-display font-bold text-gray-900">0%</p>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                            <div className="w-[0%] h-full bg-rose-500"></div>
                        </div>
                    </div>
                </div>

                {/* Projects List */}
                <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Recent Projects</h2>
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 font-bold">Loading projects...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-gray-400 font-bold mb-4">No projects yet.</p>
                            <Link href="/dashboard/create" className="text-rose-500 font-bold border-b-2 border-rose-100 pb-1">Create your first gift →</Link>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Project Name</th>
                                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6 font-bold text-gray-900">{p.name}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.theme_type === 'valentine' ? 'bg-rose-100 text-rose-600' : p.theme_type === 'birthday' ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {p.theme_type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <div className={`w-2 h-2 rounded-full ${p.is_live ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                                                {p.is_live ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-4 py-2 text-xs font-black uppercase tracking-tight text-gray-400 hover:text-gray-900 transition-colors">Edit</button>
                                                <button className="px-4 py-2 text-xs font-black uppercase tracking-tight text-rose-500 hover:text-rose-700 transition-colors">Share</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

