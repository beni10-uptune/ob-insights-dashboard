import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Create admin user
    const adminEmail = "b10smith5@gmail.com"
    const adminPassword = "Admin123!"
    const adminName = "Ben Smith"

    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", adminEmail)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: "Admin user already exists", email: adminEmail },
        { status: 200 }
      )
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
      .select()
      .single()

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json(
        { error: "Failed to create admin user", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      email: adminEmail,
      password: adminPassword,
      userId: newUser.id,
      role: "admin"
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Failed to setup admin user" },
      { status: 500 }
    )
  }
}