import type { Metadata } from "next";
import { Fira_Code, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import UserListener from "@/components/UserListener";
import ProductListener from "@/components/ProductListener";
import CartListener from "@/components/CartListener";
import AddressListener from "@/components/AddressListener";
import OrderListener from "@/components/OrderListener";
import BrandListener from "@/components/BrandListener";
import CategoriesListener from "@/components/CategoriesListener";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShutterUp",
  description: "ShutterUp",
  icons: {
    icon: "/shutterup.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${firaCode.variable} font-plus-jakarta-sans antialiased bg-zinc-800 text-zinc-50 overflow-y-scroll`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <UserListener />
            <ProductListener />
            <CartListener />
            <AddressListener />
            <OrderListener />
            <BrandListener />
            <CategoriesListener />
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
