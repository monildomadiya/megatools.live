import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generateSiteSearchSchema } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://megatools.live"),
  title: {
    default: "MegaTools - 100+ Free Online Calculators & Smart Tools",
    template: "%s | MegaTools",
  },
  description: "MegaTools offers 100+ free online calculators and tools for health, finance, math, unit conversion, SEO, and more. Accurate, fast, and mobile-friendly.",
  keywords: "free online calculators, bmi calculator, loan emi calculator, compound interest calculator, age calculator, percentage calculator, unit converter, word counter, mortgage calculator, tip calculator, password generator, math tools, health tools, finance tools",
  authors: [{ name: "MegaTools", url: "https://megatools.live" }],
  creator: "MegaTools",
  publisher: "MegaTools",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://megatools.live",
    siteName: "MegaTools",
    title: "MegaTools - 100+ Free Online Calculators & Smart Tools",
    description: "Access 100+ free, accurate, and fast online calculators and tools. BMI, loan EMI, compound interest, age, unit converters and more.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@megatools_live",
    creator: "@megatools_live",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSiteSearchSchema()) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col text-gray-900 antialiased`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
