import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NewsHub } from "@/components/news/news-hub"

export default async function NewsPage() {
  await requireAuth()

  return (
    <DashboardLayout
      title="News & Insights Hub"
      subtitle="Latest obesity medication news and market insights"
    >
      <NewsHub />
    </DashboardLayout>
  )
}