import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          password_hash: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          password_hash: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          password_hash?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          content: string | null
          source: string | null
          url: string | null
          sentiment: string | null
          category: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          source?: string | null
          url?: string | null
          sentiment?: string | null
          category?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          source?: string | null
          url?: string | null
          sentiment?: string | null
          category?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_metrics: {
        Row: {
          id: string
          keyword: string | null
          search_volume: number | null
          cpc: number | null
          competition: number | null
          trend_direction: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          keyword?: string | null
          search_volume?: number | null
          cpc?: number | null
          competition?: number | null
          trend_direction?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          keyword?: string | null
          search_volume?: number | null
          cpc?: number | null
          competition?: number | null
          trend_direction?: string | null
          recorded_at?: string
          created_at?: string
        }
      }
      competitor_ads: {
        Row: {
          id: string
          platform: string | null
          advertiser: string | null
          ad_id: string | null
          creative_url: string | null
          headline: string | null
          description: string | null
          cta: string | null
          first_seen: string | null
          last_seen: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform?: string | null
          advertiser?: string | null
          ad_id?: string | null
          creative_url?: string | null
          headline?: string | null
          description?: string | null
          cta?: string | null
          first_seen?: string | null
          last_seen?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string | null
          advertiser?: string | null
          ad_id?: string | null
          creative_url?: string | null
          headline?: string | null
          description?: string | null
          cta?: string | null
          first_seen?: string | null
          last_seen?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      website_metrics: {
        Row: {
          id: string
          date: string | null
          clicks: number | null
          impressions: number | null
          ctr: number | null
          position: number | null
          top_queries: Record<string, unknown> | null
          top_pages: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          date?: string | null
          clicks?: number | null
          impressions?: number | null
          ctr?: number | null
          position?: number | null
          top_queries?: Record<string, unknown> | null
          top_pages?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string | null
          clicks?: number | null
          impressions?: number | null
          ctr?: number | null
          position?: number | null
          top_queries?: Record<string, unknown> | null
          top_pages?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
  }
} 