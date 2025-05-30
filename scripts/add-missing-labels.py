#!/usr/bin/env python3
import json

# Load the roadmap JSON
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'r') as f:
    roadmap = json.load(f)

# Define the missing labels and their children
missing_sections = [
    {
        "label": "Core Concepts",
        "parent": "alignment-fundamentals-topic",
        "children": ["core-methodology-subtopic", "teacher-trainer-subtopic", "multi-agent-subtopic", 
                    "hallucinations-subtopic", "foundational-papers-subtopic", "key-figures-subtopic"],
        "position": {"x": 510, "y": 890}  # Position in the right area of alignment fundamentals
    },
    {
        "label": "Security & Attacks", 
        "parent": "technical-alignment-topic",
        "children": ["prompt-injection-subtopic", "jailbreak-subtopic", 
                    "data-poisoning-subtopic", "computer-security-subtopic"],
        "position": {"x": 430, "y": 1760}  # Below interpretability techniques
    },
    {
        "label": "Research Methods",
        "parent": "advanced-research-topic",
        "children": ["red-teaming-subtopic", "ai-agents-subtopic", 
                    "disrupting-research-subtopic", "collaboration-subtopic"],
        "position": {"x": 170, "y": 2100}  # In advanced section
    }
]

# Add new label nodes and update children
for section in missing_sections:
    # Create the label node
    label_id = section["label"].lower().replace(" ", "-") + "-label"
    label_node = {
        "id": label_id,
        "type": "label",
        "position": section["position"],
        "data": {
            "label": section["label"],
            "parentId": section["parent"],
            "style": {
                "fontSize": 16,
                "fontWeight": 600
            }
        },
        "width": 140 if section["label"] == "Core Concepts" else 160,
        "height": 25
    }
    
    # Add the label node
    roadmap['nodes'].append(label_node)
    print(f"Added label: {section['label']} at position ({section['position']['x']}, {section['position']['y']})")
    
    # Update children to point to the new label
    for child_id in section["children"]:
        for node in roadmap['nodes']:
            if node['id'] == child_id:
                old_parent = node['data']['parentId']
                node['data']['parentId'] = label_id
                print(f"  Updated {child_id}: parent changed from {old_parent} to {label_id}")
                
                # Adjust positions for better grouping if needed
                if section["label"] == "Core Concepts":
                    # These are already well positioned
                    pass
                elif section["label"] == "Security & Attacks":
                    # Move these nodes down to be under the new label
                    node['position']['y'] = section["position"]["y"] + 40
                elif section["label"] == "Research Methods":
                    # Adjust Y position to be under the label in the advanced section
                    node['position']['y'] = section["position"]["y"] + 40

# Save the updated roadmap
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'w') as f:
    json.dump(roadmap, f, indent=2)

print("\nSuccessfully added all missing label nodes!")