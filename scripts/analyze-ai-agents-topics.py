#!/usr/bin/env python3
"""
Analyze AI Agents roadmap topics for relevance to AI Safety Research.
Evaluates each topic's significance on a 0-10 scale based on safety relevance.
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Directory containing the AI agents content
CONTENT_DIR = "/Users/infinitespire/ai_dev/ai-safety-research-compiler/development-resources/roadmaps/ai-agents/content"

# AI Safety relevance keywords and phrases
SAFETY_KEYWORDS = {
    'critical': [
        'safety', 'red-team', 'guardrails', 'prompt-injection', 'jailbreak',
        'bias', 'toxicity', 'alignment', 'control', 'risk', 'security',
        'privacy', 'pii', 'data-privacy', 'human-in-the-loop', 'sandboxing',
        'permissioning', 'tool-invocation', 'agent-loop'
    ],
    'important': [
        'reasoning', 'observation', 'reflection', 'memory', 'planning',
        'monitoring', 'testing', 'evaluation', 'metrics', 'tracing',
        'logging', 'context', 'chain-of-thought', 'tree-of-thought',
        'dag-agents', 'planner-executor', 'episodic', 'semantic'
    ],
    'useful': [
        'api', 'function-calling', 'tool', 'integration', 'rag',
        'embeddings', 'vector', 'fine-tuning', 'prompt-engineering',
        'tokenization', 'context-windows', 'pricing', 'models'
    ]
}

def extract_topic_name(filename: str) -> str:
    """Extract the topic name from the filename (part before @)."""
    if '@' in filename:
        return filename.split('@')[0]
    return filename.replace('.md', '')

def read_markdown_file(filepath: Path) -> Dict[str, str]:
    """Read a markdown file and extract title and content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title (first # heading)
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else extract_topic_name(filepath.name)
        
        # Get first 500 characters of content for analysis
        preview = content[:500].replace('\n', ' ').strip()
        
        return {
            'title': title,
            'content': content,
            'preview': preview,
            'length': len(content)
        }
    except Exception as e:
        return {
            'title': extract_topic_name(filepath.name),
            'content': '',
            'preview': f'Error reading file: {str(e)}',
            'length': 0
        }

def calculate_significance(topic_name: str, file_data: Dict[str, str]) -> Tuple[float, List[str]]:
    """
    Calculate significance score (0-10) for AI safety researchers.
    Returns score and list of matched keywords/reasons.
    """
    score = 0
    matched_keywords = []
    
    # Combine topic name and content for analysis
    text_to_analyze = f"{topic_name} {file_data['title']} {file_data['preview']}".lower()
    
    # Check for critical safety keywords (high scores)
    for keyword in SAFETY_KEYWORDS['critical']:
        if keyword in text_to_analyze:
            score += 2.5
            matched_keywords.append(f"critical:{keyword}")
    
    # Check for important keywords (medium scores)
    for keyword in SAFETY_KEYWORDS['important']:
        if keyword in text_to_analyze:
            score += 1.5
            matched_keywords.append(f"important:{keyword}")
    
    # Check for useful keywords (lower scores)
    for keyword in SAFETY_KEYWORDS['useful']:
        if keyword in text_to_analyze:
            score += 0.5
            matched_keywords.append(f"useful:{keyword}")
    
    # Special case adjustments
    if 'prompt-injection' in topic_name or 'jailbreak' in topic_name:
        score = min(10, score + 3)
        matched_keywords.append("special:critical-vulnerability")
    
    if 'safety' in topic_name or 'red-team' in topic_name:
        score = min(10, score + 2)
        matched_keywords.append("special:direct-safety-topic")
    
    if 'human-in-the-loop' in topic_name:
        score = min(10, score + 2)
        matched_keywords.append("special:human-oversight")
    
    # Cap the score at 10
    score = min(10, score)
    
    return score, matched_keywords

def categorize_topic(score: float) -> str:
    """Categorize topic based on significance score."""
    if score >= 8:
        return "Critical"
    elif score >= 6:
        return "Important"
    elif score >= 4:
        return "Useful"
    else:
        return "Optional"

def analyze_topics() -> Dict[str, List[Dict]]:
    """Analyze all topics and return categorized results."""
    results = {
        'Critical': [],
        'Important': [],
        'Useful': [],
        'Optional': []
    }
    
    all_topics = []
    
    # Process each markdown file
    for filename in os.listdir(CONTENT_DIR):
        if not filename.endswith('.md'):
            continue
        
        filepath = Path(CONTENT_DIR) / filename
        topic_name = extract_topic_name(filename)
        file_data = read_markdown_file(filepath)
        
        # Calculate significance
        score, keywords = calculate_significance(topic_name, file_data)
        category = categorize_topic(score)
        
        topic_info = {
            'topic_name': topic_name,
            'filename': filename,
            'title': file_data['title'],
            'score': score,
            'category': category,
            'matched_keywords': keywords,
            'preview': file_data['preview'][:200] + '...' if len(file_data['preview']) > 200 else file_data['preview']
        }
        
        all_topics.append(topic_info)
        results[category].append(topic_info)
    
    # Sort each category by score (descending)
    for category in results:
        results[category].sort(key=lambda x: x['score'], reverse=True)
    
    return results, all_topics

def generate_report(results: Dict[str, List[Dict]], all_topics: List[Dict]) -> str:
    """Generate a formatted analysis report."""
    report = []
    report.append("# AI Agents Roadmap Topics - AI Safety Relevance Analysis")
    report.append(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"Total topics analyzed: {len(all_topics)}")
    report.append("\n## Summary by Category\n")
    
    # Category summaries
    for category in ['Critical', 'Important', 'Useful', 'Optional']:
        count = len(results[category])
        percentage = (count / len(all_topics)) * 100 if all_topics else 0
        report.append(f"- **{category}**: {count} topics ({percentage:.1f}%)")
    
    # Detailed sections
    report.append("\n---\n")
    
    for category in ['Critical', 'Important', 'Useful', 'Optional']:
        report.append(f"\n## {category} Topics ({len(results[category])} total)")
        
        if category == 'Critical':
            report.append("\n*These are core safety topics that every AI safety researcher should understand.*\n")
        elif category == 'Important':
            report.append("\n*Valuable topics for comprehensive understanding of AI agent safety.*\n")
        elif category == 'Useful':
            report.append("\n*Supporting knowledge that enhances safety research capabilities.*\n")
        else:
            report.append("\n*Tangentially related topics with limited direct safety relevance.*\n")
        
        for topic in results[category]:
            report.append(f"\n### {topic['title']}")
            report.append(f"- **Topic ID**: `{topic['topic_name']}`")
            report.append(f"- **Score**: {topic['score']:.1f}/10")
            report.append(f"- **Relevance**: {', '.join(topic['matched_keywords']) if topic['matched_keywords'] else 'General AI agents knowledge'}")
            report.append(f"- **Preview**: {topic['preview']}")
    
    # Top recommendations
    report.append("\n---\n\n## Top 15 Recommendations for AI Safety Researcher Curriculum\n")
    sorted_topics = sorted(all_topics, key=lambda x: x['score'], reverse=True)[:15]
    
    for i, topic in enumerate(sorted_topics, 1):
        report.append(f"{i}. **{topic['title']}** (Score: {topic['score']:.1f}) - {topic['category']}")
        report.append(f"   - Topic: `{topic['topic_name']}`")
        report.append(f"   - Key relevance: {', '.join(topic['matched_keywords'][:3]) if topic['matched_keywords'] else 'N/A'}")
    
    return '\n'.join(report)

def save_json_analysis(results: Dict[str, List[Dict]], all_topics: List[Dict], output_path: str):
    """Save the analysis results as JSON for programmatic use."""
    json_data = {
        'metadata': {
            'source': 'ai-agents-roadmap',
            'analyzed_date': datetime.now().isoformat(),
            'total_topics': len(all_topics),
            'content_directory': CONTENT_DIR
        },
        'categories': results,
        'all_topics_sorted': sorted(all_topics, key=lambda x: x['score'], reverse=True)
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)

def main():
    """Main analysis function."""
    print("Analyzing AI Agents roadmap topics for AI Safety relevance...")
    
    # Analyze topics
    results, all_topics = analyze_topics()
    
    # Generate and save report
    report = generate_report(results, all_topics)
    
    # Save outputs
    output_dir = Path("/Users/infinitespire/ai_dev/ai-safety-research-compiler/development-resources")
    output_dir.mkdir(exist_ok=True)
    
    # Save markdown report
    report_path = output_dir / "ai-agents-safety-analysis.md"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\nMarkdown report saved to: {report_path}")
    
    # Save JSON analysis
    json_path = output_dir / "ai-agents-safety-analysis.json"
    save_json_analysis(results, all_topics, json_path)
    print(f"JSON analysis saved to: {json_path}")
    
    # Print summary
    print("\n=== ANALYSIS SUMMARY ===")
    for category in ['Critical', 'Important', 'Useful', 'Optional']:
        print(f"{category}: {len(results[category])} topics")
    
    print(f"\nTotal topics analyzed: {len(all_topics)}")
    print("\nTop 5 most relevant topics for AI Safety:")
    sorted_topics = sorted(all_topics, key=lambda x: x['score'], reverse=True)[:5]
    for i, topic in enumerate(sorted_topics, 1):
        print(f"{i}. {topic['title']} (Score: {topic['score']:.1f})")

if __name__ == "__main__":
    main()