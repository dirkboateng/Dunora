import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://dunora.app"),
  title: {
    default: "Dunora — AI-powered photo delivery",
    template: "%s · Dunora",
  },
  description:
    "Upload once. Deliver smarter. Dunora helps photographers and clubs deliver branded galleries to their clients in minutes, not hours.",
  openGraph: {
    title: "Dunora",
    description: "AI-powered photo delivery for modern photographers.",
    siteName: "Dunora",
    type: "website",
  },
  // Note: app/icon.svg is auto-discovered by Next.js — no explicit icons key.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
