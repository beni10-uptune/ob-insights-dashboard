import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Get user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: "Database error",
        details: error.message
      })
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        email: email
      })
    }

    // Check if password_hash exists
    if (!user.password_hash) {
      return NextResponse.json({
        success: false,
        error: "User has no password hash",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasPasswordHash: !!user.password_hash
        }
      })
    }

    // Test password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    return NextResponse.json({
      success: isPasswordValid,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash?.length
      },
      passwordValid: isPasswordValid,
      testPassword: password
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Server error",
      details: String(error)
    })
  }
}