import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Booking Platform",
  description: "A frontend for browsing, creating, and booking events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}