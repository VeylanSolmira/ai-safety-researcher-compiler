import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllNews, 
  getNewsByCategory, 
  getRecentNews,
  getNewsByTag 
} from '@/lib/db/news-queries';

// Force dynamic mode to prevent build-time execution
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as any;
    const tag = searchParams.get('tag') as any;
    const recent = searchParams.get('recent') as any;
    
    let news;
    
    if (category) {
      news = getNewsByCategory(category);
    } else if (tag) {
      news = getNewsByTag(tag);
    } else if (recent) {
      const days = parseInt(recent) || 30;
      news = getRecentNews(days);
    } else {
      news = getAllNews();
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}