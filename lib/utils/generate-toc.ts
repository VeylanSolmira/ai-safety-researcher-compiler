/**
 * Utility functions for generating table of contents from markdown content
 */

import GithubSlugger from 'github-slugger';

export interface TocItem {
  level: number;
  text: string;
  slug: string;
  children?: TocItem[];
}

/**
 * Generate a slug from heading text (matching rehype-slug behavior)
 */
export function generateSlug(text: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(text);
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  const slugger = new GithubSlugger(); // Create single instance for all headings
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    headings.push({
      level,
      text,
      slug: slugger.slug(text) // Use the same slugger instance
    });
  }

  return headings;
}

/**
 * Build hierarchical TOC structure from flat heading list
 */
export function buildTocTree(headings: TocItem[]): TocItem[] {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  headings.forEach(heading => {
    const item = { ...heading, children: [] };

    // Find parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    // Add to parent or root
    if (stack.length === 0) {
      tree.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    stack.push(item);
  });

  return tree;
}

/**
 * Generate markdown for table of contents
 */
export function generateTocMarkdown(
  headings: TocItem[], 
  options: {
    title?: string;
    minLevel?: number;
    maxLevel?: number;
    ordered?: boolean;
    collapsible?: boolean;
  } = {}
): string {
  const {
    title = '## Table of Contents',
    minLevel = 2,
    maxLevel = 4,
    ordered = false,
    collapsible = false
  } = options;

  // Filter headings by level
  const filteredHeadings = headings.filter(
    h => h.level >= minLevel && h.level <= maxLevel
  );

  if (filteredHeadings.length === 0) {
    return '';
  }

  let toc = '';

  // Build the TOC items
  let tocItems = '';
  filteredHeadings.forEach((heading, index) => {
    const indent = '  '.repeat(heading.level - minLevel);
    const bullet = ordered ? `${index + 1}.` : '-';
    tocItems += `${indent}${bullet} [${heading.text}](#${heading.slug})\n`;
  });

  // Always use pure markdown for security
  // Add a nice separator and compact formatting
  if (collapsible) {
    // Use a visually distinct format that's still pure markdown
    toc = `---

📑 **Table of Contents**

${tocItems}
---`;
  } else {
    // Regular markdown TOC
    toc = title ? `${title}\n\n${tocItems}` : tocItems;
  }

  return toc;
}

/**
 * Insert TOC into markdown content
 * Inserts after first heading without visible markers
 */
export function insertTocIntoMarkdown(
  markdown: string,
  options: {
    title?: string;
    minLevel?: number;
    maxLevel?: number;
    ordered?: boolean;
    collapsible?: boolean;
  } = {}
): string {
  const headings = extractHeadings(markdown);
  const toc = generateTocMarkdown(headings, options);

  if (!toc) return markdown;

  // Check if TOC already exists by looking for the title or collapsible marker
  const tocTitle = options.title || '## Table of Contents';
  const tocTitleRegex = new RegExp(`^${tocTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm');
  const collapsibleRegex = /---\s*\n\s*📑\s*\*\*Table of Contents\*\*/;
  
  if (tocTitleRegex.test(markdown) || collapsibleRegex.test(markdown)) {
    // Find existing TOC and replace it
    let tocStart = -1;
    let tocEnd = -1;
    
    // Check for regular TOC
    const tocStartMatch = markdown.match(tocTitleRegex);
    if (tocStartMatch && tocStartMatch.index !== undefined) {
      tocStart = tocStartMatch.index;
      const afterTocStart = tocStartMatch.index + tocStartMatch[0].length;
      const restOfContent = markdown.slice(afterTocStart);
      const nextHeadingMatch = restOfContent.match(/^#{1,6}\s+/m);
      
      if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
        tocEnd = afterTocStart + nextHeadingMatch.index;
      } else {
        const contentResumeMatch = restOfContent.match(/\n\n+([^\n])/);
        if (contentResumeMatch && contentResumeMatch.index !== undefined) {
          tocEnd = afterTocStart + contentResumeMatch.index + 2;
        } else {
          tocEnd = markdown.length;
        }
      }
    } else {
      // Check for markdown-style TOC with separators
      const markdownTocMatch = markdown.match(/---\s*\n\s*📑\s*\*\*Table of Contents\*\*[\s\S]*?\n---/);
      if (markdownTocMatch && markdownTocMatch.index !== undefined) {
        tocStart = markdownTocMatch.index;
        tocEnd = markdownTocMatch.index + markdownTocMatch[0].length;
      }
    }
    
    if (tocStart !== -1 && tocEnd !== -1) {
      const beforeToc = markdown.slice(0, tocStart);
      const afterToc = markdown.slice(tocEnd);
      return `${beforeToc}${toc}\n${afterToc}`;
    }
  }

  // Insert after first heading if no TOC found
  const firstHeadingMatch = markdown.match(/^#\s+.+$/m);
  if (firstHeadingMatch && firstHeadingMatch.index !== undefined) {
    const insertPosition = firstHeadingMatch.index + firstHeadingMatch[0].length;
    return (
      markdown.slice(0, insertPosition) +
      `\n\n${toc}\n` +
      markdown.slice(insertPosition)
    );
  }

  // If no heading found, insert at beginning
  return `${toc}\n\n${markdown}`;
}

/**
 * Remove TOC markers from content
 */
export function removeTocMarkers(markdown: string): string {
  // Remove <!-- TOC --> markers
  return markdown.replace(/<!-- TOC -->\n?/g, '');
}

/**
 * Check if content needs a TOC based on length and heading count
 */
export function shouldAddToc(
  markdown: string,
  options: {
    minLength?: number;
    minHeadings?: number;
  } = {}
): boolean {
  const { minLength = 5000, minHeadings = 5 } = options;
  
  // Check if TOC already exists
  if (hasToc(markdown)) {
    return false;
  }
  
  if (markdown.length < minLength) return false;
  
  const headings = extractHeadings(markdown);
  const contentHeadings = headings.filter(h => h.level >= 2 && h.level <= 4);
  
  return contentHeadings.length >= minHeadings;
}

/**
 * Check if content already has a TOC
 */
export function hasToc(markdown: string): boolean {
  // Check for standard TOC title
  const tocTitleRegex = /^##\s+Table of Contents/mi;
  // Check for collapsible/styled TOC
  const styledTocRegex = /📑\s*\*\*Table of Contents\*\*/i;
  // Check for HTML details TOC
  const htmlTocRegex = /<details>[\s\S]*?Table of Contents[\s\S]*?<\/details>/i;
  
  return tocTitleRegex.test(markdown) || styledTocRegex.test(markdown) || htmlTocRegex.test(markdown);
}