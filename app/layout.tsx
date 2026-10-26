import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "600", "800", "900"], variable: "--font-archivo" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = {
  applicationName: "Parintins Leva e Traz",
  icons: { icon: "/logo.webp", apple: "/logo.webp" },
};
export const viewport: Viewport = { themeColor: "#0b0b0f" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
