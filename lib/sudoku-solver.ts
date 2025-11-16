
import { SudokuGraph } from './sudoku-graph';
import { SolvingStep, SolvingStatistics, GraphVertex } from './types';

/**
 * Algoritmo de resolução de Sudoku usando coloração de grafos com backtracking
 */
export class SudokuSolver {
  private sudokuGraph: SudokuGraph;
  private steps: SolvingStep[] = [];
  private statistics: SolvingStatistics = {
    totalSteps: 0,
    backtrackSteps: 0,
    timeElapsed: 0,
    conflictsFound: 0,
    currentStep: 0
  };

  constructor(sudokuGraph: SudokuGraph) {
    this.sudokuGraph = sudokuGraph;
  }

  /**
   * Resolve o Sudoku usando backtracking com heurísticas
   */
  public solve(): { success: boolean; steps: SolvingStep[]; statistics: SolvingStatistics } {
    this.resetSolution();
    const startTime = performance.now();
    
    const success = this.backtrackSolve();
    
    this.statistics.timeElapsed = performance.now() - startTime;
    
    return {
      success,
      steps: this.steps,
      statistics: this.statistics
    };
  }

  /**
   * Reset da solução para nova tentativa
   */
  private resetSolution(): void {
    this.steps = [];
    this.statistics = {
      totalSteps: 0,
      backtrackSteps: 0,
      timeElapsed: 0,
      conflictsFound: 0,
      currentStep: 0
    };
  }

  /**
   * Algoritmo principal de backtracking
   */
  private backtrackSolve(): boolean {
    // Encontrar próxima célula vazia usando heurística MRV (Minimum Remaining Values)
    const vertex = this.selectNextVertex();
    
    if (!vertex) {
      // Todas as células preenchidas - solução encontrada
      return true;
    }

    const possibleValues = Array.from(vertex.domain).sort();
    if (possibleValues.length === 0) {
      this.statistics.conflictsFound++;
      this.recordStep(vertex.id, 0, 'conflict');
      return false;
    }
    
    for (const value of possibleValues) {
      this.statistics.totalSteps++;
      
      // Tentar atribuir o valor
      if (this.assignValue(vertex, value)) {
        this.recordStep(vertex.id, value, 'assign');
        
        // Recursão
        if (this.backtrackSolve()) {
          return true; // Solução encontrada
        }
        
        // Backtrack
        this.statistics.backtrackSteps++;
        this.recordStep(vertex.id, 0, 'backtrack');
        this.unassignValue(vertex);
      } else {
        this.statistics.conflictsFound++;
        this.recordStep(vertex.id, value, 'conflict');
      }
    }
    
    return false; // Nenhuma solução encontrada
  }

  /**
   * Heurística MRV: Seleciona o vértice com menor domínio
   */
  private selectNextVertex(): GraphVertex | null {
    const graph = this.sudokuGraph.getGraph();
    let bestVertex: GraphVertex | null = null;
    let minDomainSize = 10;
    let maxDegree = -1;

    for (const vertex of graph.vertices) {
      if (vertex.value === 0) { // Célula vazia
        const domainSize = vertex.domain.size;
        const degree = vertex.neighbors.size;

        // MRV: Menor domínio primeiro
        // Em caso de empate, usar grau como desempate (Most Constraining Variable)
        if (domainSize < minDomainSize || 
           (domainSize === minDomainSize && degree > maxDegree)) {
          bestVertex = vertex;
          minDomainSize = domainSize;
          maxDegree = degree;
        }
      }
    }

    return bestVertex;
  }

  /**
   * Atribui um valor a um vértice
   */
  private assignValue(vertex: GraphVertex, value: number): boolean {
    const cell = this.sudokuGraph.idToCell(vertex.id);
    return this.sudokuGraph.setValue(cell.row, cell.col, value);
  }

  /**
   * Remove atribuição de um vértice
   */
  private unassignValue(vertex: GraphVertex): void {
    const cell = this.sudokuGraph.idToCell(vertex.id);
    this.sudokuGraph.setValue(cell.row, cell.col, 0);
  }

  /**
   * Registra um passo da solução
   */
  private recordStep(vertexId: number, value: number, action: 'assign' | 'backtrack' | 'conflict'): void {
    const graph = this.sudokuGraph.getGraph();
    const domainSizes = graph.vertices.map(v => v.domain.size);
    
    this.steps.push({
      vertexId,
      value,
      action,
      domainSizes,
      timestamp: Date.now()
    });
  }

  /**
   * Obtém estatísticas da resolução
   */
  public getStatistics(): SolvingStatistics {
    return { ...this.statistics };
  }

  /**
   * Verifica se existe uma solução única
   */
  public hasUniqueSolution(): boolean {
    // Salvar estado atual
    const originalGrid = this.sudokuGraph.getGrid().map(row => 
      row.map(cell => ({ ...cell }))
    );

    let solutionCount = 0;
    const maxSolutions = 2; // Só precisamos saber se tem mais de 1

    // Função para contar soluções
    const countSolutions = (): boolean => {
      const vertex = this.selectNextVertex();
      
      if (!vertex) {
        solutionCount++;
        return solutionCount >= maxSolutions;
      }

      for (const value of Array.from(vertex.domain)) {
        if (this.assignValue(vertex, value)) {
          if (countSolutions()) {
            return true; // Encontrou mais de uma solução
          }
          this.unassignValue(vertex);
        }
      }
      
      return false;
    };

    const hasMultipleSolutions = countSolutions();

    // Restaurar estado original
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const originalCell = originalGrid[row][col];
        this.sudokuGraph.setValue(row, col, originalCell.value, originalCell.isFixed);
      }
    }

    return solutionCount === 1;
  }

  /**
   * Valida se o puzzle tem solução possível
   */
  public isPuzzleSolvable(): boolean {
    if (!this.sudokuGraph.isValid()) {
      return false;
    }

    // Verificar se alguma célula vazia tem domínio vazio
    const graph = this.sudokuGraph.getGraph();
    for (const vertex of graph.vertices) {
      if (vertex.value === 0 && vertex.domain.size === 0) {
        return false;
      }
    }

    // Tentar resolver uma cópia
    const originalGrid = this.sudokuGraph.getGrid().map(row => 
      row.map(cell => ({ ...cell }))
    );

    const result = this.solve();

    // Restaurar estado original
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const originalCell = originalGrid[row][col];
        this.sudokuGraph.setValue(row, col, originalCell.value, originalCell.isFixed);
      }
    }

    return result.success;
  }
}

// Função utilitária para converter ID para coordenadas
export function idToCoord(id: number): { row: number; col: number } {
  return {
    row: Math.floor(id / 9),
    col: id % 9
  };
}
