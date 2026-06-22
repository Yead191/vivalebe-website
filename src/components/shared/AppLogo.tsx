import Image from "next/image";

interface AppLogoProps {
    variant?: "default" | "white";
}

export function AppLogo({ variant = "default" }: AppLogoProps) {
    return (
        <div className="flex items-center gap-2.5 select-none">
            {/* Icon Frame box Container */}


            {/* Typography Label */}
            <span className={`text-xl font-extrabold tracking-tight ${variant === "white" ? "text-white" : "text-neutral-900"
                }`}>
                <Image src="/logo.png" alt="Logo" width={400} height={400} className="w-24 h-fit object-contain" />
            </span>
        </div>
    );
}