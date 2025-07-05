import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Test connection first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: "error",
        message: "Missing Supabase environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      }, { status: 500 })
    }

    // Create admin user
    const adminEmail = "b10smith5@gmail.com"
    const adminPassword = "Admin123!"
    const adminName = "Ben Smith"

    // Test if we can connect to Supabase
    try {
      const { error: testError } = await supabase
        .from("users")
        .select("count(*)")
        .limit(1)

      if (testError) {
        return NextResponse.json({
          status: "error",
          message: "Cannot connect to Supabase database",
          error: testError.message,
          details: "Check if the users table exists and environment variables are correct"
        }, { status: 500 })
      }
    } catch (connectionError) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: String(connectionError)
      }, { status: 500 })
    }

    // Check if admin already exists
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", adminEmail)
      .maybeSingle()

    if (selectError) {
      return NextResponse.json({
        status: "error", 
        message: "Error checking existing users",
        error: selectError.message
      }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({
        status: "success",
        message: "Admin user already exists - you can sign in now!",
        user: {
          email: existingUser.email,
          role: existingUser.role,
          id: existingUser.id
        },
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10)

    // Create admin user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: adminEmail,
        name: adminName,
        password_hash: passwordHash,
        role: "admin",
      })
      .select("id, email, role")
      .single()

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json({
        status: "error",
        message: "Failed to create admin user",
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Admin user created successfully! You can now sign in.",
      user: newUser,
      credentials: {
        email: adminEmail,
        password: adminPassword
      },
      nextStep: "Go to /auth/signin to log in"
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({
      status: "error",
      message: "Failed to setup admin user",
      error: String(error)
    }, { status: 500 })
  }
}