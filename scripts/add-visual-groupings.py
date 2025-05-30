#!/usr/bin/env python3
import json

# Load the roadmap JSON
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'r') as f:
    roadmap = json.load(f)

# New sections to add
new_sections = [
    # Core Computer Science section
    {
        "id": "core-cs-section",
        "type": "section",
        "position": {"x": 60, "y": 520},
        "data": {
            "label": "",
            "parentId": "foundations-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 210,
        "height": 180
    },
    # Philosophy & Ethics section
    {
        "id": "philosophy-ethics-section",
        "type": "section",
        "position": {"x": 280, "y": 520},
        "data": {
            "label": "",
            "parentId": "foundations-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 160,
        "height": 70
    },
    # Philosophy & Ethics label
    {
        "id": "philosophy-ethics-label",
        "type": "label",
        "position": {"x": 300, "y": 530},
        "data": {
            "label": "Philosophy & Ethics",
            "parentId": "philosophy-ethics-section",
            "style": {
                "fontSize": 16,
                "fontWeight": 600
            }
        },
        "width": 140,
        "height": 25
    },
    # AI Safety Paradigms section
    {
        "id": "ai-safety-paradigms-section",
        "type": "section",
        "position": {"x": 600, "y": 520},
        "data": {
            "label": "",
            "parentId": "foundations-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 380,
        "height": 80
    },
    # AI Systems & Training section
    {
        "id": "ai-systems-section",
        "type": "section",
        "position": {"x": 600, "y": 620},
        "data": {
            "label": "",
            "parentId": "foundations-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 380,
        "height": 250
    },
    # Sources of AI Risk section
    {
        "id": "sources-ai-risk-section",
        "type": "section",
        "position": {"x": 60, "y": 980},
        "data": {
            "label": "",
            "parentId": "alignment-fundamentals-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 380,
        "height": 140
    },
    # AI Risk Areas section
    {
        "id": "ai-risk-areas-section",
        "type": "section",
        "position": {"x": 60, "y": 1140},
        "data": {
            "label": "",
            "parentId": "alignment-fundamentals-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 180,
        "height": 80
    },
    # Core Concepts section
    {
        "id": "core-concepts-section",
        "type": "section",
        "position": {"x": 490, "y": 880},
        "data": {
            "label": "",
            "parentId": "alignment-fundamentals-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 500,
        "height": 250
    },
    # Core Concepts label
    {
        "id": "core-concepts-label",
        "type": "label",
        "position": {"x": 510, "y": 890},
        "data": {
            "label": "Core Concepts",
            "parentId": "core-concepts-section",
            "style": {
                "fontSize": 16,
                "fontWeight": 600
            }
        },
        "width": 120,
        "height": 25
    },
    # Testing Contexts section
    {
        "id": "testing-contexts-section",
        "type": "section",
        "position": {"x": 60, "y": 1600},
        "data": {
            "label": "",
            "parentId": "technical-alignment-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 330,
        "height": 200
    },
    # Interpretability section
    {
        "id": "interpretability-section",
        "type": "section",
        "position": {"x": 60, "y": 1820},
        "data": {
            "label": "",
            "parentId": "technical-alignment-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 330,
        "height": 140
    },
    # Security & Attacks section
    {
        "id": "security-attacks-section",
        "type": "section",
        "position": {"x": 410, "y": 1480},
        "data": {
            "label": "",
            "parentId": "technical-alignment-topic",
            "style": {
                "backgroundColor": "#e5e7eb",
                "borderColor": "#9ca3af",
                "borderWidth": 2,
                "borderRadius": 8
            }
        },
        "width": 420,
        "height": 100
    },
    # Security & Attacks label
    {
        "id": "security-attacks-label",
        "type": "label",
        "position": {"x": 430, "y": 1490},
        "data": {
            "label": "Security & Attacks",
            "parentId": "security-attacks-section",
            "style": {
                "fontSize": 16,
                "fontWeight": 600
            }
        },
        "width": 150,
        "height": 25
    }
]

# Update node parentIds to match new sections
node_updates = {
    # Core CS nodes
    "docker-subtopic": {"parentId": "core-cs-section"},
    "distributed-systems-subtopic": {"parentId": "core-cs-section"},
    "version-control-subtopic": {"parentId": "core-cs-section"},
    
    # Philosophy & Ethics
    "ethics-subtopic": {"parentId": "philosophy-ethics-section", "position": {"x": 300, "y": 560}},
    
    # AI Safety Paradigms
    "control-subtopic": {"parentId": "ai-safety-paradigms-section"},
    "alignment-subtopic": {"parentId": "ai-safety-paradigms-section"},
    "value-learning-subtopic": {"parentId": "ai-safety-paradigms-section"},
    
    # AI Systems
    "types-ai-systems-subtopic": {"parentId": "ai-systems-section"},
    "llms-subtopic": {"parentId": "ai-systems-section"},
    "how-llms-trained-subtopic": {"parentId": "ai-systems-section"},
    "pretraining-subtopic": {"parentId": "ai-systems-section"},
    "fine-tuning-subtopic": {"parentId": "ai-systems-section"},
    
    # Sources of AI Risk
    "agency-subtopic": {"parentId": "sources-ai-risk-section"},
    "impenetrability-subtopic": {"parentId": "sources-ai-risk-section"},
    "situational-awareness-subtopic": {"parentId": "sources-ai-risk-section"},
    
    # AI Risk Areas
    "existential-risk-subtopic": {"parentId": "ai-risk-areas-section"},
    
    # Core Concepts
    "core-methodology-subtopic": {"parentId": "core-concepts-section", "position": {"x": 510, "y": 930}},
    "teacher-trainer-subtopic": {"parentId": "core-concepts-section", "position": {"x": 680, "y": 930}},
    "multi-agent-subtopic": {"parentId": "core-concepts-section", "position": {"x": 510, "y": 980}},
    "hallucinations-subtopic": {"parentId": "core-concepts-section", "position": {"x": 710, "y": 980}},
    "foundational-papers-subtopic": {"parentId": "core-concepts-section", "position": {"x": 510, "y": 1030}},
    "key-figures-subtopic": {"parentId": "core-concepts-section", "position": {"x": 680, "y": 1030}},
    
    # Security & Attacks
    "prompt-injection-subtopic": {"parentId": "security-attacks-section", "position": {"x": 430, "y": 1530}},
    "jailbreak-subtopic": {"parentId": "security-attacks-section", "position": {"x": 590, "y": 1530}},
    "data-poisoning-subtopic": {"parentId": "security-attacks-section", "position": {"x": 430, "y": 1570}},
    "computer-security-subtopic": {"parentId": "security-attacks-section", "position": {"x": 590, "y": 1570}}
}

# Add new sections to the nodes list
roadmap['nodes'].extend(new_sections)

# Update existing nodes
for node in roadmap['nodes']:
    node_id = node.get('id')
    if node_id in node_updates:
        updates = node_updates[node_id]
        if 'parentId' in updates:
            node['data']['parentId'] = updates['parentId']
        if 'position' in updates:
            node['position'] = updates['position']

# Save the updated roadmap
with open('/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'w') as f:
    json.dump(roadmap, f, indent=2)

print("Visual groupings added successfully!")