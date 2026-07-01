import { NextResponse } from "next/server";
import { all } from "@/lib/db";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/services -> every bookable photo type.
export async function GET() {
  const services = all<Service>("SELECT * FROM services ORDER BY id");
  return NextResponse.json({ services });
}
