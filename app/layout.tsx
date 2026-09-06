import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Pikul — you're carrying more than usual",
  description:
    "Pikul weighs everything you carry — assignments, shifts, commute, family — against your own normal, and tells you the one thing worth putting down.",
  openGraph: {
    title: "Pikul — you're carrying more than usual",
    description:
      "It's never one big thing. Pikul watches the four weeks behind you, not just this one.",
    type: "website",
  },
};

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
