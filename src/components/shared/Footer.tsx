
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  SiInstagram,
  SiFacebook,
  
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

const footerLinks = {
  explore: [
    { label: "All Studios", href: "/studios" },
    { label: "Photo Studios", href: "/studios?category=photo-studios" },
    { label: "Sound Stages", href: "/studios?category=sound-stages" },
    { label: "Podcast Rooms", href: "/studios?category=podcast-rooms" },
    { label: "Music Suites", href: "/studios?category=music-suites" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Add Your Studio", href: "/studios/new" },
    { label: "My Bookings", href: "/my-bookings" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles size={21} />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
              Discover inspiring creative spaces, connect with studio owners,
              and bring your next big idea to life.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-lg border border-border p-2.5 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-lg border border-border p-2.5 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-lg border border-border p-2.5 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
               <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>hello@studiospace.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
            >
              Explore Studios <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Made for creators, with creativity.
          </p>
        </div>
      </div>
    </footer>
  );
}
