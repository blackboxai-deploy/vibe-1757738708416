"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { TechnicalStateItem } from "@/types/protocol";
import { TECHNICAL_STATE_POINTS } from "@/lib/vehicleTemplates";

interface TechnicalStateTableProps {
  form: any;
  onNext: () => void;
  onPrev: () => void;
}

export default function TechnicalStateTable({ form, onNext, onPrev }: TechnicalStateTableProps) {
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterCondition, setFilterCondition] = useState<string>('all');
  
  const technicalState = form.watch('technicalState') as TechnicalStateItem[];
  
  // Statystyki stanu technicznego
  const stats = technicalState.reduce((acc, item) => {
    acc[item.condition] = (acc[item.condition] || 0) + 1;
    acc.total++;
    return acc;
  }, { total: 0 } as Record<string, number>);

  // Filtrowanie elementów
  const filteredItems = technicalState.filter(item => 
    filterCondition === 'all' || item.condition === filterCondition
  );

  // Rozwijanie/zwijanie wierszy
  const toggleRow = (itemId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Aktualizacja stanu technicznego
  const updateTechnicalStateItem = (itemId: string, field: keyof TechnicalStateItem, value: any) => {
    const currentState = form.getValues('technicalState') as TechnicalStateItem[];
    const updatedState = currentState.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    form.setValue('technicalState', updatedState);
  };

  // Mapowanie kolorów dla stanów
  const getConditionColor = (condition: string) => {
    const colors = {
      sprawny: 'bg-green-100 text-green-800 border-green-200',
      niesprawny: 'bg-red-100 text-red-800 border-red-200',
      wymaga_naprawy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      do_wymiany: 'bg-orange-100 text-orange-800 border-orange-200',
      nie_dotyczy: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[condition as keyof typeof colors] || colors.sprawny;
  };

  // Mapowanie krytyczności
  const getCriticalityIcon = (criticality?: string) => {
    switch (criticality) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Nagłówek */}
      <Card>
        <CardHeader>
          <CardTitle>Punkty 11-15: Ocena Stanu Technicznego (a-q)</CardTitle>
          <CardDescription>
            Szczegółowa ocena wszystkich elementów zgodnie z załącznikiem nr 8 PKP PLK
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* Statystyki */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">Łącznie</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.sprawny || 0}</div>
              <div className="text-sm text-green-600">Sprawne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.wymaga_naprawy || 0}</div>
              <div className="text-sm text-yellow-600">Do naprawy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.do_wymiany || 0}</div>
              <div className="text-sm text-orange-600">Do wymiany</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.niesprawny || 0}</div>
              <div className="text-sm text-red-600">Niesprawne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.nie_dotyczy || 0}</div>
              <div className="text-sm text-gray-600">N/D</div>
            </div>
          </div>

          {/* Filtry */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={filterCondition === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCondition('all')}
            >
              Wszystkie ({stats.total})
            </Button>
            <Button 
              variant={filterCondition === 'sprawny' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCondition('sprawny')}
            >
              Sprawne ({stats.sprawny || 0})
            </Button>
            <Button 
              variant={filterCondition === 'niesprawny' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCondition('niesprawny')}
            >
              Niesprawne ({stats.niesprawny || 0})
            </Button>
          </div>

          {/* Ostrzeżenia */}
          {(stats.niesprawny > 0 || stats.do_wymiany > 0) && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription>
                <strong>⚠️ Uwaga!</strong> Wykryto elementy niesprawne lub wymagające wymiany. 
                Wymagane szczegółowe uzasadnienie w uwagach.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabela stanu technicznego */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela Oceny Stanu Technicznego</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Punkt</th>
                  <th className="text-left p-4 font-medium">Opis elementu</th>
                  <th className="text-left p-4 font-medium">Stan</th>
                  <th className="text-left p-4 font-medium">Krytyczność</th>
                  <th className="text-left p-4 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    
                    {/* Punkt */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono">
                          {item.point}
                        </Badge>
                        {getCriticalityIcon(item.criticality)}
                      </div>
                    </td>

                    {/* Opis */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-sm">
                          {TECHNICAL_STATE_POINTS[item.point as keyof typeof TECHNICAL_STATE_POINTS]}
                        </div>
                        
                        {expandedRows.has(item.id) && (
                          <div className="space-y-3">
                            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                              {item.description}
                            </div>
                            
                            {/* Edycja opisu */}
                            <textarea
                              value={item.description}
                              onChange={(e) => updateTechnicalStateItem(item.id, 'description', e.target.value)}
                              placeholder="Szczegółowy opis elementu..."
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stan */}
                    <td className="p-4">
                      <select
                        value={item.condition}
                        onChange={(e) => updateTechnicalStateItem(item.id, 'condition', e.target.value)}
                        className={`px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getConditionColor(item.condition)}`}
                      >
                        <option value="sprawny">Sprawny</option>
                        <option value="wymaga_naprawy">Wymaga naprawy</option>
                        <option value="do_wymiany">Do wymiany</option>
                        <option value="niesprawny">Niesprawny</option>
                        <option value="nie_dotyczy">Nie dotyczy</option>
                      </select>
                    </td>

                    {/* Krytyczność */}
                    <td className="p-4">
                      <select
                        value={item.criticality || 'medium'}
                        onChange={(e) => updateTechnicalStateItem(item.id, 'criticality', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Niska</option>
                        <option value="medium">Średnia</option>
                        <option value="high">Wysoka</option>
                        <option value="critical">Krytyczna</option>
                      </select>
                    </td>

                    {/* Akcje */}
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleRow(item.id)}
                        >
                          {expandedRows.has(item.id) ? '▲' : '▼'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Punkt 16: Uwagi ogólne */}
      <Card>
        <CardHeader>
          <CardTitle>Punkt 16: Uwagi Ogólne i Zalecenia</CardTitle>
          <CardDescription>
            Podsumowanie oceny, wykryte usterki i zalecenia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Uwagi ogólne */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Uwagi ogólne</label>
            <textarea
              {...form.register('generalNotes')}
              placeholder="Ogólne uwagi dotyczące stanu technicznego pojazdu..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Czy wymaga naprawy */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register('repairNeeded')}
                className="rounded"
              />
              <span className="text-sm font-medium">Pojazd wymaga naprawy przed dopuszczeniem do eksploatacji</span>
            </label>
          </div>

          {form.watch('repairNeeded') && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription>
                <strong>⚠️ Pojazd wymaga naprawy!</strong> Szczegółowo opisz wymagane prace naprawcze w uwagach ogólnych.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Nawigacja */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Wstecz: Komisja
        </Button>
        <Button onClick={onNext}>
          Dalej: Podpisy →
        </Button>
      </div>
    </div>
  );
}