#!/usr/bin/env npx tsx

import { getDb } from '../lib/db';
import { topics } from '../lib/db/schema';
import fs from 'fs/promises';
import path from 'path';

async function createBackup() {
  const db = getDb();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', `content-backup-${timestamp}`);
  
  console.log('Creating content backup...');
  
  try {
    // Create backup directory
    await fs.mkdir(backupDir, { recursive: true });
    
    // Get all topics with content
    const allTopics = await db.select().from(topics);
    const topicsWithContent = allTopics.filter(t => t.contentAcademic || t.contentPersonal);
    
    console.log(`Found ${topicsWithContent.length} topics with content to backup`);
    
    // Create backup JSON
    const backup = {
      timestamp,
      topicsCount: topicsWithContent.length,
      topics: topicsWithContent.map(t => ({
        id: t.id,
        title: t.title,
        moduleId: t.moduleId,
        contentAcademic: t.contentAcademic,
        contentPersonal: t.contentPersonal,
        updatedAt: t.updatedAt
      }))
    };
    
    // Write backup file
    const backupFile = path.join(backupDir, 'content-backup.json');
    await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✓ Backup created at: ${backupFile}`);
    console.log(`✓ Backed up ${topicsWithContent.length} topics`);
    
    // Also create individual markdown files for easy reading
    for (const topic of topicsWithContent) {
      if (topic.contentAcademic) {
        const academicFile = path.join(backupDir, `${topic.id}-academic.md`);
        await fs.writeFile(academicFile, topic.contentAcademic);
      }
      if (topic.contentPersonal) {
        const personalFile = path.join(backupDir, `${topic.id}-personal.md`);
        await fs.writeFile(personalFile, topic.contentPersonal);
      }
    }
    
    console.log('✓ Individual markdown files created');
    
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

createBackup();