#!/usr/bin/env python3
import json

# Load the roadmap JSON
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'r') as f:
    roadmap = json.load(f)

# Find the ethics-subtopic to get its position and replace it
ethics_node = None
ethics_index = None
for i, node in enumerate(roadmap['nodes']):
    if node['id'] == 'ethics-subtopic':
        ethics_node = node
        ethics_index = i
        break

if ethics_node:
    # Create new nodes based on the old ethics node position
    philosophy_label = {
        "id": "philosophy-label",
        "type": "label",
        "position": {"x": ethics_node['position']['x'], "y": ethics_node['position']['y']},
        "data": {
            "label": "Philosophy",
            "parentId": "foundations-topic",
            "style": {
                "fontSize": 16,
                "fontWeight": 600
            }
        },
        "width": 120,
        "height": 25
    }
    
    ethics_subtopic = {
        "id": "ethics-subtopic",
        "type": "subtopic",
        "position": {"x": ethics_node['position']['x'] + 10, "y": ethics_node['position']['y'] + 40},
        "data": {
            "label": "Ethics",
            "parentId": "philosophy-label",
            "style": {
                "fontSize": 14
            }
        },
        "width": 80,
        "height": 35
    }
    
    political_subtopic = {
        "id": "political-subtopic",
        "type": "subtopic",
        "position": {"x": ethics_node['position']['x'] + 10, "y": ethics_node['position']['y'] + 85},
        "data": {
            "label": "Political",
            "parentId": "philosophy-label",
            "style": {
                "fontSize": 14
            }
        },
        "width": 80,
        "height": 35
    }
    
    # Remove old ethics node
    roadmap['nodes'].pop(ethics_index)
    
    # Add new nodes
    roadmap['nodes'].extend([philosophy_label, ethics_subtopic, political_subtopic])
    
    print(f"Added Philosophy label at ({philosophy_label['position']['x']}, {philosophy_label['position']['y']})")
    print(f"Added Ethics subtopic at ({ethics_subtopic['position']['x']}, {ethics_subtopic['position']['y']})")
    print(f"Added Political subtopic at ({political_subtopic['position']['x']}, {political_subtopic['position']['y']})")
    
    # Save the updated roadmap
    with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'w') as f:
        json.dump(roadmap, f, indent=2)
    
    print("\nSuccessfully updated the roadmap!")
else:
    print("Could not find ethics-subtopic node!")