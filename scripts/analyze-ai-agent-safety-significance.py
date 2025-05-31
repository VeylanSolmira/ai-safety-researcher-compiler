#!/usr/bin/env python3
"""
Analyzes markdown files in the AI agents directory to estimate their significance
to AI safety research on a scale of 0-10.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
import csv

# Define keywords and patterns relevant to AI safety
SAFETY_KEYWORDS = {
    # Core safety concepts
    'alignment': 3,
    'control': 2,
    'safety': 3,
    'risk': 2,
    'harm': 2,
    'dangerous': 2,
    'threat': 2,
    'vulnerability': 2,
    'security': 2,
    
    # Technical safety terms
    'red team': 3,
    'adversarial': 3,
    'robustness': 2,
    'interpretability': 2,
    'explainability': 2,
    'transparency': 2,
    'guardrail': 3,
    'filter': 2,
    'monitoring': 2,
    'audit': 2,
    
    # Specific safety issues
    'jailbreak': 3,
    'prompt injection': 3,
    'bias': 2,
    'toxicity': 2,
    'hallucination': 2,
    'manipulation': 2,
    'deception': 2,
    'misuse': 2,
    'privacy': 2,
    'fairness': 2,
    
    # Governance and policy
    'regulation': 2,
    'policy': 1,
    'ethics': 2,
    'responsible': 2,
    'governance': 2,
    'oversight': 2,
    'compliance': 1,
    
    # Human oversight
    'human-in-the-loop': 3,
    'human oversight': 3,
    'human review': 2,
    'supervision': 2,
}

# Negative indicators (reduce score)
NEGATIVE_KEYWORDS = {
    'game': -1,
    'entertainment': -1,
    'marketing': -1,
    'sales': -1,
}

def extract_file_info(filepath: Path) -> Dict:
    """Extract filename, title, content, and links from a markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title (first # heading)
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else 'No Title'
    
    # Extract links
    link_pattern = r'\[@[^]]+\]\(([^)]+)\)'
    links = re.findall(link_pattern, content)
    
    # Extract filename without extension and ID
    filename = filepath.stem
    if '@' in filename:
        filename = filename.split('@')[0]
    
    return {
        'filename': filename,
        'title': title,
        'content': content,
        'links': links,
        'filepath': str(filepath)
    }

def calculate_safety_significance(info: Dict) -> Tuple[float, Dict]:
    """Calculate safety significance score (0-10) based on content analysis."""
    content_lower = info['content'].lower()
    title_lower = info['title'].lower()
    
    # Initialize scoring components
    keyword_score = 0
    title_bonus = 0
    link_bonus = 0
    content_depth_score = 0
    
    # Count safety keywords in content
    keyword_counts = {}
    for keyword, weight in SAFETY_KEYWORDS.items():
        count = content_lower.count(keyword.lower())
        if count > 0:
            keyword_counts[keyword] = count
            # Diminishing returns for multiple occurrences
            keyword_score += weight * (1 + min(count - 1, 3) * 0.3)
    
    # Apply negative keywords
    for keyword, weight in NEGATIVE_KEYWORDS.items():
        count = content_lower.count(keyword.lower())
        if count > 0:
            keyword_score += weight * count
    
    # Check title for safety relevance
    for keyword, weight in SAFETY_KEYWORDS.items():
        if keyword.lower() in title_lower:
            title_bonus += weight * 1.5  # Title keywords are more significant
    
    # Analyze links for safety-related resources
    safety_link_keywords = ['safety', 'security', 'red', 'team', 'alignment', 'risk', 'ethics']
    for link in info['links']:
        link_lower = link.lower()
        for keyword in safety_link_keywords:
            if keyword in link_lower:
                link_bonus += 0.5
                break
    
    # Content depth score based on length and structure
    content_length = len(info['content'])
    if content_length > 1000:
        content_depth_score += 1
    if content_length > 2000:
        content_depth_score += 0.5
    
    # Check for structured sections (multiple headings)
    heading_count = len(re.findall(r'^#+\s', info['content'], re.MULTILINE))
    if heading_count > 3:
        content_depth_score += 0.5
    
    # Calculate final score
    raw_score = keyword_score + title_bonus + link_bonus + content_depth_score
    
    # Normalize to 0-10 scale
    # Maximum reasonable raw score is around 30-40
    normalized_score = min(10, max(0, raw_score / 4))
    
    # Special cases for obviously safety-critical topics
    if 'red team' in title_lower or 'safety' in title_lower:
        normalized_score = max(normalized_score, 7)
    if 'prompt injection' in title_lower or 'jailbreak' in title_lower:
        normalized_score = max(normalized_score, 6)
    
    details = {
        'keyword_score': round(keyword_score, 2),
        'title_bonus': round(title_bonus, 2),
        'link_bonus': round(link_bonus, 2),
        'content_depth_score': round(content_depth_score, 2),
        'keyword_counts': keyword_counts,
        'safety_related_links': len([l for l in info['links'] if any(k in l.lower() for k in safety_link_keywords)])
    }
    
    return round(normalized_score, 1), details

def main():
    # Directory containing the markdown files
    content_dir = Path('/Users/infinitespire/ai_dev/ai-safety-research-compiler/development-resources/roadmaps/ai-agents/content')
    
    if not content_dir.exists():
        print(f"Error: Directory {content_dir} does not exist")
        return
    
    # Process all markdown files
    results = []
    
    for filepath in sorted(content_dir.glob('*.md')):
        print(f"Processing: {filepath.name}")
        
        try:
            # Extract file information
            info = extract_file_info(filepath)
            
            # Calculate significance score
            score, details = calculate_safety_significance(info)
            
            # Compile results
            result = {
                'filename': info['filename'],
                'title': info['title'],
                'significance_score': score,
                'word_count': len(info['content'].split()),
                'link_count': len(info['links']),
                'safety_link_count': details['safety_related_links'],
                'top_keywords': ', '.join(f"{k}({v})" for k, v in sorted(details['keyword_counts'].items(), key=lambda x: x[1], reverse=True)[:5]),
                'scoring_details': details,
                'filepath': info['filepath']
            }
            
            results.append(result)
            
        except Exception as e:
            print(f"Error processing {filepath.name}: {e}")
    
    # Sort by significance score
    results.sort(key=lambda x: x['significance_score'], reverse=True)
    
    # Save results to JSON
    output_json = Path('/Users/infinitespire/ai_dev/ai-safety-research-compiler/development-resources/ai-agent-safety-analysis.json')
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    # Save summary to CSV
    output_csv = Path('/Users/infinitespire/ai_dev/ai-safety-research-compiler/development-resources/ai-agent-safety-summary.csv')
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['filename', 'title', 'significance_score', 'word_count', 
                     'link_count', 'safety_link_count', 'top_keywords']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for result in results:
            row = {k: result[k] for k in fieldnames}
            writer.writerow(row)
    
    # Print summary statistics
    print("\n" + "="*60)
    print("ANALYSIS COMPLETE")
    print("="*60)
    print(f"Total files analyzed: {len(results)}")
    print(f"Files with high significance (≥7): {len([r for r in results if r['significance_score'] >= 7])}")
    print(f"Files with medium significance (4-6.9): {len([r for r in results if 4 <= r['significance_score'] < 7])}")
    print(f"Files with low significance (<4): {len([r for r in results if r['significance_score'] < 4])}")
    print(f"\nResults saved to:")
    print(f"  - JSON: {output_json}")
    print(f"  - CSV: {output_csv}")
    
    # Print top 10 most significant files
    print("\nTop 10 Most Significant Files for AI Safety:")
    print("-" * 60)
    for i, result in enumerate(results[:10], 1):
        print(f"{i}. {result['title']} (Score: {result['significance_score']})")
        print(f"   File: {result['filename']}")
        print(f"   Keywords: {result['top_keywords']}")
        print()

if __name__ == "__main__":
    main()