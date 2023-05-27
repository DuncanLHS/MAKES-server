import Navigation from "@/app/components/ui/Navigation";
import { NextAuthProvider } from "./providers";
import "@/styles/globals.css";
import Head from "next/head";

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
      <body className="flex h-screen flex-col">
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
