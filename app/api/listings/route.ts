import { NextResponse } from "next/server";
import { filterListings, InvalidFilter } from "@/lib/listings";

export async function GET(request: Request) {
  try {
    return NextResponse.json(filterListings(new URL(request.url).searchParams));
  } catch (error) {
    if (error instanceof InvalidFilter) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
