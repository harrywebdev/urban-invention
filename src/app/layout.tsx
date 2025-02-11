import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vrazovka Fin v1",
  description: "Digital twin of Vrazovka IRL Fin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={"light"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-stretch min-h-screen p-8 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-[95%] sm:max-w-2xl md:max-w-3xl shadow-xl bg-white">
          <header>
            <h1 className={"text-xl font-semibold text-gray-400"}>
              <Link href="/">vrazovka_fin</Link>
            </h1>
          </header>

          <main className="flex flex-col gap-2 md:gap-4 row-start-2 items-stretch">
            {children}
          </main>

          <footer
            className={
              "text-sm text-gray-500 tracking-wider border-t-2 border-gray-100 pt-2"
            }
          >
            made with ♥️ by Harry
          </footer>
        </div>
      </body>
    </html>
  );
}
