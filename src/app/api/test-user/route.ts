import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", "b10smith5@gmail.com")
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({
        status: "error",
        message: "Database error",
        error: error.message
      })
    }

    if (!user) {
      // Create user with password hash
      const passwordHash = await bcrypt.hash("Admin123!", 10)
      
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: "b10smith5@gmail.com",
          name: "Admin User",
          role: "admin",
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({
          status: "error", 
          message: "Failed to create user",
          error: createError.message
        })
      }

      return NextResponse.json({
        status: "success",
        message: "Admin user created",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          hasPasswordHash: !!newUser.password_hash
        }
      })
    }

    // User exists, update password
    const passwordHash = await bcrypt.hash("Admin123!", 10)
    
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ 
        password_hash: passwordHash,
        role: "admin",
        updated_at: new Date().toISOString()
      })
      .eq("email", "b10smith5@gmail.com")
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to update user",
        error: updateError.message
      })
    }

    // Test the password
    const isValid = await bcrypt.compare("Admin123!", passwordHash)

    return NextResponse.json({
      status: "success",
      message: "Admin user updated",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        hasPasswordHash: !!updatedUser.password_hash,
        passwordValid: isValid
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: String(error)
    })
  }
}