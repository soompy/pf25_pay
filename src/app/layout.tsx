import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafePay | Interactive Payment Demo",
  description: "Try the full SafePay checkout flow without signing in. Demo only — no real payments are processed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
