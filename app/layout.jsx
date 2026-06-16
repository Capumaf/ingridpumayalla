import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full m-0" suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}