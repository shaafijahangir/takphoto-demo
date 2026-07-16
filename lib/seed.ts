import { db, tx } from "./db";
import type { ServiceCategory } from "./types";

type SeedService = {
  slug: string;
  name: string;
  category: ServiceCategory;
  country: string;
  size_label: string;
  duration_min: number;
  price: number; // dollars CAD, 0 = quoted or no charge
  price_display: string;
  price_note: string;
  description: string;
  specs: string[];
};

// Every service the studio lists is bookable. Government photos are the
// appointment itself. Studio sessions book the session. Wedding and real
// estate book a consultation, because nobody books a wedding day off a
// 15-minute slot picker.
//
// Prices: $30 visa and $50 headshot are confirmed by the studio over email.
// Everything else is quoted, so the form says so instead of inventing a number.
const SERVICES: SeedService[] = [
  {
    slug: "canada-visa-photo",
    name: "Canada Visa & Passport Photo",
    category: "gov",
    country: "Canada",
    size_label: "35 × 45 mm",
    duration_min: 15,
    price: 30,
    price_display: "$30",
    price_note: "for 2 prints",
    description:
      "IRCC-compliant photos for Canadian visa and travel-document applications. Printed on-site and checked against the current government spec before you leave.",
    specs: [
      "35 × 45 mm, 2 prints",
      "Neutral expression, plain white/light background",
      "Face 31–36 mm chin to crown",
      "Printed & verified in ~15 minutes",
    ],
  },
  {
    slug: "us-visa-photo",
    name: "US Visa & Passport Photo",
    category: "gov",
    country: "United States",
    size_label: "2 × 2 in (51 × 51 mm)",
    duration_min: 15,
    price: 30,
    price_display: "$30",
    price_note: "for 2 prints",
    description:
      "US Department of State compliant 2×2 inch photos for visa (DS-160), green card, and passport applications. Digital copy for online uploads available on request.",
    specs: [
      "2 × 2 in (51 × 51 mm), 2 prints",
      "Head 1–1 3/8 in (25–35 mm)",
      "Plain white background, no glasses",
      "Digital file provided for online forms",
    ],
  },
  {
    slug: "corporate-headshot",
    name: "Corporate Headshot",
    category: "studio",
    country: "",
    size_label: "",
    duration_min: 20,
    price: 50,
    price_display: "$50",
    price_note: "per digital file",
    description:
      "Professional, modern headshots that showcase confidence and authenticity. Shot at the Broughton St studio with professional lighting, retouched, and delivered as a high-res file.",
    specs: [
      "Professional lighting & retouch",
      "High-res digital file, ready to use",
      "Extra files $50 each",
      "~20 minute sitting",
    ],
  },
  {
    slug: "portrait-modelling",
    name: "Modelling & Portrait Session",
    category: "studio",
    country: "",
    size_label: "",
    duration_min: 60,
    price: 120,
    price_display: "From $120",
    price_note: "per session",
    description:
      "Elegant portraits that highlight your unique features and style. Studio or on-location, with a selection of edited images and digital files added as you need them.",
    specs: [
      "Studio or on-location",
      "Selection of edited images",
      "Add digital files as needed",
      "45–60 minute session",
    ],
  },
  {
    slug: "baby-family-session",
    name: "Baby & Family Session",
    category: "studio",
    country: "",
    size_label: "",
    duration_min: 60,
    price: 0,
    price_display: "Quote",
    price_note: "based on your group",
    description:
      "Natural family portraits that capture the love and connection you share. Tailored to your group size and location, delivered as a digital gallery.",
    specs: [
      "Tailored to group size & location",
      "Studio or on-location",
      "Digital gallery delivered",
      "Priced once we know the plan",
    ],
  },
  {
    slug: "wedding-consultation",
    name: "Wedding Consultation",
    category: "studio",
    country: "",
    size_label: "",
    duration_min: 30,
    price: 0,
    price_display: "No charge",
    price_note: "30 minute consult",
    description:
      "Beautiful, timeless wedding photography throughout Victoria and Vancouver Island. Book a consultation to walk through your date, venue, and coverage, and we will quote the day from there.",
    specs: [
      "Talk through date, venue & coverage",
      "See full wedding galleries in person",
      "Quote built around your day",
      "No charge, no obligation",
    ],
  },
  {
    slug: "real-estate-consultation",
    name: "Real Estate Consultation",
    category: "studio",
    country: "",
    size_label: "",
    duration_min: 30,
    price: 0,
    price_display: "No charge",
    price_note: "30 minute consult",
    description:
      "Premium real estate photography that helps listings sell faster. Book a consultation to go over the property, turnaround, and what the listing needs, and we will quote the shoot.",
    specs: [
      "Go over property size & turnaround",
      "Stills, twilight & floor plans available",
      "Quote built around the listing",
      "No charge, no obligation",
    ],
  },
];

function run() {
  tx(() => {
    db.exec("DELETE FROM bookings; DELETE FROM services;");
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('services','bookings');");

    const ins = db.prepare(
      `INSERT INTO services
         (slug, name, category, country, size_label, duration_min, price_cents,
          price_display, price_note, description, specs)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    );
    for (const s of SERVICES) {
      ins.run(
        s.slug,
        s.name,
        s.category,
        s.country,
        s.size_label,
        s.duration_min,
        s.price * 100,
        s.price_display,
        s.price_note,
        s.description,
        s.specs.join("\n")
      );
    }
  });

  const c = (db.prepare("SELECT COUNT(*) c FROM services").get() as any).c;
  console.log(`Seed complete: ${c} services`);
}

run();
