"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter, X } from "lucide-react"

interface NewsFiltersProps {
  selectedCategory: string
  selectedSentiment: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onCategoryChange: (category: string) => void
  onSentimentChange: (sentiment: string) => void
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onClearFilters: () => void
  categories: string[]
}

export function NewsFilters({
  selectedCategory,
  selectedSentiment,
  dateRange,
  onCategoryChange,
  onSentimentChange,
  onDateRangeChange,
  onClearFilters,
  categories
}: NewsFiltersProps) {
  const hasActiveFilters = 
    selectedCategory !== "all" || 
    selectedSentiment !== "all" || 
    dateRange.from || 
    dateRange.to

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sentiment</label>
          <Select value={selectedSentiment} onValueChange={onSentimentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Positive
                </div>
              </SelectItem>
              <SelectItem value="negative">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Negative
                </div>
              </SelectItem>
              <SelectItem value="neutral">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  Neutral
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <div className="space-y-2">
            <DatePicker
              date={dateRange.from}
              onDateChange={(date) => onDateRangeChange({ ...dateRange, from: date })}
              placeholder="From date"
              className="w-full"
            />
            <DatePicker
              date={dateRange.to}
              onDateChange={(date) => onDateRangeChange({ ...dateRange, to: date })}
              placeholder="To date"
              className="w-full"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-1">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedSentiment !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Sentiment: {selectedSentiment}
                </Badge>
              )}
              {(dateRange.from || dateRange.to) && (
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Date filtered
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}