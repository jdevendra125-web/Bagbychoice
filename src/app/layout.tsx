import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bag By Choice — Choose your style, carry your confidence",
  description: "Premium quality imported handbags, purses, clutches and more. 100% authentic, latest trends, perfect for every occasion.",
  keywords: "handbags, purses, clutches, imported bags, premium bags, fashion bags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream-50 text-brand-900">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
