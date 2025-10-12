import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const tripId = parseInt(params.id);

    await db
      .delete(trips)
      .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete trip error:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}