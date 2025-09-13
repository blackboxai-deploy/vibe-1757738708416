"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface SignatureSectionProps {
  form: any;
  onPrev: () => void;
  onSave: () => void;
}

export default function SignatureSection({ form, onPrev, onSave }: SignatureSectionProps) {
  
  const commission = form.watch('commission') || [];
  const signatures = form.watch('signatures') || [];

  return (
    <div className="space-y-6">
      
      {/* Nagłówek */}
      <Card>
        <CardHeader>
          <CardTitle>Punkt 17: Podpisy Członków Komisji</CardTitle>
          <CardDescription>
            Potwierdzenie prawdziwości danych i przyjęcie odpowiedzialności przez członków komisji
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Lista podpisów */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista Podpisów
            <Badge variant="outline">
              {signatures.length} z {commission.length} podpisów
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {commission.length === 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription>
                Brak członków komisji. Wróć do kroku "Komisja" aby dodać członków.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {commission.map((member: any, index: number) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.role} • {member.position} • {member.company}
                    </div>
                  </div>
                  <Badge variant={signatures.some((s: any) => s.memberId === member.id) ? "default" : "outline"}>
                    {signatures.some((s: any) => s.memberId === member.id) ? "Podpisano" : "Oczekuje"}
                  </Badge>
                </div>

                {/* Symulacja podpisu elektronicznego */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data podpisu</label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Miejsce podpisu</label>
                    <input
                      type="text"
                      placeholder="Warszawa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Potwierdzam prawdziwość przedstawionych danych</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Przyjmuję odpowiedzialność za dokonaną ocenę</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Wyrażam zgodę na przetwarzanie danych osobowych (RODO)</span>
                  </label>
                </div>

                <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 px-4 pb-4">
                  <div className="text-sm text-gray-600 mb-2">Podpis elektroniczny:</div>
                  <div className="bg-white border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
                    [Miejsce na podpis elektroniczny lub odcisk palca]
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Podsumowanie protokołu */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Podsumowanie Protokołu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Dane podstawowe</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Numer: {form.watch('protocolNumber') || 'Nie wypełniono'}</li>
                <li>• Typ: {form.watch('assessmentType') || 'Nie wybrano'}</li>
                <li>• Pojazd: {form.watch('vehicleData.identification.vehicleNumber') || 'Nie wypełniono'}</li>
                <li>• Lokalizacja: {form.watch('location') || 'Nie wypełniono'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Status oceny</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Komisja: {commission.length} członków</li>
                <li>• Stan techniczny: {(form.watch('technicalState') || []).length} elementów</li>
                <li>• Podpisy: {signatures.length} z {commission.length}</li>
                <li>• Wymaga naprawy: {form.watch('repairNeeded') ? 'Tak' : 'Nie'}</li>
              </ul>
            </div>
          </div>

          {form.watch('repairNeeded') && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                ⚠️ Pojazd został oceniony jako wymagający naprawy przed dopuszczeniem do eksploatacji.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Nawigacja i zapisanie */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Wstecz: Stan Techniczny
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">
            📄 Podgląd PDF
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            ✅ Zapisz Protokół
          </Button>
        </div>
      </div>
    </div>
  );
}