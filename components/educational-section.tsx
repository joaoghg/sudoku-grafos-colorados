"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BookOpen,
  GitBranch,
  Palette,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react";

export function EducationalSection() {
  const [activeTab, setActiveTab] = useState("modelagem");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const tabs = [
    { id: "modelagem", label: "Modelagem" },
    { id: "coloracao", label: "Coloração" },
    { id: "algoritmo", label: "Algoritmo" },
    { id: "heuristica", label: "Heurísticas" },
  ];

  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-center justify-center text-pretty">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Teoria dos Grafos aplicada ao Sudoku
          </CardTitle>
          <p className="text-center text-gray-600 text-sm md:text-base text-pretty">
            Entenda como transformar um puzzle clássico em um problema de
            coloração de grafos
          </p>
        </CardHeader>

        <CardContent>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-2 mb-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {activeTab === "modelagem" && (
              <div className="space-y-4">
                <motion.div {...fadeInUp}>
                  <div className="flex items-start gap-3 mb-4">
                    <GitBranch className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-base md:text-lg mb-2 text-pretty">
                        Modelagem como Grafo
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 mb-3 break-words text-pretty">
                        O Sudoku pode ser representado como um grafo
                        não-direcionado onde cada célula da grade 9×9 é um
                        vértice.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Componentes do Grafo:
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Vértices (81):</strong> Uma para cada célula
                          da grade 9×9
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Arestas:</strong> Conectam células que não
                          podem ter o mesmo valor
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Restrições:</strong> Mesma linha, coluna ou
                          bloco 3×3
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">81</div>
                      <div className="text-xs text-gray-600">Vértices</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        810
                      </div>
                      <div className="text-xs text-gray-600">Arestas</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "coloracao" && (
              <div className="space-y-4">
                <motion.div {...fadeInUp}>
                  <div className="flex items-start gap-3 mb-4">
                    <Palette className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Problema de Coloração
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Resolver o Sudoku equivale a colorir o grafo com 9 cores
                        (números 1-9) seguindo a regra fundamental.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">
                        Regra da Coloração:
                      </span>
                    </div>

                    <div className="text-sm md:text-base text-purple-700 bg-white rounded p-3 break-words text-pretty">
                      <strong>
                        "Vértices adjacentes não podem ter a mesma cor"
                      </strong>
                      <p className="mt-2 text-gray-700 text-pretty">
                        No contexto do Sudoku: células conectadas por arestas
                        (mesma linha, coluna ou bloco) não podem ter o mesmo
                        número.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-red-400 rounded" />
                      <span>Cor 1 = Número 1</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-orange-400 rounded" />
                      <span>Cor 2 = Número 2</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-yellow-400 rounded" />
                      <span>Cor 3 = Número 3</span>
                    </div>
                    <div className="text-center text-xs text-gray-500">...</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-teal-400 rounded" />
                      <span>Cor 9 = Número 9</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "algoritmo" && (
              <div className="space-y-4">
                <motion.div {...fadeInUp}>
                  <div className="flex items-start gap-3 mb-4">
                    <Zap className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Algoritmo de Backtracking
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Utilizamos backtracking com heurísticas para resolver o
                        problema de coloração eficientemente.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div className="text-sm">
                        <strong>Selecionar Vértice:</strong> Escolher próxima
                        célula vazia usando heurísticas
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div className="text-sm">
                        <strong>Tentar Cores:</strong> Testar cada valor
                        possível no domínio da célula
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div className="text-sm">
                        <strong>Validar:</strong> Verificar se a cor não
                        conflita com vizinhos
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div className="text-sm">
                        <strong>Recursão/Backtrack:</strong> Continuar ou voltar
                        atrás se necessário
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "heuristica" && (
              <div className="space-y-4">
                <motion.div {...fadeInUp}>
                  <div className="flex items-start gap-3 mb-4">
                    <Brain className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Heurísticas Inteligentes
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Estratégias que tornam o algoritmo mais eficiente ao
                        reduzir o espaço de busca.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          MRV - Minimum Remaining Values
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Prioriza células com menor número de valores possíveis.
                        Reduz drasticamente o número de tentativas.
                      </p>
                      <div className="mt-2 text-xs text-green-700 bg-white rounded p-2">
                        <strong>Exemplo:</strong> Célula com 2 opções é
                        processada antes de uma com 7 opções.
                      </div>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          Most Constraining Variable
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Em caso de empate no MRV, escolhe a célula que mais
                        restringe outras células (maior grau no grafo).
                      </p>
                      <div className="mt-2 text-xs text-blue-700 bg-white rounded p-2">
                        <strong>Benefício:</strong> Resolve conflitos potenciais
                        mais cedo no processo.
                      </div>
                    </div>

                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">
                          Constraint Propagation
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Quando uma cor é atribuída, automaticamente remove essa
                        cor do domínio de todos os vizinhos.
                      </p>
                      <div className="mt-2 text-xs text-purple-700 bg-white rounded p-2">
                        <strong>Resultado:</strong> Detecção precoce de
                        impossibilidades e redução do espaço de busca.
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
