// import type { Metadata } from "next";
"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./components/provider";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { CreditsProvider } from "./lib/CreditContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <CreditsProvider>
            <Header />
            {children}
            <Footer />
          </CreditsProvider>
        </Provider>
      </body>
    </html>
  );
}
