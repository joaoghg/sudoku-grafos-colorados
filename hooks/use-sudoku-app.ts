"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SudokuGraph } from "@/lib/sudoku-graph";
import { SudokuSolver } from "@/lib/sudoku-solver";
import { SudokuGenerator } from "@/lib/sudoku-generator";
import { DifficultyLevel, AlgorithmState, SolvingStep } from "@/lib/types";

export function useSudokuApp() {
  const sudokuGraph = useRef(new SudokuGraph());
  const sudokuSolver = useRef(new SudokuSolver(sudokuGraph.current));
  const sudokuGenerator = useRef(new SudokuGenerator());

  const [grid, setGrid] = useState(sudokuGraph.current.getGrid());
  const [graph, setGraph] = useState(sudokuGraph.current.getGraph());
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [conflictCells, setConflictCells] = useState<
    Array<{ row: number; col: number }>
  >([]);

  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    isRunning: false,
    isPaused: false,
    isComplete: false,
    currentVertex: null,
    steps: [],
    statistics: {
      totalSteps: 0,
      backtrackSteps: 0,
      timeElapsed: 0,
      conflictsFound: 0,
      currentStep: 0,
    },
  });

  // Timers para animação passo-a-passo
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const stepDelay = 300; // milliseconds between steps

  const updateStates = useCallback(() => {
    setGrid([...sudokuGraph.current.getGrid()]);
    setGraph({ ...sudokuGraph.current.getGraph() });
  }, []);

  const setCellValue = useCallback(
    (row: number, col: number, value: number) => {
      const success = sudokuGraph.current.setValue(row, col, value);
      if (success) {
        updateStates();

        if (!sudokuGraph.current.isValid()) {
          findConflicts();
        } else {
          setConflictCells([]);
        }

        if (sudokuGraph.current.isComplete()) {
          setAlgorithmState((prev) => ({ ...prev, isComplete: true }));
        }
      }
      return success;
    },
    [updateStates]
  );

  const findConflicts = useCallback(() => {
    const conflicts: Array<{ row: number; col: number }> = [];
    const currentGrid = sudokuGraph.current.getGrid();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = currentGrid[row][col].value;
        if (value !== 0) {
          // Temporariamente remover o valor para testar
          sudokuGraph.current.setValue(row, col, 0);
          if (!sudokuGraph.current.isValidMove(row, col, value)) {
            conflicts.push({ row, col });
          }
          sudokuGraph.current.setValue(row, col, value);
        }
      }
    }

    setConflictCells(conflicts);
  }, []);

  const clearPuzzle = useCallback(() => {
    // Parar animação se estiver rodando
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }

    sudokuGraph.current.clear();
    updateStates();
    setHighlightedCell(null);
    setConflictCells([]);
    setAlgorithmState({
      isRunning: false,
      isPaused: false,
      isComplete: false,
      currentVertex: null,
      steps: [],
      statistics: {
        totalSteps: 0,
        backtrackSteps: 0,
        timeElapsed: 0,
        conflictsFound: 0,
        currentStep: 0,
      },
    });
  }, [updateStates]);

  const generatePuzzle = useCallback(
    (difficulty: DifficultyLevel) => {
      clearPuzzle();
      const puzzle = sudokuGenerator.current.generate(difficulty);
      sudokuGraph.current.loadPuzzle(puzzle);
      updateStates();
    },
    [clearPuzzle, updateStates]
  );

  const solvePuzzle = useCallback(() => {
    if (!sudokuGraph.current.isValid()) {
      alert("Puzzle inválido! Corrija os conflitos antes de resolver.");
      return;
    }

    setAlgorithmState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));

    setTimeout(() => {
      sudokuSolver.current = new SudokuSolver(sudokuGraph.current);
      const result = sudokuSolver.current.solve();

      if (result.success) {
        setAlgorithmState((prev) => ({
          ...prev,
          isRunning: false,
          isComplete: true,
          steps: result.steps,
          statistics: {
            ...result.statistics,
            currentStep: result.steps.length,
          },
        }));

        updateStates();

        // Executar animação dos passos
        if (result.steps.length > 0) {
          animateSteps(result.steps);
        }
      } else {
        setAlgorithmState((prev) => ({
          ...prev,
          isRunning: false,
          statistics: result.statistics,
        }));
        alert("Não foi possível resolver este puzzle!");
      }
    }, 100);
  }, [updateStates]);

  const solveStepByStep = useCallback(() => {
    if (!sudokuGraph.current.isValid()) {
      alert("Puzzle inválido! Corrija os conflitos antes de resolver.");
      return;
    }

    setAlgorithmState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));

    // Obter solução completa
    sudokuSolver.current = new SudokuSolver(sudokuGraph.current);
    const result = sudokuSolver.current.solve();

    if (result.success) {
      setAlgorithmState((prev) => ({
        ...prev,
        steps: result.steps,
        statistics: result.statistics,
      }));

      // Resetar grid para estado inicial
      updateStates();

      // Iniciar animação passo-a-passo
      animateStepByStep(result.steps);
    } else {
      setAlgorithmState((prev) => ({
        ...prev,
        isRunning: false,
        statistics: result.statistics,
      }));
      alert("Não foi possível resolver este puzzle!");
    }
  }, [updateStates]);

  const animateSteps = useCallback(
    (steps: SolvingStep[]) => {
      let currentStep = 0;

      const animate = () => {
        if (currentStep < steps.length) {
          const step = steps[currentStep];

          if (step.action === "assign") {
            const coord = {
              row: Math.floor(step.vertexId / 9),
              col: step.vertexId % 9,
            };
            setHighlightedCell(coord);

            // Aplicar o valor após um pequeno delay
            setTimeout(() => {
              const coord = {
                row: Math.floor(step.vertexId / 9),
                col: step.vertexId % 9,
              };
              sudokuGraph.current.setValue(coord.row, coord.col, step.value);
              updateStates();
            }, stepDelay / 2);
          }

          setAlgorithmState((prev) => ({
            ...prev,
            statistics: { ...prev.statistics, currentStep: currentStep + 1 },
          }));

          currentStep++;
          animationTimer.current = setTimeout(animate, stepDelay);
        } else {
          setHighlightedCell(null);
          setAlgorithmState((prev) => ({
            ...prev,
            isRunning: false,
            isComplete: true,
          }));
        }
      };

      animate();
    },
    [updateStates]
  );

  const animateStepByStep = useCallback((steps: SolvingStep[]) => {
    setAlgorithmState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: true, // Começa pausado para controle manual
      statistics: { ...prev.statistics, currentStep: 0 },
    }));
  }, []);

  const pauseAnimation = useCallback(() => {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }

    setAlgorithmState((prev) => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }

    setAlgorithmState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
    }));

    setHighlightedCell(null);
  }, []);

  const toggleGraphView = useCallback(() => {
    setIsGraphVisible((prev) => !prev);
  }, []);

  const toggle3DView = useCallback(() => {
    setIs3DView((prev) => !prev);
  }, []);

  const canSolve =
    sudokuGraph.current.isValid() && !sudokuGraph.current.isComplete();

  return {
    // Estados
    grid,
    graph,
    algorithmState,
    isGraphVisible,
    is3DView,
    highlightedCell,
    conflictCells,
    canSolve,

    // Ações
    setCellValue,
    clearPuzzle,
    generatePuzzle,
    solvePuzzle,
    solveStepByStep,
    pauseAnimation,
    stopAnimation,
    toggleGraphView,
    toggle3DView,

    // Utilitários
    sudokuGraph: sudokuGraph.current,
    sudokuSolver: sudokuSolver.current,
    sudokuGenerator: sudokuGenerator.current,
  };
}
