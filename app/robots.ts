import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://dunora.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/dashboard", "/onboarding", "/auth/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
