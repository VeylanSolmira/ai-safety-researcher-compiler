import { NextRequest, NextResponse } from 'next/server';
import { getTimelineItems, createTimelineItem, updateTimelineItem, deleteTimelineItem } from '@/lib/db/timeline-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');
    
    if (!blockId) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 });
    }

    const items = getTimelineItems(blockId);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching timeline items:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { blockId, type, title, description, relatedTopics, url, reminder, date, position } = data;

    if (!blockId || !type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = createTimelineItem({
      blockId,
      type,
      title,
      description: description || null,
      relatedTopics: relatedTopics || [],
      url: url || null,
      reminder: reminder || null,
      date: date || null,
      position: position || 0
    });

    return NextResponse.json({ id, message: 'Timeline item created successfully' });
  } catch (error) {
    console.error('Error creating timeline item:', error);
    return NextResponse.json({ error: 'Failed to create timeline item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    updateTimelineItem(id, updates);
    return NextResponse.json({ message: 'Timeline item updated successfully' });
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json({ error: 'Failed to update timeline item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    deleteTimelineItem(id);
    return NextResponse.json({ message: 'Timeline item deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json({ error: 'Failed to delete timeline item' }, { status: 500 });
  }
}