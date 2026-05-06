import { Tool, Category, BlogPost } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://megatools.com";

export const generateToolMetadata = (tool: Tool) => {
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords.join(", "),
    alternates: {
      canonical: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
      type: "website",
    },
  };
};

export const generateCategoryMetadata = (category: Category) => {
  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/tools/${category.slug}`,
    },
  };
};

export const generateJSONLD = (tool: Tool) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "description": tool.shortDescription,
    "url": `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
