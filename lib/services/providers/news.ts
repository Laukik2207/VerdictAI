export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
}

export async function fetchCompanyNews(company: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("NewsAPI key missing. Skipping news fetch.");
    return [];
  }

  try {
    // Determine the date 7 days ago to keep news recent
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const fromDate = oneWeekAgo.toISOString().split("T")[0];

    // Using everything endpoint to search by company name
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}&from=${fromDate}&sortBy=relevancy&language=en&apiKey=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: Number(process.env.NEWS_CACHE_TTL) || 3600 },
    });

    if (!res.ok) {
      console.error(`NewsAPI returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.articles) {
      return [];
    }

    // Map and return top 10 articles
    return data.articles.slice(0, 10).map((article: any) => ({
      title: article.title,
      source: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
      description: article.description,
      url: article.url,
    }));
  } catch (error) {
    console.error("News fetch failed:", error);
    return [];
  }
}
