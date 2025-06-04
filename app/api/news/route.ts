import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllNews, 
  getNewsByCategory, 
  getRecentNews,
  getNewsByTag 
} from '@/lib/db/news-queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const recent = searchParams.get('recent');
    
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