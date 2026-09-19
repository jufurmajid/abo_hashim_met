import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "أبو هاشم | للحوم والألبان والأجبان - تسوق طازج يومياً",
  description: "متجر أبو هاشم الإلكتروني لأجود أنواع اللحوم الطازجة والألبان والأجبان والمنتجات البلدية. طلب سريع وتوصيل طازج لباب بيتك بدون تسجيل.",
  openGraph: {
    title: "أبو هاشم | للحوم والألبان والأجبان",
    description: "أجود أنواع اللحوم البلدي والألبان والأجبان الطازجة يومياً.",
    type: "website",
    locale: "ar_IQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} scroll-smooth`}>
      <body className={`${tajawal.className} min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans selection:bg-emerald-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
