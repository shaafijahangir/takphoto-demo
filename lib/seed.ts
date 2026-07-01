import { db, tx } from "./db";

type SeedService = {
  slug: string;
  name: string;
  country: string;
  size_label: string;
  duration_min: number;
  price: number; // dollars CAD
  description: string;
  specs: string[];
};

// Starting set per the studio: Canada and US visa photos (different sizes).
// Specs reflect the published government requirements; prices are demo values.
// The studio can hand over exact pricing/spec copy and we tweak these rows.
const SERVICES: SeedService[] = [
  {
    slug: "canada-visa-photo",
    name: "Canada Visa Photo",
    country: "Canada",
    size_label: "35 × 45 mm",
    duration_min: 15,
    price: 20,
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
    name: "US Visa Photo",
    country: "United States",
    size_label: "2 × 2 in (51 × 51 mm)",
    duration_min: 15,
    price: 25,
    description:
      "US Department of State–compliant 2×2 inch photos for visa (DS-160), green card, and passport applications. Digital copy for online uploads available on request.",
    specs: [
      "2 × 2 in (51 × 51 mm), 2 prints",
      "Head 1–1 3/8 in (25–35 mm)",
      "Plain white background, no glasses",
      "Digital file provided for online forms",
    ],
  },
];

function run() {
  tx(() => {
    db.exec("DELETE FROM bookings; DELETE FROM services;");
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('services','bookings');");

    const ins = db.prepare(
      `INSERT INTO services (slug, name, country, size_label, duration_min, price_cents, description, specs)
       VALUES (?,?,?,?,?,?,?,?)`
    );
    for (const s of SERVICES) {
      ins.run(
        s.slug,
        s.name,
        s.country,
        s.size_label,
        s.duration_min,
        s.price * 100,
        s.description,
        s.specs.join("\n")
      );
    }
  });

  const c = (db.prepare("SELECT COUNT(*) c FROM services").get() as any).c;
  console.log(`Seed complete: ${c} services`);
}

run();
