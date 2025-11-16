import { DifficultyLevel } from "./types";
import { SudokuGraph } from "./sudoku-graph";
import { SudokuSolver } from "./sudoku-solver";

/**
 * Gerador de puzzles de Sudoku com diferentes níveis de dificuldade
 */
export class SudokuGenerator {
  /**
   * Gera um puzzle de Sudoku completo
   */
  public generateComplete(): number[][] {
    const grid = this.createEmptyGrid();
    this.fillGrid(grid);
    return grid;
  }

  /**
   * Gera um puzzle de Sudoku com nível de dificuldade especificado
   */
  public generate(difficulty: DifficultyLevel): number[][] {
    const completeGrid = this.generateComplete();
    return this.removeCells(completeGrid, difficulty);
  }

  /**
   * Cria uma grade 9x9 vazia
   */
  private createEmptyGrid(): number[][] {
    return Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));
  }

  /**
   * Preenche a grade com uma solução válida
   */
  private fillGrid(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          for (const num of numbers) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.fillGrid(grid)) {
                return true;
              }

              grid[row][col] = 0;
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  /**
   * Verifica se um número é válido em uma posição
   */
  private isValid(
    grid: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    // Verificar linha
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) return false;
    }

    // Verificar coluna
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) return false;
    }

    // Verificar bloco 3x3
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  }

  /**
   * Remove células baseado no nível de dificuldade
   */
  private removeCells(
    grid: number[][],
    difficulty: DifficultyLevel
  ): number[][] {
    const result = grid.map((row) => [...row]);
    const difficultySettings = this.getDifficultySettings(difficulty);

    let cellsToRemove = difficultySettings.cellsToRemove;
    const attempts = difficultySettings.maxAttempts;
    const requireUnique = difficulty === "dificil" || difficulty === "extremo";

    for (let attempt = 0; attempt < attempts && cellsToRemove > 0; attempt++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (result[row][col] !== 0) {
        const backup = result[row][col];
        result[row][col] = 0;

        // Verificar se puzzle segue resolvível pelo solver de grafos
        const solvable = this.hasValidSolutionGraph(result);
        const uniqueOk = !requireUnique || this.hasUniqueSolutionGraph(result);
        if (solvable && uniqueOk) {
          cellsToRemove--;
        } else {
          result[row][col] = backup;
        }
      }
    }

    return result;
  }

  /**
   * Configurações de dificuldade
   */
  private getDifficultySettings(difficulty: DifficultyLevel) {
    switch (difficulty) {
      case "facil":
        return { cellsToRemove: 35, maxAttempts: 50 };
      case "medio":
        return { cellsToRemove: 45, maxAttempts: 70 };
      case "dificil":
        return { cellsToRemove: 55, maxAttempts: 90 };
      case "extremo":
        return { cellsToRemove: 65, maxAttempts: 120 };
      default:
        return { cellsToRemove: 40, maxAttempts: 60 };
    }
  }

  /**
   * Verifica se o puzzle tem pelo menos uma solução válida
   */
  private hasValidSolution(grid: number[][]): boolean {
    const testGrid = grid.map((row) => [...row]);
    return this.solveSimple(testGrid);
  }

  /**
   * Verifica solvabilidade usando o solver de grafos (alinhado com a UI)
   */
  private hasValidSolutionGraph(grid: number[][]): boolean {
    const graph = new SudokuGraph();
    graph.loadPuzzle(grid);
    const solver = new SudokuSolver(graph);
    return solver.isPuzzleSolvable();
  }

  /**
   * Verifica unicidade de solução usando o solver de grafos
   */
  private hasUniqueSolutionGraph(grid: number[][]): boolean {
    const graph = new SudokuGraph();
    graph.loadPuzzle(grid);
    const solver = new SudokuSolver(graph);
    return solver.hasUniqueSolution();
  }

  /**
   * Solver simples para validação
   */
  private solveSimple(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.solveSimple(grid)) {
                return true;
              }

              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Embaralha array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Puzzles pré-definidos para demonstração
   */
  public getPredefinedPuzzles(): Record<DifficultyLevel, number[][]> {
    return {
      facil: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      medio: [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
      ],
      dificil: [
        [0, 0, 0, 0, 0, 6, 0, 0, 0],
        [0, 5, 9, 0, 0, 0, 0, 0, 8],
        [2, 0, 0, 0, 0, 8, 0, 0, 0],
        [0, 4, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 6, 0, 0, 3, 0, 5, 4],
        [0, 0, 0, 3, 2, 5, 0, 0, 6],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      extremo: [
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 6, 0, 2],
        [0, 0, 0, 0, 3, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 7, 0],
        [0, 0, 6, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
      ],
    };
  }
}
