import "~/styles/globals.css";

import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { ChatWidget } from "~/components/ui/chat-widget";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="bg-background">
        <body suppressHydrationWarning className="font-sans antialiased">
          <TRPCReactProvider>
            {children}
            <ChatWidget />
          </TRPCReactProvider>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  );
}
