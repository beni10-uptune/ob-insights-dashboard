import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const adminEmail = "b10smith5@gmail.com"
    const newPassword = "Admin123!"
    
    // Generate fresh hash
    const freshHash = await bcrypt.hash(newPassword, 10)
    
    // Update user with fresh hash
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ 
        password_hash: freshHash,
        role: "admin",
        updated_at: new Date().toISOString()
      })
      .eq("email", adminEmail)
      .select()
      .single()
    
    if (updateError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to update user",
        error: updateError.message
      })
    }
    
    // Test the hash immediately
    const isValid = await bcrypt.compare(newPassword, freshHash)
    
    // Try to fetch the user and verify
    const { data: verifyUser, error: verifyError } = await supabase
      .from("users")
      .select("*")
      .eq("email", adminEmail)
      .single()
    
    if (verifyError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to verify user",
        error: verifyError.message
      })
    }
    
    // Test the stored hash
    const storedHashValid = verifyUser.password_hash ? 
      await bcrypt.compare(newPassword, verifyUser.password_hash) : false
    
    return NextResponse.json({
      status: "success",
      message: "Admin password has been reset",
      credentials: {
        email: adminEmail,
        password: newPassword
      },
      debug: {
        userFound: !!verifyUser,
        hasPasswordHash: !!verifyUser.password_hash,
        freshHashValid: isValid,
        storedHashValid: storedHashValid,
        hashLength: verifyUser.password_hash?.length,
        role: verifyUser.role
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Reset failed",
      error: String(error)
    })
  }
}