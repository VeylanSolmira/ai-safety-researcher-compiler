'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, MoreVertical, Calendar, Target, FileText, StickyNote, Check, Trash2, Edit2, Copy, Clock, CalendarDays } from 'lucide-react';
import { TimeBlock, TimelineItem } from '@/lib/db/timeline-queries';
import { formatDateRange, formatDuration, calculateDuration, suggestDates } from '@/lib/utils/timeline-dates';

interface DynamicTimelineProps {
  userId: string;
}

const blockTypeEmojis: Record<string, string> = {
  day: '📅',
  week: '📆',
  sprint: '🏃',
  phase: '🎯',
  month: '🗓️',
  quarter: '📊',
  custom: '🔧'
};

const itemTypeIcons = {
  task: <Check className="w-4 h-4" />,
  deadline: <Clock className="w-4 h-4 text-red-500" />,
  milestone: <Target className="w-4 h-4 text-green-500" />,
  note: <StickyNote className="w-4 h-4 text-yellow-500" />
};

export default function DynamicTimeline({ userId }: DynamicTimelineProps) {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchBlocks();
    fetchTemplates();
  }, [userId]);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`/api/timeline/blocks?userId=${userId}`);
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/timeline/templates?public=true');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createBlock = async (parentId: string | null, data: any) => {
    try {
      await fetch('/api/timeline/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          parentId,
          ...data,
          position: blocks.length
        })
      });
      fetchBlocks();
      setShowAddBlock(false);
    } catch (error) {
      console.error('Error creating block:', error);
    }
  };

  const updateBlock = async (id: string, updates: any) => {
    try {
      await fetch('/api/timeline/blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      fetchBlocks();
      setEditingBlock(null);
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm('Delete this block and all its contents?')) return;
    
    try {
      await fetch(`/api/timeline/blocks?id=${id}`, {
        method: 'DELETE'
      });
      fetchBlocks();
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      await fetch('/api/timeline/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, updates: { completed } })
      });
      fetchBlocks();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const applyTemplate = async (templateId: string) => {
    try {
      await fetch('/api/timeline/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          templateId,
          userId
        })
      });
      fetchBlocks();
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  const TimeBlockComponent: React.FC<{ block: TimeBlock; depth: number; siblings?: TimeBlock[] }> = ({ block, depth, siblings = [] }) => {
    const [collapsed, setCollapsed] = useState(block.collapsed);
    const [showActions, setShowActions] = useState(false);
    const [showAddChild, setShowAddChild] = useState(false);
    const [editingDates, setEditingDates] = useState(false);
    const [showWrapForm, setShowWrapForm] = useState(false);

    const hasChildren = block.children && block.children.length > 0;
    const hasItems = block.items && block.items.length > 0;
    const duration = calculateDuration(block.startDate, block.endDate);

    return (
      <div className={`${depth > 0 ? 'ml-6' : ''} mb-2`}>
        <div className="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          {/* Expand/Collapse */}
          {(hasChildren || hasItems) && (
            <button
              onClick={() => {
                setCollapsed(!collapsed);
                updateBlock(block.id, { collapsed: !collapsed });
              }}
              className="p-1"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          {!hasChildren && !hasItems && <div className="w-6" />}

          {/* Block Type Emoji */}
          <span className="text-lg">{blockTypeEmojis[block.type] || '📌'}</span>

          {/* Block Name */}
          {editingBlock === block.id ? (
            <input
              type="text"
              defaultValue={block.name}
              onBlur={(e) => updateBlock(block.id, { name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateBlock(block.id, { name: e.currentTarget.value });
                }
              }}
              className="flex-1 px-2 py-1 border rounded"
              autoFocus
            />
          ) : (
            <span className="flex-1 font-medium">{block.name}</span>
          )}

          {/* Date Range */}
          {(block.startDate || block.endDate) && !editingDates && (
            <button
              onClick={() => setEditingDates(true)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <CalendarDays className="w-4 h-4" />
              {formatDateRange(block.startDate, block.endDate)}
              {duration && <span className="text-gray-500">({formatDuration(duration)})</span>}
            </button>
          )}

          {/* Date Editor */}
          {editingDates && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                defaultValue={block.startDate || ''}
                onChange={(e) => updateBlock(block.id, { startDate: e.target.value || null })}
                className="px-2 py-1 text-sm border rounded"
              />
              <span>to</span>
              <input
                type="date"
                defaultValue={block.endDate || ''}
                onChange={(e) => updateBlock(block.id, { endDate: e.target.value || null })}
                className="px-2 py-1 text-sm border rounded"
              />
              <button
                onClick={() => setEditingDates(false)}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          )}

          {/* Add dates button if no dates */}
          {!block.startDate && !block.endDate && !editingDates && (
            <button
              onClick={() => setEditingDates(true)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              + Add dates
            </button>
          )}

          {/* Progress */}
          {hasItems && (
            <span className="text-sm text-gray-500">
              {block.items!.filter(i => i.completed).length}/{block.items!.length}
            </span>
          )}

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2 z-10 w-48">
                <button
                  onClick={() => {
                    setEditingBlock(block.id);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Edit2 className="w-4 h-4" /> Edit Name
                </button>
                <button
                  onClick={() => {
                    setEditingDates(true);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <CalendarDays className="w-4 h-4" /> Edit Dates
                </button>
                <button
                  onClick={() => {
                    setShowAddChild(true);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Plus className="w-4 h-4" /> Add Inside
                </button>
                <button
                  onClick={() => {
                    setShowWrapForm(true);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Copy className="w-4 h-4" /> Wrap with...
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-500"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        {!collapsed && hasItems && (
          <div className="ml-8 mt-2 space-y-1">
            {block.items!.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                {item.type === 'task' ? (
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => toggleItem(item.id, e.target.checked)}
                    className="w-4 h-4"
                  />
                ) : (
                  itemTypeIcons[item.type]
                )}
                <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-sm text-gray-500">
                    {item.date}
                  </span>
                )}
                {item.type === 'deadline' && item.reminder && (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Children */}
        {!collapsed && hasChildren && (
          <div className="mt-2">
            {block.children!.map((child) => (
              <TimeBlockComponent key={child.id} block={child} depth={depth + 1} siblings={block.children || []} />
            ))}
          </div>
        )}

        {/* Add Child Form */}
        {showAddChild && (
          <AddBlockForm
            onSubmit={(data) => createBlock(block.id, data)}
            onCancel={() => setShowAddChild(false)}
            depth={depth + 1}
            parentBlock={block}
          />
        )}

        {/* Wrap Form */}
        {showWrapForm && (
          <WrapBlockForm
            block={block}
            siblings={siblings}
            onSubmit={async (data) => {
              try {
                await fetch('/api/timeline/blocks/wrap', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId,
                    ...data
                  })
                });
                fetchBlocks();
                setShowWrapForm(false);
              } catch (error) {
                console.error('Error wrapping blocks:', error);
              }
            }}
            onCancel={() => setShowWrapForm(false)}
            depth={depth}
          />
        )}
      </div>
    );
  };

  const AddBlockForm: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
    depth?: number;
    parentBlock?: TimeBlock;
  }> = ({ onSubmit, onCancel, depth = 0, parentBlock }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('week');
    const [customType, setCustomType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [autoSuggestDates, setAutoSuggestDates] = useState(true);

    // Auto-suggest dates based on type
    useEffect(() => {
      if (autoSuggestDates && type !== 'custom') {
        const suggested = suggestDates(type, parentBlock?.startDate);
        if (suggested) {
          setStartDate(suggested.startDate);
          setEndDate(suggested.endDate);
        }
      }
    }, [type, autoSuggestDates, parentBlock]);

    return (
      <div className={`${depth > 0 ? 'ml-6' : ''} mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg`}>
        <h3 className="font-medium mb-3">Add Time Block</h3>
        <input
          type="text"
          placeholder="Name (e.g., 'MATS Application Sprint')"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          autoFocus
        />
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Object.entries(blockTypeEmojis).map(([key, emoji]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`p-2 rounded ${type === key ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
            >
              {emoji} {key}
            </button>
          ))}
        </div>
        
        {type === 'custom' && (
          <input
            type="text"
            placeholder="Custom type name"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
          />
        )}

        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <input
              type="checkbox"
              checked={autoSuggestDates}
              onChange={(e) => setAutoSuggestDates(e.target.checked)}
              className="w-4 h-4"
            />
            Auto-suggest dates based on type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (name) {
                onSubmit({ 
                  name, 
                  type, 
                  customType,
                  startDate: startDate || null,
                  endDate: endDate || null
                });
                setName('');
                setType('week');
                setCustomType('');
                setStartDate('');
                setEndDate('');
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const WrapBlockForm: React.FC<{
    block: TimeBlock;
    siblings: TimeBlock[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
    depth?: number;
  }> = ({ block, siblings, onSubmit, onCancel, depth = 0 }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('week');
    const [customType, setCustomType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([block.id]);
    const [autoCalculateDates, setAutoCalculateDates] = useState(true);

    // Get siblings at the same level
    const availableSiblings = siblings.filter(s => s.id !== block.id);

    // Auto-calculate dates based on selected blocks and type
    useEffect(() => {
      if (autoCalculateDates && selectedBlockIds.length > 0) {
        const selectedBlocks = [block, ...availableSiblings.filter(s => selectedBlockIds.includes(s.id))];
        const dates = selectedBlocks
          .flatMap(b => [b.startDate, b.endDate])
          .filter(d => d !== null) as string[];
        
        if (dates.length > 0) {
          dates.sort();
          const minDate = dates[0];
          const maxDate = dates[dates.length - 1];
          
          // If wrapping with a specific type, expand to match that type's typical duration
          if (type !== 'custom') {
            const suggested = suggestDates(type, minDate);
            if (suggested) {
              // Use the suggested start date or the min date, whichever is earlier
              const suggestedStart = suggested.startDate < minDate ? suggested.startDate : minDate;
              // Use the suggested end date or the max date, whichever is later
              const suggestedEnd = suggested.endDate > maxDate ? suggested.endDate : maxDate;
              setStartDate(suggestedStart);
              setEndDate(suggestedEnd);
            } else {
              setStartDate(minDate);
              setEndDate(maxDate);
            }
          } else {
            setStartDate(minDate);
            setEndDate(maxDate);
          }
        }
      }
    }, [selectedBlockIds, autoCalculateDates, type, block, availableSiblings]);

    return (
      <div className={`${depth > 0 ? 'ml-6' : ''} mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800`}>
        <h3 className="font-medium mb-3">Wrap with Parent Block</h3>
        
        <input
          type="text"
          placeholder="Parent name (e.g., 'Week 1' or 'Research Phase')"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          autoFocus
        />
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Object.entries(blockTypeEmojis).map(([key, emoji]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`p-2 rounded ${type === key ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
            >
              {emoji} {key}
            </button>
          ))}
        </div>
        
        {type === 'custom' && (
          <input
            type="text"
            placeholder="Custom type name"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
          />
        )}

        {/* Sibling selection */}
        {availableSiblings.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Include neighboring blocks:</label>
            <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
              {availableSiblings.map(sibling => (
                <label key={sibling.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBlockIds.includes(sibling.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBlockIds([...selectedBlockIds, sibling.id]);
                      } else {
                        setSelectedBlockIds(selectedBlockIds.filter(id => id !== sibling.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    {sibling.name}
                    {sibling.startDate && ` (${sibling.startDate})`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <input
              type="checkbox"
              checked={autoCalculateDates}
              onChange={(e) => setAutoCalculateDates(e.target.checked)}
              className="w-4 h-4"
            />
            Auto-calculate dates to encompass selected blocks
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (name) {
                onSubmit({ 
                  blockIds: selectedBlockIds,
                  parentName: name,
                  parentType: type,
                  parentCustomType: customType || null,
                  parentStartDate: startDate || null,
                  parentEndDate: endDate || null
                });
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Parent
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading timeline...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Learning Timeline</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddBlock(!showAddBlock)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" /> Add Time Block
          </button>
          <button
            onClick={() => setSelectedTemplate(selectedTemplate ? null : 'show')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Copy className="w-5 h-5" /> Use Template
          </button>
        </div>
      </div>

      {/* Template Selection */}
      {selectedTemplate === 'show' && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-3">Choose a Template</h3>
          <div className="grid gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className="text-left p-3 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="font-medium">{template.name}</div>
                {template.description && (
                  <div className="text-sm text-gray-500">{template.description}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">Used {template.useCount} times</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Block Form */}
      {showAddBlock && (
        <AddBlockForm
          onSubmit={(data) => createBlock(null, data)}
          onCancel={() => setShowAddBlock(false)}
        />
      )}

      {/* Timeline Blocks */}
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No timeline blocks yet.</p>
            <p className="text-sm mt-2">Start by adding a time block or using a template.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <TimeBlockComponent key={block.id} block={block} depth={0} siblings={blocks} />
          ))
        )}
      </div>
    </div>
  );
}