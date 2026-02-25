import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#EFE9E3] dark:bg-[#0F0E0A] border-t border-[#D9CFC7] dark:border-[#3B3028] mt-20 transition-colors duration-300">
      <div
        className="container mx-auto max-w-6xl px-4 lg:px-8 py-12"
        suppressHydrationWarning
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10"
          suppressHydrationWarning
        >
          <div className="lg:col-span-2 space-y-6" suppressHydrationWarning>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src="/logo.png"
                alt="Supplement Science Logo"
                width={240}
                height={60}
                className="w-auto h-12 dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-sm leading-relaxed mb-6 font-medium">
              Advancing human health through rigorous, evidence-based research
              on supplements, nutrition, and personalized wellness strategies.
            </p>
            <div className="flex items-center gap-4" suppressHydrationWarning>
              <a
                href="#"
                className="p-2.5 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-slate-600 dark:text-zinc-400 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white transition-all shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-slate-600 dark:text-zinc-400 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white transition-all shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-slate-600 dark:text-zinc-400 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div suppressHydrationWarning>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">
              Explore
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/category/supplements"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">
              Standards
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/fact-checking"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Fact-Checking Process
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-independence"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Editorial Independence
                </Link>
              </li>
              <li>
                <Link
                  href="/safety-measures"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Safety Measures
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">
              Legal
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/medical-disclaimer"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6" suppressHydrationWarning>
            <h4 className="font-bold uppercase text-xs tracking-widest text-primary">
              Newsletter
            </h4>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              Get the latest science-backed supplement news delivered to your
              inbox.
            </p>
            <div className="flex flex-col gap-3" suppressHydrationWarning>
              <input
                type="email"
                placeholder="Email address"
                className="bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] rounded-lg px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-sm transition-colors duration-300"
              />
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg shadow-sm"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t border-[#D9CFC7] dark:border-[#3B3028] flex flex-col md:flex-row justify-between items-center gap-6"
          suppressHydrationWarning
        >
          <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">
            © {currentYear} SupplementDecoded. Empowering health through data.
          </p>
          <div className="flex items-center gap-6" suppressHydrationWarning>
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-white dark:bg-[#211A13] px-3 py-1.5 rounded-full border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Database Real-time Sync
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
