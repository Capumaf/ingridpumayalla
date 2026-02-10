// app/layout.jsx
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full m-0" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
