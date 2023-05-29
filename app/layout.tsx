import Navigation from "@/components/ui/Navigation";
import { NextAuthProvider } from "./providers";
import "@/styles/globals.css";
import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="M.A.K.E.S. Server" />
      </Head>
      <body className={`${inter.variable} flex h-screen flex-col font-sans`}>
        <NextAuthProvider>
          <Navigation />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "MAKES Server",
  description: "Welcome to MAKES Server",
};
