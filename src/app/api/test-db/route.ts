import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Test the connection by querying the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Database connection successful!',
      data: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error', details: error },
      { status: 500 }
    )
  }
} 