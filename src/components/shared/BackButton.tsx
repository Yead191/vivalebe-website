"use client"
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand transition-colors cursor-pointer"
        >
            <ArrowLeft className="size-4" />
            Back
        </button>
    )
}
