import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

export default function AnalysisPanel({ result }) {
  const { success, tokens, errors } = result

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Status:</span>
        {success ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Success
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Tokens</span>
              <span className="font-medium">{tokens?.length || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Errors</span>
              <span className="font-medium">{errors?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {errors && errors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Error Summary</h3>
          <div className="space-y-2">
            {errors.slice(0, 3).map((error, index) => (
              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                <div>
                  Line {error.line}, Column {error.column}
                </div>
                <div className="font-medium">{error.message}</div>
              </div>
            ))}
            {errors.length > 3 && (
              <div className="text-sm text-muted-foreground">And {errors.length - 3} more errors...</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

