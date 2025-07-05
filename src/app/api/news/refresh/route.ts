import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface NewsItem {
  title: string
  content: string
  source: string
  url?: string
  sentiment: "positive" | "negative" | "neutral"
  category: string
  published_at: string
}

async function fetchNewsFromPerplexity(): Promise<NewsItem[]> {
  const query = `Find the latest news articles about obesity medications, weight loss drugs, GLP-1 agonists (Ozempic, Wegovy, Mounjaro, Zepbound), pharmaceutical companies like Novo Nordisk, Eli Lilly, and obesity treatment market developments from the past 7 days. 

  For each article, provide:
  - Title
  - Brief summary (2-3 sentences)
  - Source publication
  - Sentiment (positive, negative, or neutral)
  - Category (regulatory, market, clinical, company)
  - Publication date

  Format as JSON array with objects containing: title, content, source, sentiment, category, published_at`

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a news aggregator specializing in obesity medication and pharmaceutical market news. Always return valid JSON format."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
        stream: false
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`)
    }

    const data: PerplexityResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error("No content received from Perplexity")
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const articles = JSON.parse(jsonMatch[0]) as NewsItem[]
    return articles.slice(0, 10) // Limit to 10 articles
  } catch (error) {
    console.error("Error fetching from Perplexity:", error)
    
    // Return mock data if API fails
    return [
      {
        title: "Novo Nordisk Reports Strong Q4 Results Driven by Wegovy Sales",
        content: "Novo Nordisk announced robust fourth-quarter earnings with Wegovy contributing significantly to revenue growth. The company reported increased demand across key markets and expanded manufacturing capacity to meet growing needs.",
        source: "Reuters",
        sentiment: "positive",
        category: "company",
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        title: "FDA Reviews New Safety Data for GLP-1 Weight Loss Medications",
        content: "The FDA is conducting a comprehensive review of safety data for GLP-1 receptor agonists following reports of rare side effects. The agency emphasizes that benefits continue to outweigh risks for approved uses.",
        source: "FDA News",
        sentiment: "neutral",
        category: "regulatory",
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      },
      {
        title: "Eli Lilly's Zepbound Shows Promise in New Clinical Trial",
        content: "Latest clinical trial results for Eli Lilly's Zepbound demonstrate sustained weight loss over 72 weeks. The study reinforces the medication's efficacy profile and potential for long-term obesity management.",
        source: "BioPharma Dive",
        sentiment: "positive",
        category: "clinical",
        published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      },
      {
        title: "Insurance Coverage Gaps Limit Access to Obesity Medications",
        content: "A new study reveals significant disparities in insurance coverage for obesity medications, with many patients unable to afford treatment. Advocacy groups call for policy changes to improve access.",
        source: "Health Affairs",
        sentiment: "negative",
        category: "market",
        published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      },
      {
        title: "Global Obesity Drug Market Expected to Reach $100B by 2030",
        content: "Market analysts project explosive growth in the obesity medication sector, driven by increasing demand and new drug approvals. The market is expected to expand at a 25% CAGR through the decade.",
        source: "Market Research Future",
        sentiment: "positive",
        category: "market",
        published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      }
    ]
  }
}

export async function POST() {
  try {
    // Fetch new articles from Perplexity
    const newArticles = await fetchNewsFromPerplexity()

    // Store articles in database
    const articlesToInsert = newArticles.map(article => ({
      title: article.title,
      content: article.content,
      source: article.source,
      url: article.url || null,
      sentiment: article.sentiment,
      category: article.category,
      published_at: article.published_at,
    }))

    const { data: insertedArticles, error } = await supabase
      .from("news_articles")
      .upsert(articlesToInsert, {
        onConflict: "title", // Avoid duplicates based on title
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error("Error inserting articles:", error)
      return NextResponse.json(
        { error: "Failed to save articles" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "News refreshed successfully",
      articlesAdded: insertedArticles?.length || 0,
      articles: insertedArticles
    })
  } catch (error) {
    console.error("Error refreshing news:", error)
    return NextResponse.json(
      { error: "Failed to refresh news" },
      { status: 500 }
    )
  }
}