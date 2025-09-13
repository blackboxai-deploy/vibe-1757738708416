/**
 * Typy danych dla pojazdów kolejowych
 * Zgodne z klasyfikacją PKP PLK
 */

// Typy pojazdów kolejowych według klasyfikacji PKP
export type VehicleType = 
  | 'lokomotywa_elektryczna'
  | 'lokomotywa_spalinowa' 
  | 'lokomotywa_parowa'
  | 'zespol_trakcyjny_elektryczny'
  | 'zespol_trakcyjny_spalinowy'
  | 'wagon_osobowy'
  | 'wagon_towarowy'
  | 'wagon_specjalny'
  | 'drezyna'
  | 'pojazd_sluzbowy';

// Serie lokomotyw i pojazdów
export type VehicleSeries = 
  | 'ET22' | 'ET25' | 'EU07' | 'EU46' | 'EP08' | 'EP09' // Lokomotywy elektryczne
  | 'ST43' | 'ST44' | 'ST45' | 'SM31' | 'SM42' // Lokomotywy spalinowe
  | 'EN57' | 'EN71' | 'EN76' | 'ED72' | 'ED74' // Zespoły trakcyjne elektryczne
  | 'SA104' | 'SA105' | 'SA106' | 'SA108' // Zespoły trakcyjne spalinowe
  | 'inne';

// Stan własności pojazdu
export type OwnershipStatus = 'wlasny' | 'dzierzawiony' | 'wynajmowany' | 'cudzy';

// Status eksploatacyjny
export type OperationalStatus = 
  | 'czynny'
  | 'usterka'  
  | 'naprawa_biezaca'
  | 'naprawa_glowna'
  | 'odstawiony'
  | 'wycofany'
  | 'rezerwowy';

// Dane identyfikacyjne pojazdu
export interface VehicleIdentification {
  vehicleNumber: string; // Numer pojazdu
  inventoryNumber?: string; // Numer inwentarzowy  
  series: VehicleSeries; // Seria pojazdu
  manufacturer: string; // Producent
  productionYear: number; // Rok produkcji
  factoryNumber?: string; // Numer fabryczny
  
  // Numery UIC (dla pojazdów międzynarodowych)
  uicNumber?: string;
  
  // Dodatkowe oznaczenia
  additionalMarkings?: string[];
}

// Dane techniczne pojazdu
export interface VehicleTechnicalData {
  // Wymiary i masa
  length: number; // Długość [mm]
  width: number; // Szerokość [mm] 
  height: number; // Wysokość [mm]
  weight: number; // Masa własna [kg]
  maxWeight?: number; // Masa całkowita [kg]
  
  // Parametry trakcyjne (dla pojazdów trakcyjnych)
  power?: number; // Moc [kW]
  maxSpeed: number; // Prędkość maksymalna [km/h]
  tractionForce?: number; // Siła pociągowa [kN]
  
  // Parametry elektryczne
  voltage?: number; // Napięcie zasilania [V]
  current?: number; // Prąd [A]
  
  // Parametry spalinowe  
  engineType?: string; // Typ silnika
  enginePower?: number; // Moc silnika [kW]
  fuelCapacity?: number; // Pojemność zbiornika paliwa [l]
  
  // Układ jezdny
  wheelArrangement?: string; // Układ osi (np. Bo'Bo')
  axleLoad: number; // Nacisk na oś [t]
  gauge: number; // Rozstaw szyn [mm] - standardowo 1435
  
  // Hamulce
  brakeType: string[]; // Typy hamulców
  brakeForce?: number; // Siła hamowania [kN]
  
  // Wyposażenie  
  equipment?: string[]; // Lista wyposażenia
  safetyDevices?: string[]; // Urządzenia bezpieczeństwa
}

// Główna struktura danych pojazdu
export interface VehicleData {
  // Podstawowe dane identyfikacyjne
  identification: VehicleIdentification;
  
  // Typ i klasyfikacja
  vehicleType: VehicleType;
  category: string; // Kategoria według przepisów
  
  // Dane techniczne
  technicalData: VehicleTechnicalData;
  
  // Status i stan
  ownershipStatus: OwnershipStatus;
  operationalStatus: OperationalStatus;
  currentLocation: string; // Aktualna lokalizacja
  assignedDepot: string; // Przypisany zakład
  
  // Historia eksploatacji
  commissioningDate?: Date; // Data oddania do eksploatacji
  lastOverhaul?: Date; // Ostatnia naprawa główna
  lastInspection?: Date; // Ostatni przegląd
  mileage?: number; // Przebieg [km]
  operatingHours?: number; // Godziny pracy [h]
  
  // Dokumentacja
  technicalDocumentation: string[]; // Lista dokumentacji technicznej
  certificates: string[]; // Certyfikaty i świadectwa
  modifications?: string[]; // Historia modyfikacji
  
  // Uwagi specjalne
  specialConditions?: string[]; // Warunki specjalne eksploatacji
  limitations?: string[]; // Ograniczenia w eksploatacji
  notes?: string; // Dodatkowe uwagi
}

// Szablon danych pojazdu dla różnych typów
export interface VehicleTemplate {
  vehicleType: VehicleType;
  series: VehicleSeries[];
  defaultTechnicalData: Partial<VehicleTechnicalData>;
  requiredDocuments: string[];
  specificInspectionPoints: string[];
  typicalDefects: string[];
  maintenanceSchedule: string[];
}

// Grupy pojazdów do raportowania
export interface VehicleGroup {
  id: string;
  name: string;
  vehicleTypes: VehicleType[];
  description: string;
  specificRequirements: string[];
}

export default VehicleData;