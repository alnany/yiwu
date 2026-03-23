import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "易物 (Yi Wu) — Connect with Verified Chinese Manufacturers",
  description: "B2B social platform connecting Chinese manufacturers with overseas designers and buyers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
