import { NextRequest, NextResponse } from 'next/server';
import { wrapBlocks } from '@/lib/db/timeline-queries';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, blockIds, parentName, parentType, parentCustomType, parentStartDate, parentEndDate } = data;

    if (!userId || !blockIds || !blockIds.length || !parentName || !parentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parentId = wrapBlocks({
      userId,
      blockIds,
      parentName,
      parentType,
      parentCustomType,
      parentStartDate,
      parentEndDate
    });

    return NextResponse.json({ parentId, message: 'Blocks wrapped successfully' });
  } catch (error) {
    console.error('Error wrapping blocks:', error);
    return NextResponse.json({ error: error.message || 'Failed to wrap blocks' }, { status: 500 });
  }
}