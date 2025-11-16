
// Tipos para representação do Sudoku e Grafo

export type SudokuCell = {
  value: number; // 0 = vazio, 1-9 = números
  isFixed: boolean; // true se foi preenchido pelo usuário/puzzle inicial
  row: number;
  col: number;
  block: number; // 0-8 representando os 9 blocos 3x3
}

export type SudokuGrid = SudokuCell[][];

export type GraphVertex = {
  id: number; // 0-80 (índice único para cada célula)
  row: number;
  col: number;
  block: number;
  value: number; // cor atual (0 = não colorido, 1-9 = cores)
  domain: Set<number>; // valores possíveis para esta célula
  neighbors: Set<number>; // IDs dos vértices vizinhos
}

export type Graph = {
  vertices: GraphVertex[];
  edges: Array<[number, number]>; // pares de IDs conectados
}

export type SolvingStep = {
  vertexId: number;
  value: number;
  action: 'assign' | 'backtrack' | 'conflict';
  domainSizes: number[]; // tamanho do domínio de cada vértice neste momento
  timestamp: number;
}

export type SolvingStatistics = {
  totalSteps: number;
  backtrackSteps: number;
  timeElapsed: number;
  conflictsFound: number;
  currentStep: number;
}

export type DifficultyLevel = 'facil' | 'medio' | 'dificil' | 'extremo';

export type AlgorithmState = {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  currentVertex: number | null;
  steps: SolvingStep[];
  statistics: SolvingStatistics;
}
