import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Export database to roadmap.sh JSON with proper hierarchical layout
async function exportToRoadmapHierarchical() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    // Get all data
    const tiers = db.prepare(`
      SELECT * FROM tiers ORDER BY position
    `).all() as any[]
    
    const modules = db.prepare(`
      SELECT * FROM modules ORDER BY tier_id, position
    `).all() as any[]
    
    const topics = db.prepare(`
      SELECT * FROM topics ORDER BY module_id, position
    `).all() as any[]
    
    // Create nodes array
    const nodes = []
    const edges = []
    
    // Layout configuration
    const config = {
      tierGap: 600,      // Vertical gap between tiers
      moduleGap: 350,    // Horizontal gap between modules
      topicGap: 250,     // Horizontal gap between topics
      tierWidth: 300,
      tierHeight: 100,
      moduleWidth: 280,
      moduleHeight: 80,
      topicWidth: 240,
      topicHeight: 60,
      startX: 100,
      startY: 100
    }
    
    let currentY = config.startY
    
    // Process each tier
    for (const tier of tiers) {
      const tierNode = {
        id: `tier-${tier.id}`,
        type: 'topic',
        position: { x: config.startX, y: currentY },
        data: {
          label: tier.title,
          style: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #333'
          }
        },
        width: config.tierWidth,
        height: config.tierHeight
      }
      nodes.push(tierNode)
      
      // Get modules for this tier
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const moduleStartX = config.startX + config.tierWidth + 150
      let moduleY = currentY - ((tierModules.length - 1) * config.moduleHeight / 2)
      
      for (const module of tierModules) {
        const moduleNode = {
          id: `module-${module.id}`,
          type: 'subtopic',
          position: { x: moduleStartX, y: moduleY },
          data: {
            label: module.title,
            style: {
              backgroundColor: '#2a2a2a',
              color: '#ffffff',
              fontSize: '16px',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #444'
            }
          },
          width: config.moduleWidth,
          height: config.moduleHeight
        }
        nodes.push(moduleNode)
        
        // Add edge from tier to module
        edges.push({
          id: `${tier.id}-to-${module.id}`,
          source: tierNode.id,
          target: moduleNode.id,
          type: 'smoothstep',
          style: { stroke: '#666', strokeWidth: 2 }
        })
        
        // Get topics for this module
        const moduleTopics = topics.filter(t => t.module_id === module.id)
        const topicStartX = moduleStartX + config.moduleWidth + 150
        
        // Calculate vertical distribution for topics
        const topicAreaHeight = Math.max(
          config.moduleHeight,
          moduleTopics.length * (config.topicHeight + 20)
        )
        let topicY = moduleY - (topicAreaHeight - config.moduleHeight) / 2
        
        for (const topic of moduleTopics) {
          const topicNode = {
            id: `${topic.id}@${topic.id}-subtopic`,
            type: 'subtopic',
            position: { x: topicStartX, y: topicY },
            data: {
              label: topic.title,
              style: {
                backgroundColor: '#3a3a3a',
                color: '#e0e0e0',
                fontSize: '14px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555'
              }
            },
            width: config.topicWidth,
            height: config.topicHeight
          }
          nodes.push(topicNode)
          
          // Add edge from module to topic
          edges.push({
            id: `${module.id}-to-${topic.id}`,
            source: moduleNode.id,
            target: topicNode.id,
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep',
            style: { stroke: '#666', strokeWidth: 1 }
          })
          
          topicY += config.topicHeight + 20
        }
        
        moduleY += Math.max(config.moduleHeight + 40, topicAreaHeight / tierModules.length)
      }
      
      currentY += config.tierGap
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
    const outputPath = path.join(process.cwd(), 'src/data/roadmaps/ai-safety-researcher/ai-safety-researcher-hierarchical.json')
    fs.writeFileSync(outputPath, JSON.stringify(roadmap, null, 2))
    
    console.log('✅ Exported hierarchical roadmap JSON to:', outputPath)
    console.log(`📊 Stats: ${nodes.length} nodes, ${edges.length} edges`)
    console.log(`   - ${tiers.length} tiers`)
    console.log(`   - ${modules.length} modules`) 
    console.log(`   - ${topics.length} topics`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

exportToRoadmapHierarchical()