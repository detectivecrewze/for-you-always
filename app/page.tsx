"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8"
        } ${className}`}
    >
      {children}
    </div>
  );
}

// Theme Card Component - Premium Redesign
function ThemeCard({
  title,
  subtitle,
  description,
  image,
  color,
  href,
  available = false,
  index,
  password,
  images,
}: {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: "rose" | "blue" | "emerald";
  href?: string;
  available?: boolean;
  index: number;
  password?: string;
  images?: string[];
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images && images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
      }, 4000 + (index * 500)); // Staggered start
      return () => clearInterval(timer);
    }
  }, [images, index]);
  const colorClasses = {
    rose: {
      bg: "bg-rose-50/50",
      badge: "bg-rose-100/50 text-rose-700 border-rose-200",
      button: "bg-slate-900 hover:bg-rose-600 shadow-slate-200 hover:shadow-rose-500/20",
      glow: "group-hover:shadow-[0_40px_80px_-20px_rgba(244,63,94,0.15)]",
      accent: "text-rose-500",
      ring: "group-hover:ring-rose-200"
    },
    blue: {
      bg: "bg-blue-50/50",
      badge: "bg-blue-100/50 text-blue-700 border-blue-200",
      button: "bg-slate-900 hover:bg-blue-600 shadow-slate-200 hover:shadow-blue-500/20",
      glow: "group-hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.15)]",
      accent: "text-blue-500",
      ring: "group-hover:ring-blue-200"
    },
    emerald: {
      bg: "bg-emerald-50/50",
      badge: "bg-emerald-100/50 text-emerald-700 border-emerald-200",
      button: "bg-slate-900 hover:bg-emerald-600 shadow-slate-200 hover:shadow-emerald-500/20",
      glow: "group-hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)]",
      accent: "text-emerald-500",
      ring: "group-hover:ring-emerald-200"
    },
  };

  const c = colorClasses[color];

  return (
    <AnimatedSection delay={index * 150}>
      <div className="group h-full relative">
        <div
          className={`relative h-full bg-white rounded-[2.5rem] overflow-hidden transition-all duration-700 
            border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-transparent
            ${c.glow} ${c.ring} group-hover:-translate-y-2`}
        >
          {/* Image Container */}
          <div className={`relative aspect-[16/10] ${c.bg} overflow-hidden`}>
            {images && images.length > 0 ? (
              <div className="absolute inset-0">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${title} showcase ${i}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
                      ${currentIdx === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                  />
                ))}
              </div>
            ) : image.match(/\.(mp4|webm|mov|mov)$/i) ? (
              <div className="absolute inset-0 pointer-events-none select-none">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  preload="metadata"
                  poster={image.replace('.mp4', '.png')}
                  disablePictureInPicture
                  disableRemotePlayback
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                >
                  <source src={image} type="video/mp4" />
                </video>
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            )}

            {/* Availability Badge */}
            <div className="absolute top-6 right-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border backdrop-blur-md ${c.badge}`}>
                {available ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    Tersedia
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    Coming Soon
                  </>
                )}
              </span>
            </div>

            {/* Password Hint - Aesthetic Badge */}
            {available && password && (
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-md rounded-xl border border-white/20">
                  <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest leading-none mb-0.5">Demo Pass</span>
                    <span className="text-[10px] font-mono font-bold text-white leading-none">{password}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-10">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                  {title}
                </h3>
              </div>
              <p className={`text-xs font-serif italic font-bold tracking-widest ${c.accent}`}>
                {subtitle}
              </p>
            </div>

            <p className="text-slate-500 font-light leading-relaxed mb-8">
              {description}
            </p>

            {available && href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-full py-4 rounded-2xl text-[13px] font-bold text-white
                  transition-all duration-500 ${c.button} uppercase tracking-widest`}
              >
                Coba Demo
                <svg className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center w-full py-4 rounded-2xl text-[13px] font-bold text-slate-400 bg-slate-100 cursor-not-allowed uppercase tracking-widest border border-slate-200/50"
              >
                Coming Soon
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// Step Card Component - Premium Redesign
function StepCard({ number, title, description, icon, delay = 0 }: { number: string; title: string; description: string; icon: React.ReactNode; delay?: number }) {
  return (
    <div className="group relative">
      {/* Decorative Connector (Desktop) */}
      {parseInt(number) < 3 && (
        <div className="hidden md:block absolute top-1/4 left-full w-full h-[1px] bg-gradient-to-r from-rose-200/50 to-transparent z-0 -translate-x-12" />
      )}

      <div className="relative z-10 p-10 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-3 ring-1 ring-slate-100/50">
        {/* Step Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 mb-8 transition-colors group-hover:bg-rose-50 group-hover:border-rose-100">
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-500 uppercase tracking-[0.2em]">Step</span>
          <span className="text-xs font-serif italic font-bold text-slate-900 leading-none">0{number}</span>
        </div>

        {/* Icon Container with Aura */}
        <div className="relative w-16 h-16 mb-8 group-hover:scale-110 transition-transform duration-700">
          <div className="absolute inset-0 bg-rose-200/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative w-full h-full rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-rose-500 transition-colors duration-500">
            {icon}
          </div>
        </div>

        <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// Feature Card Component - Premium Redesign
function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="group relative h-full p-10 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 ring-1 ring-slate-100/50">
      <div className="flex flex-col h-full">
        {/* Icon with Dynamic Aura */}
        <div className="relative w-14 h-14 mb-8 group-hover:scale-110 transition-transform duration-700">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-700 ${color.includes('rose') ? 'bg-rose-500' :
            color.includes('blue') ? 'bg-blue-500' :
              color.includes('emerald') ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
          <div className="relative w-full h-full rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-colors duration-500">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 tracking-tight group-hover:text-rose-600 transition-colors duration-500">
            {title}
          </h3>
          <p className="text-slate-500 font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Minimalist Detail Line */}
        <div className="w-8 h-[2px] bg-slate-100 mt-8 group-hover:w-16 group-hover:bg-rose-200 transition-all duration-700" />
      </div>
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [activeMap, setActiveMap] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const mapThemes = [
    {
      title: "LDR Edition",
      subtitle: "Miles and Memories",
      description: "Menghubungkan jarak ribuan mil dalam sebuah garis emosional, melacak setiap titik pertemuan yang berharga antara Anda dan pasangan.",
      video: "https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/ldr_map.mov",
      accent: "emerald"
    },
    {
      title: "Valentine Edition",
      subtitle: "The Atlas of Us",
      description: "Visualisasi peta bernuansa Rose yang lembut, menceritakan setiap kilometer perjalanan cinta Anda dengan detail puitis.",
      video: "https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/valentine_map.mov",
      accent: "rose"
    },
    {
      title: "Birthday Edition",
      subtitle: "Lifetime Journey",
      description: "Navigasi cerita hidup dalam satu peta interaktif, merayakan setiap tahun bertambahnya usia dengan narasi visual yang dinamis.",
      video: "https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/birthday_map.mov",
      accent: "blue"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">
      {/* Background Elements - Sophisticated & Calmer Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-100/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[50%] h-[50%] bg-blue-100/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-slate-100/20 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#fafafa_100%)] opacity-80" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between px-8 py-4 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-rose-100 ring-1 ring-slate-200/50">
                <img src="/logo.png" alt="For you, Always." className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-serif italic font-semibold text-slate-900 leading-none mb-0.5">
                  For you, Always.
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                  Digital Atelier
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="#tema" className="px-5 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 tracking-wide rounded-xl hover:bg-slate-50/80 transition-all">
                Tema
              </Link>
              <Link href="#cara-kerja" className="px-5 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 tracking-wide rounded-xl hover:bg-slate-50/80 transition-all">
                Cara Kerja
              </Link>
              <Link href="#fitur" className="px-5 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 tracking-wide rounded-xl hover:bg-slate-50/80 transition-all">
                Fitur
              </Link>
            </div>

            {/* CTA Button - Refined for Luxury */}
            <Link
              href="#harga"
              className="px-7 py-3 bg-slate-900 text-white text-[13px] font-bold rounded-2xl 
                hover:bg-rose-600 transition-all duration-500 shadow-xl shadow-slate-200 hover:shadow-rose-200"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content - Sophisticated Modern Redesign */}
            <div className="text-center lg:text-left order-2 lg:order-1">

              <AnimatedSection delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                  Kirimkan Kenangan
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">
                    Secara Digital
                  </span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Cara tercantik untuk mengatakan <span className="text-rose-600/80 italic font-serif italic">"I love you"</span> di era modern.
                  Platform hadiah digital yang menggabungkan estetika desain dengan kedalaman emosi.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  <Link
                    href="#harga"
                    className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-semibold rounded-2xl
                      transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-1
                      flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <span className="relative z-10">Pesan Sekarang</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link
                    href="#tema"
                    className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 font-semibold rounded-2xl border border-slate-200/80
                      hover:border-rose-200 hover:text-rose-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    Mulai Eksplorasi
                    <svg className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Content - Abstract 3D Glassmorphism Showcase with Slider */}
            <div className="order-1 lg:order-2 relative h-[500px] md:h-[600px] flex items-center justify-center">
              {/* Abstract 3D-like Background Elements */}
              <div className="absolute top-1/4 -right-20 w-80 h-80 bg-rose-200/30 rounded-full blur-[100px] animate-blob" />
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px] animate-blob [animation-delay:2s]" />

              <div className="relative z-10 w-full max-w-sm md:max-w-md animate-float">
                {/* Floating Glass Pills / Abstract 3D elements formed by CSS */}
                <div className="absolute -top-12 -right-8 w-24 h-48 glass-pill rounded-full animate-tilt blur-[1px] -z-10 [animation-delay:1s]" />
                <div className="absolute -bottom-8 -left-12 w-32 h-32 glass-card rounded-full animate-spin-slow opacity-60 -z-10 [animation-duration:30s]" />

                {/* Main Premium Mockup */}
                <div className="relative group perspective-1000">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-white/60 transition-all duration-1000 group-hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.2)] animate-tilt">

                    {/* Mockup Top Detail */}
                    <div className="absolute top-8 left-10 flex gap-2 z-20">
                      <div className="w-2 h-2 rounded-full bg-slate-200/60" />
                      <div className="w-2 h-2 rounded-full bg-slate-200/60" />
                      <div className="w-2 h-2 rounded-full bg-slate-200/60" />
                    </div>

                    {/* High-Res Image Slider Container - 6 Images Loop */}
                    <div className="relative rounded-[2.2rem] overflow-hidden bg-slate-50 aspect-[4/5] shadow-inner">
                      {[
                        "/valentine.png",
                        "/valentine2.png",
                        "/valentine3.png",
                        "/ldr4.png",
                        "/ldr5.png",
                        "/ldr6.png"
                      ].map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Showcase ${idx + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out 
                            ${currentImage === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                        />
                      ))}

                      {/* Glass Overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.2rem]" />
                    </div>

                    {/* Slider Progress Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-0.5 rounded-full transition-all duration-[800ms] ${currentImage === i ? 'w-6 bg-rose-500' : 'w-1 bg-slate-400/30'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STEPS SECTION - Premium Tech Style --- */}
      <section id="cara-kerja" className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50/30 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-20 text-balance">
              <span className="inline-block px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100 mb-8">
                Proses Kreasi
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8 leading-[1.1]">
                Sempurnakan Momen <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">
                  Melalui Sentuhan Digital.
                </span>
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
                Hadirkan kebahagiaan dalam genggaman dengan proses kustomisasi yang dirancang khusus untuk setiap cerita berharga Anda.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
            <AnimatedSection delay={100} className="flex h-auto">
              <StepCard
                number="1"
                title="Pilih Tema"
                description="Temukan koleksi tema premium kami yang dirancang khusus untuk setiap momen spesial Anda."
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699-2.7c-.91.364-1.352.734-1.652 1.058.302.302.684.738 1.058 1.652" />
                  </svg>
                }
              />
            </AnimatedSection>
            <AnimatedSection delay={200} className="flex h-auto">
              <StepCard
                number="2"
                title="Kustomisasi"
                description="Tambahkan pesan personal, foto kenangan, dan detail spesial dengan editor intuitif kami."
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                }
              />
            </AnimatedSection>
            <AnimatedSection delay={300} className="flex h-auto">
              <StepCard
                number="3"
                title="Bagikan"
                description="Dapatkan link unik dan bagikan keajaiban hadiah digital Anda seketika kepada orang tercinta."
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm0 10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
                  </svg>
                }
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --- THEMES SECTION - Digital Gallery Style --- */}
      <section id="tema" className="py-24 md:py-32 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-rose-50/20 rounded-full blur-[120px] -z-10 -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-50/20 rounded-full blur-[120px] -z-10 translate-x-1/2" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <AnimatedSection>
            <div className="text-center mb-20 text-balance">
              <span className="inline-block px-4 py-1.5 bg-rose-50 rounded-full text-[10px] font-bold text-rose-600 uppercase tracking-[0.2em] border border-rose-100 mb-8">
                Koleksi Premium
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8 leading-[1.1]">
                Jelajahi Koleksi Tema <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">
                  dengan Estetika Terpilih.
                </span>
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
                Setiap desain adalah representasi unik dari sebuah cerita. Pilih bingkai visual yang paling pas untuk mengabadikan momen spesial Anda.
              </p>
            </div>
          </AnimatedSection>

          {/* Theme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <ThemeCard
              title="Valentine"
              subtitle="The Atlas of Us"
              description="Perjalanan romantis dengan fitur peta interaktif, infinity scroll storytelling, dan tipografi elegan yang mengabadikan kisah cinta Anda."
              image="https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/valentine.webp"
              color="rose"
              href="https://valentine-site-sigma.vercel.app/"
              available={true}
              index={0}
              password="123"
            />

            <ThemeCard
              title="Ulang Tahun"
              subtitle="Wrapped Bash"
              description="Desain bergaya Spotify Wrapped yang merayakan tahun mereka lewat analisis musik, momen berkesan, dan insight personal."
              image="/birthday.png"
              color="blue"
              href="https://birthday-site-wine-sigma.vercel.app"
              available={true}
              index={1}
              password="123"
            />

            <ThemeCard
              title="LDR Love"
              subtitle="Journey of Miles"
              description="Estetika Windows XP yang nostalgik dengan statistik hubungan, countdown timer, dan pelacakan jarak untuk pasangan LDR."
              image="/ldr_preview.png"
              color="emerald"
              href="https://ldr-pages.vercel.app/"
              available={true}
              index={2}
              password="forever"
            />
          </div>
        </div>
      </section>

      {/* --- JOURNEY MAP SHOWCASE SECTION - Spotlight Gallery Redesign --- */}
      <section className="py-24 md:py-32 bg-[#FAFAFA] relative overflow-hidden">
        {/* Decorative background labels */}
        <div className="absolute top-0 left-0 p-20 opacity-[0.02] pointer-events-none -rotate-12">
          <span className="text-[120px] font-display font-bold leading-none">THE SHOWCASE</span>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100 mb-6">
                Signature Feature
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                Menelusuri <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">Peta Kenangan Anda.</span>
              </h2>
              <p className="text-slate-500 font-light text-lg max-w-2xl mx-auto">
                Saksikan bagaimana fitur Journey Map kami mengabadikan setiap langkah cerita Anda dalam visualisasi yang megah.
              </p>
            </AnimatedSection>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left: Interactive Switcher (Navigation) */}
            <div className="w-full lg:w-1/3 order-2 lg:order-1">
              <AnimatedSection delay={100}>
                <div className="space-y-4">
                  {mapThemes.map((theme, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMap(i)}
                      className={`w-full text-left p-6 rounded-[2rem] transition-all duration-500 border group/btn ${activeMap === i
                        ? 'bg-white border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 scale-[1.02]'
                        : 'bg-white/40 border-slate-100 opacity-60 hover:opacity-100 hover:bg-white hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${activeMap === i ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500 group-hover/btn:bg-slate-300'
                            }`}>
                            <span className="text-xs font-bold font-serif italic">{i + 1}</span>
                          </div>
                          <div>
                            <h3 className={`text-sm font-bold transition-colors ${activeMap === i ? 'text-slate-900' : 'text-slate-500'}`}>{theme.title}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{theme.subtitle}</p>
                          </div>
                        </div>

                        {/* Interactive Indicator Icon */}
                        <div className={`transition-all duration-500 ${activeMap === i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover/btn:opacity-40 group-hover/btn:translate-x-0'}`}>
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {activeMap === i ? (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            {theme.description}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                          <span className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest">Klik untuk melihat →</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right: The Grand Spotlight Frame */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2">
              <AnimatedSection delay={200}>
                <div className="relative">
                  {/* Dynamic Backdrop Glow based on active theme */}
                  <div className={`absolute -inset-10 rounded-full blur-[120px] transition-colors duration-1000 -z-10 ${activeMap === 0 ? 'bg-emerald-100/20' : activeMap === 1 ? 'bg-rose-100/30' : 'bg-blue-100/20'
                    }`} />

                  {/* Cinematic Gallery Frame */}
                  <div className="relative bg-white/40 backdrop-blur-2xl rounded-[3rem] p-4 md:p-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] ring-1 ring-white/60">
                    <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden aspect-square md:aspect-video lg:aspect-[1.5/1]">
                      {/* Key-based Video for clean switching animation */}
                      <div className="absolute inset-0 pointer-events-none select-none">
                        {mapThemes[activeMap].video.match(/\.(mp4|webm|mov)$/i) ? (
                          <video
                            key={activeMap}
                            src={mapThemes[activeMap].video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            webkit-playsinline="true"
                            preload="auto"
                            disablePictureInPicture
                            disableRemotePlayback
                            className="w-full h-full object-cover animate-in fade-in duration-1000"
                          />
                        ) : (
                          <img
                            key={activeMap}
                            src={mapThemes[activeMap].video}
                            alt={mapThemes[activeMap].title}
                            className="w-full h-full object-cover animate-in fade-in duration-1000"
                          />
                        )}
                      </div>

                      {/* Floating UI Badges */}
                      <div className="absolute top-6 left-6 flex items-center gap-3">
                        <div className="h-6 px-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest">Live Experience</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION - Luxury Atelier Style --- */}
      <section id="fitur" className="py-24 md:py-32 bg-[#FAFAFA] relative overflow-hidden text-balance">
        {/* Decorative background labels - Large paged text */}
        <div className="absolute bottom-0 right-0 p-20 opacity-[0.02] pointer-events-none rotate-90">
          <span className="text-[150px] font-display font-bold leading-none tracking-tighter">QUALITY</span>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100 mb-8">
                Keunggulan Kami
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8 leading-[1.1]">
                Mengukir Kenangan Dengan <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">
                  Detail yang Sempurna.
                </span>
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                Kami menggabungkan estetika tinggi dan teknologi terkini untuk memastikan setiap hadiah digital Anda memiliki jiwa dan cerita.
              </p>
            </div>
          </AnimatedSection>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatedSection delay={100}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.077-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.048 4.025a3 3 0 01-4.293-4.293 3 3 0 014.293 4.293zm6.364-6.364a3 3 0 00-4.293-4.293 3 3 0 004.293 4.293zm0 0L12 12m0 0h7.5" />
                  </svg>
                }
                title="Desain Premium"
                description="Setiap tema dikurasi oleh desainer profesional, memastikan keseimbangan antara seni dan fungsi di setiap detiknya."
                color="text-rose-500"
              />
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                }
                title="Responsif Penuh"
                description="Tampilan yang tetap mewah dan presisi di berbagai layar, mulai dari smartphone hingga layar desktop resolusi tinggi."
                color="text-blue-500"
              />
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
                title="Fleksibilitas Tinggi"
                description="Mudah untuk mempersonalisasi foto, ucapan, dan urutan cerita agar hadiah Anda terasa benar-benar datang dari hati."
                color="text-emerald-500"
              />
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Kecepatan Optimal"
                description="Dibangun dengan teknologi terbaru untuk memastikan kartu ucapan Anda termuat seketika tanpa perlu menunggu lama."
                color="text-amber-500"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION - Modern Tech Luxury --- */}
      <section id="harga" className="py-24 md:py-32 bg-[#FAFAFA] relative overflow-hidden">
        {/* Ambient Background Glows - Subtler intensity */}
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-rose-100/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-slate-100/20 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left side: Value Proposition */}
            <div className="flex-1 text-center lg:text-left">
              <AnimatedSection>
                <span className="inline-block px-4 py-1.5 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100 mb-8">
                  Investasi Kebahagiaan
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8 leading-[1.1]">
                  Satu Nilai untuk <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-slate-800 to-slate-900 italic font-serif py-1">
                    Keajaiban Selamanya.
                  </span>
                </h2>
                <div className="space-y-6 text-slate-500 font-light text-lg mb-10">
                  <p>Kami meniadakan langganan bulanan. Cukup satu kali investasi untuk setiap karya digital yang Anda ciptakan.</p>
                  <p>Akses tanpa batas dan kebahagiaan yang tak lekang oleh waktu.</p>
                </div>

                {/* Secondary Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 grayscale">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Secure Payment</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right side: The Pricing Card */}
            <div className="flex-1 w-full max-w-md">
              <AnimatedSection delay={200}>
                <div className="relative group">
                  {/* Glowing Aura Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                  {/* The Card Content */}
                  <div className="relative bg-white border border-slate-100 p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Pass-Key Tema</h3>
                        <p className="text-sm text-slate-400 italic">Unlimited Customization</p>
                      </div>
                      <div className="px-3 py-1 bg-rose-50 rounded-lg text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                        Best Value
                      </div>
                    </div>

                    <div className="mb-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-400">Rp</span>
                        <span className="text-6xl font-display font-bold text-slate-900 tracking-tight">20.000</span>
                        <span className="text-sm text-slate-400">/tema</span>
                      </div>
                    </div>

                    <ul className="space-y-5 mb-12">
                      {[
                        "Akses Penuh ke Koleksi Tema",
                        "Editor Intuitif",
                        "Penyimpanan Cloud Aman",
                        "Optimasi Layar Mobile",
                        "Priority Atelier Support"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-600 group/item">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:border-rose-200 group-hover/item:bg-rose-50 transition-colors">
                            <svg className="w-3 h-3 text-slate-400 group-hover/item:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20%E2%9C%A8%20Saya%20tertarik%20untuk%20memesan%20hadiah%20digital%20yang%20*Abadi%20%26%20Bermakna*.%0A%0AMohon%20info%20langkah%20selanjutnya%20untuk%20proses%20pemesanannya%20ya.%20Terima%20kasih!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-5 bg-slate-900 text-white font-bold rounded-2xl
                        transition-all duration-500 hover:bg-rose-600 hover:shadow-2xl hover:shadow-rose-100 gap-3"
                    >
                      Dapatkan Akses Sekarang
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>



      {/* --- CTA SECTION - Redesigned for Elegance --- */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Decorative Background Elements for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white p-8 md:p-20 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] ring-1 ring-black/[0.02] overflow-hidden">
              {/* Subtle Texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-8 leading-[1.1]">
                  Siap Membuat Sesuatu yang
                  <br />
                  <span className="italic font-serif text-rose-700">Abadi & Bermakna?</span>
                </h2>
                <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto font-light">
                  Bergabunglah dengan ratusan orang yang telah mempercayakan momen spesial mereka kepada Digital Atelier kami.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <a
                    href="https://wa.me/6281381543981?text=Halo%20Admin!%20%F0%9F%8C%B9%20Saya%20ingin%20membuat%20kejutan%20spesial%20dengan%20hadiah%20digital.%0A%0ABisa%20bantu%20jelaskan%20cara%20pemesanan%20dan%20pilihan%20temanya?%20Terima%20kasih!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl
                      hover:bg-rose-600 transition-all duration-500 shadow-2xl shadow-slate-200 hover:shadow-rose-100 flex items-center justify-center gap-3"
                  >
                    Mulai Sekarang
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <Link
                    href="#tema"
                    className="w-full sm:w-auto px-12 py-5 bg-white text-slate-600 font-bold rounded-2xl
                      border border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all duration-300 flex items-center justify-center"
                  >
                    Eksplorasi Tema
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- FOOTER - Minimalist & Clean --- */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mb-3 transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-serif italic font-bold text-slate-900 leading-none">
                For you, Always.
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                Digital Atelier
              </span>
            </Link>
          </div>

          {/* Minimalist Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
            <Link href="#tema" className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest">Tema</Link>
            <Link href="#cara-kerja" className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest">Cara Kerja</Link>
            <Link href="#fitur" className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest">Keunggulan</Link>
            <a href="https://wa.me/6281381381543981?text=Halo%20Digital%20Atelier!%20Saya%20butuh%20bantuan%20terkait%20layanan%20hadiah%20digital." target="_blank" className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest">WA Center</a>
          </nav>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-400 font-medium">
              © 2026 For you, Always. – Preserving Memories Digitally
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
