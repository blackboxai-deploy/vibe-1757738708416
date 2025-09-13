"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtocolValidation } from "@/types/protocol";

interface ValidationMessagesProps {
  validation: ProtocolValidation;
}

export default function ValidationMessages({ validation }: ValidationMessagesProps) {
  
  if (validation.errors.length === 0 && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      
      {/* Błędy krytyczne */}
      {validation.errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>
            <div className="flex items-center justify-between mb-2">
              <strong className="text-red-800">❌ Błędy wymagające poprawki:</strong>
              <Badge variant="destructive">{validation.errors.length}</Badge>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Ostrzeżenia */}
      {validation.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription>
            <div className="flex items-center justify-between mb-2">
              <strong className="text-yellow-800">⚠️ Ostrzeżenia:</strong>
              <Badge variant="outline" className="border-yellow-400">{validation.warnings.length}</Badge>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700 text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Brakujące pola */}
      {validation.missingFields.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription>
            <div className="flex items-center justify-between mb-2">
              <strong className="text-blue-800">📋 Brakujące pola:</strong>
              <Badge variant="outline" className="border-blue-400">{validation.missingFields.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {validation.missingFields.map((field, index) => (
                <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                  {field}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Status kompletności */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Status Kompletności Protokołu
            <Badge variant={validation.completionPercentage === 100 ? "default" : "outline"}>
              {validation.completionPercentage}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                validation.completionPercentage === 100 
                  ? 'bg-green-500' 
                  : validation.completionPercentage >= 70 
                    ? 'bg-blue-500' 
                    : validation.completionPercentage >= 40 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
              }`}
              style={{ width: `${validation.completionPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-600 text-center">
            {validation.isValid 
              ? "✅ Protokół gotowy do finalizacji" 
              : "🔄 Protokół wymaga uzupełnienia"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}