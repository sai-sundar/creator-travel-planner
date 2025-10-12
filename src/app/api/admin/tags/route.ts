import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trendingTags } from "@/db/schema";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await db
      .select()
      .from(trendingTags)
      .orderBy(desc(trendingTags.usageCount));

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Tags API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
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
    const { tagName, usageCount, category } = body;

    const [newTag] = await db
      .insert(trendingTags)
      .values({
        tagName,
        usageCount: usageCount || 0,
        category,
        lastUpdated: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ tag: newTag }, { status: 201 });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}