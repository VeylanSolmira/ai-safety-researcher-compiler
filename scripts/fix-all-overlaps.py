#!/usr/bin/env python3
import json

# Load the roadmap
with open('src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'r') as f:
    data = json.load(f)

# Major reorganization to fix all overlaps
updates = {
    # Move philosophy section outside of foundations-section-left
    'philosophy-label': {'x': 380, 'y': 500},
    'ethics-subtopic': {'x': 380, 'y': 540},
    'political-subtopic': {'x': 380, 'y': 580},
    
    # AI Governance - spread out the sections
    'ai-governance-section': {'x': 450, 'y': 1580},
    'policy-frameworks-label': {'x': 470, 'y': 1600},
    'national-ai-strategies-subtopic': {'x': 470, 'y': 1640},
    'international-coordination-subtopic': {'x': 650, 'y': 1640},
    'regulatory-approaches-subtopic': {'x': 470, 'y': 1690},
    
    'institutional-design-label': {'x': 470, 'y': 1750},
    'safety-oversight-bodies-subtopic': {'x': 470, 'y': 1790},
    'assessment-frameworks-subtopic': {'x': 660, 'y': 1790},
    'enforcement-mechanisms-subtopic': {'x': 470, 'y': 1840},
    
    'strategic-interventions-label': {'x': 470, 'y': 1900},
    'risk-assessment-methodologies-subtopic': {'x': 470, 'y': 1940},
    'timeline-considerations-subtopic': {'x': 690, 'y': 1940},
    'resource-allocation-subtopic': {'x': 470, 'y': 1990},
    
    # Technical section - inside the box
    'technical-section': {'x': 50, 'y': 1580},
    'testing-contexts-label': {'x': 70, 'y': 1600},
    'white-box-subtopic': {'x': 70, 'y': 1640},
    'black-box-subtopic': {'x': 220, 'y': 1640},
    'grey-box-subtopic': {'x': 70, 'y': 1690},
    
    'interpretability-techniques-label': {'x': 70, 'y': 1750},
    'explainability-subtopic': {'x': 70, 'y': 1790},
    'interpretability-subtopic': {'x': 200, 'y': 1790},
    'transparency-subtopic': {'x': 340, 'y': 1790},
    
    'security-&-attacks-label': {'x': 70, 'y': 1850},
    'prompt-injection-subtopic': {'x': 70, 'y': 1890},
    'jailbreak-subtopic': {'x': 220, 'y': 1890},
    'data-poisoning-subtopic': {'x': 70, 'y': 1940},
    'computer-security-subtopic': {'x': 210, 'y': 1940},
    
    # Advanced Research section
    'advanced-section': {'x': 350, 'y': 2080, 'width': 600},
    'research-methods-label': {'x': 370, 'y': 2100},
    'red-teaming-subtopic': {'x': 370, 'y': 2140},
    'ai-agents-subtopic': {'x': 500, 'y': 2140},
    'disrupting-research-subtopic': {'x': 600, 'y': 2140},
    'collaboration-subtopic': {'x': 820, 'y': 2140},
    
    'organizations-label': {'x': 370, 'y': 2200},
    'constellation-subtopic': {'x': 370, 'y': 2240},
    'far-subtopic': {'x': 500, 'y': 2240},
    
    # Core Concepts - inside alignment section
    'core-concepts-label': {'x': 70, 'y': 900},
    'sources-ai-risk-label': {'x': 70, 'y': 1050},
    'agency-subtopic': {'x': 70, 'y': 1090},
    'impenetrability-subtopic': {'x': 170, 'y': 1090},
    'situational-awareness-subtopic': {'x': 310, 'y': 1090},
    
    'ai-risk-areas-label': {'x': 70, 'y': 1150},
    'existential-risk-subtopic': {'x': 70, 'y': 1190},
}

# Apply all position updates
for node in data['nodes']:
    if node['id'] in updates:
        node['position'].update(updates[node['id']])
        if 'width' in updates[node['id']]:
            node['width'] = updates[node['id']]['width']
        print(f"Updated {node['id']} to ({node['position']['x']}, {node['position']['y']})")

# Save the updated roadmap
with open('src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\nFixed all major overlaps!")