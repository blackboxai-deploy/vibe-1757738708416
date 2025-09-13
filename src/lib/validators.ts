/**
 * Funkcje walidacji specyficzne dla protokołów PKP PLK
 * Zawiera logikę biznesową zgodną z wymaganiami kolejowymi
 */

import { Protocol, TechnicalStateItem, ProtocolValidation } from '../types/protocol';
import { CommissionMember } from '../types/signature';
import { VehicleType } from '../types/vehicle';

// Walidacja numeru protokołu według standardów PKP PLK
export function validateProtocolNumber(protocolNumber: string): { isValid: boolean; error?: string } {
  // Format: ABC/123/YYYY lub ABC-123-YYYY
  const pattern = /^[A-Z]{2,4}[\/\-][0-9]{1,4}[\/\-][0-9]{4}$/;
  
  if (!protocolNumber) {
    return { isValid: false, error: "Numer protokołu jest wymagany" };
  }
  
  if (!pattern.test(protocolNumber)) {
    return { 
      isValid: false, 
      error: "Nieprawidłowy format numeru protokołu. Wymagany format: ABC/123/YYYY" 
    };
  }
  
  return { isValid: true };
}

// Walidacja numeru pojazdu kolejowego
export function validateVehicleNumber(vehicleNumber: string, vehicleType: VehicleType): { isValid: boolean; error?: string } {
  if (!vehicleNumber) {
    return { isValid: false, error: "Numer pojazdu jest wymagany" };
  }
  
  // Różne formaty dla różnych typów pojazdów
  const patterns = {
    lokomotywa_elektryczna: /^(ET|EU|EP|EL)[0-9]{2}[A-Z]?-[0-9]{3}$/,
    lokomotywa_spalinowa: /^(ST|SM|SU)[0-9]{2}[A-Z]?-[0-9]{3}$/,
    zespol_trakcyjny_elektryczny: /^(EN|ED)[0-9]{2}[A-Z]?-[0-9]{3}$/,
    zespol_trakcyjny_spalinowy: /^(SA|SN)[0-9]{2}[A-Z]?-[0-9]{3}$/,
    wagon_osobowy: /^[0-9]{2}-[0-9]{2}-[0-9]{3}-[0-9]$/,
    wagon_towarowy: /^[0-9]{2}-[0-9]{2}-[0-9]{3}-[0-9]$/,
  };
  
  const pattern = patterns[vehicleType as keyof typeof patterns];
  if (pattern && !pattern.test(vehicleNumber)) {
    return { 
      isValid: false, 
      error: `Nieprawidłowy format numeru dla typu pojazdu ${vehicleType}` 
    };
  }
  
  return { isValid: true };
}

