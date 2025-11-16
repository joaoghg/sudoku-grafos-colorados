"use client";

import { motion } from "framer-motion";
import { SudokuGrid } from "@/components/sudoku-grid";
import { GraphVisualization } from "@/components/graph-visualization";
import { ControlPanel } from "@/components/control-panel";
import { StatisticsPanel } from "@/components/statistics-panel";
import { EducationalSection } from "@/components/educational-section";
import { useSudokuApp } from "@/hooks/use-sudoku-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Users } from "lucide-react";

export default function SudokuGraphPage() {
  const {
    grid,
    graph,
    algorithmState,
    isGraphVisible,
    is3DView,
    highlightedCell,
    conflictCells,
    canSolve,
    setCellValue,
    clearPuzzle,
    generatePuzzle,
    solvePuzzle,
    solveStepByStep,
    pauseAnimation,
    stopAnimation,
    toggleGraphView,
    toggle3DView,
  } = useSudokuApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sudoku & Coloração de Grafos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Projeto Acadêmico de Teoria dos Grafos
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                Projeto Acadêmico
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span className="hidden md:inline">
                  João, Igor, Thales, Matheus
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Panel - Controles e Estatísticas */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ControlPanel
                onSolve={solvePuzzle}
                onStepSolve={solveStepByStep}
                onPause={pauseAnimation}
                onStop={stopAnimation}
                onClear={clearPuzzle}
                onGenerate={generatePuzzle}
                onToggleGraphView={toggleGraphView}
                onToggle3DView={toggle3DView}
                algorithmState={algorithmState}
                isGraphVisible={isGraphVisible}
                is3DView={is3DView}
                canSolve={canSolve}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatisticsPanel
                graph={graph}
                statistics={algorithmState.statistics}
                isComplete={algorithmState.isComplete}
              />
            </motion.div>
          </div>

          {/* Center Panel - Sudoku e Grafo */}
          <div className="xl:col-span-6 space-y-6">
            {/* Sudoku Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-center">
                    Grade do Sudoku
                  </CardTitle>
                  <p className="text-center text-sm text-gray-600">
                    Clique em uma célula e digite um número de 1-9, ou use as
                    teclas para navegar
                  </p>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <SudokuGrid
                    grid={grid}
                    onCellChange={setCellValue}
                    highlightedCell={highlightedCell}
                    conflictCells={conflictCells}
                    readOnly={
                      algorithmState.isRunning && !algorithmState.isPaused
                    }
                    className="max-w-md mx-auto"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Graph Visualization */}
            {isGraphVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                      Visualização do Grafo
                    </CardTitle>
                    <p className="text-center text-sm text-gray-600">
                      {is3DView
                        ? "Visualização 3D com eixo Z representando os blocos 3×3"
                        : "Layout em grade 2D correspondente ao Sudoku"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <GraphVisualization
                      graph={graph}
                      highlightedVertex={
                        highlightedCell
                          ? highlightedCell.row * 9 + highlightedCell.col
                          : null
                      }
                      view3D={is3DView}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Seção Educativa */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <EducationalSection />
            </motion.div>
          </div>
        </div>

        {/* Footer with Project Info */}
        <motion.footer
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700">
              <Book className="w-5 h-5" />
              <span>Projeto Acadêmico - Teoria dos Grafos</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Autores:</span>
              </div>
              <span>João Guilherme Herreira Garnica</span>
              <span>•</span>
              <span>Igor Ribeiro Scarlassara</span>
              <span>•</span>
              <span>Thales Zaitum</span>
              <span>•</span>
              <span>Matheus Biagio</span>
            </div>

            <p className="text-xs text-gray-500 max-w-3xl mx-auto">
              Este projeto demonstra como o problema clássico do Sudoku pode ser
              modelado e resolvido utilizando conceitos de Teoria dos Grafos,
              especificamente algoritmos de coloração com backtracking e
              heurísticas inteligentes como MRV (Minimum Remaining Values).
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
