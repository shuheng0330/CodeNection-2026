import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { createBrandMetadata } from "@/lib/brand-metadata";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = createBrandMetadata(
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linen text-ink">
        {children}
      </body>
    </html>
  );
}
