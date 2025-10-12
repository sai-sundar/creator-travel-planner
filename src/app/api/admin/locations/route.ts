import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { locationDatabase } from "@/db/schema";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await db
      .select()
      .from(locationDatabase)
      .orderBy(desc(locationDatabase.trendingScore));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Locations API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, country, category, description, bestTimeToVisit, trendingScore } = body;

    const [newLocation] = await db
      .insert(locationDatabase)
      .values({
        name,
        country,
        category,
        description,
        bestTimeToVisit,
        trendingScore: trendingScore || 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ location: newLocation }, { status: 201 });
  } catch (error) {
    console.error("Create location error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}