# Content Linking Guide

This guide explains how to create links between topics when writing content for the AI Safety Research Compiler.

## Link Patterns

### 1. Linking Within the Same Module

When linking to another topic in the same module, use relative paths:

```markdown
[Introduction to AI Paradigms](../introduction-ai-paradigms)
[Creating New Paradigms](../creating-new-paradigms)
```

### 2. Linking Across Modules

When linking to topics in different modules, use the full journey path:

```markdown
[The Control Problem](/journey/foundation/understanding-risks/control-problem)
[AI Agency and Autonomy](/journey/foundation/understanding-risks/agency-in-ai)
[Mechanistic Interpretability](/journey/intermediate/interpretability-safety/mechanistic-interp)
```

The URL pattern is: `/journey/[tierId]/[moduleId]/[topicId]`

### 3. Connections Section Format

At the end of each topic, use this standardized format for the Connections section:

```markdown
## Connections

### Prerequisites
- **topic-id**: Brief description of why this is a prerequisite
- **another-topic-id**: What the reader should know from this topic

### Related Topics
- **related-topic-id**: How this connects to the current topic
- **another-related-id**: Why this is relevant

### Next Steps
- **next-topic-id**: Natural progression from this topic
- **advanced-topic-id**: Where to go for deeper understanding
```

Example:
```markdown
### Related Topics
- **control-problem**: Why agency makes control difficult
- **alignment-principles-deep**: Technical approaches to alignment
- **mesa-optimization**: Emergent agency in learned systems
```

## Topic ID Reference

Topic IDs are kebab-case versions of the topic name. Common patterns:

- `why-ai-safety` - Why AI Safety Matters
- `control-problem` - The Control Problem
- `agency-in-ai` - AI Agency and Autonomy
- `mechanistic-interp` - Mechanistic Interpretability Practice
- `ai-development-factions` - AI Development Factions & Paradigm Analysis

## Best Practices

1. **Use descriptive link text**: Instead of "click here", use the actual topic title or a descriptive phrase
   - ✅ Good: `[Learn about the control problem](../control-problem)`
   - ❌ Bad: `[Click here](../control-problem) to learn more`

2. **Provide context**: In the Connections section, always explain why topics are related
   - ✅ Good: `**mesa-optimization**: Emergent agency in learned systems`
   - ❌ Bad: `**mesa-optimization**`

3. **Check your links**: Ensure topic IDs match exactly (they're case-sensitive)

4. **Use relative paths when possible**: This makes content more portable
   - Within same module: `../topic-id`
   - Different module in same tier: `../../other-module-id/topic-id`
   - Different tier: Use full path `/journey/tier/module/topic`

5. **Link strategically**: Don't over-link. Focus on connections that truly enhance understanding

## Finding Topic IDs

To find the correct topic ID:

1. Check the database: 
   ```bash
   sqlite3 journey-dev.db "SELECT id, title FROM topics WHERE title LIKE '%keyword%';"
   ```

2. Browse the journey structure:
   ```bash
   sqlite3 journey-dev.db "SELECT t.id, t.title, m.title as module FROM topics t JOIN modules m ON t.module_id = m.id ORDER BY m.title, t.position;"
   ```

3. Look in the URL when viewing the topic in the app

## Module ID Reference

Common module IDs:
- `understanding-risks` - Understanding AI Risks
- `paradigms-mental-models` - Paradigms & Mental Models
- `interpretability-safety` - Interpretability & Safety Analysis
- `red-teaming-security` - Red Teaming & Security
- `alignment-theory` - Alignment Theory & Practice

## Tier ID Reference

- `foundation` - Foundation tier
- `intermediate` - Intermediate tier
- `advanced` - Advanced tier
- `expert` - Expert tier

## Examples in Context

### In a topic about AI agency:
```markdown
Understanding agency is crucial for AI safety because agency amplifies both 
capabilities and risks. As we explored in [The Control Problem](../control-problem), 
maintaining meaningful human control becomes increasingly difficult as AI systems 
develop greater autonomy.

For a deeper technical understanding of how agency might emerge unexpectedly, 
see [Mesa-Optimization](/journey/advanced/alignment-theory/mesa-optimization).
```

### In the Connections section:
```markdown
## Connections

### Prerequisites
- **ml-fundamentals**: Understanding how AI systems learn and operate
- **control-problem**: Core challenges in maintaining control over AI systems

### Related Topics
- **value-alignment**: Ensuring AI agents pursue appropriate goals
- **corrigibility**: Keeping AI systems modifiable as they become more capable
- **multi-agent-systems**: How multiple AI agents interact and coordinate

### Next Steps
- **advanced-agency**: Deeper exploration of autonomous AI systems
- **governance-frameworks**: Policy approaches to managing AI agency
```

## Troubleshooting

If a link isn't working:

1. Check the topic ID is correct (case-sensitive, uses hyphens not underscores)
2. Verify the module and tier IDs in the path
3. Ensure the topic exists in the database
4. Check for typos in the markdown link syntax

Remember: The journey structure is the source of truth. When in doubt, query the database to find the correct IDs and paths.