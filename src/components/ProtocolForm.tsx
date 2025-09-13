"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import VehicleDataSection from "./VehicleDataSection";
import TechnicalStateTable from "./TechnicalStateTable";
import SignatureSection from "./SignatureSection";
import ValidationMessages from "./ValidationMessages";

// import { protocolSchema, type ProtocolInput } from "@/lib/protocolSchema";
import { validateProtocol } from "@/lib/validators";
import { saveProtocol, dataManager } from "@/lib/dataStorage";
import { generateDefaultTechnicalState } from "@/lib/vehicleTemplates";
import { Protocol, AssessmentType } from "@/types/protocol";
import { VehicleType } from "@/types/vehicle";

interface ProtocolFormProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  onValidationChange: (errors: string[]) => void;
  onProgressChange: (percentage: number) => void;
  initialData?: Partial<Protocol>;
  protocolId?: string;
}

export default function ProtocolForm({
  currentStep,
  onStepChange,
  onValidationChange,
  onProgressChange,
  initialData,
  protocolId
}: ProtocolFormProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Inicjalizacja formularza z domyślnymi wartami
  const form = useForm({
    // resolver: zodResolver(protocolSchema),
    defaultValues: {
      id: protocolId || crypto.randomUUID(),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      protocolNumber: '',
      assessmentType: 'P4' as AssessmentType,
      issueDate: new Date(),
      location: '',
      depot: '',
      inspectionReason: '',
      vehicleData: {
        identification: {
          vehicleNumber: '',
          series: 'inne',
          manufacturer: '',
          productionYear: new Date().getFullYear(),
          additionalMarkings: []
        },
        vehicleType: 'lokomotywa_elektryczna' as VehicleType,
        category: '',
        technicalData: {
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
          maxSpeed: 0,
          axleLoad: 0,
          gauge: 1435,
          brakeType: []
        },
        ownershipStatus: 'wlasny',
        operationalStatus: 'czynny',
        currentLocation: '',
        assignedDepot: '',
        technicalDocumentation: [],
        certificates: []
      },
      commission: [],
      commissionChairman: '',
      legalBasis: 'Załącznik nr 8 do Regulaminu PKP PLK',
      regulations: ['Ustawa o transporcie kolejowym', 'Regulamin PKP PLK'],
      accompanyingDocuments: [],
      previousInspections: [],
      inspectionConditions: {
        weather: '',
        temperature: 20,
        other: ''
      },
      toolsUsed: [],
      measuringDevices: [],
      assessmentScope: [],
      excludedElements: [],
      technicalState: [],
      generalNotes: '',
      recommendations: [],
      defectsFound: [],
      repairNeeded: false,
      signatures: [],
      ...initialData
    }
  });

  // Obsługa zmian danych pojazdu - automatyczne generowanie stanu technicznego
  const vehicleType = form.watch('vehicleData.vehicleType');
  const vehicleSeries = form.watch('vehicleData.identification.series') as any;
  
  useEffect(() => {
    if (vehicleType && form.getValues('technicalState').length === 0) {
      const defaultTechnicalState = generateDefaultTechnicalState(vehicleType, vehicleSeries);
      form.setValue('technicalState', defaultTechnicalState);
    }
  }, [vehicleType, vehicleSeries, form]);

  // Walidacja w czasie rzeczywistym
  const validateCurrentForm = useCallback(() => {
    const currentData = form.getValues() as any;
    const validation = validateProtocol(currentData);
    
    onValidationChange(validation.errors);
    onProgressChange(validation.completionPercentage);
    
    return validation;
  }, [form, onValidationChange, onProgressChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const subscription = form.watch(() => {
      const timeoutId = setTimeout(() => {
        if (form.formState.isDirty) {
          handleAutoSave();
        }
      }, 2000); // Auto-save po 2 sekundach bezczynności

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [form, autoSaveEnabled]);

  // Auto-save function
  const handleAutoSave = async () => {
    try {
      setSaveStatus('saving');
      const currentData = form.getValues();
      const protocolData: Protocol = {
        ...currentData,
        updatedAt: new Date()
      } as Protocol;

      const success = saveProtocol(protocolData);
      setSaveStatus(success ? 'saved' : 'error');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  // Nawigacja między krokami
  const handleNextStep = () => {
    const validation = validateCurrentForm();
    if (validation.errors.length === 0 || currentStep === 'signatures') {
      const steps = ['basic', 'vehicle', 'commission', 'technical', 'signatures'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        onStepChange(steps[currentIndex + 1]);
      }
    }
  };

  const handlePrevStep = () => {
    const steps = ['basic', 'vehicle', 'commission', 'technical', 'signatures'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      onStepChange(steps[currentIndex - 1]);
    }
  };

  // Zapisanie protokołu
  const handleSave = async (isDraft: boolean = true) => {
    setIsLoading(true);
    
    try {
      const formData = form.getValues();
      const protocolData: Protocol = {
        ...formData,
        status: isDraft ? 'draft' : 'completed',
        updatedAt: new Date()
      } as Protocol;

      if (!isDraft) {
        // Walidacja przed finalnym zapisem
        const validation = validateProtocol(protocolData);
        if (!validation.isValid) {
          onValidationChange(validation.errors);
          return;
        }
      }

      const success = saveProtocol(protocolData);
      
      if (success) {
        setSaveStatus('saved');
        form.reset(protocolData);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving protocol:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generowanie numeru protokołu
  const handleGenerateProtocolNumber = () => {
    const depot = form.getValues('depot');
    if (depot) {
      const newNumber = dataManager.generateNextProtocolNumber(depot);
      form.setValue('protocolNumber', newNumber);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        
        {/* Status i nawigacja */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Badge variant={saveStatus === 'saved' ? 'default' : 'outline'}>
              {saveStatus === 'saving' && '⏳ Zapisywanie...'}
              {saveStatus === 'saved' && '✅ Zapisano'}
              {saveStatus === 'error' && '❌ Błąd'}
              {saveStatus === 'idle' && '📝 Roboczy'}
            </Badge>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
              />
              <span>Automatyczny zapis</span>
            </label>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(true)}
              disabled={isLoading}
            >
              Zapisz Roboczy
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isLoading}
            >
              Zapisz Finalny
            </Button>
          </div>
        </div>

        <Separator />

        {/* Krok 1: Podstawowe dane protokołu */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Punkty 1-2: Podstawowe Dane Protokołu</CardTitle>
              <CardDescription>
                Numer, typ oceny, lokalizacja i powód kontroli
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Punkt 1: Numer i typ protokołu */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Numer protokołu *</label>
                  <div className="flex space-x-2">
                    <input
                      {...form.register('protocolNumber')}
                      placeholder="ABC/123/2024"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleGenerateProtocolNumber}
                      className="whitespace-nowrap"
                    >
                      Generuj
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Typ oceny *</label>
                  <select
                    {...form.register('assessmentType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="P4">P4 - Przegląd okresowy</option>
                    <option value="P5">P5 - Przegląd główny</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data wystawienia *</label>
                  <input
                    type="date"
                    {...form.register('issueDate', { valueAsDate: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Punkt 2: Lokalizacja i okoliczności */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lokalizacja *</label>
                  <input
                    {...form.register('location')}
                    placeholder="Warszawa Główna"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Zakład/Lokomotywownia *</label>
                  <input
                    {...form.register('depot')}
                    placeholder="Warszawa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Powód przeprowadzenia oceny *</label>
                  <textarea
                    {...form.register('inspectionReason')}
                    placeholder="Przegląd okresowy po 30 000 km przebiegu"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div></div>
            <Button onClick={handleNextStep}>
              Dalej: Dane Pojazdu →
            </Button>
          </div>
        </TabsContent>

        {/* Krok 2: Dane pojazdu */}
        <TabsContent value="vehicle">
          <VehicleDataSection 
            form={form}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        </TabsContent>

        {/* Krok 3: Komisja */}
        <TabsContent value="commission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Punkty 5-6: Skład Komisji i Podstawa Prawna</CardTitle>
              <CardDescription>
                Członkowie komisji oceniającej z kwalifikacjami i uprawnieniami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Komisja musi składać się z minimum 2 członków, w tym przewodniczącego z odpowiednimi kwalifikacjami technicznymi.
                </AlertDescription>
              </Alert>
              
              {/* Dodaj komponent komisji tutaj */}
              <div className="mt-6 p-6 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                Sekcja komisji będzie dodana w następnym kroku implementacji
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              ← Wstecz
            </Button>
            <Button onClick={handleNextStep}>
              Dalej: Stan Techniczny →
            </Button>
          </div>
        </TabsContent>

        {/* Krok 4: Stan techniczny */}
        <TabsContent value="technical">
          <TechnicalStateTable 
            form={form}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        </TabsContent>

        {/* Krok 5: Podpisy */}
        <TabsContent value="signatures">
          <SignatureSection 
            form={form}
            onPrev={handlePrevStep}
            onSave={() => handleSave(false)}
          />
        </TabsContent>

        {/* Walidacja */}
        <ValidationMessages 
          validation={validateCurrentForm()}
        />

      </form>
    </Form>
  );
}