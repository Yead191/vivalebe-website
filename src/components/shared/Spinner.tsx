"use client";
import Image from "next/image";
import React from "react";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]  gap-4 w-full bg-transparent rounded-xl">
      {/* Logo with scale animation */}
      <div className="scale-pulse">
        {/* Logo */}
        <div className="flex items-center w-full ">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={300}
            height={300}
            className="h-16 w-fit object-contain"
          />
        </div>
      </div>

      {/* Custom animation style */}
      <style jsx>{`
        @keyframes scalePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .scale-pulse {
          animation: scalePulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;