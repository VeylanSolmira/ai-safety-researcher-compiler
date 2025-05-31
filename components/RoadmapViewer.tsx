'use client'

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
import 'reactflow/dist/style.css'
import TopicContent from './TopicContent'
import { useProgress } from '@/hooks/useProgress'
import { useViewMode } from '@/contexts/ViewModeContext'
import { useRouter } from 'next/navigation'

// Simple node components
const TitleNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} id="y1" />
    <div style={data.style} className="px-4 py-2">
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} id="y2" />
  </>
)

const TopicNode = ({ data, id }: { data: any; id: string }) => {
  const { isCompleted, isStarted } = useProgress()
  const completed = isCompleted(id)
  const started = isStarted(id)
  
  return (
    <>
      <Handle type="target" position={Position.Top} id="y1" />
      <div 
        style={data.style} 
        className={`
          ${completed 
            ? 'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-400' 
            : started
            ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-400'
            : 'bg-white dark:bg-gray-800 border-blue-500 dark:border-blue-400'
          }
          border-2 rounded-lg px-4 py-2 hover:opacity-90 cursor-pointer dark:text-white relative
        `}
      >
        <div className="flex items-center gap-2">
          {completed && <span className="text-green-600 dark:text-green-400">✓</span>}
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="y2" />
    </>
  )
}

const SubtopicNode = ({ data, id }: { data: any; id: string }) => {
  const { isCompleted, isStarted } = useProgress()
  const completed = isCompleted(id)
  const started = isStarted(id)
  
  return (
    <div 
      style={data.style} 
      className={`
        ${completed 
          ? 'bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-600' 
          : started
          ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600'
          : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
        }
        border rounded-md px-3 py-1 hover:opacity-90 cursor-pointer text-sm dark:text-gray-200
      `}
    >
      <div className="flex items-center gap-1">
        {completed && <span className="text-green-600 dark:text-green-400 text-xs">✓</span>}
        {data.label}
      </div>
    </div>
  )
}

const SectionNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} id="y1" style={{ visibility: 'hidden' }} />
    <Handle type="target" position={Position.Left} id="x1" style={{ visibility: 'hidden' }} />
    <Handle type="target" position={Position.Right} id="x2" style={{ visibility: 'hidden' }} />
    <div 
      style={{
        width: '100%', 
        height: '100%',
        backgroundColor: data.style?.backgroundColor || '#f3f4f6',
        border: `${data.style?.borderWidth || 2}px solid ${data.style?.borderColor || '#d1d5db'}`,
        borderRadius: data.style?.borderRadius || '8px',
        ...data.style
      }} 
    />
    <Handle type="source" position={Position.Bottom} id="y2" style={{ visibility: 'hidden' }} />
    <Handle type="source" position={Position.Right} id="x2" style={{ visibility: 'hidden' }} />
    <Handle type="source" position={Position.Left} id="x1" style={{ visibility: 'hidden' }} />
  </>
)

const LabelNode = ({ data }: { data: any }) => (
  <div style={data.style} className="font-semibold">
    {data.label}
  </div>
)

const nodeTypes: NodeTypes = {
  title: TitleNode,
  topic: TopicNode,
  subtopic: SubtopicNode,
  section: SectionNode,
  label: LabelNode,
}

interface RoadmapViewerProps {
  roadmapData: {
    nodes: Node[]
    edges: Edge[]
  }
}

export default function RoadmapViewer({ roadmapData }: RoadmapViewerProps) {
  const { viewMode } = useViewMode()
  const { isCompleted, isStarted, toggleComplete, markStarted } = useProgress()
  const router = useRouter()
  
  // Filter nodes based on view mode
  const filteredNodes = useMemo(() => {
    return roadmapData.nodes.filter(node => {
      const nodeViewMode = node.data?.viewMode || 'both'
      return nodeViewMode === 'both' || nodeViewMode === viewMode
    })
  }, [roadmapData.nodes, viewMode])
  
  // Filter edges to only include those between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id))
    return roadmapData.edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    )
  }, [roadmapData.edges, filteredNodes])
  
  const [nodes, , onNodesChange] = useNodesState(filteredNodes)
  const [edges, , onEdgesChange] = useEdgesState(filteredEdges)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedNodeLabel, setSelectedNodeLabel] = useState<string>('')
  
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'topic' || node.type === 'subtopic') {
      setSelectedNode(node.id)
      setSelectedNodeLabel(node.data.label || '')
      markStarted(node.id)
    }
  }, [markStarted])
  
  return (
    <div className="w-full h-[800px] border rounded-lg overflow-hidden bg-gray-50 dark:bg-[#2a2635] relative">
      <button
        onClick={() => router.push('/journey')}
        className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        Start Journey
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 200, y: -50, zoom: 0.75 }}
        minZoom={0.75}
        maxZoom={2}
        attributionPosition="bottom-left"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls />
      </ReactFlow>
      
      {selectedNode && (
        <TopicContent
          roadmapSlug="ai-safety-researcher"
          topicId={selectedNode}
          topicLabel={selectedNodeLabel}
          onClose={() => {
            setSelectedNode(null)
            setSelectedNodeLabel('')
          }}
        />
      )}
    </div>
  )
}