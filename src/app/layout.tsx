import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // Cute, modern, rounded
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BơCinema - Trải nghiệm điện ảnh đỉnh cao",
  description: "Đặt vé phim nhanh chóng, dễ dàng tại BơCinema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${nunito.variable} font-sans antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
