import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

// Self-hosted from @fontsource so builds never depend on reaching Google Fonts.
const fredoka = localFont({
  variable: "--font-fredoka",
  src: [
    { path: "../../node_modules/@fontsource/fredoka/files/fredoka-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2", weight: "700" },
  ],
});

const anton = localFont({
  variable: "--font-anton",
  src: "../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  weight: "400",
});

const dmSans = localFont({
  variable: "--font-dm-sans",
  src: [
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "SneakerDrop — Limited pairs. Zero compromise.",
    template: "%s · SneakerDrop",
  },
  description:
    "SneakerDrop is a premium sneaker showcase. Explore limited drops and join the waitlist before they sell out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${anton.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!bg-cream !text-ink !border !border-ink !rounded-full !font-body",
          }}
        />
      </body>
    </html>
  );
}
