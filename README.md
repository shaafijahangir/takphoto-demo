# Photo Tak — Demo Site + Passport/Visa Booking

A demo redesign of [takphoto.ca](https://takphoto.ca) with a working booking
system for **government-compliant passport & visa photos** (~15-minute
appointments). Landing page mirrors the studio's photography brand; the value
add is online booking for the quick-turnaround print service.

## Stack
- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **`node:sqlite`** (built-in, Node 24+) — zero external DB, file at `data/takphoto.db`

## The booking model — one studio, one station
The studio is one photographer at one location, so a person can't be shot for
two appointments at once. The system models a **single shared booking queue**:
every appointment (Canada *or* US visa) reserves the same station timeline, and
the availability engine removes any overlapping slot. This makes double-booking
physically impossible — see `lib/availability.ts`.

Flow (lean): **Photo type → Date & time → Your details → Confirm.**

## Notifications
On every booking the studio inbox (`takphoto.inc@gmail.com`) is notified. With
no email provider configured, notices are logged to the console and
`data/notifications.log` so the demo runs with zero secrets. Set `RESEND_API_KEY`
(see `.env.example`) to send real email. Notifications never block or fail a
booking — `lib/notify.ts`.

## Run it
```bash
npm install
npm run seed     # loads Canada + US visa photo services into SQLite
npm run dev      # http://localhost:3100
```

Build: `npm run build && npm start`.

## Bookable services (seed data)
Starter set — the studio can hand over exact pricing/spec copy and we tweak the
rows in `lib/seed.ts`:

| Service            | Size                  | Duration | Demo price |
|--------------------|-----------------------|----------|------------|
| Canada Visa Photo  | 35 × 45 mm            | 15 min   | $20        |
| US Visa Photo      | 2 × 2 in (51 × 51 mm) | 15 min   | $25        |

Studio hours are configurable in `lib/types.ts` (`STUDIO_OPEN`, `STUDIO_CLOSE`,
`CLOSED_WEEKDAYS` — currently Mon–Sat 10:00–18:00, closed Sundays).

## API
- `GET  /api/services` — bookable photo types
- `GET  /api/availability?serviceId=&date=` — open 15-min slots for the station
- `POST /api/bookings` — create a booking (re-checks conflict in a transaction, then notifies)
- `GET  /api/bookings` — simple admin list

## What's mocked / next steps
- Portfolio & service imagery uses Unsplash placeholders — swap for the studio's real photos.
- Confirmation "email to customer" is stubbed alongside the studio notification.
- Payments are out of scope for the MVP (pay in-studio).
- Get exact government specs/pricing and additional doc types (PR card, citizenship, etc.) from the studio, then extend `lib/seed.ts`.
