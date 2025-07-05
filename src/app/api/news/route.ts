import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching articles:", error)
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      )
    }

    return NextResponse.json({ articles: articles || [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}