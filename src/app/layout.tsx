import type { Metadata } from "next";
import { Inter, MuseoModerno } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  title: "Viva Leve",
  description: "Connection that begins with honesty.",
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
      <body className="min-h-full flex flex-col">
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
