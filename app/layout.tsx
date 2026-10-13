import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans, Libre_Franklin } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { DashboardShell } from "@/components/dashboard/shell";

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const display = Libre_Franklin({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortPulse — Cross-Port Intelligence",
  description:
    "Module 3 sample dashboard: status across 11 ports, findings, data quality, and priorities. ILLUSTRATIVE synthetic data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        ibmPlex.variable,
        display.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full">
        <Providers>
          <DashboardShell>{children}</DashboardShell>
        </Providers>
      </body>
    </html>
  );
}
