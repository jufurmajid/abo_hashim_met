import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "أبو هاشم | للحوم والألبان والأجبان",
  description: "متجر أبو هاشم الإلكتروني لأجود أنواع اللحوم الطازجة والألبان والأجبان والمنتجات الغذائية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} scroll-smooth`}>
      <body className={`${tajawal.className} min-h-screen bg-emerald-50/20 text-slate-800 antialiased flex flex-col font-sans selection:bg-emerald-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
