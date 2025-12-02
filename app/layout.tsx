import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VCA Virtual Coach",
  description: "Virtual golf coach powered by VCA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">{children}</body>
    </html>
  );
}

