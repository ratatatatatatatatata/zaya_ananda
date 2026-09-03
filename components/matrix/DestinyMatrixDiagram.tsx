import type { DestinyMatrix, MatrixPointKey } from "@/lib/matrix-calculation";

type Node = { key: MatrixPointKey; x: number; y: number; size: "lg" | "md" | "sm"; tone: string };

const NODES: Node[] = [
  { key: "b", x: 50, y: 7, size: "lg", tone: "#8465d4" },
  { key: "b2", x: 50, y: 18, size: "md", tone: "#547dcc" },
  { key: "b1", x: 50, y: 27, size: "sm", tone: "#39a6b6" },
  { key: "g", x: 80, y: 20, size: "lg", tone: "#f1a759" },
  { key: "c", x: 93, y: 50, size: "lg", tone: "#e76f65" },
  { key: "c2", x: 82, y: 50, size: "md", tone: "#f8f5ed" },
  { key: "c1", x: 72, y: 50, size: "sm", tone: "#ed9d50" },
  { key: "y", x: 80, y: 80, size: "lg", tone: "#f1a759" },
  { key: "d", x: 50, y: 93, size: "lg", tone: "#e76f65" },
  { key: "d2", x: 50, y: 82, size: "md", tone: "#f8f5ed" },
  { key: "d1", x: 50, y: 72, size: "sm", tone: "#ed9d50" },
  { key: "k", x: 20, y: 80, size: "lg", tone: "#f1a759" },
  { key: "a", x: 7, y: 50, size: "lg", tone: "#8465d4" },
  { key: "a2", x: 18, y: 50, size: "md", tone: "#547dcc" },
  { key: "a1", x: 27, y: 50, size: "sm", tone: "#39a6b6" },
  { key: "f", x: 20, y: 20, size: "lg", tone: "#f1a759" },
  { key: "e", x: 50, y: 50, size: "lg", tone: "#e3be62" },
];

const SIZES = { lg: 11, md: 8.5, sm: 6.5 };

export function DestinyMatrixDiagram({ matrix }: { matrix: DestinyMatrix }) {
  return (
    <div className="mx-auto w-full max-w-[680px] rounded-[2rem] border border-line bg-white/80 p-3 shadow-soft sm:p-6">
      <svg viewBox="0 0 100 100" role="img" aria-label="Хувь тавилангийн матрицын диаграм" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="matrixGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0d7668" stopOpacity=".34" />
            <stop offset="1" stopColor="#8465d4" stopOpacity=".34" />
          </linearGradient>
        </defs>
        <path d="M50 7 93 50 50 93 7 50Z" fill="none" stroke="url(#matrixGlow)" strokeWidth=".7" />
        <rect x="20" y="20" width="60" height="60" rx="2" fill="none" stroke="#0d7668" strokeOpacity=".45" strokeWidth=".7" />
        <path d="M7 50h86M50 7v86M20 20l60 60M80 20 20 80" fill="none" stroke="#60736d" strokeOpacity=".24" strokeWidth=".55" />
        <path d="M27 50 50 27 72 50 50 72Z" fill="#e3be62" fillOpacity=".06" stroke="#e3be62" strokeOpacity=".5" strokeDasharray="1.5 1.5" strokeWidth=".5" />
        <text x="50" y="2.7" textAnchor="middle" fontSize="2.7" fill="#60736d">Сүнслэг авьяас</text>
        <text x="50" y="99" textAnchor="middle" fontSize="2.7" fill="#60736d">Үйлийн үрийн сүүл</text>
        <text x="2.5" y="47" textAnchor="middle" fontSize="2.7" fill="#60736d" transform="rotate(-90 2.5 47)">Хувь чанар</text>
        <text x="97.5" y="53" textAnchor="middle" fontSize="2.7" fill="#60736d" transform="rotate(90 97.5 53)">Нийгмийн илрэл</text>
        {NODES.map((node) => {
          const radius = SIZES[node.size] / 2;
          const darkText = node.tone === "#f8f5ed" || node.tone === "#e3be62" || node.tone === "#f1a759";
          return (
            <g key={node.key}>
              <circle cx={node.x} cy={node.y} r={radius + .8} fill="#fff" fillOpacity=".75" />
              <circle cx={node.x} cy={node.y} r={radius} fill={node.tone} stroke="#17352f" strokeOpacity=".22" strokeWidth=".35" />
              <text x={node.x} y={node.y + 1.45} textAnchor="middle" fontSize={node.size === "lg" ? 4.8 : 3.8} fontWeight="700" fill={darkText ? "#17352f" : "#fff"}>
                {matrix.points[node.key]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
