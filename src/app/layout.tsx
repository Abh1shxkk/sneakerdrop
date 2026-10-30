import type { Metadata } from "next";
import { Anton, DM_Sans, Fredoka } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
