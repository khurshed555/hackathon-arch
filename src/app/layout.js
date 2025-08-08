import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { defaultLocale, getMessages, supportedLocales } from "@/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CCTV Viewer",
  description: "Secure CCTV monitoring dashboard",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value ?? defaultLocale;
  const lang = supportedLocales.includes(cookieLang) ? cookieLang : defaultLocale;
  await getMessages(lang); // ensure locale chunk is loaded early
  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
