"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PhoneIcon, MapPinIcon } from "@/components/icons";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/book", label: "Passport & Visa" },
  { href: "/#why", label: "Why Us" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* top utility bar */}
      <div className="hidden bg-ink text-paper/80 md:block">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-8 py-2 text-xs lg:px-20">
          <span className="flex items-center gap-2">
            <MapPinIcon className="h-3.5 w-3.5 text-sand" />
            623 Broughton St, Victoria, BC
          </span>
          <a href="tel:+17784338257" className="flex items-center gap-2 hover:text-paper">
            <PhoneIcon className="h-3.5 w-3.5 text-sand" />
            (778) 433-8257
          </a>
        </div>
      </div>

      {/* main bar */}
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-ink/10 bg-paper/90 backdrop-blur"
            : "border-transparent bg-paper/70 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between px-5 py-4 sm:px-8 lg:px-20">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson font-display text-lg font-bold text-paper">
              P
            </span>
            <span className="font-display text-xl font-bold tracking-wide text-ink">
              Photo<span className="text-crimson"> Tak</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 lg:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-crimson">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/book" className="btn-primary !px-5 !py-2 text-sm">
              Book Visa Photo
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-ink/10 bg-paper px-5 py-3 lg:hidden">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-ink/80 hover:text-crimson"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
