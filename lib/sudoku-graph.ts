
import { SudokuGrid, SudokuCell, Graph, GraphVertex } from './types';

/**
 * Classe principal para modelar Sudoku como um problema de coloração de grafos
 */
export class SudokuGraph {
  private graph: Graph;
  private grid: SudokuGrid;

  constructor() {
    this.grid = this.createEmptyGrid();
    this.graph = this.createGraphFromGrid(this.grid);
  }

  /**
   * Cria uma grade 9x9 vazia do Sudoku
   */
  private createEmptyGrid(): SudokuGrid {
    const grid: SudokuGrid = [];
    for (let row = 0; row < 9; row++) {
      grid[row] = [];
      for (let col = 0; col < 9; col++) {
        const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        grid[row][col] = {
          value: 0,
          isFixed: false,
          row,
          col,
          block
        };
      }
    }
    return grid;
  }

  /**
   * Converte coordenadas (row, col) para ID único do vértice
   */
  private cellToId(row: number, col: number): number {
    return row * 9 + col;
  }

  /**
   * Converte ID do vértice para coordenadas (row, col)
   */
  private idToCellPrivate(id: number): { row: number; col: number } {
    return {
      row: Math.floor(id / 9),
      col: id % 9
    };
  }

  /**
   * Cria o grafo a partir da grade do Sudoku
   * 81 vértices, um para cada célula
   * Arestas conectam células que não podem ter o mesmo valor
   */
  private createGraphFromGrid(grid: SudokuGrid): Graph {
    const vertices: GraphVertex[] = [];
    const edges: Array<[number, number]> = [];

    // Criar vértices
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const id = this.cellToId(row, col);
        const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        
        vertices[id] = {
          id,
          row,
          col,
          block,
          value: grid[row][col].value,
          domain: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
          neighbors: new Set()
        };
      }
    }

    // Criar arestas (conectar células que não podem ter o mesmo valor)
    for (let i = 0; i < 81; i++) {
      const cell1 = this.idToCellPrivate(i);
      
      for (let j = i + 1; j < 81; j++) {
        const cell2 = this.idToCellPrivate(j);
        
        // Mesma linha, coluna ou bloco 3x3 = conectados
        if (this.areConnected(cell1.row, cell1.col, cell2.row, cell2.col)) {
          edges.push([i, j]);
          vertices[i].neighbors.add(j);
          vertices[j].neighbors.add(i);
        }
      }
    }

    return { vertices, edges };
  }

  /**
   * Verifica se duas células estão conectadas (mesma linha, coluna ou bloco)
   */
  private areConnected(row1: number, col1: number, row2: number, col2: number): boolean {
    // Mesma linha
    if (row1 === row2) return true;
    
    // Mesma coluna
    if (col1 === col2) return true;
    
    // Mesmo bloco 3x3
    const block1 = Math.floor(row1 / 3) * 3 + Math.floor(col1 / 3);
    const block2 = Math.floor(row2 / 3) * 3 + Math.floor(col2 / 3);
    if (block1 === block2) return true;
    
    return false;
  }

  /**
   * Define um valor para uma célula e atualiza os domínios dos vizinhos
   */
  public setValue(row: number, col: number, value: number, isFixed = false): boolean {
    if (row < 0 || row > 8 || col < 0 || col > 8) return false;
    if (value < 0 || value > 9) return false;

    const id = this.cellToId(row, col);
    const vertex = this.graph.vertices[id];

    // Se está removendo valor (value = 0)
    if (value === 0) {
      this.grid[row][col].value = 0;
      this.grid[row][col].isFixed = false;
      vertex.value = 0;
      this.updateDomains();
      return true;
    }

    // Verificar se o valor é válido
    if (!this.isValidMove(row, col, value)) {
      return false;
    }

    // Definir valor
    this.grid[row][col].value = value;
    this.grid[row][col].isFixed = isFixed;
    vertex.value = value;

    // Atualizar domínios
    this.updateDomains();

    return true;
  }

  /**
   * Verifica se um movimento é válido
   */
  public isValidMove(row: number, col: number, value: number): boolean {
    if (value === 0) return true; // Sempre pode limpar uma célula

    // Verificar linha
    for (let c = 0; c < 9; c++) {
      if (c !== col && this.grid[row][c].value === value) {
        return false;
      }
    }

    // Verificar coluna
    for (let r = 0; r < 9; r++) {
      if (r !== row && this.grid[r][col].value === value) {
        return false;
      }
    }

    // Verificar bloco 3x3
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if ((r !== row || c !== col) && this.grid[r][c].value === value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Atualiza os domínios de todos os vértices baseado nos valores atuais
   */
  private updateDomains(): void {
    for (const vertex of this.graph.vertices) {
      if (vertex.value !== 0) {
        vertex.domain = new Set([vertex.value]);
      } else {
        vertex.domain = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        // Remover valores que estão nos vizinhos
        for (const neighborId of vertex.neighbors) {
          const neighbor = this.graph.vertices[neighborId];
          if (neighbor.value !== 0) {
            vertex.domain.delete(neighbor.value);
          }
        }
      }
    }
  }

  /**
   * Verifica se o Sudoku atual é válido
   */
  public isValid(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.grid[row][col].value;
        if (value !== 0) {
          // Temporariamente remover o valor para testar
          this.grid[row][col].value = 0;
          const isValidMove = this.isValidMove(row, col, value);
          this.grid[row][col].value = value; // Restaurar
          
          if (!isValidMove) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Verifica se o Sudoku está completo
   */
  public isComplete(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col].value === 0) {
          return false;
        }
      }
    }
    return this.isValid();
  }

  /**
   * Limpa a grade (remove valores não fixos)
   */
  public clear(): void {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!this.grid[row][col].isFixed) {
          this.setValue(row, col, 0);
        }
      }
    }
  }

  /**
   * Carrega um puzzle do Sudoku
   */
  public loadPuzzle(puzzle: number[][]): void {
    this.clear();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row] && puzzle[row][col] && puzzle[row][col] !== 0) {
          this.setValue(row, col, puzzle[row][col], true);
        }
      }
    }
  }

  // Getters
  public getGrid(): SudokuGrid {
    return this.grid;
  }

  public getGraph(): Graph {
    return this.graph;
  }

  public getCell(row: number, col: number): SudokuCell | null {
    if (row < 0 || row > 8 || col < 0 || col > 8) return null;
    return this.grid[row][col];
  }

  public getVertex(id: number): GraphVertex | null {
    if (id < 0 || id > 80) return null;
    return this.graph.vertices[id];
  }

  /**
   * Converte ID para coordenadas (método público)
   */
  public idToCell(id: number): { row: number; col: number } {
    return {
      row: Math.floor(id / 9),
      col: id % 9
    };
  }

  /**
   * Retorna estatísticas do grafo
   */
  public getGraphStats() {
    const totalVertices = 81;
    const totalEdges = this.graph.edges.length;
    const emptyVertices = this.graph.vertices.filter(v => v.value === 0).length;
    const filledVertices = totalVertices - emptyVertices;
    
    return {
      totalVertices,
      totalEdges,
      emptyVertices,
      filledVertices,
      completionPercentage: Math.round((filledVertices / totalVertices) * 100)
    };
  }
}
