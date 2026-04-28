import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MachineryFind — Heavy Equipment Marketplace",
  description: "Search and discover heavy equipment listings across the Midwest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
