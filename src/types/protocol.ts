/**
 * Typy danych dla protokołów oceny stanu technicznego pojazdów kolejowych P4/P5
 * Zgodne z wymogami PKP PLK - Załącznik nr 8
 */

import { VehicleData, VehicleType } from './vehicle';
import { Signature, CommissionMember } from './signature';

// Status protokołu
export type ProtocolStatus = 'draft' | 'completed' | 'approved' | 'archived';

// Typ oceny (P4/P5)
export type AssessmentType = 'P4' | 'P5';

// Ocena stanu technicznego (a-q punkty)
export interface TechnicalStateItem {
  id: string;
  point: string; // a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q
  description: string;
  condition: 'sprawny' | 'niesprawny' | 'wymaga_naprawy' | 'do_wymiany' | 'nie_dotyczy';
  notes?: string;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

// Główna struktura protokołu (17 punktów zgodnie z załącznikiem nr 8)
export interface Protocol {
  // Metadane protokołu
  id: string;
  status: ProtocolStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Punkt 1: Podstawowe dane protokołu
  protocolNumber: string;
  assessmentType: AssessmentType; // P4 lub P5
  issueDate: Date;
  
  // Punkt 2: Lokalizacja i okoliczności
  location: string;
  depot: string; // Zakład/lokomotywownia
  inspectionReason: string;
  
  // Punkt 3-4: Dane pojazdu
  vehicleData: VehicleData;
  
  // Punkt 5: Skład komisji
  commission: CommissionMember[];
  commissionChairman: string; // Przewodniczący komisji
  
  // Punkt 6: Podstawa prawna
  legalBasis: string;
  regulations: string[];
  
  // Punkt 7: Dokumentacja towarzysząca
  accompanyingDocuments: string[];
  previousInspections: string[];
  
  // Punkt 8: Warunki przeprowadzenia oceny
  inspectionConditions: {
    weather: string;
    temperature: number;
    humidity?: number;
    other: string;
  };
  
  // Punkt 9: Wykorzystane narzędzia i przyrządy
  toolsUsed: string[];
  measuringDevices: string[];
  
  // Punkt 10: Zakres oceny
  assessmentScope: string[];
  excludedElements: string[];
  
  // Punkt 11-15: Stan techniczny (tabela a-q)
  technicalState: TechnicalStateItem[];
  
  // Punkt 16: Uwagi ogólne i zalecenia
  generalNotes: string;
  recommendations: string[];
  defectsFound: string[];
  repairNeeded: boolean;
  
  // Punkt 17: Podpisy członków komisji
  signatures: Signature[];
  approvalDate?: Date;
  
  // Dodatkowe pola
  attachments?: string[];
  photos?: string[];
  summary?: string;
}

// Szablon protokołu dla różnych typów pojazdów
export interface ProtocolTemplate {
  id: string;
  name: string;
  vehicleType: VehicleType;
  defaultTechnicalState: TechnicalStateItem[];
  requiredFields: string[];
  specificRegulations: string[];
  description: string;
}

// Wynik walidacji protokołu
export interface ProtocolValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
  completionPercentage: number;
}

// Filtry dla listy protokołów
export interface ProtocolFilters {
  status?: ProtocolStatus[];
  vehicleType?: VehicleType[];
  assessmentType?: AssessmentType[];
  dateFrom?: Date;
  dateTo?: Date;
  depot?: string;
  protocolNumber?: string;
}

// Statystyki protokołów
export interface ProtocolStatistics {
  total: number;
  byStatus: Record<ProtocolStatus, number>;
  byVehicleType: Record<VehicleType, number>;
  byAssessmentType: Record<AssessmentType, number>;
  recent: number; // ostatnie 30 dni
}

export default Protocol;