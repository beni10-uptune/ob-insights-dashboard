import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: "error",
        message: "Missing environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          url: supabaseUrl ? "Set" : "Missing"
        }
      })
    }

    // Test Supabase connection
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try to connect to the users table
    const { data, error } = await supabase
      .from("users")
      .select("count(*)")
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: error.message,
        details: error
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: data,
      config: {
        url: supabaseUrl.substring(0, 30) + "...",
        keyPresent: true
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: "error", 
      message: "Test failed",
      error: String(error)
    })
  }
}