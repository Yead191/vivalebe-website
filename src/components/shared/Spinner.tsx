"use client";
import Image from "next/image";
import React from "react";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full bg-[#F8FAFC]">
      <div className="relative flex items-center justify-center">

        {/* 1. Elegant Light Ambient Glow (Uses your primary color at low opacity) */}
        <div className="absolute size-48 bg-[#429CA8]/10 blur-3xl rounded-full" />

        {/* 2. Outer Ultra-Fine Spinning Ring */}
        <div
          className="absolute size-28 rounded-full border-[1.5px] border-transparent border-t-[#429CA8] border-l-[#429CA8]/20 animate-spin"
          style={{ animationDuration: '1.2s' }}
        />

        {/* 3. Inner Counter-Spinning Ring */}
        <div className="absolute size-24 rounded-full border border-transparent border-b-[#429CA8]/40 border-r-[#429CA8]/10 animate-spin-reverse" />

        {/* 4. Branded Logo Badge */}
        {/* Using your primary color as a solid background beautifully surfaces the white logo text */}
        <div className="relative flex items-center justify-center size-16 rounded-full bg-[#429CA8] shadow-[0_10px_25px_rgba(66,156,168,0.3)] border border-[#429CA8]/20 p-3 z-10">
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            className="h-6 w-auto object-contain brightness-100"
            priority
          />
        </div>
      </div>

      {/* 5. Editorial Subtext */}
      <p className="mt-8 text-[10px] font-bold  text-[#429CA8]/80 uppercase select-none pointer-events-none tracking-widest">
        Loading Experience
      </p>

      {/* Global CSS for the counter-spin */}
      <style jsx global>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 2.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;