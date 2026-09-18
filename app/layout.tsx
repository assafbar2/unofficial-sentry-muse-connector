import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { UnofficialBanner } from "@/components/unofficial-banner";
import {
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
  UNOFFICIAL_SHORT,
} from "@/lib/disclaimer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: `${UNOFFICIAL_SHORT} ${UNOFFICIAL_DISCLAIMER}`,
  robots: { index: false, follow: false },
  other: {
    "x-unofficial-concept": "true",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UnofficialBanner />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
