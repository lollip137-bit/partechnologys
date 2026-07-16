import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build.Site — Premium Web Agency",
  description:
    "Build.Site delivers fast, modern, and conversion-ready websites for ambitious businesses worldwide.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-hero-color font-sans">
        {children}
      </body>
    </html>
  );
}
