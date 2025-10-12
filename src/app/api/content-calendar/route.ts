import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contentCalendar, trips } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's trips first
    const userTrips = await db
      .select()
      .from(trips)
      .where(eq(trips.userId, userId));

    const tripIds = userTrips.map(t => t.id);

    if (tripIds.length === 0) {
      return NextResponse.json({ content: [] });
    }

    // Get content for user's trips
    const content = await db
      .select()
      .from(contentCalendar);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Content calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
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

    const userId = session.user.id;
    const body = await request.json();
    const { scheduledDate, caption, tone, locationSuggestion, hashtags, tripId } = body;

    // Get first user trip if tripId not provided
    let finalTripId = tripId;
    if (!finalTripId) {
      const userTrips = await db
        .select()
        .from(trips)
        .where(eq(trips.userId, userId))
        .limit(1);
      
      if (userTrips.length > 0) {
        finalTripId = userTrips[0].id;
      } else {
        return NextResponse.json(
          { error: "No trips found. Please create a trip first." },
          { status: 400 }
        );
      }
    }

    const [newContent] = await db
      .insert(contentCalendar)
      .values({
        tripId: finalTripId,
        scheduledDate,
        caption,
        tone,
        locationSuggestion,
        hashtags,
        status: "scheduled",
      })
      .returning();

    return NextResponse.json({ content: newContent }, { status: 201 });
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}