"use client";

import { useEffect, useState } from "react";
import { Graph, GraphVertex } from "@/lib/types";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Carregando visualização do grafo...</span>
      </div>
    </div>
  ),
});

interface GraphVisualizationProps {
  graph: Graph;
  highlightedVertex?: number | null;
  className?: string;
  view3D?: boolean;
}

export function GraphVisualization({
  graph,
  highlightedVertex,
  className = "",
  view3D = false,
}: GraphVisualizationProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<any>({});

  useEffect(() => {
    if (!graph?.vertices) return;

    if (view3D) {
      setup3DVisualization();
    } else {
      setup2DVisualization();
    }
  }, [graph, highlightedVertex, view3D]);

  const setup2DVisualization = () => {
    const vertices = graph.vertices;
    const edges = graph.edges;

    // Posições dos vértices em layout de grade 9x9
    const vertexPositions = vertices.map((vertex) => ({
      x: vertex.col,
      y: 8 - vertex.row, // Inverter Y para coincidir com layout do Sudoku
      vertex,
    }));

    // Configurar arestas
    const edgeX: number[] = [];
    const edgeY: number[] = [];

    edges.forEach(([id1, id2]) => {
      const pos1 = vertexPositions[id1];
      const pos2 = vertexPositions[id2];

      edgeX.push(pos1.x, pos2.x, NaN);
      edgeY.push(pos1.y, pos2.y, NaN);
    });

    // Separar vértices por estado
    const emptyVertices = vertexPositions.filter((p) => p.vertex.value === 0);
    const filledVertices = vertexPositions.filter((p) => p.vertex.value !== 0);
    const highlightedVertexData =
      highlightedVertex !== null
        ? vertexPositions.find((p) => p.vertex.id === highlightedVertex)
        : null;

    const data: any[] = [
      // Arestas
      {
        x: edgeX,
        y: edgeY,
        mode: "lines",
        type: "scatter",
        line: {
          width: 0.5,
          color: "#cbd5e1",
        },
        hoverinfo: "none",
        showlegend: false,
      },

      // Vértices vazios
      {
        x: emptyVertices.map((p) => p.x),
        y: emptyVertices.map((p) => p.y),
        mode: "markers",
        type: "scatter",
        marker: {
          size: 15,
          color: "#f1f5f9",
          line: {
            width: 2,
            color: "#64748b",
          },
        },
        text: emptyVertices.map(
          (p) =>
            `Célula (${p.vertex.row + 1}, ${p.vertex.col + 1})<br>` +
            `Bloco: ${p.vertex.block + 1}<br>` +
            `Domínio: ${p.vertex.domain.size} valores`
        ),
        hovertemplate: "%{text}<extra></extra>",
        name: "Células Vazias",
      },

      // Vértices preenchidos
      {
        x: filledVertices.map((p) => p.x),
        y: filledVertices.map((p) => p.y),
        mode: "markers+text",
        type: "scatter",
        marker: {
          size: 20,
          color: filledVertices.map((p) => {
            // Cores diferentes para cada número
            const colors = [
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#6366f1",
              "#a855f7",
              "#ec4899",
              "#14b8a6",
            ];
            return colors[(p.vertex.value - 1) % colors.length];
          }),
          line: {
            width: 2,
            color: "#1f2937",
          },
        },
        text: filledVertices.map((p) => p.vertex.value.toString()),
        textfont: {
          color: "white",
          size: 12,
          family: "Arial Black",
        },
        textposition: "middle center",
        hovertemplate: "Célula (%{x}, %{y})<br>Valor: %{text}<extra></extra>",
        name: "Células Preenchidas",
      },
    ];

    // Vértice destacado
    if (highlightedVertexData) {
      data.push({
        x: [highlightedVertexData.x],
        y: [highlightedVertexData.y],
        mode: "markers",
        type: "scatter",
        marker: {
          size: 25,
          color: "#10b981",
          line: {
            width: 4,
            color: "#065f46",
          },
          symbol: "star",
        },
        text: `Célula Destacada (${highlightedVertexData.vertex.row + 1}, ${
          highlightedVertexData.vertex.col + 1
        })`,
        hovertemplate: "%{text}<extra></extra>",
        name: "Célula Atual",
      });
    }

    const layout = {
      title: false,
      xaxis: {
        showgrid: true,
        gridcolor: "#e2e8f0",
        showline: true,
        linecolor: "#64748b",
        showticklabels: true,
        tickmode: "array",
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ticktext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        title: {
          text: "Colunas",
          font: { size: 12 },
          standoff: 16,
        },
      },
      yaxis: {
        showgrid: true,
        gridcolor: "#e2e8f0",
        showline: true,
        linecolor: "#64748b",
        showticklabels: true,
        tickmode: "array",
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ticktext: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
        title: {
          text: "Linhas",
          font: { size: 12 },
        },
      },
      showlegend: true,
      legend: {
        orientation: "h",
        yanchor: "top",
        y: -0.15,
        xanchor: "center",
        x: 0.5,
        font: { size: 11 },
      },
      plot_bgcolor: "#f8fafc",
      paper_bgcolor: "white",
      margin: { l: 40, r: 20, t: 20, b: 50 },
      hovermode: "closest",
      hoverlabel: {
        bgcolor: "#1f2937",
        font: { size: 12, color: "white" },
      },
    };

    setPlotData(data);
    setLayoutConfig(layout);
  };

  const setup3DVisualization = () => {
    const vertices = graph.vertices;
    const edges = graph.edges;

    // Posições 3D dos vértices
    const vertexPositions = vertices.map((vertex) => ({
      x: vertex.col,
      y: vertex.row,
      z: vertex.block,
      vertex,
    }));

    // Configurar arestas 3D
    const edgeX: (number | null)[] = [];
    const edgeY: (number | null)[] = [];
    const edgeZ: (number | null)[] = [];

    edges.forEach(([id1, id2]) => {
      const pos1 = vertexPositions[id1];
      const pos2 = vertexPositions[id2];

      edgeX.push(pos1.x, pos2.x, null);
      edgeY.push(pos1.y, pos2.y, null);
      edgeZ.push(pos1.z, pos2.z, null);
    });

    const emptyVertices = vertexPositions.filter((p) => p.vertex.value === 0);
    const filledVertices = vertexPositions.filter((p) => p.vertex.value !== 0);

    const data: any[] = [
      // Arestas 3D
      {
        x: edgeX,
        y: edgeY,
        z: edgeZ,
        mode: "lines",
        type: "scatter3d",
        line: {
          width: 2,
          color: "#94a3b8",
        },
        hoverinfo: "none",
        showlegend: false,
      },

      // Vértices vazios 3D
      {
        x: emptyVertices.map((p) => p.x),
        y: emptyVertices.map((p) => p.y),
        z: emptyVertices.map((p) => p.z),
        mode: "markers",
        type: "scatter3d",
        marker: {
          size: 8,
          color: "#e2e8f0",
          line: {
            width: 1,
            color: "#64748b",
          },
        },
        text: emptyVertices.map(
          (p) =>
            `(${p.vertex.row + 1}, ${p.vertex.col + 1}) B${
              p.vertex.block + 1
            } - ${p.vertex.domain.size} opções`
        ),
        hovertemplate: "%{text}<extra></extra>",
        name: "Vazias",
      },

      // Vértices preenchidos 3D
      {
        x: filledVertices.map((p) => p.x),
        y: filledVertices.map((p) => p.y),
        z: filledVertices.map((p) => p.z),
        mode: "markers+text",
        type: "scatter3d",
        marker: {
          size: 12,
          color: filledVertices.map((p) => {
            const colors = [
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#6366f1",
              "#a855f7",
              "#ec4899",
              "#14b8a6",
            ];
            return colors[(p.vertex.value - 1) % colors.length];
          }),
          line: {
            width: 1,
            color: "#1f2937",
          },
        },
        text: filledVertices.map((p) => p.vertex.value.toString()),
        textfont: {
          color: "white",
          size: 10,
          family: "Arial Black",
        },
        hovertemplate: "Valor: %{text}<extra></extra>",
        name: "Preenchidas",
      },
    ];

    const layout = {
      title: false,
      scene: {
        xaxis: {
          title: "Colunas",
          showbackground: true,
          backgroundcolor: "#f1f5f9",
          showgrid: true,
          gridcolor: "#cbd5e1",
        },
        yaxis: {
          title: "Linhas",
          showbackground: true,
          backgroundcolor: "#f1f5f9",
          showgrid: true,
          gridcolor: "#cbd5e1",
        },
        zaxis: {
          title: "Blocos",
          showbackground: true,
          backgroundcolor: "#f1f5f9",
          showgrid: true,
          gridcolor: "#cbd5e1",
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 },
        },
      },
      showlegend: true,
      legend: {
        orientation: "h",
        yanchor: "top",
        y: 1,
        xanchor: "center",
        x: 0.5,
        font: { size: 11 },
      },
      paper_bgcolor: "white",
      hovermode: "closest",
      hoverlabel: {
        bgcolor: "#1f2937",
        font: { size: 11, color: "white" },
      },
    };

    setPlotData(data);
    setLayoutConfig(layout);
  };

  const config: any = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "autoScale2d",
      "autoscale",
      "editInChartStudio",
      "editinchartstudio",
      "hoverCompareCartesian",
      "hovercompare",
      "lasso",
      "lasso2d",
      "orbitRotation",
      "orbitrotation",
      "pan",
      "pan2d",
      "pan3d",
      "resetSankeyGroup",
      "resetViewMap",
      "resetViewMapbox",
      "resetViews",
      "resetcameradefault",
      "resetsankeygroup",
      "select",
      "select2d",
      "sendDataToCloud",
      "senddatatocloud",
      "tableRotation",
      "tablerotation",
      "toggleHover",
      "toggleSpikelines",
      "togglehover",
      "togglespikelines",
      "zoom",
      "zoom2d",
      "zoom3d",
      "zoomIn2d",
      "zoomInGeo",
      "zoomInMap",
      "zoomInMapbox",
      "zoomOut2d",
      "zoomOutGeo",
      "zoomOutMap",
      "zoomOutMapbox",
      "zoomin",
      "zoomout",
    ],
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {plotData.length > 0 && (
        <Plot
          data={plotData}
          layout={layoutConfig}
          config={config}
          style={{ width: "100%", height: "500px" }}
        />
      )}
    </motion.div>
  );
}
