import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Tak · Victoria Photography + Passport & Visa Photos",
  description:
    "Luxury photography and videography in Victoria, BC. Fast, guaranteed-compliant Canadian and US visa & passport photos. Book your 15-minute photo appointment online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
