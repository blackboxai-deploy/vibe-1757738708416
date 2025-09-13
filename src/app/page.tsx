"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProtocolForm from "@/components/ProtocolForm";

export default function HomePage() {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState("basic");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Protokół Oceny Stanu Technicznego
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Pojazdów Kolejowych P4/P5 zgodnie z załącznikiem nr 8 PKP PLK
          </p>
          
          {/* Progress Bar */}
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Postęp wypełniania</span>
                <span className="text-sm text-gray-500">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                🚂 Lokomotywy
              </CardTitle>
              <CardDescription>
                Elektryczne, spalinowe i parowe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Protokoły dla lokomotyw wszystkich typów trakcji z pełną dokumentacją techniczną.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                🚄 Zespoły Trakcyjne
              </CardTitle>
              <CardDescription>
                EN57, EN71, EN76, SA104-108
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ocena stanu zespołów trakcyjnych z uwzględnieniem specyfiki konstrukcyjnej.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                🚃 Wagony
              </CardTitle>
              <CardDescription>
                Osobowe, towarowe i specjalne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Protokoły dla wagonów z oceną wyposażenia i systemów bezpieczeństwa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Validation Alerts */}
        {validationErrors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription>
              <strong>Wymagane poprawki:</strong>
              <ul className="list-disc list-inside mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <Card className="shadow-xl">
          <CardHeader className="bg-blue-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl">
              Formularz Protokołu Oceny
            </CardTitle>
            <CardDescription className="text-blue-200">
              Wypełnij wszystkie wymagane sekcje zgodnie z załącznikiem nr 8 PKP PLK
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              
              {/* Tab Navigation */}
              <div className="border-b bg-gray-50 px-6">
                <TabsList className="grid w-full grid-cols-5 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="basic" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Krok 1</div>
                      <div className="text-xs text-gray-500">Podstawowe</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="vehicle" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Krok 2</div>
                      <div className="text-xs text-gray-500">Pojazd</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="commission" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Krok 3</div>
                      <div className="text-xs text-gray-500">Komisja</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="technical" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Krok 4</div>
                      <div className="text-xs text-gray-500">Stan Techniczny</div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="signatures" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Krok 5</div>
                      <div className="text-xs text-gray-500">Podpisy</div>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                <ProtocolForm 
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  onValidationChange={setValidationErrors}
                  onProgressChange={setCompletionPercentage}
                />
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Status Bar */}
        <div className="fixed bottom-6 right-6">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">System PKP PLK</span>
                </div>
                <Badge variant="outline">
                  Wersja 1.0
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              💡 Pomoc i Wskazówki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Wymagania Formalne</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Wszystkie 17 punktów protokołu muszą być wypełnione</li>
                  <li>• Komisja minimum 2 członków z odpowiednimi kwalifikacjami</li>
                  <li>• Ocena punktów a-q stanu technicznego obowiązkowa</li>
                  <li>• Podpisy wszystkich członków komisji wymagane</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Dokumenty Towarzyszące</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Karta pojazdu kolejowego</li>
                  <li>• Ostatni protokół przeglądu</li>
                  <li>• Dokumentacja techniczna</li>
                  <li>• Świadectwa dopuszczenia</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}