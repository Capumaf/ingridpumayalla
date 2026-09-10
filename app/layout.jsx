import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from "@/components/CookieConsent";

export const metadata = {
  metadataBase: new URL("https://ingridpumayalla.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full m-0" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}