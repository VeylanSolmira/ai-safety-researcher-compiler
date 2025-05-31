#!/usr/bin/env python3
"""
Create personal version placeholders for all topic content files that don't have one.
"""

import os
import glob

def create_personal_versions():
    content_dir = "src/data/roadmaps/ai-safety-researcher/content"
    
    # Get all regular content files (not personal versions)
    regular_files = glob.glob(f"{content_dir}/*@*.md")
    regular_files = [f for f in regular_files if not f.endswith('.personal.md')]
    
    created_files = []
    existing_personal = []
    
    for regular_file in regular_files:
        # Extract the base name without .md
        base_name = regular_file.replace('.md', '')
        personal_file = f"{base_name}.personal.md"
        
        if os.path.exists(personal_file):
            existing_personal.append(personal_file)
            continue
            
        # Extract topic ID from filename
        filename = os.path.basename(regular_file)
        topic_id = filename.replace('.md', '')
        topic_name = topic_id.split('@')[0].replace('-', ' ').title()
        
        # Create personal version with placeholder content
        content = f"""# {topic_name} (Personal View)

<!-- This is the personal/informal version of {topic_id} -->

*[This personal version needs to be written. It should provide the same information as the academic version but in a more relatable, informal way with examples and analogies.]*

## Quick Overview

🎯 **What is this about?**
[Explain the topic in simple terms]

💭 **Why should you care?**
[Personal motivation and real-world relevance]

🔑 **Key Concepts**
[Main ideas explained simply]

## Learning Tips

[Add personal learning strategies, common pitfalls, and encouragement]

---

*Note: Switch to Academic mode for the formal treatment of this topic.*
"""
        
        with open(personal_file, 'w') as f:
            f.write(content)
        
        created_files.append(personal_file)
    
    # Print summary
    print(f"Content directory: {content_dir}")
    print(f"Total regular files: {len(regular_files)}")
    print(f"Existing personal versions: {len(existing_personal)}")
    print(f"Created personal versions: {len(created_files)}")
    
    if created_files:
        print("\nCreated personal versions for:")
        for f in sorted(created_files):
            print(f"  - {os.path.basename(f)}")

if __name__ == "__main__":
    create_personal_versions()