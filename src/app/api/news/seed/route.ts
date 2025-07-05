import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const mockArticles = [
  {
    title: "Novo Nordisk Reports Record Q4 Results Driven by Wegovy Demand",
    content: "Novo Nordisk announced exceptional fourth-quarter earnings with Wegovy sales exceeding expectations across all major markets. The Danish pharmaceutical giant reported a 31% increase in obesity care revenue, primarily driven by strong uptake of its GLP-1 weight management medication. CEO Lars Fruergaard Jørgensen highlighted the company's ongoing efforts to scale manufacturing capacity to meet unprecedented global demand.",
    source: "Reuters Health",
    url: "https://example.com/novo-nordisk-q4-results",
    sentiment: "positive",
    category: "company",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "FDA Expands Safety Review of GLP-1 Weight Loss Medications",
    content: "The U.S. Food and Drug Administration has initiated a comprehensive safety review of GLP-1 receptor agonists following increased reports of gastrointestinal side effects. The agency emphasized that the review is precautionary and that benefits continue to outweigh risks for approved indications. Healthcare providers are advised to monitor patients closely and report any adverse events.",
    source: "FDA Safety Communications",
    url: "https://example.com/fda-glp1-safety-review",
    sentiment: "neutral",
    category: "regulatory",
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Eli Lilly's Zepbound Demonstrates Superior Weight Loss in Head-to-Head Trial",
    content: "Eli Lilly released positive results from a head-to-head clinical trial comparing Zepbound (tirzepatide) to Wegovy (semaglutide). The 72-week study showed that patients on Zepbound achieved significantly greater weight reduction, with 67% of participants losing at least 20% of their body weight compared to 43% on Wegovy. The findings strengthen Lilly's competitive position in the obesity medication market.",
    source: "BioPharma Dive",
    url: "https://example.com/zepbound-wegovy-comparison",
    sentiment: "positive",
    category: "clinical",
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Insurance Coverage Barriers Limit Patient Access to Obesity Medications",
    content: "A new analysis reveals that despite clinical effectiveness, insurance coverage for obesity medications remains inconsistent across the United States. Only 42% of commercial insurance plans provide full coverage for GLP-1 weight loss drugs, leaving many patients with monthly costs exceeding $1,000. Patient advocacy groups are calling for policy reforms to classify obesity as a chronic disease requiring comprehensive coverage.",
    source: "Health Affairs",
    url: "https://example.com/insurance-coverage-obesity-drugs",
    sentiment: "negative",
    category: "market",
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Global Obesity Drug Market Projected to Exceed $100 Billion by 2030",
    content: "Market research firms are revising their projections for the global obesity medication market upward, with latest estimates suggesting the sector could reach $105 billion by 2030. The explosive growth is attributed to increasing obesity prevalence, expanding drug approvals, and growing acceptance of pharmacological weight management. Analysts expect the market to maintain a compound annual growth rate of 28% through the decade.",
    source: "Market Research Future",
    url: "https://example.com/obesity-drug-market-100b",
    sentiment: "positive",
    category: "market",
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "European Medicines Agency Approves New Weight Management Indication",
    content: "The European Medicines Agency (EMA) has approved an expanded indication for a leading GLP-1 medication to include weight management in adults with obesity. The decision follows comprehensive review of clinical trial data demonstrating significant and sustained weight loss. The approval is expected to improve patient access across European Union member states.",
    source: "EMA Press Release",
    url: "https://example.com/ema-weight-management-approval",
    sentiment: "positive",
    category: "regulatory",
    published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Manufacturing Capacity Shortages Continue to Impact Wegovy Availability",
    content: "Novo Nordisk confirms that manufacturing capacity constraints continue to limit Wegovy availability in several key markets. The company is investing €2.3 billion in new production facilities but acknowledges that supply-demand balance may not normalize until late 2024. Healthcare providers report ongoing challenges in maintaining patient treatment continuity.",
    source: "Pharmaceutical Executive",
    url: "https://example.com/wegovy-supply-shortage",
    sentiment: "negative",
    category: "company",
    published_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Real-World Evidence Confirms Long-Term Efficacy of GLP-1 Weight Loss Drugs",
    content: "A large-scale retrospective analysis of real-world patient data confirms the long-term efficacy and safety profile of GLP-1 receptor agonists for weight management. The study, following over 50,000 patients for up to three years, showed sustained weight loss and improvements in cardiovascular risk factors. Researchers noted the importance of continued treatment adherence for optimal outcomes.",
    source: "New England Journal of Medicine",
    url: "https://example.com/real-world-glp1-efficacy",
    sentiment: "positive",
    category: "clinical",
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
]

export async function POST() {
  try {
    const { data: insertedArticles, error } = await supabase
      .from("news_articles")
      .upsert(mockArticles, {
        onConflict: "title",
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error("Error seeding articles:", error)
      return NextResponse.json(
        { error: "Failed to seed articles", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      articlesAdded: insertedArticles?.length || 0,
      articles: insertedArticles
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    )
  }
}