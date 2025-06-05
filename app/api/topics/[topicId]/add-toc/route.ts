import { getDatabasePath } from '@/lib/db'

import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { insertTocIntoMarkdown, shouldAddToc } from '@/lib/utils/generate-toc';

export async function POST(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = params.topicId;
    const db = new Database(path.join(process.cwd(), 'journey.db'));

    // Get the topic
    const topic = db.prepare(`
      SELECT id, title, content_academic, content_personal
      FROM topics
      WHERE id = ?
    `).get(topicId) as any;

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    let academicUpdated = false;
    let personalUpdated = false;

    // Add TOC to academic content if needed
    if (topic.content_academic && shouldAddToc(topic.content_academic)) {
      if (!topic.content_academic.includes('<!-- TOC -->')) {
        const updatedContent = insertTocIntoMarkdown(topic.content_academic, {
          title: '## Table of Contents',
          minLevel: 2,
          maxLevel: 3,
          ordered: false
        });

        db.prepare(`
          UPDATE topics 
          SET content_academic = ?
          WHERE id = ?
        `).run(updatedContent, topicId);

        academicUpdated = true;
      }
    }

    // Add TOC to personal content if needed
    if (topic.content_personal && shouldAddToc(topic.content_personal)) {
      if (!topic.content_personal.includes('<!-- TOC -->')) {
        const updatedContent = insertTocIntoMarkdown(topic.content_personal, {
          title: '## Table of Contents',
          minLevel: 2,
          maxLevel: 3,
          ordered: false
        });

        db.prepare(`
          UPDATE topics 
          SET content_personal = ?
          WHERE id = ?
        `).run(updatedContent, topicId);

        personalUpdated = true;
      }
    }

    db.close();

    return NextResponse.json({
      success: true,
      academicUpdated,
      personalUpdated,
      message: academicUpdated || personalUpdated 
        ? 'Table of contents added successfully' 
        : 'Content not long enough or TOC already exists'
    });

  } catch (error) {
    console.error('Error adding table of contents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}