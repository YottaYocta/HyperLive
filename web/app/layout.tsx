import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { StoreProvider } from "./store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ara",
  description: "Real-time hackathon event manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--color-background] text-[--color-foreground]">
        <StoreProvider>
          <Nav />
          <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
