import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trips, destinations, platforms } from "@/db/schema";
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

    const userTrips = await db
      .select()
      .from(trips)
      .where(eq(trips.userId, userId));

    return NextResponse.json({ trips: userTrips });
  } catch (error) {
    console.error("Trips API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
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
    const { title, description, startDate, endDate, destinations: destData, platforms: platformData } = body;

    // Create trip
    const [newTrip] = await db
      .insert(trips)
      .values({
        userId,
        title,
        description,
        startDate,
        endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Create destinations
    if (destData && destData.length > 0) {
      const destinationsToInsert = destData.map((dest: any) => ({
        tripId: newTrip.id,
        name: dest.name,
        country: dest.country,
        visitDate: dest.visitDate || null,
        notes: dest.notes || null,
        latitude: null,
        longitude: null,
      }));

      await db.insert(destinations).values(destinationsToInsert);
    }

    // Create platform selections
    if (platformData && platformData.length > 0) {
      const platformsToInsert = platformData.map((platform: string) => ({
        tripId: newTrip.id,
        platformName: platform,
        isSelected: true,
      }));

      await db.insert(platforms).values(platformsToInsert);
    }

    return NextResponse.json({ trip: newTrip }, { status: 201 });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}