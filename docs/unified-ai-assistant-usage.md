# Unified AI Assistant Usage Guide

The `UnifiedAIAssistant` component provides a flexible AI-powered interface that can operate in three modes:

## Modes

### 1. Chat Mode (`mode="chat"`)
Used for interactive conversations with the AI tutor.

```tsx
<UnifiedAIAssistant
  mode="chat"
  sectionId="alignment"
  paradigmId="the-race"
  showWarning={true}
/>
```

### 2. Analysis Mode (`mode="analysis"`)
Used for analyzing content with various tools (summarize, simplify, expand, critique, quiz).

```tsx
<UnifiedAIAssistant
  mode="analysis"
  content={markdownContent}
  sectionId="prerequisites"
/>
```

### 3. Both Mode (`mode="both"`)
Provides tabs to switch between chat and analysis modes.

```tsx
<UnifiedAIAssistant
  mode="both"
  content={markdownContent}
  sectionId="foundations"
  showWarning={false}
/>
```

## Props

- `content?: string` - Content to analyze (required for analysis mode)
- `sectionId?: string` - Section ID for default prompts (default: 'default')
- `paradigmId?: string` - Initial paradigm to use
- `mode?: 'chat' | 'analysis' | 'both'` - Display mode (default: 'both')
- `className?: string` - Additional CSS classes
- `showWarning?: boolean` - Show AI tutor warning (default: true)
- `initialMessage?: string` - Custom initial message for chat

## Features

### Paradigm Selection
- **Random Paradigm**: Selects a random paradigm from all 39 available
- **Choose Paradigm**: Two-level dropdown (Category → Paradigm)
- **Clear**: Remove current paradigm selection

### Tutor Modes
- **Teacher Mode**: Helpful and supportive
- **Adversary Mode**: Challenging and skeptical

### Analysis Tools
- **Summarize**: Create concise summaries
- **Simplify**: Explain in simpler terms
- **Expand**: Add more detail and examples
- **Critique**: Provide critical analysis
- **Generate Quiz**: Create quiz questions

## Example Integrations

### In a Topic Page
```tsx
// For journey topics with interactive learning
<UnifiedAIAssistant
  mode="chat"
  sectionId={topic.id}
  className="mt-8"
/>
```

### In a Content Viewer
```tsx
// For analyzing displayed content
<UnifiedAIAssistant
  mode="analysis"
  content={displayedContent}
  className="mt-4"
/>
```

### In a Learning Dashboard
```tsx
// For both chat and analysis capabilities
<UnifiedAIAssistant
  mode="both"
  content={currentTopicContent}
  sectionId={currentSection}
  initialMessage="Welcome! What would you like to explore today?"
/>
```

## Migration from Old Components

### From ClaudeAssistant
```tsx
// Old
<ClaudeAssistant content={content} />

// New
<UnifiedAIAssistant
  mode="analysis"
  content={content}
/>
```

### From InteractiveTransition AITeacher
```tsx
// Old
<AITeacher viewMode={viewMode} sectionId={sectionId} />

// New
<UnifiedAIAssistant
  mode="chat"
  sectionId={sectionId}
/>
```