import type { Metadata } from "next";
import { Big_Shoulders, Archivo } from "next/font/google";
import "../globals.css";

/**
 * Root layout for design previews (the admin sample at /admin-preview).
 * Same fonts as the admin; never indexed. The pages under it refuse to
 * render on the live site.
 */
const shoulders = Big_Shoulders({ variable: "--font-shoulders", subsets: ["latin"], axes: ["opsz"], display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], display: "swap" });

export const metadata: Metadata = {
  title: "Admin preview | Onibsport",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${shoulders.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper">{children}</body>
    </html>
  );
}
