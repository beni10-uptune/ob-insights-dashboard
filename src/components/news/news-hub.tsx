"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsCard } from "./news-card"
import { RefreshCw, Search, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface NewsArticle {
  id: string
  title: string
  content: string | null
  source: string | null
  url: string | null
  sentiment: "positive" | "negative" | "neutral" | null
  category: string | null
  published_at: string | null
  created_at: string
}

export function NewsHub() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSentiment, setSelectedSentiment] = useState("all")

  const fetchArticles = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const response = await fetch("/api/news")
      if (!response.ok) throw new Error("Failed to fetch articles")
      
      const data = await response.json()
      setArticles(data.articles || [])
      
      if (refresh) {
        toast.success("News feed updated")
      }
    } catch (error) {
      toast.error("Failed to load news articles")
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const refreshNews = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/news/refresh", { method: "POST" })
      if (!response.ok) throw new Error("Failed to refresh news")
      
      await fetchArticles(true)
      toast.success("News feed refreshed with latest articles")
    } catch (error) {
      toast.error("Failed to refresh news feed")
      console.error("Error refreshing news:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSentiment = selectedSentiment === "all" || article.sentiment === selectedSentiment
    
    return matchesSearch && matchesCategory && matchesSentiment
  })

  const sentimentStats = {
    positive: articles.filter(a => a.sentiment === "positive").length,
    negative: articles.filter(a => a.sentiment === "negative").length,
    neutral: articles.filter(a => a.sentiment === "neutral").length,
  }

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))] as string[]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              Last updated 30 min ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentimentStats.positive}</div>
            <p className="text-xs text-muted-foreground">
              {articles.length > 0 ? Math.round((sentimentStats.positive / articles.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sentimentStats.negative}</div>
            <p className="text-xs text-muted-foreground">
              {articles.length > 0 ? Math.round((sentimentStats.negative / articles.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral Sentiment</CardTitle>
            <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{sentimentStats.neutral}</div>
            <p className="text-xs text-muted-foreground">
              {articles.length > 0 ? Math.round((sentimentStats.neutral / articles.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={refreshNews} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">No articles found</p>
                <Button onClick={refreshNews} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        )}
      </div>

      {filteredArticles.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        </div>
      )}
    </div>
  )
}