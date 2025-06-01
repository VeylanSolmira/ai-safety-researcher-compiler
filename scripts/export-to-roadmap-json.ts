import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Export database to roadmap.sh JSON format
async function exportToRoadmapJSON() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    // Get all tiers with their modules and topics
    const tiers = db.prepare(`
      SELECT * FROM tiers ORDER BY position
    `).all()
    
    const modules = db.prepare(`
      SELECT * FROM modules ORDER BY tier_id, position
    `).all()
    
    const topics = db.prepare(`
      SELECT * FROM topics ORDER BY module_id, position
    `).all()
    
    // Create groups for visual organization
    const groups = [
      {
        id: "foundation-modules",
        title: "Foundation",
        color: "#3B82F6"
      },
      {
        id: "intermediate-modules", 
        title: "Intermediate",
        color: "#10B981"
      },
      {
        id: "advanced-modules",
        title: "Advanced", 
        color: "#F59E0B"
      },
      {
        id: "expert-modules",
        title: "Expert",
        color: "#EF4444"
      }
    ]
    
    // Create nodes for the roadmap
    const nodes = []
    let nodeId = 1000
    
    // Add tier header nodes
    for (const tier of tiers) {
      nodes.push({
        id: `tier-${tier.id}`,
        title: tier.title,
        description: tier.description,
        type: "topic",
        width: 300,
        height: 80,
        style: {
          backgroundColor: tier.color || "#1a1a1a",
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: "bold"
        }
      })
    }
    
    // Add module and topic nodes
    const modulesByTier = {}
    for (const module of modules) {
      const tierId = module.tier_id
      if (!modulesByTier[tierId]) modulesByTier[tierId] = []
      
      const moduleNode = {
        id: `module-${module.id}`,
        title: module.title,
        description: module.description,
        type: "subtopic",
        width: 250,
        height: 60,
        parentId: `tier-${tierId}`,
        style: {
          backgroundColor: "#2a2a2a",
          color: "#ffffff"
        }
      }
      
      modulesByTier[tierId].push(moduleNode)
      nodes.push(moduleNode)
      
      // Add topics for this module
      const moduleTopics = topics.filter(t => t.module_id === module.id)
      for (const topic of moduleTopics) {
        nodes.push({
          id: `${topic.id}@${topic.id}-subtopic`,
          title: topic.title,
          description: topic.description,
          type: "subtopic", 
          width: 200,
          height: 50,
          parentId: `module-${module.id}`,
          style: {
            backgroundColor: "#3a3a3a",
            color: "#e0e0e0",
            fontSize: "14px"
          }
        })
      }
    }
    
    // Create edges (connections)
    const edges = []
    
    // Connect tiers to their modules
    for (const tier of tiers) {
      const tierModules = modulesByTier[tier.id] || []
      for (const module of tierModules) {
        edges.push({
          id: `${tier.id}-to-${module.id}`,
          source: `tier-${tier.id}`,
          target: module.id,
          sourceHandle: "y2",  // bottom of tier
          targetHandle: "y1",  // top of module
          type: "straight"
        })
      }
    }
    
    // Connect modules to their topics
    for (const module of modules) {
      const moduleTopics = topics.filter(t => t.module_id === module.id)
      for (const topic of moduleTopics) {
        edges.push({
          id: `${module.id}-to-${topic.id}`,
          source: `module-${module.id}`,
          target: `${topic.id}@${topic.id}-subtopic`,
          sourceHandle: "y2",  // bottom of module
          targetHandle: "y1",  // top of topic
          type: "straight"
        })
      }
    }
    
    // Position nodes (simplified grid layout)
    let x = 100
    let y = 100
    const tierSpacing = 800
    const moduleSpacing = 300
    const topicSpacing = 220
    
    for (const tier of tiers) {
      // Position tier node
      const tierNode = nodes.find(n => n.id === `tier-${tier.id}`)
      if (tierNode) {
        tierNode.x = x
        tierNode.y = y
      }
      
      // Position modules for this tier
      const tierModules = nodes.filter(n => n.parentId === `tier-${tier.id}`)
      let moduleY = y + 120
      
      for (let i = 0; i < tierModules.length; i++) {
        const module = tierModules[i]
        module.x = x + 350
        module.y = moduleY
        
        // Position topics for this module
        const moduleTopics = nodes.filter(n => n.parentId === module.id)
        let topicX = module.x + 300
        let topicY = module.y - (moduleTopics.length * 30) / 2
        
        for (const topic of moduleTopics) {
          topic.x = topicX
          topic.y = topicY
          topicY += 60
        }
        
        moduleY += Math.max(moduleSpacing, moduleTopics.length * 60 + 100)
      }
      
      y += tierSpacing
    }
    
    // Create the roadmap structure
    const roadmap = {
      id: "ai-safety-researcher",
      title: "AI Safety Researcher",
      description: "A comprehensive learning path for AI safety research",
      metadata: {
        version: "2.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      groups,
      nodes,
      edges,
      config: {
        fontSize: 14,
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#0A0A0B",
        theme: "dark"
      }
    }
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json')
    fs.writeFileSync(outputPath, JSON.stringify(roadmap, null, 2))
    
    console.log('✅ Exported roadmap JSON to:', outputPath)
    console.log(`📊 Stats: ${tiers.length} tiers, ${modules.length} modules, ${topics.length} topics`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

exportToRoadmapJSON()