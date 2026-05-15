"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import navItems from "@/constants/landing-nav-items";
import Image from "next/image";

export default function LandingNavbar() {
    const [activeSection, setActiveSection] = useState<string>("home");
    const [isScrolled, setIsScrolled] = useState(false);
    // const [showNavbar, setShowNavbar] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const lastScrollTop = useRef(0);

    // ── Scroll spy + hide-on-scroll-down ──────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const bannerHeight = document.getElementById("banner")?.offsetHeight || 0;
            // Background swap
            setIsScrolled(scrollY > bannerHeight - 83);

            // Hide / show
            // if (scrollY > lastScrollTop.current && scrollY > 100) {
            //     setShowNavbar(false);
            // } else {
            //     setShowNavbar(true);
            // }
            lastScrollTop.current = scrollY <= 0 ? 0 : scrollY;

            // Active section detection
            const sectionIds = navItems.map((item) => item.sectionId);
            let current = sectionIds[0];
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 100) current = id;
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ── Smooth scroll helper ───────────────────────────────────────────────────
    const scrollToSection = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(sectionId);
        }
        setDrawerOpen(false);
    };

    // ── Styles ─────────────────────────────────────────────────────────────────
    const navBase =
        "fixed top-0 z-50 w-full transition-all duration-500";

    const navBg = isScrolled
        ? "bg-[#014B52] backdrop-blur-sm"
        : "bg-transparent";

    // const navTranslate = showNavbar ? "translate-y-0" : "-translate-y-full";

    return (
        <nav className={`${navBase} ${navBg} `}>
            <div className=" container py-4 flex items-center justify-between">

                {/* ── Logo ── */}
                <button
                    onClick={() => scrollToSection("home")}
                    className="shrink-0 flex items-center gap-0 select-none"
                    aria-label="Go to home"
                >
                    <Image src={'/logo.png'} width={400} height={100} alt="logo" className="h-[51px] w-fit object-contain" draggable={false} />
                </button>

                {/* ── Desktop nav links ── */}
                <ul className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.sectionId;
                        return (
                            <li key={item.sectionId}>
                                <button
                                    onClick={() => scrollToSection(item.sectionId)}
                                    className={`
                    relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-sm
                    ${isActive
                                            ? "text-[#F5A800]"
                                            : "text-white/80 hover:text-white"
                                        }
                  `}
                                >
                                    {item.label}
                                    {/* Active underline */}
                                    {isActive && (
                                        <span
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full"
                                            style={{ background: "#F5A800" }}
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* ── Right: CTA + mobile menu ── */}
                <div className="flex items-center gap-3">
                    {/* CTA button */}
                    <Button
                        onClick={() => scrollToSection("get-started")}
                        className="
              hidden lg:inline-flex
              bg-[#F5A800] hover:bg-[#e09900] text-white
              px-6 py-2 rounded-md text-sm
              transition-all duration-200 shadow-none h-10
            "
                    >
                        Get Started
                    </Button>

                    {/* Mobile hamburger */}
                    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-white hover:text-[#F5A800] hover:bg-white/10"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-72 bg-black border-l border-white/10 text-white"
                        >
                            <SheetHeader className="mb-6">
                                <SheetTitle className="text-left">
                                    {/* Logo inside drawer */}
                                    <span
                                        className="font-extrabold text-xl flex items-center gap-0"
                                        style={{ fontFamily: "'Arial Black', sans-serif" }}
                                    >
                                        <span style={{ color: "#F5A800" }}>SH</span>
                                        <span
                                            className="border-2 mx-[2px] px-[3px] leading-none"
                                            style={{ color: "#F5A800", borderColor: "#F5A800", borderRadius: "3px" }}
                                        >
                                            O
                                        </span>
                                        <span style={{ color: "#F5A800" }}>WE</span>
                                    </span>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.sectionId;
                                    return (
                                        <button
                                            key={item.sectionId}
                                            onClick={() => scrollToSection(item.sectionId)}
                                            className={`
                        text-left px-4 py-3 rounded-md text-base font-medium transition-all
                        ${isActive
                                                    ? "bg-[#F5A800]/10 text-[#F5A800] border-l-2 border-[#F5A800]"
                                                    : "text-white/75 hover:text-white hover:bg-white/5"
                                                }
                      `}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <Button
                                        onClick={() => {
                                            scrollToSection("get-started");
                                            setDrawerOpen(false);
                                        }}
                                        className="w-full bg-[#F5A800] hover:bg-[#e09900] text-black font-bold rounded-md"
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}