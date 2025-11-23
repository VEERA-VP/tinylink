import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Link2 } from "lucide-react";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "URL shortener built with Next.js and MongoDB"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
          <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
              <Link 
                href="/" 
                className="font-bold tracking-tight text-xl inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 transition-all duration-200"
              >
                <Link2 className="h-5 w-5 text-sky-400" />
                TinyLink
              </Link>
              <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                Next.js · MongoDB
              </span>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">{children}</div>
          </main>
          <footer className="border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm text-xs text-slate-400">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-sky-400" />
                TinyLink
              </span>
              <span>© 2025 · Built with Next.js</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
