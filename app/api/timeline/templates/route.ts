import { NextRequest, NextResponse } from 'next/server';
import { getTimelineTemplates, createTimelineTemplate, applyTemplate } from '@/lib/db/timeline-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';
    const userId = searchParams.get('userId');

    const templates = getTimelineTemplates(isPublic, userId || undefined);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching timeline templates:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action } = data;

    if (action === 'create') {
      const { userId, name, description, structure, isPublic } = data;

      if (!name || !structure) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const id = createTimelineTemplate({
        userId: userId || null,
        name,
        description: description || null,
        structure,
        isPublic: isPublic || false
      });

      return NextResponse.json({ id, message: 'Template created successfully' });
    } else if (action === 'apply') {
      const { templateId, userId, parentId } = data;

      if (!templateId || !userId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = applyTemplate(templateId, userId, parentId);
      return NextResponse.json({ message: 'Template applied successfully', blocks: result });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling timeline template:', error);
    return NextResponse.json({ error: 'Failed to handle timeline template' }, { status: 500 });
  }
}