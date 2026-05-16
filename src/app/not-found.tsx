"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Wifi, AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center transition-colors duration-300 bg-[#f0f7f7] py-8 lg:py-0">
            <div className="container px-4 mx-auto">
                <div className="max-w-5xl mx-auto relative overflow-hidden bg-white/80 border border-[#429CA8]/20 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300">

                    {/* Decorative Blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#429CA8]/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#429CA8]/10 rounded-full blur-3xl -z-10"></div>

                    {/* Circuit-like Lines */}
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-[#429CA8] to-transparent animate-pulse"></div>
                        <div className="absolute top-2/4 left-0 w-full h-px bg-linear-to-r from-transparent via-[#429CA8] to-transparent animate-pulse" style={{ animationDelay: "1s" }}></div>
                        <div className="absolute top-3/4 left-0 w-full h-px bg-linear-to-r from-transparent via-[#429CA8] to-transparent animate-pulse" style={{ animationDelay: "2s" }}></div>
                        <div className="absolute left-1/4 top-0 h-full w-px bg-linear-to-b from-transparent via-[#429CA8] to-transparent animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                        <div className="absolute left-2/4 top-0 h-full w-px bg-linear-to-b from-transparent via-[#429CA8] to-transparent animate-pulse" style={{ animationDelay: "1.5s" }}></div>
                        <div className="absolute left-3/4 top-0 h-full w-px bg-linear-to-b from-transparent via-[#429CA8] to-transparent animate-pulse" style={{ animationDelay: "2.5s" }}></div>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
                        {/* Left Side - Error Code */}
                        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 bg-red-50 text-red-600 border border-red-200">
                                <AlertTriangle className="mr-2" size={18} />
                                <span>Error 404</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#429CA8]">
                                Oops!
                            </h1>

                            <p className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                                Page not found
                            </p>

                            <p className="text-base mb-8 max-w-md text-gray-500">
                                The page you are looking for might have been removed, had its
                                name changed, or is temporarily unavailable.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={handleGoBack}
                                    className="group relative flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-white text-[#429CA8] border border-[#429CA8]/30 hover:bg-[#429CA8]/5 cursor-pointer"
                                >
                                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" size={18} />
                                    Go Back
                                </button>

                                <Link
                                    href="/"
                                    className="group relative flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-[#429CA8] text-white hover:bg-[#3a8b96] cursor-pointer"
                                >
                                    <Home className="mr-2 group-hover:scale-110 transition-transform duration-300" size={18} />
                                    Return to Homepage
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="w-full md:w-1/2 hidden md:flex justify-center ">
                            <div className="relative">
                                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-[#429CA8]/5 border border-[#429CA8]/20 flex items-center justify-center relative overflow-hidden">

                                    {/* Animated Circles */}
                                    <div className="absolute inset-0">
                                        <div
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed opacity-20 border-[#429CA8]"
                                            style={{ animation: "spin-slow 15s linear infinite" }}
                                        ></div>
                                        <div
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-4 border-dashed opacity-10 border-[#429CA8]"
                                            style={{ animation: "spin-slow 30s linear infinite reverse" }}
                                        ></div>
                                    </div>

                                    {/* 404 Text */}
                                    <div className="relative z-10 text-center">
                                        <div className="text-9xl font-black text-[#429CA8]/10">
                                            404
                                        </div>
                                        <div className="mt-4 flex justify-center text-[#429CA8]">
                                            <Wifi size={48} className="animate-pulse" />
                                            <div className="absolute top-1/2 left-1/2 w-12 h-1 bg-current transform -translate-x-1/2 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div
                                    className="absolute -top-4 -right-4 w-12 h-12 rounded-lg transform rotate-12 bg-[#429CA8]/20 backdrop-blur-md border border-[#429CA8]/30"
                                    style={{ animation: "float 6s ease-in-out infinite", animationDelay: "0s" }}
                                ></div>
                                <div
                                    className="absolute -bottom-6 -left-6 w-16 h-16 rounded-lg transform -rotate-12 bg-[#429CA8]/15 backdrop-blur-md border border-[#429CA8]/25"
                                    style={{ animation: "float 6s ease-in-out infinite", animationDelay: "1s" }}
                                ></div>
                                <div
                                    className="absolute top-1/2 -right-8 w-10 h-10 rounded-full bg-[#429CA8]/20 backdrop-blur-md border border-[#429CA8]/30"
                                    style={{ animation: "float 6s ease-in-out infinite", animationDelay: "2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes float {
          0%   { transform: translateY(0px) rotate(0deg); }
          50%  { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
        </div>
    );
};

export default NotFoundPage;
