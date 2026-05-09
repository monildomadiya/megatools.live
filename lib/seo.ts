import { Tool, Category } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://megatools.live";
const SITE_NAME = "MegaTools";

export const generateToolMetadata = (tool: Tool) => ({
  title: tool.metaTitle,
  description: tool.metaDescription,
  keywords: tool.keywords.join(", "),
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: `${SITE_URL}/tools/${tool.category}/${tool.slug}` },
  openGraph: { title: tool.metaTitle, description: tool.metaDescription, url: `${SITE_URL}/tools/${tool.category}/${tool.slug}`, siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: tool.metaTitle, description: tool.metaDescription, site: "@megatools_live" },
});

export const generateCategoryMetadata = (category: Category) => ({
  title: category.metaTitle,
  description: category.metaDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/tools/${category.slug}` },
  openGraph: { title: category.metaTitle, description: category.metaDescription, url: `${SITE_URL}/tools/${category.slug}`, siteName: SITE_NAME, type: "website" },
});

export const generateJSONLD = (tool: Tool) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": tool.title,
  "description": tool.longDescription || tool.shortDescription,
  "url": `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
  "dateModified": tool.updatedAt,
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };
};

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url,
  })),
});

export const generateSiteSearchSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": SITE_URL,
  "name": SITE_NAME,
  "description": "Free online calculators and tools for health, finance, math, conversion, and more.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/tools?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});
