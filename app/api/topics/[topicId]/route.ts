import { NextRequest, NextResponse } from 'next/server';
import { getDb, eq } from '@/lib/db';
import { topics } from '@/lib/db/schema';

export async function PUT(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Content editing is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { contentAcademic, contentPersonal } = await request.json();
    const db = getDb();
    
    // First, get the current content for backup
    const currentTopic = await db
      .select()
      .from(topics)
      .where(eq(topics.id, params.topicId))
      .limit(1);
    
    if (currentTopic.length === 0) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }
    
    // Log the change for safety (in production, this would go to a proper audit log)
    console.log(`[CONTENT EDIT] Topic: ${params.topicId}`);
    console.log(`[CONTENT EDIT] Previous academic length: ${currentTopic[0].contentAcademic?.length || 0}`);
    console.log(`[CONTENT EDIT] Previous personal length: ${currentTopic[0].contentPersonal?.length || 0}`);
    console.log(`[CONTENT EDIT] New academic length: ${contentAcademic?.length || 'unchanged'}`);
    console.log(`[CONTENT EDIT] New personal length: ${contentPersonal?.length || 'unchanged'}`);
    
    // Build update object based on what's provided
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (contentAcademic !== undefined) {
      updateData.contentAcademic = contentAcademic;
    }
    
    if (contentPersonal !== undefined) {
      updateData.contentPersonal = contentPersonal;
    }
    
    if (Object.keys(updateData).length === 1) {
      return NextResponse.json(
        { error: 'No content provided to update' },
        { status: 400 }
      );
    }
    
    // Update the topic
    const result = await db
      .update(topics)
      .set(updateData)
      .where(eq(topics.id, params.topicId))
      .returning();
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      topic: result[0] 
    });
    
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic content' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const db = getDb();
    const topic = await db
      .select()
      .from(topics)
      .where(eq(topics.id, params.topicId))
      .limit(1);
    
    if (topic.length === 0) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(topic[0]);
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}