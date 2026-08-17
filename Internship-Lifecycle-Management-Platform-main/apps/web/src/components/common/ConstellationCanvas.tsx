import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface ConstellationCanvasProps {
  className?: string;
  interactive?: boolean;
  theme?: 'dark' | 'light';
}

type Status = 'progressing' | 'attention' | 'intervention';

interface Node {
  id: string;
  x: number;
  y: number;
  status: Status;
  name: string;
  roll: string;
  company: string;
  vx: number;
  vy: number;
}

interface Edge {
  id: string;
  source: Node;
  target: Node;
}

const MOCK_STUDENTS = [
  { name: 'Rahul Sharma', roll: '20CS101', company: 'TechCorp' },
  { name: 'Priya Patel', roll: '20CS102', company: 'Innovatech' },
  { name: 'Vikram Singh', roll: '20CS103', company: 'DataSystems' },
  { name: 'Neha Reddy', roll: '20CS104', company: 'GlobalSoft' },
  { name: 'Amit Kumar', roll: '20CS105', company: 'TechCorp' },
  { name: 'Sneha Gupta', roll: '20CS106', company: 'DataSystems' },
  { name: 'Anjali Desai', roll: '20CS107', company: 'Innovatech' },
  { name: 'Rohan Mehta', roll: '20CS108', company: 'GlobalSoft' },
  { name: 'Divya Iyer', roll: '20CS109', company: 'TechCorp' },
  { name: 'Karan Joshi', roll: '20CS110', company: 'CloudWorks' },
  { name: 'Pooja Verma', roll: '20CS111', company: 'DataSystems' },
  { name: 'Aditya Rao', roll: '20CS112', company: 'NextGen AI' },
  { name: 'Tanvi Shah', roll: '20CS113', company: 'Innovatech' },
  { name: 'Manish Paul', roll: '20CS114', company: 'TechCorp' },
  { name: 'Kavita Nair', roll: '20CS115', company: 'GlobalSoft' },
  { name: 'Siddharth Roy', roll: '20CS116', company: 'CloudWorks' },
  { name: 'Meera Sen', roll: '20CS117', company: 'NextGen AI' },
  { name: 'Gaurav Das', roll: '20CS118', company: 'DataSystems' },
];

const STATUS_COLORS = {
  progressing: '#10B981', // green
  attention: '#F59E0B',   // amber
  intervention: '#EF4444', // red
};

const generateConstellation = (nodeCount: number): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const radius = 18 + Math.random() * 28; // Between 18% and 46% from center
    
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    let status: Status = 'progressing';
    if (i % 7 === 2 || i % 7 === 5) status = 'attention';
    if (i === 3 || i === 9 || i === 15) status = 'intervention';

    const student = MOCK_STUDENTS[i % MOCK_STUDENTS.length];

    nodes.push({
      id: `node-${i}`,
      x,
      y,
      status,
      name: student.name,
      roll: student.roll,
      company: student.company,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    });
  }

  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 24) {
        edges.push({
          id: `edge-${i}-${j}`,
          source: nodes[i],
          target: nodes[j],
        });
      }
    }
  }

  return { nodes, edges };
};

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  className = '',
  interactive = true,
  theme = 'light',
}) => {
  const { nodes, edges } = useMemo(() => generateConstellation(18), []);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const isLight = theme === 'light';
  const edgeStroke = isLight ? 'rgba(11, 82, 91, 0.18)' : 'rgba(255, 255, 255, 0.15)';

  return (
    <div 
      className={`relative w-full h-full min-h-[320px] overflow-hidden rounded-2xl ${className}`}
      style={{
        backgroundColor: isLight ? '#FFFDF8' : '#090D16',
        borderColor: isLight ? 'rgba(11, 82, 91, 0.12)' : 'rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[70%] h-[70%] blur-[90px] rounded-full"
          style={{
            backgroundColor: isLight ? 'rgba(11, 82, 91, 0.06)' : 'rgba(99, 91, 255, 0.12)'
          }}
        />
      </div>

      <motion.svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        animate={{
          rotate: [0, 1.5, -1.5, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Constellation Edges */}
        {edges.map((edge) => (
          <motion.line
            key={edge.id}
            x1={edge.source.x}
            y1={edge.source.y}
            x2={edge.target.x}
            y2={edge.target.y}
            stroke={edgeStroke}
            strokeWidth="0.4"
            strokeDasharray="1 1"
            animate={{
              x1: [edge.source.x, edge.source.x + edge.source.vx, edge.source.x],
              y1: [edge.source.y, edge.source.y + edge.source.vy, edge.source.y],
              x2: [edge.target.x, edge.target.x + edge.target.vx, edge.target.x],
              y2: [edge.target.y, edge.target.y + edge.target.vy, edge.target.y],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Constellation Student Nodes */}
        {nodes.map((node) => (
          <motion.g
            key={node.id}
            onMouseEnter={() => interactive && setHoveredNode(node)}
            onMouseLeave={() => interactive && setHoveredNode(null)}
            className={interactive ? 'cursor-pointer' : ''}
            animate={{
              x: [0, node.vx, 0],
              y: [0, node.vy, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Outer halo */}
            <circle
              cx={node.x}
              cy={node.y}
              r="2.2"
              fill={STATUS_COLORS[node.status]}
              opacity={isLight ? "0.2" : "0.3"}
              className="pointer-events-none"
            />
            {/* Core dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r="1"
              fill={STATUS_COLORS[node.status]}
              stroke={isLight ? "#FFFDF8" : "#080A12"}
              strokeWidth="0.3"
            />
          </motion.g>
        ))}
      </motion.svg>

      {/* Interactive Tooltip */}
      {interactive && hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute pointer-events-none z-20 rounded-xl px-3.5 py-2.5 shadow-xl border"
          style={{
            left: `${Math.min(Math.max(hoveredNode.x, 15), 85)}%`,
            top: `${Math.min(Math.max(hoveredNode.y, 18), 82)}%`,
            transform: 'translate(-50%, -125%)',
            backgroundColor: isLight ? '#FFFDF8' : '#141926',
            borderColor: isLight ? 'rgba(11, 82, 91, 0.2)' : 'rgba(255, 255, 255, 0.15)',
            color: isLight ? '#142326' : '#F4F6FF'
          }}
        >
          <div className="text-xs font-semibold whitespace-nowrap">
            {hoveredNode.name}
          </div>
          <div className="text-[10px] opacity-60">
            {hoveredNode.company} · {hoveredNode.roll}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 pt-1 border-t" style={{ borderColor: isLight ? 'rgba(11, 82, 91, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[hoveredNode.status] }}
            />
            <span className="text-[10px] font-mono font-medium capitalize" style={{ color: STATUS_COLORS[hoveredNode.status] }}>
              {hoveredNode.status === 'progressing' ? 'On Track' : hoveredNode.status === 'attention' ? 'Watch' : 'Needs Intervention'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConstellationCanvas;
