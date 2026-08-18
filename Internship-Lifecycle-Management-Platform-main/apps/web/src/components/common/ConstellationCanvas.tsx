import React, { useRef, useEffect, useState } from "react";
import { Table, Eye, Zap } from "lucide-react";

export interface StudentNode {
  id: string;
  name: string;
  score: number;
  status: "progressing" | "attention" | "intervention";
  roll?: string;
  company?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
}

export interface ConstellationProps {
  students?: StudentNode[];
  onSelectStudent?: (student: StudentNode) => void;
  className?: string;
  interactive?: boolean;
  theme?: "dark" | "light";
}

const DEFAULT_MOCK_STUDENTS: StudentNode[] = [
  { id: "s1", name: "Rahul Sharma", score: 88, status: "progressing", roll: "20CS101", company: "TechCorp" },
  { id: "s2", name: "Priya Patel", score: 92, status: "progressing", roll: "20CS102", company: "Innovatech" },
  { id: "s3", name: "Vikram Singh", score: 54, status: "intervention", roll: "20CS103", company: "DataSystems" },
  { id: "s4", name: "Neha Reddy", score: 76, status: "attention", roll: "20CS104", company: "GlobalSoft" },
  { id: "s5", name: "Amit Kumar", score: 95, status: "progressing", roll: "20CS105", company: "TechCorp" },
  { id: "s6", name: "Sneha Gupta", score: 89, status: "progressing", roll: "20CS106", company: "DataSystems" },
  { id: "s7", name: "Anjali Desai", score: 68, status: "attention", roll: "20CS107", company: "Innovatech" },
  { id: "s8", name: "Rohan Mehta", score: 91, status: "progressing", roll: "20CS108", company: "GlobalSoft" },
  { id: "s9", name: "Divya Iyer", score: 48, status: "intervention", roll: "20CS109", company: "TechCorp" },
  { id: "s10", name: "Karan Joshi", score: 82, status: "progressing", roll: "20CS110", company: "CloudWorks" },
  { id: "s11", name: "Pooja Verma", score: 71, status: "attention", roll: "20CS111", company: "DataSystems" },
  { id: "s12", name: "Aditya Rao", score: 94, status: "progressing", roll: "20CS112", company: "NextGen AI" },
];

export const ConstellationCanvas: React.FC<ConstellationProps> = ({
  students = DEFAULT_MOCK_STUDENTS,
  onSelectStudent,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const [hoveredNode, setHoveredNode] = useState<StudentNode | null>(null);

  useEffect(() => {
    if (viewMode !== "graph") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 250;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize node positions
    const nodes = students.map((s) => ({
      ...s,
      x: s.x || Math.random() * (width - 60) + 30,
      y: s.y || Math.random() * (height - 60) + 30,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: s.status === "intervention" ? 8 : s.status === "attention" ? 6 : 5,
    }));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines based on proximity
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Bounce on edges
          if (node.x < 20 || node.x > width - 20) node.vx *= -1;
          if (node.y < 20 || node.y > height - 20) node.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Status-based colors
        if (node.status === "intervention") {
          ctx.fillStyle = "#ef4444"; // red-500
          ctx.shadowColor = "rgba(239, 68, 68, 0.4)";
          ctx.shadowBlur = 4;
        } else if (node.status === "attention") {
          ctx.fillStyle = "#f59e0b"; // amber-500
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "#10b981"; // emerald-500
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      if (!prefersReducedMotion && document.visibilityState === 'visible') {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [students, viewMode]);

  return (
    <div className={`card-modern relative overflow-hidden p-4 ${className}`}>
      {/* Header bar with view switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Student Cohort Risk Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === "graph"
                ? "bg-white dark:bg-slate-700 shadow-xs font-medium text-slate-900 dark:text-slate-50"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Graph
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-700 shadow-xs font-medium text-slate-900 dark:text-slate-50"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* Render Canvas or Dense Table */}
      {viewMode === "graph" ? (
        <div className="relative w-full h-64 bg-slate-50/50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-800/80">
          <canvas ref={canvasRef} className="w-full h-full block" />
          {/* Status Legend */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-3 text-[11px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> On Track
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Intervention
            </span>
          </div>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 sticky top-0">
              <tr>
                <th className="py-2 px-3">Student</th>
                <th className="py-2 px-3">Readiness Score</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => onSelectStudent?.(st)}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${onSelectStudent ? 'cursor-pointer' : ''}`}
                >
                  <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-200">
                    {st.name}
                    {st.roll && <span className="text-[10px] text-slate-400 font-mono block">{st.roll} · {st.company}</span>}
                  </td>
                  <td className="py-2 px-3 font-mono">{st.score}%</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        st.status === "intervention"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : st.status === "attention"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {st.status === "intervention" ? "Intervention" : st.status === "attention" ? "Moderate" : "On Track"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConstellationCanvas;
