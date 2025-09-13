/**
 * Typy danych dla podpisów i członków komisji oceniającej
 * Zgodne z wymogami PKP PLK
 */

// Funkcje/role członków komisji
export type CommissionRole = 
  | 'przewodniczacy' // Przewodniczący komisji
  | 'czlonek' // Członek komisji
  | 'sekretarz' // Sekretarz komisji
  | 'ekspert' // Ekspert techniczny
  | 'przedstawiciel_wlasciciela' // Przedstawiciel właściciela
  | 'przedstawiciel_uzytkownika' // Przedstawiciel użytkownika
  | 'inspektor' // Inspektor techniczny
  | 'rzeczoznawca'; // Rzeczoznawca

// Kwalifikacje członków komisji
export type QualificationType = 
  | 'inzynier'
  | 'magister_inzynier' 
  | 'technik'
  | 'mistrz'
  | 'rzeczoznawca_kolejowy'
  | 'inspektor_techniczny'
  | 'specjalista_ds_bezpieczenstwa'
  | 'inne';

// Status podpisu
export type SignatureStatus = 'pending' | 'signed' | 'rejected' | 'expired';

// Dane członka komisji
export interface CommissionMember {
  id: string;
  
  // Dane osobowe
  firstName: string;
  lastName: string;
  title?: string; // Tytuł naukowy/zawodowy
  
  // Funkcja w komisji
  role: CommissionRole;
  isPrimaryRole: boolean; // Czy to główna funkcja
  
  // Dane zawodowe
  position: string; // Stanowisko
  company: string; // Nazwa firmy/instytucji
  department?: string; // Wydział/dział
  
  // Kwalifikacje
  qualifications: QualificationType[];
  licenseNumber?: string; // Numer licencji/uprawnień
  licenseExpiryDate?: Date; // Data ważności uprawnień
  
  // Kontakt
  email?: string;
  phone?: string;
  
  // Doświadczenie
  experience: string; // Opis doświadczenia
  specialization?: string[]; // Specjalizacje
  
  // Status aktywności
  isActive: boolean;
  notes?: string;
}

// Dane podpisu elektronicznego/fizycznego
export interface Signature {
  id: string;
  memberId: string; // Powiązanie z członkiem komisji
  
  // Dane podpisu
  signatureDate: Date;
  signatureTime: string;
  location: string; // Miejsce złożenia podpisu
  
  // Typ podpisu
  signatureType: 'electronic' | 'handwritten' | 'digital_certificate';
  
  // Status
  status: SignatureStatus;
  
  // Dane elektroniczne (jeśli dotyczy)
  digitalSignature?: {
    certificateId?: string;
    algorithm?: string;
    timestamp?: string;
    hash?: string;
  };
  
  // Dane fizyczne (jeśli dotyczy)  
  physicalSignature?: {
    imageUrl?: string;
    witnessName?: string;
    witnessSignature?: string;
  };
  
  // Oświadczenia i zgody
  declarations: {
    accuracyConfirmation: boolean; // Potwierdzenie prawdziwości danych
    responsibilityAcceptance: boolean; // Przyjęcie odpowiedzialności
    confidentialityAgreement: boolean; // Zgoda na poufność
    gdprConsent: boolean; // Zgoda RODO
  };
  
  // Metadane
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

// Szablon komisji dla różnych typów ocen
export interface CommissionTemplate {
  id: string;
  name: string;
  description: string;
  
  // Wymagany skład
  requiredRoles: CommissionRole[];
  minimumMembers: number;
  maximumMembers: number;
  
  // Wymagane kwalifikacje
  requiredQualifications: {
    role: CommissionRole;
    qualifications: QualificationType[];
    experience: string;
  }[];
  
  // Specjalne wymagania
  specialRequirements?: string[];
  conflictOfInterestRules?: string[];
}

// Walidacja składu komisji
export interface CommissionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  
  // Sprawdzenia składu
  hasRequiredRoles: boolean;
  hasMinimumMembers: boolean;
  hasQualifiedMembers: boolean;
  hasValidLicenses: boolean;
  
  // Konflikty interesów
  conflictOfInterest: boolean;
  conflictDetails?: string[];
}

// Status całej komisji
export interface CommissionStatus {
  isComplete: boolean;
  totalMembers: number;
  signedMembers: number;
  pendingSignatures: number;
  
  // Daty
  commissionFormed: Date;
  firstSignature?: Date;
  lastSignature?: Date;
  completionDate?: Date;
  
  // Problemy
  issues: string[];
  warnings: string[];
}

// Historyczne składy komisji
export interface HistoricalCommission {
  protocolId: string;
  protocolNumber: string;
  date: Date;
  members: CommissionMember[];
  signatures: Signature[];
  notes?: string;
}

export default Signature;