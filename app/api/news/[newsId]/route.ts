import { NextRequest, NextResponse } from 'next/server';
import { getNewsItem } from '@/lib/db/news-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { newsId: string } }
) {
  try {
    const newsItem = getNewsItem(params.newsId);
    
    if (!newsItem) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news item' },
      { status: 500 }
    );
  }
}