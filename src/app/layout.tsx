import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { UploadProgressProvider } from "~/components/upload/upload-progress-provider";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Concolabs | Construction Software Solutions",
  description:
    "Concolabs helps construction companies streamline operations, reduce paperwork, and scale globally with our all-in-one platform.",
  keywords: [
    "construction software",
    "project management",
    "construction technology",
    "building software",
    "construction management",
  ],
  authors: [{ name: "Concolabs" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Concolabs | Construction Software Solutions",
    description: "Streamline your construction operations with Concolabs",
    type: "website",
  },
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} bg-background`}>
        <body className="font-sans antialiased">
          <TRPCReactProvider>
            <UploadProgressProvider>
              {children}
              <Toaster richColors />
            </UploadProgressProvider>
          </TRPCReactProvider>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  );
}
