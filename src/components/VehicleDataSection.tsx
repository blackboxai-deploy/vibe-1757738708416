"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { VehicleType, VehicleSeries } from "@/types/vehicle";
import { VEHICLE_TEMPLATES, getVehicleTemplate } from "@/lib/vehicleTemplates";

interface VehicleDataSectionProps {
  form: any;
  onNext: () => void;
  onPrev: () => void;
}

export default function VehicleDataSection({ form, onNext, onPrev }: VehicleDataSectionProps) {
  
  // Pobieranie aktualnych wartości z formularza
  const vehicleType = form.watch('vehicleData.vehicleType') as VehicleType;
  const vehicleSeries = form.watch('vehicleData.identification.series') as VehicleSeries;
  const template = getVehicleTemplate(vehicleSeries);

  // Automatyczne wypełnianie danych na podstawie szablonu
  const handleTemplateSelect = (series: VehicleSeries) => {
    const selectedTemplate = (VEHICLE_TEMPLATES as any)[series];
    if (selectedTemplate) {
      form.setValue('vehicleData.identification.series', series);
      form.setValue('vehicleData.vehicleType', selectedTemplate.vehicleType);
      
      // Ustawienie domyślnych wartości technicznych jeśli dostępne
      // form.setValue('vehicleData.technicalData', selectedTemplate.defaultTechnicalData);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Nagłówek sekcji */}
      <Card>
        <CardHeader>
          <CardTitle>Punkty 3-4: Dane Identyfikacyjne i Techniczne Pojazdu</CardTitle>
          <CardDescription>
            Pełna identyfikacja pojazdu zgodna z dokumentacją techniczną
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Szybki wybór szablonu */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-lg">
            🚂 Szybki Wybór Typu Pojazdu
          </CardTitle>
          <CardDescription>
            Wybierz typ pojazdu aby automatycznie wypełnić podstawowe dane
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={vehicleType} onValueChange={(value) => form.setValue('vehicleData.vehicleType', value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lokomotywa_elektryczna">Lok. Elektryczne</TabsTrigger>
              <TabsTrigger value="lokomotywa_spalinowa">Lok. Spalinowe</TabsTrigger>
              <TabsTrigger value="zespol_trakcyjny_elektryczny">Zespoły El.</TabsTrigger>
              <TabsTrigger value="wagon_osobowy">Wagony</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lokomotywa_elektryczna" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['ET22', 'ET25', 'EU07', 'EU46', 'EP08', 'EP09'].map(series => (
                  <Button
                    key={series}
                    variant={vehicleSeries === series ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(series as VehicleSeries)}
                    className="justify-start"
                  >
                    {series}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="lokomotywa_spalinowa" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['ST43', 'ST44', 'ST45', 'SM31', 'SM42'].map(series => (
                  <Button
                    key={series}
                    variant={vehicleSeries === series ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(series as VehicleSeries)}
                    className="justify-start"
                  >
                    {series}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="zespol_trakcyjny_elektryczny" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['EN57', 'EN71', 'EN76', 'ED72', 'ED74'].map(series => (
                  <Button
                    key={series}
                    variant={vehicleSeries === series ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(series as VehicleSeries)}
                    className="justify-start"
                  >
                    {series}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="wagon_osobowy" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => form.setValue('vehicleData.identification.series', 'inne')}
                >
                  Wagon standardowy
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Punkt 3: Dane identyfikacyjne */}
      <Card>
        <CardHeader>
          <CardTitle>Punkt 3: Identyfikacja Pojazdu</CardTitle>
          <CardDescription>
            Podstawowe dane identyfikacyjne zgodne z kartą pojazdu
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Numer pojazdu *</label>
              <input
                {...form.register('vehicleData.identification.vehicleNumber')}
                placeholder="EU07-123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seria *</label>
              <select
                {...form.register('vehicleData.identification.series')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Wybierz serię --</option>
                <optgroup label="Lokomotywy elektryczne">
                  <option value="ET22">ET22</option>
                  <option value="ET25">ET25</option>
                  <option value="EU07">EU07</option>
                  <option value="EU46">EU46</option>
                  <option value="EP08">EP08</option>
                  <option value="EP09">EP09</option>
                </optgroup>
                <optgroup label="Lokomotywy spalinowe">
                  <option value="ST43">ST43</option>
                  <option value="ST44">ST44</option>
                  <option value="ST45">ST45</option>
                  <option value="SM31">SM31</option>
                  <option value="SM42">SM42</option>
                </optgroup>
                <optgroup label="Zespoły trakcyjne">
                  <option value="EN57">EN57</option>
                  <option value="EN71">EN71</option>
                  <option value="EN76">EN76</option>
                  <option value="ED72">ED72</option>
                  <option value="ED74">ED74</option>
                  <option value="SA104">SA104</option>
                  <option value="SA105">SA105</option>
                  <option value="SA106">SA106</option>
                  <option value="SA108">SA108</option>
                </optgroup>
                <option value="inne">Inne</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Producent *</label>
              <input
                {...form.register('vehicleData.identification.manufacturer')}
                placeholder="Pesa, Newag, Alstom..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rok produkcji *</label>
              <input
                type="number"
                {...form.register('vehicleData.identification.productionYear', { valueAsNumber: true })}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Numer fabryczny</label>
              <input
                {...form.register('vehicleData.identification.factoryNumber')}
                placeholder="123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Numer UIC</label>
              <input
                {...form.register('vehicleData.identification.uicNumber')}
                placeholder="91 51 1 123 456-7"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Punkt 4: Dane techniczne */}
      <Card>
        <CardHeader>
          <CardTitle>Punkt 4: Dane Techniczne</CardTitle>
          <CardDescription>
            Parametry techniczne zgodne z kartą UIC
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* Wyświetlanie informacji o szablonie */}
          {template && (
            <Alert className="mb-6">
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Załadowano szablon dla serii <strong>{vehicleSeries}</strong></span>
                  <Badge variant="outline">{template.vehicleType}</Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="dimensions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dimensions">Wymiary i Masa</TabsTrigger>
              <TabsTrigger value="traction">Trakcja</TabsTrigger>
              <TabsTrigger value="running">Układ Jezdny</TabsTrigger>
              <TabsTrigger value="equipment">Wyposażenie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dimensions" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Długość [mm] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.length', { valueAsNumber: true })}
                    placeholder="20000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Szerokość [mm] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.width', { valueAsNumber: true })}
                    placeholder="3000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wysokość [mm] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.height', { valueAsNumber: true })}
                    placeholder="4650"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Masa [kg] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.weight', { valueAsNumber: true })}
                    placeholder="80000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="traction" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moc [kW]</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.power', { valueAsNumber: true })}
                    placeholder="3200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prędkość maksymalna [km/h] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.maxSpeed', { valueAsNumber: true })}
                    placeholder="125"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Napięcie zasilania [V]</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.voltage', { valueAsNumber: true })}
                    placeholder="3000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Siła pociągowa [kN]</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.tractionForce', { valueAsNumber: true })}
                    placeholder="250"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="running" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nacisk na oś [t] *</label>
                  <input
                    type="number"
                    step="0.1"
                    {...form.register('vehicleData.technicalData.axleLoad', { valueAsNumber: true })}
                    placeholder="20.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rozstaw szyn [mm] *</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.gauge', { valueAsNumber: true })}
                    defaultValue="1435"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Układ osi</label>
                  <input
                    {...form.register('vehicleData.technicalData.wheelArrangement')}
                    placeholder="Bo'Bo'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Siła hamowania [kN]</label>
                  <input
                    type="number"
                    {...form.register('vehicleData.technicalData.brakeForce', { valueAsNumber: true })}
                    placeholder="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Typy hamulców *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pneumatyczny', 'Elektrodynamiczny', 'Awaryjny', 'Postojowy'].map(brake => (
                      <label key={brake} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={brake}
                          {...form.register('vehicleData.technicalData.brakeType')}
                          className="rounded"
                        />
                        <span className="text-sm">{brake}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status eksploatacyjny *</label>
                  <select
                    {...form.register('vehicleData.operationalStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="czynny">Czynny</option>
                    <option value="usterka">Usterka</option>
                    <option value="naprawa_biezaca">Naprawa bieżąca</option>
                    <option value="naprawa_glowna">Naprawa główna</option>
                    <option value="odstawiony">Odstawiony</option>
                    <option value="rezerwowy">Rezerwowy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aktualna lokalizacja *</label>
                  <input
                    {...form.register('vehicleData.currentLocation')}
                    placeholder="Warszawa Główna"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Nawigacja */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Wstecz: Podstawowe
        </Button>
        <Button onClick={onNext}>
          Dalej: Komisja →
        </Button>
      </div>
    </div>
  );
}