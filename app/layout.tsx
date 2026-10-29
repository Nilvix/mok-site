import type { Metadata, Viewport } from "next";
import { Unbounded, Inter, Jura } from "next/font/google";
import { SITE } from "@/lib/site-config";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const jura = Jura({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  variable: "--font-jura",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://mok-cherkessk.ru"),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["МОК", "ресто-лаунж", "Черкесск", "паровые коктейли", "бар", "кухня", "игровая зона", "Октябрьская 220"],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${inter.variable} ${jura.variable}`}>
      <body className="bg-ink font-sans text-white">{children}</body>
    </html>
  );
}