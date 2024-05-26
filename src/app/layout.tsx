

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./components/provider";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";


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
        <Header />
        {children}
        <Footer />
        </Provider>
      </body>
    </html>
  );
}
