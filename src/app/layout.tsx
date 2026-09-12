import type { Metadata } from "next";
import { Inter, MuseoModerno } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getSiteUrl } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  variable: "--font-museo-moderno",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Sigaleve | Connection that begins with honesty.",
    template: "%s | Sigaleve",
  },
  description:
    "Sigaleve is a dating and community platform where honest connections begin. Meet people, share stories, and build relationships with truth.",
  keywords: [
    "Sigaleve",
    "honest dating",
    "dating community",
    "real connections",
    "relationship",
    "Sigaleve dating",
  ],
  applicationName: "Sigaleve",
  authors: [{ name: "Sigaleve", url: getSiteUrl() }],
  creator: "Sigaleve",
  publisher: "Sigaleve",
  category: "dating",
  icons: { icon: "/favicon.ico" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Sigaleve",
    title: "Sigaleve | Connection that begins with honesty.",
    description:
      "Meet people who value honesty. Sigaleve is where real connections begin.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Sigaleve" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigaleve | Connection that begins with honesty.",
    description:
      "Meet people who value honesty. Sigaleve is where real connections begin.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${museoModerno.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Toaster
          position="top-right"
          offset={20}
          closeButton
          duration={3500}
          toastOptions={{
            classNames: {
              toast: '!shadow-medium !border-line',
              title: 'font-semibold',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
