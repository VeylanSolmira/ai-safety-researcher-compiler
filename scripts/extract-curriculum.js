const fs = require('fs');
const path = require('path');

// Read the roadmap JSON
const roadmapPath = path.join(__dirname, '../src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json');
const roadmap = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

// Create a map of nodes by ID for easy lookup
const nodeMap = {};
roadmap.nodes.forEach(node => {
  nodeMap[node.id] = node;
});

// Function to get all children of a node
function getChildren(nodeId) {
  return roadmap.nodes.filter(node => 
    node.data.parentId === nodeId
  ).sort((a, b) => {
    // Sort by position for better ordering
    if (Math.abs(a.position.y - b.position.y) > 10) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });
}

// Function to build the markdown for a topic and its children
function buildTopicSection(topic, index) {
  let output = `## ${index}. ${topic.data.label}\n\n`;
  
  // Get direct children of the topic
  const topicChildren = getChildren(topic.id);
  
  // Group children by type
  const labels = topicChildren.filter(n => n.type === 'label');
  const directSubtopics = topicChildren.filter(n => n.type === 'subtopic');
  
  // Process labeled sections
  labels.forEach(label => {
    output += `### ${label.data.label}\n`;
    const labelChildren = getChildren(label.id);
    labelChildren.forEach(child => {
      if (child.type === 'subtopic') {
        output += `- ${child.data.label}\n`;
      }
    });
    output += '\n';
  });
  
  // Process direct subtopics (not under a label)
  if (directSubtopics.length > 0) {
    // Custom section names based on topic
    let sectionName = 'Core Topics';
    if (topic.id === 'foundations-topic' && directSubtopics.some(s => s.data.label.includes('Ethics'))) {
      sectionName = 'Philosophy & Ethics';
    } else if (topic.id === 'alignment-fundamentals-topic') {
      sectionName = 'Core Concepts';
    } else if (topic.id === 'technical-alignment-topic') {
      sectionName = 'Security & Attacks';
    } else if (topic.id === 'advanced-research-topic') {
      sectionName = 'Research Methods';
    }
    
    output += `### ${sectionName}\n`;
    directSubtopics.forEach(subtopic => {
      output += `- ${subtopic.data.label}\n`;
    });
    output += '\n';
  }
  
  return output;
}

// Build the curriculum structure
let output = '# AI Safety Researcher Curriculum Structure\n\n';

// Prerequisites section
output += '## Prerequisites\n';
output += '- (To be defined - ML basics, Python, etc.)\n\n';

// Main topics
const mainTopics = roadmap.nodes.filter(n => 
  n.type === 'topic' && 
  n.id !== 'title-node' &&
  !n.data.parentId
).sort((a, b) => a.position.y - b.position.y);

mainTopics.forEach((topic, index) => {
  output += buildTopicSection(topic, index + 1);
});

// Write to file
const outputPath = path.join(__dirname, '../CURRICULUM.md');
fs.writeFileSync(outputPath, output);
console.log('Curriculum structure extracted to CURRICULUM.md');