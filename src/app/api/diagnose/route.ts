import { NextResponse } from "next/server"

export async function GET() {
  try {
    const diagnostics = {
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      status: "success",
      message: "Environment diagnostics",
      data: diagnostics
    })
  } catch (error) {
    return NextResponse.json({
      status: "error", 
      message: "Diagnostic failed",
      error: String(error)
    }, { status: 500 })
  }
}