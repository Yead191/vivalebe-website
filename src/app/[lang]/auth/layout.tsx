import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";

export default async function AuthLayout({
    children,
    params,
}: LayoutProps<"/[lang]">) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();

    const dict = await getDictionary(lang);
    const me = getCurrentUser();

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">

            <main className="flex-1">{children}</main>

        </div>
    );
}
