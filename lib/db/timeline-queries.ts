import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', '..', 'journey.db'));
db.pragma('foreign_keys = ON');

// Types
export interface TimeBlock {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  type: 'day' | 'week' | 'sprint' | 'phase' | 'month' | 'quarter' | 'custom';
  customType: string | null;
  position: number;
  collapsed: boolean;
  metadata: any;
  startDate: string | null;
  endDate: string | null;
  createdAt: number;
  updatedAt: number;
  children?: TimeBlock[];
  items?: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  blockId: string;
  type: 'task' | 'deadline' | 'milestone' | 'note';
  title: string;
  description: string | null;
  completed: boolean;
  relatedTopics: string[];
  url: string | null;
  reminder: any | null;
  date: string | null;
  position: number;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineTemplate {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  structure: any;
  isPublic: boolean;
  useCount: number;
  createdAt: number;
}

// Helper to build hierarchical structure
function buildHierarchy(blocks: any[], items: any[]): TimeBlock[] {
  const blockMap = new Map<string, TimeBlock>();
  const rootBlocks: TimeBlock[] = [];

  // First pass: create all blocks
  blocks.forEach(block => {
    blockMap.set(block.id, {
      ...block,
      metadata: block.metadata ? JSON.parse(block.metadata) : {},
      collapsed: Boolean(block.collapsed),
      startDate: block.start_date,
      endDate: block.end_date,
      children: [],
      items: []
    });
  });

  // Second pass: build hierarchy
  blocks.forEach(block => {
    const currentBlock = blockMap.get(block.id)!;
    if (block.parent_id) {
      const parent = blockMap.get(block.parent_id);
      if (parent) {
        parent.children!.push(currentBlock);
      }
    } else {
      rootBlocks.push(currentBlock);
    }
  });

  // Third pass: add items
  items.forEach(item => {
    const block = blockMap.get(item.block_id);
    if (block) {
      block.items!.push({
        ...item,
        relatedTopics: item.related_topics ? JSON.parse(item.related_topics) : [],
        reminder: item.reminder ? JSON.parse(item.reminder) : null,
        completed: Boolean(item.completed),
        date: item.date
      });
    }
  });

  // Sort children and items by position
  const sortByPosition = (a: any, b: any) => a.position - b.position;
  blockMap.forEach(block => {
    block.children!.sort(sortByPosition);
    block.items!.sort(sortByPosition);
  });

  return rootBlocks.sort(sortByPosition);
}

// Get all timeline blocks for a user
export function getTimelineBlocks(userId: string): TimeBlock[] {
  const blocks = db.prepare(`
    SELECT id, user_id, parent_id, name, type, custom_type, position, collapsed, metadata, start_date, end_date, created_at, updated_at
    FROM time_blocks
    WHERE user_id = ?
    ORDER BY position
  `).all(userId);

  const blockIds = blocks.map(b => b.id);
  const items = blockIds.length > 0 ? db.prepare(`
    SELECT id, block_id, type, title, description, completed, related_topics, url, reminder, date, position, created_at, updated_at
    FROM timeline_items
    WHERE block_id IN (${blockIds.map(() => '?').join(',')})
    ORDER BY position
  `).all(...blockIds) : [];

  return buildHierarchy(blocks, items);
}

// Create a new time block
export function createTimeBlock(data: {
  userId: string;
  parentId: string | null;
  name: string;
  type: string;
  customType: string | null;
  position: number;
  metadata: any;
  startDate?: string | null;
  endDate?: string | null;
}): string {
  const id = crypto.randomBytes(8).toString('hex');
  
  db.prepare(`
    INSERT INTO time_blocks (id, user_id, parent_id, name, type, custom_type, position, metadata, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.userId,
    data.parentId,
    data.name,
    data.type,
    data.customType,
    data.position,
    JSON.stringify(data.metadata),
    data.startDate || null,
    data.endDate || null
  );

  return id;
}

// Update a time block
export function updateTimeBlock(id: string, updates: Partial<TimeBlock>): void {
  const allowedFields = ['name', 'type', 'custom_type', 'position', 'collapsed', 'metadata', 'parent_id', 'start_date', 'end_date'];
  const updateClauses: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      updateClauses.push(`${dbKey} = ?`);
      values.push(
        dbKey === 'metadata' ? JSON.stringify(value) :
        dbKey === 'collapsed' ? (value ? 1 : 0) :
        value
      );
    }
  });

  if (updateClauses.length > 0) {
    values.push(id);
    db.prepare(`
      UPDATE time_blocks
      SET ${updateClauses.join(', ')}
      WHERE id = ?
    `).run(...values);
  }
}

// Delete a time block (cascades to children and items)
export function deleteTimeBlock(id: string): void {
  db.prepare('DELETE FROM time_blocks WHERE id = ?').run(id);
}

// Get timeline items for a block
export function getTimelineItems(blockId: string): TimelineItem[] {
  return db.prepare(`
    SELECT id, block_id, type, title, description, completed, related_topics, url, reminder, date, position, created_at, updated_at
    FROM timeline_items
    WHERE block_id = ?
    ORDER BY position
  `).all(blockId).map(item => ({
    ...item,
    relatedTopics: item.related_topics ? JSON.parse(item.related_topics) : [],
    reminder: item.reminder ? JSON.parse(item.reminder) : null,
    completed: Boolean(item.completed),
    date: item.date
  }));
}

// Create a timeline item
export function createTimelineItem(data: {
  blockId: string;
  type: string;
  title: string;
  description: string | null;
  relatedTopics: string[];
  url: string | null;
  reminder: any | null;
  date?: string | null;
  position: number;
}): string {
  const id = crypto.randomBytes(8).toString('hex');
  
  db.prepare(`
    INSERT INTO timeline_items (id, block_id, type, title, description, related_topics, url, reminder, date, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.blockId,
    data.type,
    data.title,
    data.description,
    JSON.stringify(data.relatedTopics),
    data.url,
    data.reminder ? JSON.stringify(data.reminder) : null,
    data.date || null,
    data.position
  );

  return id;
}

// Update a timeline item
export function updateTimelineItem(id: string, updates: Partial<TimelineItem>): void {
  const allowedFields = ['type', 'title', 'description', 'completed', 'related_topics', 'url', 'reminder', 'date', 'position'];
  const updateClauses: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      updateClauses.push(`${dbKey} = ?`);
      values.push(
        dbKey === 'related_topics' ? JSON.stringify(value) :
        dbKey === 'reminder' ? JSON.stringify(value) :
        dbKey === 'completed' ? (value ? 1 : 0) :
        value
      );
    }
  });

  if (updateClauses.length > 0) {
    values.push(id);
    db.prepare(`
      UPDATE timeline_items
      SET ${updateClauses.join(', ')}
      WHERE id = ?
    `).run(...values);
  }
}

