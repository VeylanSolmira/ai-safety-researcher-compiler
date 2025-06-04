#!/usr/bin/env tsx

import { extractHeadings, generateTocMarkdown } from '../lib/utils/generate-toc';

// Test content with various heading types
const testContent = `
# Main Title

## Introduction

Some content here.

## Key Concepts

### Concept 1: Basic Ideas

More content.

### Concept 2: Advanced Topics

Even more content.

## Conclusion

Final thoughts.
`;

console.log('Testing TOC generation...\n');

const headings = extractHeadings(testContent);
console.log('Extracted headings:');
headings.forEach(h => {
  console.log(`  Level ${h.level}: "${h.text}" → #${h.slug}`);
});

console.log('\nGenerated TOC:');
const toc = generateTocMarkdown(headings, {
  title: '## Table of Contents',
  minLevel: 2,
  maxLevel: 3
});
console.log(toc);

// Test with duplicate headings
const dupContent = `
## Introduction
## Introduction
### Introduction
`;

console.log('\n\nTesting duplicate headings:');
const dupHeadings = extractHeadings(dupContent);
dupHeadings.forEach(h => {
  console.log(`  Level ${h.level}: "${h.text}" → #${h.slug}`);
});