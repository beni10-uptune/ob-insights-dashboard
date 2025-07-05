"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus, Bookmark, BookmarkCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleBookmark = async () => {
    try {
      const response = await fetch(`/api/news/${article.id}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
      })
      
      if (response.ok) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + "..."
  }

  const publishedDate = article.published_at 
    ? new Date(article.published_at)
    : new Date(article.created_at)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {article.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(publishedDate, { addSuffix: true })}</span>
              {article.source && (
                <>
                  <span>•</span>
                  <span>{article.source}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {article.sentiment && (
              <Badge variant="outline" className={getSentimentColor(article.sentiment)}>
                <span className="flex items-center gap-1">
                  {getSentimentIcon(article.sentiment)}
                  {article.sentiment}
                </span>
              </Badge>
            )}
            
            {article.category && (
              <Badge variant="secondary">
                {article.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {article.content && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isExpanded ? article.content : truncateContent(article.content)}
            </p>
            
            {article.content.length > 200 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto mt-1 text-xs"
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.url && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Read Full Article
                </a>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className="flex items-center gap-1"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}