// Walidacja składu komisji
export function validateCommission(commission: CommissionMember[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (commission.length < 2) {
    errors.push("Komisja musi składać się z minimum 2 członków");
  }
  
  if (commission.length > 10) {
    errors.push("Komisja nie może mieć więcej niż 10 członków");
  }
  
  // Sprawdzenie czy jest przewodniczący
  const chairmen = commission.filter(member => member.role === 'przewodniczacy');
  if (chairmen.length === 0) {
    errors.push("Komisja musi mieć przewodniczącego");
  } else if (chairmen.length > 1) {
    errors.push("Komisja może mieć tylko jednego przewodniczącego");
  }
  
  // Sprawdzenie kwalifikacji przewodniczącego
  if (chairmen.length === 1) {
    const chairman = chairmen[0];
    if (!chairman.qualifications.some(q => 
      ['inzynier', 'magister_inzynier', 'rzeczoznawca_kolejowy'].includes(q)
    )) {
      errors.push("Przewodniczący musi mieć odpowiednie kwalifikacje techniczne");
    }
  }
  
  // Sprawdzenie czy są eksperci techniczni
  const experts = commission.filter(member => 
    member.role === 'ekspert' || member.role === 'rzeczoznawca'
  );
  if (experts.length === 0) {
    errors.push("Komisja musi zawierać co najmniej jednego eksperta technicznego");
  }
  
  // Sprawdzenie ważności uprawnień
  const currentDate = new Date();
  commission.forEach((member, index) => {
    if (member.licenseExpiryDate && member.licenseExpiryDate < currentDate) {
      errors.push(`Członek komisji ${member.firstName} ${member.lastName} ma nieważne uprawnienia`);
    }
  });
  
  // Sprawdzenie konfliktu interesów
  const companies = commission.map(member => member.company.toLowerCase());
  const uniqueCompanies = [...new Set(companies)];
  if (uniqueCompanies.length === 1 && commission.length > 1) {
    errors.push("Wszyscy członkowie komisji pochodzą z tej samej firmy - możliwy konflikt interesów");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Walidacja stanu technicznego
export function validateTechnicalState(technicalState: TechnicalStateItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (technicalState.length === 0) {
    errors.push("Wymagana ocena co najmniej jednego elementu stanu technicznego");
  }
  
  // Sprawdzenie czy wszystkie wymagane punkty są ocenione
  const requiredPoints = ['a', 'b', 'c', 'd', 'e', 'f'];
  const evaluatedPoints = technicalState.map(item => item.point);
  
  requiredPoints.forEach(point => {
    if (!evaluatedPoints.includes(point)) {
      errors.push(`Brak oceny obowiązkowego punktu "${point}"`);
    }
  });
  
  // Sprawdzenie krytycznych elementów
  const criticalItems = technicalState.filter(item => 
    item.condition === 'niesprawny' && 
    ['a', 'c', 'd', 'e'].includes(item.point) // Konstrukcja, układ jezdny, koła, hamulce
  );
  
  if (criticalItems.length > 0 && !technicalState.some(item => item.notes?.includes('dopuszczenie warunkowe'))) {
    errors.push("Pojazd z niesprawną konstrukcją nośną, układem jezdnym, kołami lub hamulcami wymaga uzasadnienia lub nie może być dopuszczony");
  }
  
  // Sprawdzenie spójności ocen
  technicalState.forEach(item => {
    if (item.condition === 'niesprawny' && !item.notes) {
      errors.push(`Punkt "${item.point}" oceniony jako niesprawny wymaga uzasadnienia w uwagach`);
    }
    
    if (item.condition === 'nie_dotyczy' && ['a', 'b', 'c', 'd', 'e', 'f'].includes(item.point)) {
      errors.push(`Punkt "${item.point}" nie może być oznaczony jako "nie dotyczy" - jest to element obowiązkowy`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Walidacja terminów i dat
export function validateDates(protocol: Partial<Protocol>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const currentDate = new Date();
  
  if (protocol.issueDate && protocol.issueDate > currentDate) {
    errors.push("Data wystawienia protokołu nie może być z przyszłości");
  }
  
  if (protocol.vehicleData?.lastOverhaul && protocol.vehicleData.lastOverhaul > currentDate) {
    errors.push("Data ostatniej naprawy głównej nie może być z przyszłości");
  }
  
  if (protocol.vehicleData?.commissioningDate && protocol.vehicleData.commissioningDate > currentDate) {
    errors.push("Data oddania do eksploatacji nie może być z przyszłości");
  }
  
  // Sprawdzenie logicznych związków dat
  if (protocol.vehicleData?.commissioningDate && protocol.vehicleData?.lastOverhaul) {
    if (protocol.vehicleData.commissioningDate > protocol.vehicleData.lastOverhaul) {
      errors.push("Data ostatniej naprawy nie może być wcześniejsza niż data oddania do eksploatacji");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Walidacja kompletności dokumentacji
export function validateDocumentation(protocol: Partial<Protocol>): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Wymagane dokumenty
  const requiredDocs = [
    'Karta pojazdu',
    'Ostatni protokół przeglądu',
    'Dokumentacja techniczna',
    'Świadectwo dopuszczenia do eksploatacji'
  ];
  
  if (!protocol.vehicleData?.technicalDocumentation || protocol.vehicleData.technicalDocumentation.length === 0) {
    errors.push("Brak dokumentacji technicznej pojazdu");
  } else {
    requiredDocs.forEach(doc => {
      if (!protocol.vehicleData?.technicalDocumentation?.some(d => d.toLowerCase().includes(doc.toLowerCase()))) {
        warnings.push(`Brak dokumentu: ${doc}`);
      }
    });
  }
  
  // Sprawdzenie certyfikatów
  if (!protocol.vehicleData?.certificates || protocol.vehicleData.certificates.length === 0) {
    warnings.push("Brak informacji o certyfikatach pojazdu");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Główna funkcja walidacji protokołu
export function validateProtocol(protocol: Partial<Protocol>): ProtocolValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  let completionPercentage = 0;
  
  // Walidacja podstawowych danych
  if (protocol.protocolNumber) {
    const numberValidation = validateProtocolNumber(protocol.protocolNumber);
    if (!numberValidation.isValid && numberValidation.error) {
      errors.push(numberValidation.error);
    }
  } else {
    errors.push("Numer protokołu jest wymagany");
  }
  
  // Walidacja pojazdu
  if (protocol.vehicleData) {
    const vehicleValidation = validateVehicleNumber(
      protocol.vehicleData.identification.vehicleNumber,
      protocol.vehicleData.vehicleType
    );
    if (!vehicleValidation.isValid && vehicleValidation.error) {
      errors.push(vehicleValidation.error);
    }
    completionPercentage += 20;
  } else {
    errors.push("Dane pojazdu są wymagane");
  }
  
  // Walidacja komisji
  if (protocol.commission && protocol.commission.length > 0) {
    const commissionValidation = validateCommission(protocol.commission);
    errors.push(...commissionValidation.errors);
    completionPercentage += 30;
  } else {
    errors.push("Skład komisji jest wymagany");
  }
  
  // Walidacja stanu technicznego
  if (protocol.technicalState && protocol.technicalState.length > 0) {
    const technicalValidation = validateTechnicalState(protocol.technicalState);
    errors.push(...technicalValidation.errors);
    completionPercentage += 30;
  } else {
    errors.push("Ocena stanu technicznego jest wymagana");
  }
  
  // Walidacja dat
  const dateValidation = validateDates(protocol);
  errors.push(...dateValidation.errors);
  
  // Walidacja dokumentacji
  const docValidation = validateDocumentation(protocol);
  errors.push(...docValidation.errors);
  warnings.push(...docValidation.warnings);
  
  // Walidacja podpisów
  if (protocol.signatures && protocol.signatures.length > 0) {
    completionPercentage += 20;
  } else {
    warnings.push("Protokół wymaga podpisów członków komisji");
  }
  
  // Obliczenie procentu kompletności na podstawie wypełnionych sekcji
  const requiredSections = [
    protocol.protocolNumber,
    protocol.vehicleData,
    protocol.commission?.length,
    protocol.technicalState?.length,
    protocol.location,
    protocol.inspectionReason
  ];
  
  const completedSections = requiredSections.filter(Boolean).length;
  completionPercentage = Math.round((completedSections / requiredSections.length) * 100);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFields: extractMissingFields(protocol),
    completionPercentage
  };
}

// Funkcja pomocnicza do wykrycia brakujących pól
function extractMissingFields(protocol: Partial<Protocol>): string[] {
  const missingFields: string[] = [];
  
  if (!protocol.protocolNumber) missingFields.push("Numer protokołu");
  if (!protocol.location) missingFields.push("Lokalizacja");
  if (!protocol.depot) missingFields.push("Zakład");
  if (!protocol.inspectionReason) missingFields.push("Powód kontroli");
  if (!protocol.vehicleData) missingFields.push("Dane pojazdu");
  if (!protocol.commission || protocol.commission.length === 0) missingFields.push("Skład komisji");
  if (!protocol.technicalState || protocol.technicalState.length === 0) missingFields.push("Stan techniczny");
  if (!protocol.legalBasis) missingFields.push("Podstawa prawna");
  
  return missingFields;
}

export default {
  validateProtocolNumber,
  validateVehicleNumber,
  validateCommission,
  validateTechnicalState,
  validateDates,
  validateDocumentation,
  validateProtocol
};