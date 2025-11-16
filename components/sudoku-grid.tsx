
'use client';

import { useState, useEffect } from 'react';
import { SudokuGrid as SudokuGridType, SudokuCell } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  grid: SudokuGridType;
  onCellChange: (row: number, col: number, value: number) => void;
  highlightedCell?: { row: number; col: number } | null;
  conflictCells?: Array<{ row: number; col: number }>;
  readOnly?: boolean;
  className?: string;
}

export function SudokuGrid({
  grid,
  onCellChange,
  highlightedCell,
  conflictCells = [],
  readOnly = false,
  className
}: SudokuGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Função para verificar se uma célula está em conflito
  const isCellInConflict = (row: number, col: number) => {
    return conflictCells.some(cell => cell.row === row && cell.col === col);
  };

  // Função para verificar se uma célula está destacada
  const isCellHighlighted = (row: number, col: number) => {
    return highlightedCell?.row === row && highlightedCell?.col === col;
  };

  // Função para obter cor do bloco
  const getBlockColor = (row: number, col: number) => {
    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    return block % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50';
  };

  // Handler para mudança de célula
  const handleCellChange = (row: number, col: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 9) {
      onCellChange(row, col, numValue);
    }
  };

  // Handler para seleção de célula
  const handleCellSelect = (row: number, col: number) => {
    if (!readOnly && !grid[row][col].isFixed) {
      setSelectedCell({ row, col });
      setInputValue(grid[row][col].value.toString() === '0' ? '' : grid[row][col].value.toString());
    }
  };

  // Handler para teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      
      if (e.key >= '1' && e.key <= '9') {
        handleCellChange(row, col, e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleCellChange(row, col, '0');
      } else if (e.key === 'Escape') {
        setSelectedCell(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell]);

  return (
    <div className={cn("grid grid-cols-9 gap-0 border-4 border-gray-800 rounded-lg overflow-hidden", className)}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: (rowIndex * 9 + colIndex) * 0.01 
            }}
            className={cn(
              "relative aspect-square border border-gray-400 flex items-center justify-center cursor-pointer select-none",
              getBlockColor(rowIndex, colIndex),
              
              // Bordas dos blocos 3x3
              {
                'border-r-4 border-r-gray-800': colIndex === 2 || colIndex === 5,
                'border-b-4 border-b-gray-800': rowIndex === 2 || rowIndex === 5,
              },
              
              // Estado da célula
              {
                'bg-green-100 border-green-400': isCellHighlighted(rowIndex, colIndex),
                'bg-red-100 border-red-400': isCellInConflict(rowIndex, colIndex),
                'bg-yellow-100 border-yellow-400': selectedCell?.row === rowIndex && selectedCell?.col === colIndex,
                'cursor-not-allowed opacity-70': readOnly || cell.isFixed,
                'hover:bg-opacity-80': !readOnly && !cell.isFixed,
              }
            )}
            onClick={() => handleCellSelect(rowIndex, colIndex)}
            whileHover={{ scale: readOnly ? 1 : 1.05 }}
            whileTap={{ scale: readOnly ? 1 : 0.95 }}
          >
            {/* Número da célula */}
            <span
              className={cn(
                "text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-200",
                {
                  'text-blue-800': cell.isFixed,
                  'text-purple-700': !cell.isFixed && cell.value !== 0,
                  'text-red-600': isCellInConflict(rowIndex, colIndex),
                  'text-green-600': isCellHighlighted(rowIndex, colIndex),
                }
              )}
            >
              {cell.value === 0 ? '' : cell.value}
            </span>

            {/* Indicador de célula fixa */}
            {cell.isFixed && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full opacity-60" />
            )}

            {/* Indicador de conflito */}
            {isCellInConflict(rowIndex, colIndex) && (
              <motion.div
                className="absolute inset-0 bg-red-200 opacity-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Indicador de destaque */}
            {isCellHighlighted(rowIndex, colIndex) && (
              <motion.div
                className="absolute inset-0 border-4 border-green-500 rounded pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              />
            )}
          </motion.div>
        ))
      )}

      {/* Legenda */}
      <div className="col-span-9 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-600 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-gray-400 rounded" />
          <span>Bloco Par</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-50 border border-gray-400 rounded" />
          <span>Bloco Ímpar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Fixo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-400 rounded" />
          <span>Conflito</span>
        </div>
      </div>
    </div>
  );
}
