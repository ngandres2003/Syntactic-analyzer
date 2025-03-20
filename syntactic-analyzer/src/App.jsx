"use client"

import { useState } from "react"
import CodeEditor from "./components/CodeEditor"
import AnalysisPanel from "./components/AnalysisPanel"
import { analyzeSyntax } from "./lib/syntax-analyzer"
import { Button } from "./components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

function App() {
  const [code, setCode] = useState("")
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    try {
      const result = analyzeSyntax(code)
      setAnalysisResult(result)
    } catch (error) {
      console.error("Error de análisis:", error)
      setAnalysisResult({
        success: false,
        error: error instanceof Error ? error.message : "Ocurrió un error desconocido",
        tokens: [],
        ast: null,
        errors: [{ message: error instanceof Error ? error.message : "Ocurrió un error desconocido", line: 0, column: 0 }],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Analizador de Sintaxis Java</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Entrada de Código</h2>
          <div className="border rounded-md overflow-hidden h-[500px]">
            <CodeEditor value={code} onChange={setCode} placeholder="Ingresa código Java aquí..." />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !code.trim()} className="px-6">
              {isAnalyzing ? "Analizando..." : "Analizar Sintaxis"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Resultados del Análisis</h2>
          <div className="border rounded-md p-4 h-[500px] overflow-auto bg-background">
            {analysisResult ? (
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                  <TabsTrigger value="ast">AST</TabsTrigger>
                  <TabsTrigger value="errors">Errores</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <AnalysisPanel result={analysisResult} />
                </TabsContent>
                <TabsContent value="tokens">
                  <TokensView tokens={analysisResult.tokens} />
                </TabsContent>
                <TabsContent value="ast">
                  <ASTView ast={analysisResult.ast} />
                </TabsContent>
                <TabsContent value="errors">
                  <ErrorsView errors={analysisResult.errors} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Ingresa código Java y haz clic en "Analizar Sintaxis" para ver los resultados
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function TokensView({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return <div className="text-muted-foreground">No se encontraron tokens</div>
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left border">Tipo</th>
            <th className="p-2 text-left border">Valor</th>
            <th className="p-2 text-left border">Línea</th>
            <th className="p-2 text-left border">Columna</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 border">{token.type}</td>
              <td className="p-2 border font-mono">{token.value}</td>
              <td className="p-2 border">{token.line}</td>
              <td className="p-2 border">{token.column}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ASTView({ ast }) {
  if (!ast) {
    return <div className="text-muted-foreground">No hay AST disponible</div>
  }

  const renderNode = (node, depth = 0) => {
    if (!node) return null

    return (
      <div className="ml-4" key={`${node.type}-${depth}-${Math.random()}`}>
        <div className="flex items-center py-1">
          <span className="font-semibold">{node.type}</span>
          {node.value && <span className="ml-2 text-muted-foreground font-mono">{node.value}</span>}
        </div>
        {node.children && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  return <div className="overflow-auto">{renderNode(ast)}</div>
}

function ErrorsView({ errors }) {
  if (!errors || errors.length === 0) {
    return <div className="text-green-500">No se encontraron errores de sintaxis</div>
  }

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
          <div className="font-semibold">
            Error en la línea {error.line}, columna {error.column}
          </div>
          <div>{error.message}</div>
        </div>
      ))}
    </div>
  )
}

export default App