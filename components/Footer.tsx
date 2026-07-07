import Link from "next/link";
import { PhoneIcon, MailIcon, MapPinIcon, InstagramIcon, FacebookIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-charcoal text-paper">
      <div className="mx-auto max-w-8xl px-5 py-16 sm:px-8 lg:px-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson font-display text-lg font-bold text-paper">
                P
              </span>
              <span className="font-display text-xl font-bold">Photo Tak</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/65">
              Luxury photography and videography in Victoria, BC. Fast, government-compliant
              passport and visa photos. Warm, modern storytelling for weddings, portraits, and brands.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper/70 transition hover:border-sand hover:text-sand">
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper/70 transition hover:border-sand hover:text-sand">
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-sand">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              <li><a href="/#work" className="hover:text-paper">Portfolio</a></li>
              <li><a href="/#services" className="hover:text-paper">Services</a></li>
              <li><a href="/#pricing" className="hover:text-paper">Pricing</a></li>
              <li><a href="/book" className="hover:text-paper">Passport & Visa Photos</a></li>
              <li><a href="/#why" className="hover:text-paper">Why Photo Tak</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-sand">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-sand" /> (778) 433-8257
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-sand" /> hello@takphoto.ca
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sand" />
                <span>623 Broughton St<br />Victoria, BC V8W 3J2</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-paper/50 sm:flex-row">
          <p>Service areas: Victoria, BC · Vancouver Island · Vancouver (travel available)</p>
          <p>© {new Date().getFullYear()} Photo Tak. Demo site. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
