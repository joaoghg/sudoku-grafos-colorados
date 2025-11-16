"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  FastForward,
  SkipForward,
  SkipBack,
  Settings,
  Zap,
} from "lucide-react";
import { DifficultyLevel, AlgorithmState } from "@/lib/types";

interface ControlPanelProps {
  onSolve: () => void;
  onStepSolve: () => void;
  onPause: () => void;
  onStop: () => void;
  onClear: () => void;
  onGenerate: (difficulty: DifficultyLevel) => void;
  onToggleGraphView: () => void;
  onToggle3DView: () => void;
  algorithmState: AlgorithmState;
  isGraphVisible: boolean;
  is3DView: boolean;
  canSolve: boolean;
}

export function ControlPanel({
  onSolve,
  onStepSolve,
  onPause,
  onStop,
  onClear,
  onGenerate,
  onToggleGraphView,
  onToggle3DView,
  algorithmState,
  isGraphVisible,
  is3DView,
  canSolve,
}: ControlPanelProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("medio");

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "facil":
        return "bg-green-100 text-green-800 border-green-300";
      case "medio":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "dificil":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "extremo":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusBadge = () => {
    if (algorithmState.isComplete) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          Resolvido
        </Badge>
      );
    }
    if (algorithmState.isRunning && !algorithmState.isPaused) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          Executando
        </Badge>
      );
    }
    if (algorithmState.isPaused) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Pausado
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
        Pronto
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Status e Controles Principais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Controles do Algoritmo</span>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controles de Execução */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onSolve}
              disabled={!canSolve || algorithmState.isRunning}
              className="flex-1 sm:flex-none sm:w-auto whitespace-normal break-words text-xs sm:text-sm leading-snug"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Resolver Automaticamente
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {algorithmState.isRunning && !algorithmState.isPaused && (
              <Button onClick={onPause} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            )}

            {(algorithmState.isRunning || algorithmState.isPaused) && (
              <Button onClick={onStop} variant="outline" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Parar
              </Button>
            )}

            <Button onClick={onClear} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gerador de Puzzles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gerar Puzzle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={selectedDifficulty}
              onValueChange={(value: DifficultyLevel) =>
                setSelectedDifficulty(value)
              }
            >
              <SelectTrigger className="flex-1 min-w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facil">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded ${getDifficultyColor(
                        "facil"
                      )}`}
                    />
                    Fácil
                  </div>
                </SelectItem>
                <SelectItem value="medio">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded ${getDifficultyColor(
                        "medio"
                      )}`}
                    />
                    Médio
                  </div>
                </SelectItem>
                <SelectItem value="dificil">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded ${getDifficultyColor(
                        "dificil"
                      )}`}
                    />
                    Difícil
                  </div>
                </SelectItem>
                <SelectItem value="extremo">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded ${getDifficultyColor(
                        "extremo"
                      )}`}
                    />
                    Extremo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => onGenerate(selectedDifficulty)}
              disabled={algorithmState.isRunning}
              size="sm"
              className="sm:w-auto"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Gerar
            </Button>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Fácil:</span>
              <span>~35 células removidas</span>
            </div>
            <div className="flex justify-between">
              <span>Médio:</span>
              <span>~45 células removidas</span>
            </div>
            <div className="flex justify-between">
              <span>Difícil:</span>
              <span>~55 células removidas</span>
            </div>
            <div className="flex justify-between">
              <span>Extremo:</span>
              <span>~65 células removidas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Visualização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={onToggleGraphView}
              variant={isGraphVisible ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              {isGraphVisible ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {isGraphVisible ? "Ocultar" : "Mostrar"} Grafo
            </Button>

            {/* {isGraphVisible && (
              <Button
                onClick={onToggle3DView}
                variant={is3DView ? "default" : "outline"}
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                {is3DView ? "2D" : "3D"}
              </Button>
            )} */}
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p>
              • <strong>2D:</strong> Layout grade tradicional
            </p>
            {/* <p>• <strong>3D:</strong> Visualização por blocos</p> */}
            <p>
              • <strong>Cores:</strong> Representam números 1-9
            </p>
            <p>
              • <strong>Arestas:</strong> Conectam células restritas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progresso da Execução */}
      {(algorithmState.isRunning ||
        algorithmState.isComplete ||
        algorithmState.steps.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Passos:</span>
                  <span>
                    {algorithmState.statistics.currentStep - 1} /{" "}
                    {algorithmState.steps.length}
                  </span>
                </div>

                {algorithmState.steps.length > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (algorithmState.statistics.currentStep /
                            algorithmState.steps.length) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-3">
                  <div>Total: {algorithmState.statistics.totalSteps}</div>
                  <div>
                    Backtrack: {algorithmState.statistics.backtrackSteps}
                  </div>
                  <div>
                    Conflitos: {algorithmState.statistics.conflictsFound}
                  </div>
                  <div>
                    Tempo: {Math.round(algorithmState.statistics.timeElapsed)}ms
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
