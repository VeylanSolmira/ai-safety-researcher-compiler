import { NextRequest, NextResponse } from 'next/server';
import { getTimelineBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock } from '@/lib/db/timeline-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const blocks = getTimelineBlocks(userId);
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching timeline blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, parentId, name, type, customType, position, metadata, startDate, endDate } = data;

    if (!userId || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = createTimeBlock({
      userId,
      parentId: parentId || null,
      name,
      type,
      customType: customType || null,
      position: position || 0,
      metadata: metadata || {},
      startDate: startDate || null,
      endDate: endDate || null
    });

    return NextResponse.json({ id, message: 'Time block created successfully' });
  } catch (error) {
    console.error('Error creating time block:', error);
    return NextResponse.json({ error: 'Failed to create time block' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 });
    }

    updateTimeBlock(id, updates);
    return NextResponse.json({ message: 'Time block updated successfully' });
  } catch (error) {
    console.error('Error updating time block:', error);
    return NextResponse.json({ error: 'Failed to update time block' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 });
    }

    deleteTimeBlock(id);
    return NextResponse.json({ message: 'Time block deleted successfully' });
  } catch (error) {
    console.error('Error deleting time block:', error);
    return NextResponse.json({ error: 'Failed to delete time block' }, { status: 500 });
  }
}