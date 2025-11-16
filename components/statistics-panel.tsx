"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Graph, SolvingStatistics } from "@/lib/types";
import {
  Activity,
  GitBranch,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

interface StatisticsPanelProps {
  graph: Graph;
  statistics: SolvingStatistics;
  isComplete: boolean;
}

export function StatisticsPanel({
  graph,
  statistics,
  isComplete,
}: StatisticsPanelProps) {
  // Calcular estatísticas do grafo
  const totalVertices = 81;
  const totalEdges = graph.edges.length;
  const filledVertices = graph.vertices.filter((v) => v.value !== 0).length;
  const emptyVertices = totalVertices - filledVertices;
  const completionPercentage = Math.round(
    (filledVertices / totalVertices) * 100
  );

  // Análise de domínios
  const domainSizes = graph.vertices
    .filter((v) => v.value === 0)
    .map((v) => v.domain.size);

  const avgDomainSize =
    domainSizes.length > 0
      ? Math.round(
          (domainSizes.reduce((a, b) => a + b, 0) / domainSizes.length) * 10
        ) / 10
      : 0;

  const minDomainSize = domainSizes.length > 0 ? Math.min(...domainSizes) : 0;
  const maxDomainSize = domainSizes.length > 0 ? Math.max(...domainSizes) : 0;

  // Estatísticas de performance
  const backtrackRate =
    statistics.totalSteps > 0
      ? Math.round((statistics.backtrackSteps / statistics.totalSteps) * 100)
      : 0;

  const conflictRate =
    statistics.totalSteps > 0
      ? Math.round((statistics.conflictsFound / statistics.totalSteps) * 100)
      : 0;

  const efficiencyScore =
    statistics.totalSteps > 0
      ? Math.max(0, 100 - backtrackRate - conflictRate)
      : 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5" />
            Status do Puzzle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso</span>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className="ml-2"
            >
              {completionPercentage}%
            </Badge>
          </div>

          <Progress value={completionPercentage} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Preenchidas: {filledVertices}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 rounded" />
              <span>Vazias: {emptyVertices}</span>
            </div>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-green-800 font-medium">Puzzle Resolvido!</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Estrutura do Grafo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GitBranch className="w-5 h-5" />
            Estrutura do Grafo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Vértices:</span>
              <span className="font-mono">{totalVertices}</span>
            </div>
            <div className="flex justify-between">
              <span>Arestas:</span>
              <span className="font-mono">{totalEdges}</span>
            </div>
            <div className="flex justify-between">
              <span>Densidade:</span>
              <span className="font-mono">
                {Math.round(
                  (totalEdges / ((totalVertices * (totalVertices - 1)) / 2)) *
                    100
                )}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span>Grau médio:</span>
              <span className="font-mono">
                {Math.round((totalEdges * 2) / totalVertices)}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <p>
              <strong>Teoria:</strong> Cada célula do Sudoku é um vértice.
              Arestas conectam células que não podem ter o mesmo valor (mesma
              linha, coluna ou bloco 3×3).
            </p>
          </div>
        </CardContent>
      </Card>

      {emptyVertices > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5" />
              Análise de Domínios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-mono text-lg text-blue-600">
                  {minDomainSize}
                </div>
                <div className="text-xs text-gray-600">Mínimo</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-green-600">
                  {avgDomainSize}
                </div>
                <div className="text-xs text-gray-600">Médio</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-orange-600">
                  {maxDomainSize}
                </div>
                <div className="text-xs text-gray-600">Máximo</div>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              <p>
                <strong>MRV Heuristic:</strong> O algoritmo prioriza células com
                menor domínio (Minimum Remaining Values) para reduzir o espaço
                de busca.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {statistics.totalSteps > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5" />
              Performance do Algoritmo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>Total de Passos</span>
                </div>
                <span className="font-mono">{statistics.totalSteps}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-orange-500" />
                  <span>Backtrackings</span>
                </div>
                <span className="font-mono">{statistics.backtrackSteps}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Conflitos</span>
                </div>
                <span className="font-mono">{statistics.conflictsFound}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>Tempo</span>
                </div>
                <span className="font-mono">
                  {Math.round(statistics.timeElapsed)}ms
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Taxa de Backtrack:</span>
                <span>{backtrackRate}%</span>
              </div>
              <Progress value={backtrackRate} className="h-1" />

              <div className="flex justify-between text-xs">
                <span>Taxa de Conflito:</span>
                <span>{conflictRate}%</span>
              </div>
              <Progress value={conflictRate} className="h-1" />

              <div className="flex justify-between text-xs">
                <span>Score de Eficiência:</span>
                <span>{efficiencyScore}%</span>
              </div>
              <Progress value={efficiencyScore} className="h-1" />
            </div>

            <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
              <p>
                <strong>Backtracking:</strong> Quando o algoritmo volta atrás
                após tentar um valor inválido. Menos backtracking = maior
                eficiência.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
