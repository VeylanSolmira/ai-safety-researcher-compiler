const data = require("./src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json");

// Function to calculate distance between two points
function distance(node1, node2) {
  const dx = node1.position.x - node2.position.x;
  const dy = node1.position.y - node2.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Find overlapping nodes
const overlappingGroups = [];
const processedNodes = new Set();

for (let i = 0; i < data.nodes.length; i++) {
  if (processedNodes.has(i)) continue;
  
  const node1 = data.nodes[i];
  const group = [{
    id: node1.id,
    label: node1.data.label,
    position: node1.position,
    type: node1.type
  }];
  
  for (let j = i + 1; j < data.nodes.length; j++) {
    if (processedNodes.has(j)) continue;
    
    const node2 = data.nodes[j];
    const dist = distance(node1, node2);
    
    // Check if nodes are within 20 pixels of each other
    if (dist <= 20) {
      processedNodes.add(j);
      group.push({
        id: node2.id,
        label: node2.data.label,
        position: node2.position,
        type: node2.type
      });
    }
  }
  
  if (group.length > 1) {
    processedNodes.add(i);
    overlappingGroups.push(group);
  }
}

console.log("=== OVERLAPPING OR VERY CLOSE NODES (within 20 pixels) ===");
console.log("");

if (overlappingGroups.length === 0) {
  console.log("No overlapping nodes found!");
} else {
  overlappingGroups.forEach((group, index) => {
    console.log(`Group ${index + 1}:`);
    group.forEach(node => {
      console.log(`  - ${node.id} (${node.type})`);
      console.log(`    Label: "${node.label}"`);
      console.log(`    Position: x=${node.position.x}, y=${node.position.y}`);
    });
    console.log("");
  });
}

// Also check for nodes at exact same position
console.log("");
console.log("=== NODES AT EXACT SAME POSITION ===");
console.log("");
const positionMap = {};
data.nodes.forEach(node => {
  const key = `${node.position.x},${node.position.y}`;
  if (!positionMap[key]) {
    positionMap[key] = [];
  }
  positionMap[key].push({
    id: node.id,
    label: node.data.label,
    type: node.type
  });
});

let foundExact = false;
Object.entries(positionMap).forEach(([pos, nodes]) => {
  if (nodes.length > 1) {
    foundExact = true;
    console.log(`At position ${pos}:`);
    nodes.forEach(node => {
      console.log(`  - ${node.id} (${node.type}): "${node.label}"`);
    });
    console.log("");
  }
});

if (!foundExact) {
  console.log("No nodes found at exact same positions.");
}

// Additional analysis: Find nodes that are too close given their widths/heights
console.log("");
console.log("=== NODES THAT MAY VISUALLY OVERLAP DUE TO SIZE ===");
console.log("");

const visualOverlaps = [];
for (let i = 0; i < data.nodes.length; i++) {
  const node1 = data.nodes[i];
  
  for (let j = i + 1; j < data.nodes.length; j++) {
    const node2 = data.nodes[j];
    
    // Calculate if bounding boxes overlap
    const node1Left = node1.position.x;
    const node1Right = node1.position.x + (node1.width || 100);
    const node1Top = node1.position.y;
    const node1Bottom = node1.position.y + (node1.height || 40);
    
    const node2Left = node2.position.x;
    const node2Right = node2.position.x + (node2.width || 100);
    const node2Top = node2.position.y;
    const node2Bottom = node2.position.y + (node2.height || 40);
    
    // Check if rectangles overlap
    if (!(node1Right < node2Left || node2Right < node1Left || 
          node1Bottom < node2Top || node2Bottom < node1Top)) {
      visualOverlaps.push({
        node1: {
          id: node1.id,
          label: node1.data.label,
          position: node1.position,
          width: node1.width,
          height: node1.height
        },
        node2: {
          id: node2.id,
          label: node2.data.label,
          position: node2.position,
          width: node2.width,
          height: node2.height
        }
      });
    }
  }
}

if (visualOverlaps.length === 0) {
  console.log("No visually overlapping nodes found based on their sizes.");
} else {
  visualOverlaps.forEach((pair, index) => {
    console.log(`Overlap ${index + 1}:`);
    console.log(`  Node 1: ${pair.node1.id}`);
    console.log(`    Label: "${pair.node1.label}"`);
    console.log(`    Position: x=${pair.node1.position.x}, y=${pair.node1.position.y}`);
    console.log(`    Size: ${pair.node1.width}x${pair.node1.height}`);
    console.log(`  Node 2: ${pair.node2.id}`);
    console.log(`    Label: "${pair.node2.label}"`);
    console.log(`    Position: x=${pair.node2.position.x}, y=${pair.node2.position.y}`);
    console.log(`    Size: ${pair.node2.width}x${pair.node2.height}`);
    console.log("");
  });
}