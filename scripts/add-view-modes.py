#!/usr/bin/env python3
import json

# Load the roadmap JSON
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'r') as f:
    roadmap = json.load(f)

# Example nodes to mark as opinionated/personal view only
# You can expand this list based on your preferences
opinionated_nodes = {
    # Example: marking "Disrupting AI Safety Research" as a personal view topic
    "disrupting-research-subtopic": {
        "mode": "personal",
        "isOpinionated": True
    },
    # Example: marking certain figures as having opinionated content
    "neel-nanda-subtopic": {
        "mode": "both",  # Shows in both modes
        "isOpinionated": True  # But styled as opinionated
    },
    "yoshua-bengio-subtopic": {
        "mode": "both",
        "isOpinionated": True
    }
}

# Add view mode data to specified nodes
for node in roadmap['nodes']:
    node_id = node['id']
    if node_id in opinionated_nodes:
        node['data']['viewMode'] = opinionated_nodes[node_id]['mode']
        node['data']['isOpinionated'] = opinionated_nodes[node_id]['isOpinionated']
        print(f"Updated {node_id}: mode={node['data']['viewMode']}, isOpinionated={node['data']['isOpinionated']}")
    else:
        # Default: neutral content shown in both modes
        if 'viewMode' not in node['data']:
            node['data']['viewMode'] = 'both'
            node['data']['isOpinionated'] = False

# Save the updated roadmap
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'w') as f:
    json.dump(roadmap, f, indent=2)

print(f"\nAdded view mode data to all nodes. {len(opinionated_nodes)} nodes marked as opinionated.")