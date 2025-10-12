import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trips, contentCalendar, platforms } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user's trips
    const userTrips = await db
      .select()
      .from(trips)
      .where(eq(trips.userId, userId))
      .orderBy(desc(trips.createdAt))
      .limit(5);

    // Fetch scheduled posts count
    const scheduledPosts = await db
      .select()
      .from(contentCalendar)
      .where(eq(contentCalendar.status, "scheduled"));

    // Fetch active platforms count
    const activePlatforms = await db
      .select()
      .from(platforms)
      .where(eq(platforms.isSelected, true));

    const stats = {
      totalTrips: userTrips.length,
      scheduledPosts: scheduledPosts.length,
      activePlatforms: activePlatforms.length,
    };

    return NextResponse.json({
      recentTrips: userTrips,
      stats,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}