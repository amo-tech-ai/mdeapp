import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { CopilotKit } from "@copilotkit/react-core";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:shadow-md"
        >
          Skip to main content
        </a>
        <Script id="mde-maps-auth-failure" strategy="beforeInteractive">
          {`window.__mdeMapsAuthFailed=false;window.gm_authFailure=function(){window.__mdeMapsAuthFailed=true;window.dispatchEvent(new CustomEvent("mde-maps-auth-failure"));};`}
        </Script>
        <CopilotKit {...getCopilotKitClientProps("conciergeAgent")}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
