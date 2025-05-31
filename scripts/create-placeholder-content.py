#!/usr/bin/env python3
"""
Create placeholder markdown files for all topics without content.
"""

import os
import json

# Map of node IDs to human-readable titles
NODE_TITLES = {
    # Core Computer Science
    "docker-subtopic": "Docker & Containerization",
    "distributed-systems-subtopic": "Distributed Systems",
    "version-control-subtopic": "Version Control",
    
    # AI Safety Paradigms
    "control-subtopic": "Control",
    "alignment-subtopic": "Alignment", 
    "value-learning-subtopic": "Value Learning",
    
    # AI Systems & Training
    "types-ai-systems-subtopic": "Types of AI Systems",
    "llms-subtopic": "Large Language Models (LLMs)",
    "how-llms-trained-subtopic": "How LLMs are Trained",
    "pretraining-subtopic": "Pretraining",
    "fine-tuning-subtopic": "Fine-tuning",
    
    # Philosophy & Ethics
    "ethics-subtopic": "Ethics & Philosophy",
    "political-subtopic": "Political Philosophy",
    
    # Sources of AI Risk
    "agency-subtopic": "Agency",
    "impenetrability-subtopic": "Impenetrability",
    "situational-awareness-subtopic": "Situational Awareness",
    
    # AI Risk Areas
    "existential-risk-subtopic": "Existential Risk",
    
    # Core Concepts
    "core-methodology-subtopic": "Core Methodology",
    "teacher-trainer-subtopic": "Teacher vs. Trainer",
    "multi-agent-subtopic": "Multi-Agent Environments",
    "hallucinations-subtopic": "Hallucinations",
    
    # Testing Contexts
    "white-box-subtopic": "White Box Testing",
    "black-box-subtopic": "Black Box Testing",
    "grey-box-subtopic": "Grey Box Testing",
    
    # Interpretability Techniques
    "explainability-subtopic": "Explainability",
    "interpretability-subtopic": "Interpretability",
    "transparency-subtopic": "Transparency",
    
    # Security & Attacks
    "prompt-injection-subtopic": "Prompt Injection",
    "jailbreak-subtopic": "Jailbreak Techniques",
    "data-poisoning-subtopic": "Data Poisoning",
    "computer-security-subtopic": "Computer Security",
    
    # Policy Frameworks
    "national-ai-strategies-subtopic": "National AI Strategies",
    "international-coordination-subtopic": "International Coordination",
    "regulatory-approaches-subtopic": "Regulatory Approaches",
    
    # Institutional Design
    "safety-oversight-bodies-subtopic": "Safety Oversight Bodies",
    "assessment-frameworks-subtopic": "Assessment Frameworks",
    "enforcement-mechanisms-subtopic": "Enforcement Mechanisms",
    
    # Strategic Interventions
    "risk-assessment-methodologies-subtopic": "Risk Assessment Methodologies",
    "timeline-considerations-subtopic": "Timeline Considerations",
    "resource-allocation-subtopic": "Resource Allocation",
    
    # Compute Governance
    "training-run-monitoring-subtopic": "Training Run Monitoring",
    "hardware-controls-subtopic": "Hardware Controls",
    "resource-tracking-subtopic": "Resource Tracking",
    
    # Model Evaluations
    "safety-benchmarks-subtopic": "Safety Benchmarks",
    "capability-assessments-subtopic": "Capability Assessments",
    "red-teaming-protocols-subtopic": "Red Teaming Protocols",
    
    # Institutional Mechanisms
    "api-access-controls-subtopic": "API Access Controls",
    "deployment-gates-subtopic": "Deployment Gates",
    "safety-capability-balance-subtopic": "Safety-Capability Balance",
    
    # Organizations
    "constellation-subtopic": "Constellation",
    "far-subtopic": "FAR (Fund for Alignment Research)",
    
    # Research Methods
    "red-teaming-subtopic": "Red Teaming",
    "ai-agents-subtopic": "AI Agents",
    "collaboration-subtopic": "Collaboration",
    
    # Key Figures (additional)
    "yoshua-bengio-subtopic": "Yoshua Bengio",
}

def create_placeholder_content(node_id, title):
    """Create placeholder content for a topic."""
    content = f"""# {title}

This topic is part of the AI Safety Research curriculum.

## Overview

Content for this topic is coming soon. This will cover essential concepts and practical applications related to {title.lower()} in the context of AI safety research.

## What You'll Learn

- Core concepts and terminology
- Practical applications in AI safety
- Current research directions
- Hands-on exercises and examples

## Prerequisites

Check the roadmap for recommended prerequisites for this topic.

## Resources

Resources and detailed content will be added soon. In the meantime, you can:

- Explore related topics in the curriculum
- Join the discussion in the community
- Contribute your own knowledge and resources

---

*Note: This is a placeholder page. Comprehensive content is under development.*"""
    
    return content

def main():
    # Path to content directory
    content_dir = "/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/content"
    
    # Get existing files
    existing_files = set(os.listdir(content_dir))
    
    # Process each node
    created_count = 0
    skipped_count = 0
    
    for node_id, title in NODE_TITLES.items():
        # Skip disrupting-research since it has personal content
        if node_id == "disrupting-research-subtopic":
            continue
            
        # Construct filename
        base_name = node_id.replace("-subtopic", "")
        filename = f"{base_name}@{node_id}.md"
        
        # Check if file already exists
        if filename in existing_files:
            print(f"✓ Skipping {filename} - already exists")
            skipped_count += 1
            continue
        
        # Check if any version exists (including personal)
        exists = any(f.startswith(f"{base_name}@") for f in existing_files)
        if exists:
            print(f"✓ Skipping {filename} - version already exists")
            skipped_count += 1
            continue
        
        # Create the file
        filepath = os.path.join(content_dir, filename)
        content = create_placeholder_content(node_id, title)
        
        with open(filepath, 'w') as f:
            f.write(content)
        
        print(f"✅ Created {filename}")
        created_count += 1
    
    print(f"\nSummary:")
    print(f"  Created: {created_count} files")
    print(f"  Skipped: {skipped_count} files (already exist)")
    print(f"  Total nodes: {len(NODE_TITLES)}")

if __name__ == "__main__":
    main()