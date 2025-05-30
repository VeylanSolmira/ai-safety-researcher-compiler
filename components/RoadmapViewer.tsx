'use client' // This component needs interactivity, so it runs on the client

import { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css' // Required CSS for ReactFlow
import TopicContent from './TopicContent'

// Custom node components for different types
const TitleNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} id="y1" />
    <div style={data.style} className="px-4 py-2">
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} id="y2" />
  </>
)

const TopicNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} id="y1" />
    <div 
      style={data.style} 
      className="bg-white border-2 border-blue-500 rounded-lg px-4 py-2 hover:bg-blue-50 cursor-pointer"
    >
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} id="y2" />
  </>
)

const SubtopicNode = ({ data }: { data: any }) => (
  <div 
    style={data.style} 
    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
  >
    {data.label}
  </div>
)

const SectionNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} id="y1" />
    <div 
      style={{...data.style, ...{ width: '100%', height: '100%' }}} 
      className="border-2 rounded-lg"
    />
    <Handle type="source" position={Position.Bottom} id="y2" />
  </>
)

const LabelNode = ({ data }: { data: any }) => (
  <div style={data.style} className="font-semibold">
    {data.label}
  </div>
)

interface RoadmapViewerProps {
  roadmapData: {
    nodes: Node[]
    edges: Edge[]
  }
}

export default function RoadmapViewer({ roadmapData }: RoadmapViewerProps) {
  const [nodes, , onNodesChange] = useNodesState(roadmapData.nodes)
  const [edges, , onEdgesChange] = useEdgesState(roadmapData.edges)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  // Memoize nodeTypes to prevent React Flow warning
  const nodeTypes = useMemo<NodeTypes>(() => ({
    title: TitleNode,
    topic: TopicNode,
    subtopic: SubtopicNode,
    section: SectionNode,
    label: LabelNode,
  }), [])
  
  // Handle node clicks
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'topic' || node.type === 'subtopic') {
      setSelectedNode(node.id)
      // TODO: Load and display topic content
      console.log('Clicked:', node.data.label)
    }
  }, [])
  
  return (
    <div className="w-full h-[800px] border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
      
      {/* Topic content panel */}
      {selectedNode && (
        <TopicContent
          roadmapSlug="ai-safety-researcher"
          topicId={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}