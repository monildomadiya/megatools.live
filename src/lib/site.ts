export const site = {
  name: "MegaTools",
  tagline: "Military & federal pay calculators",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://megatools.live",
  contactEmail: process.env.CONTACT_EMAIL || "contact@example.com",
  disclaimer: "MegaTools is an independent website and is not affiliated with the U.S. Department of Defense, the Department of Veterans Affairs, GSA, OPM or any government agency.",
} as const;
