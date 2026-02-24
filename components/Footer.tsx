import Link from "next/link";
import Image from "next/image";
import {
  Microscope,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#EFE9E3] border-t border-[#D9CFC7] mt-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Supplement Science Logo"
                width={240}
                height={60}
                className="w-auto h-12 mb-2"
              />
            </Link>
            <p className="text-muted-foreground text-base max-w-md leading-relaxed">
              Advancing human health through rigorous, evidence-based research
              on supplements, nutrition, and personalized wellness strategies.
              Every article is cited from peer-reviewed journals.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">
              Information
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/ingredients"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ingredients Index
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Ethos
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/medical-disclaimer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-primary">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Get the latest science-backed supplement news delivered to your
              inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-background border border-border rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button size="sm" className="shrink-0">
                Join
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">
              Support
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Expert
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} SupplementDecoded. Empowering health through data.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Database Real-time Sync
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
