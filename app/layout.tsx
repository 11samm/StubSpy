import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL("https://stubspy.com"),
  title: "StubSpy — Big nights. Smaller prices.",
  description: "StubSpy is building a smarter way to track resale ticket prices and catch price drops. Join the waitlist for early access.",
  openGraph: { title: "StubSpy — Big nights. Smaller prices.", description: "Track the tickets you want. Catch the price drop. Join the StubSpy early-access waitlist.", type: "website", locale: "en_US" },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={geist.variable}><body>{children}</body></html>;
}