// Delete a timeline item
export function deleteTimelineItem(id: string): void {
  db.prepare('DELETE FROM timeline_items WHERE id = ?').run(id);
}

// Get timeline templates
export function getTimelineTemplates(isPublic: boolean, userId?: string): TimelineTemplate[] {
  let query = 'SELECT * FROM timeline_templates WHERE 1=1';
  const params: any[] = [];

  if (isPublic) {
    query += ' AND is_public = 1';
  } else if (userId) {
    query += ' AND (is_public = 1 OR user_id = ?)';
    params.push(userId);
  }

  query += ' ORDER BY use_count DESC, created_at DESC';

  return db.prepare(query).all(...params).map(template => ({
    ...template,
    structure: JSON.parse(template.structure),
    isPublic: Boolean(template.is_public)
  }));
}

// Create a timeline template
export function createTimelineTemplate(data: {
  userId: string | null;
  name: string;
  description: string | null;
  structure: any;
  isPublic: boolean;
}): string {
  const id = crypto.randomBytes(8).toString('hex');
  
  db.prepare(`
    INSERT INTO timeline_templates (id, user_id, name, description, structure, is_public)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.userId,
    data.name,
    data.description,
    JSON.stringify(data.structure),
    data.isPublic ? 1 : 0
  );

  return id;
}

// Wrap existing blocks with a new parent block
export function wrapBlocks(data: {
  userId: string;
  blockIds: string[];
  parentName: string;
  parentType: string;
  parentCustomType?: string | null;
  parentStartDate?: string | null;
  parentEndDate?: string | null;
}): string {
  const parentId = crypto.randomBytes(8).toString('hex');
  
  // Get the blocks to be wrapped
  const blocks = db.prepare(`
    SELECT * FROM time_blocks 
    WHERE id IN (${data.blockIds.map(() => '?').join(',')})
    AND user_id = ?
  `).all(...data.blockIds, data.userId);
  
  if (blocks.length === 0) {
    throw new Error('No blocks found to wrap');
  }
  
  // Find the minimum position and parent_id of blocks being wrapped
  const minPosition = Math.min(...blocks.map(b => b.position));
  const currentParentId = blocks[0].parent_id;
  
  // Check all blocks have the same parent (siblings)
  if (!blocks.every(b => b.parent_id === currentParentId)) {
    throw new Error('Can only wrap blocks that are siblings');
  }
  
  // Create the new parent block
  db.prepare(`
    INSERT INTO time_blocks (id, user_id, parent_id, name, type, custom_type, position, metadata, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    parentId,
    data.userId,
    currentParentId,
    data.parentName,
    data.parentType,
    data.parentCustomType || null,
    minPosition,
    JSON.stringify({}),
    data.parentStartDate,
    data.parentEndDate
  );
  
  // Update the wrapped blocks to have the new parent
  db.prepare(`
    UPDATE time_blocks 
    SET parent_id = ?, position = position - ?
    WHERE id IN (${data.blockIds.map(() => '?').join(',')})
  `).run(parentId, minPosition, ...data.blockIds);
  
  // Shift positions of blocks after the wrapped ones
  db.prepare(`
    UPDATE time_blocks 
    SET position = position + 1
    WHERE user_id = ? 
    AND parent_id ${currentParentId ? '= ?' : 'IS NULL'}
    AND position > ?
  `).run(
    data.userId,
    ...(currentParentId ? [currentParentId] : []),
    minPosition
  );
  
  return parentId;
}

// Apply a template to create time blocks
export function applyTemplate(templateId: string, userId: string, parentId: string | null = null): TimeBlock[] {
  const template = db.prepare('SELECT * FROM timeline_templates WHERE id = ?').get(templateId);
  
  if (!template) {
    throw new Error('Template not found');
  }

  const structure = JSON.parse(template.structure);
  
  // Increment use count
  db.prepare('UPDATE timeline_templates SET use_count = use_count + 1 WHERE id = ?').run(templateId);

  // Recursively create blocks from template
  function createBlocksFromTemplate(templateBlock: any, parentId: string | null, position: number): TimeBlock {
    const blockId = createTimeBlock({
      userId,
      parentId,
      name: templateBlock.name,
      type: templateBlock.type,
      customType: templateBlock.customType || null,
      position,
      metadata: templateBlock.metadata || {}
    });

    // Create items if any
    if (templateBlock.items) {
      templateBlock.items.forEach((item: any, index: number) => {
        createTimelineItem({
          blockId,
          type: item.type,
          title: item.title,
          description: item.description || null,
          relatedTopics: item.relatedTopics || [],
          url: item.url || null,
          reminder: item.reminder || null,
          position: index
        });
      });
    }

    // Create children if any
    const children: TimeBlock[] = [];
    if (templateBlock.children) {
      templateBlock.children.forEach((child: any, index: number) => {
        children.push(createBlocksFromTemplate(child, blockId, index));
      });
    }

    return {
      id: blockId,
      userId,
      parentId,
      name: templateBlock.name,
      type: templateBlock.type,
      customType: templateBlock.customType || null,
      position,
      collapsed: false,
      metadata: templateBlock.metadata || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children,
      items: templateBlock.items || []
    };
  }

  const rootBlock = createBlocksFromTemplate(structure, parentId, 0);
  return [rootBlock];
}