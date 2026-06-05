import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { VercelAnalyticsClient } from "@/components/analytics/vercel-analytics-client";
import { MdeAppProviders } from "@/components/app-providers";
import { MdeCopilotKitProvider } from "@/components/copilot/copilot-kit-provider";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mdeai — concierge for Medellín",
  description: "AI-first discovery for Medellín: rentals, events, nightlife.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* beforeInteractive in body (not <head>) — runs before Maps; React 19-safe via src file */}
        <Script
          id="mde-maps-auth-bootstrap"
          strategy="beforeInteractive"
          src="/mde-maps-auth-bootstrap.js"
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:shadow-md"
        >
          Skip to main content
        </a>
        <MdeAppProviders>
          <MdeCopilotKitProvider>
            {children}
          </MdeCopilotKitProvider>
        </MdeAppProviders>
        <VercelAnalyticsClient />
      </body>
    </html>
  );
}
