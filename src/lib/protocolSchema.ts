/**
 * Schemat walidacji Zod dla protokołów PKP PLK
 * Zawiera wszystkie wymagane walidacje zgodne z załącznikiem nr 8
 */

import { z } from 'zod';

// Walidacja numerów i kodów PKP PLK
const protocolNumberSchema = z.string()
  .min(1, "Numer protokołu jest wymagany")
  .regex(/^[A-Z0-9\/\-]+$/i, "Nieprawidłowy format numeru protokołu")
  .max(50, "Numer protokołu nie może przekraczać 50 znaków");

const vehicleNumberSchema = z.string()
  .min(1, "Numer pojazdu jest wymagany")
  .regex(/^[A-Z0-9\-\s]+$/i, "Nieprawidłowy format numeru pojazdu")
  .max(20, "Numer pojazdu nie może przekraczać 20 znaków");

// Walidacja dat
const dateSchema = z.date({
  required_error: "Data jest wymagana",
  invalid_type_error: "Nieprawidłowy format daty"
}).refine(
  (date) => date <= new Date(),
  "Data nie może być z przyszłości"
);

// Walidacja danych osobowych
const personNameSchema = z.string()
  .min(2, "Imię/nazwisko musi mieć minimum 2 znaki")
  .max(50, "Imię/nazwisko nie może przekraczać 50 znaków")
  .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-\']+$/, "Niedozwolone znaki w imieniu/nazwisku");

// Walidacja identyfikacji pojazdu
const vehicleIdentificationSchema = z.object({
  vehicleNumber: vehicleNumberSchema,
  inventoryNumber: z.string().optional(),
  series: z.enum([
    'ET22', 'ET25', 'EU07', 'EU46', 'EP08', 'EP09',
    'ST43', 'ST44', 'ST45', 'SM31', 'SM42', 
    'EN57', 'EN71', 'EN76', 'ED72', 'ED74',
    'SA104', 'SA105', 'SA106', 'SA108', 'inne'
  ], {
    errorMap: () => ({ message: "Wybierz prawidłową serię pojazdu" })
  }),
  manufacturer: z.string()
    .min(1, "Producent jest wymagany")
    .max(100, "Nazwa producenta nie może przekraczać 100 znaków"),
  productionYear: z.number()
    .int("Rok produkcji musi być liczbą całkowitą")
    .min(1800, "Nieprawidłowy rok produkcji")
    .max(new Date().getFullYear(), "Rok produkcji nie może być z przyszłości"),
  factoryNumber: z.string().optional(),
  uicNumber: z.string().optional(),
  additionalMarkings: z.array(z.string()).optional()
});

// Walidacja danych technicznych
const vehicleTechnicalDataSchema = z.object({
  length: z.number()
    .positive("Długość musi być większa od 0")
    .max(50000, "Nieprawidłowa długość pojazdu"),
  width: z.number()
    .positive("Szerokość musi być większa od 0")
    .max(5000, "Nieprawidłowa szerokość pojazdu"),
  height: z.number()
    .positive("Wysokość musi być większa od 0")
    .max(10000, "Nieprawidłowa wysokość pojazdu"),
  weight: z.number()
    .positive("Masa musi być większa od 0")
    .max(500000, "Nieprawidłowa masa pojazdu"),
  maxWeight: z.number().positive().optional(),
  power: z.number().positive().optional(),
  maxSpeed: z.number()
    .positive("Prędkość maksymalna musi być większa od 0")
    .max(400, "Nieprawidłowa prędkość maksymalna"),
  tractionForce: z.number().positive().optional(),
  voltage: z.number().positive().optional(),
  current: z.number().positive().optional(),
  engineType: z.string().optional(),
  enginePower: z.number().positive().optional(),
  fuelCapacity: z.number().positive().optional(),
  wheelArrangement: z.string().optional(),
  axleLoad: z.number()
    .positive("Nacisk na oś musi być większy od 0")
    .max(30, "Nieprawidłowy nacisk na oś"),
  gauge: z.number()
    .positive("Rozstaw szyn musi być większy od 0")
    .default(1435),
  brakeType: z.array(z.string()).min(1, "Wymagany co najmniej jeden typ hamulca"),
  brakeForce: z.number().positive().optional(),
  equipment: z.array(z.string()).optional(),
  safetyDevices: z.array(z.string()).optional()
});

// Walidacja danych pojazdu
const vehicleDataSchema = z.object({
  identification: vehicleIdentificationSchema,
  vehicleType: z.enum([
    'lokomotywa_elektryczna',
    'lokomotywa_spalinowa', 
    'lokomotywa_parowa',
    'zespol_trakcyjny_elektryczny',
    'zespol_trakcyjny_spalinowy',
    'wagon_osobowy',
    'wagon_towarowy',
    'wagon_specjalny',
    'drezyna',
    'pojazd_sluzbowy'
  ], {
    errorMap: () => ({ message: "Wybierz prawidłowy typ pojazdu" })
  }),
  category: z.string().min(1, "Kategoria jest wymagana"),
  technicalData: vehicleTechnicalDataSchema,
  ownershipStatus: z.enum(['wlasny', 'dzierzawiony', 'wynajmowany', 'cudzy']),
  operationalStatus: z.enum([
    'czynny', 'usterka', 'naprawa_biezaca', 
    'naprawa_glowna', 'odstawiony', 'wycofany', 'rezerwowy'
  ]),
  currentLocation: z.string().min(1, "Lokalizacja jest wymagana"),
  assignedDepot: z.string().min(1, "Przypisany zakład jest wymagany"),
  commissioningDate: dateSchema.optional(),
  lastOverhaul: dateSchema.optional(),
  lastInspection: dateSchema.optional(),
  mileage: z.number().nonnegative().optional(),
  operatingHours: z.number().nonnegative().optional(),
  technicalDocumentation: z.array(z.string()),
  certificates: z.array(z.string()),
  modifications: z.array(z.string()).optional(),
  specialConditions: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
  notes: z.string().optional()
});

// Walidacja członka komisji
const commissionMemberSchema = z.object({
  id: z.string().uuid(),
  firstName: personNameSchema,
  lastName: personNameSchema,
  title: z.string().optional(),
  role: z.enum([
    'przewodniczacy', 'czlonek', 'sekretarz', 'ekspert',
    'przedstawiciel_wlasciciela', 'przedstawiciel_uzytkownika',
    'inspektor', 'rzeczoznawca'
  ]),
  isPrimaryRole: z.boolean(),
  position: z.string().min(1, "Stanowisko jest wymagane"),
  company: z.string().min(1, "Nazwa firmy jest wymagana"),
  department: z.string().optional(),
  qualifications: z.array(z.enum([
    'inzynier', 'magister_inzynier', 'technik', 'mistrz',
    'rzeczoznawca_kolejowy', 'inspektor_techniczny',
    'specjalista_ds_bezpieczenstwa', 'inne'
  ])).min(1, "Wymagane co najmniej jedno kwalifikacje"),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: dateSchema.optional(),
  email: z.string().email("Nieprawidłowy format email").optional(),
  phone: z.string().optional(),
  experience: z.string().min(1, "Opis doświadczenia jest wymagany"),
  specialization: z.array(z.string()).optional(),
  isActive: z.boolean(),
  notes: z.string().optional()
});

// Walidacja stanu technicznego
const technicalStateItemSchema = z.object({
  id: z.string().uuid(),
  point: z.enum(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q']),
  description: z.string().min(1, "Opis jest wymagany"),
  condition: z.enum([
    'sprawny', 'niesprawny', 'wymaga_naprawy', 
    'do_wymiany', 'nie_dotyczy'
  ]),
  notes: z.string().optional(),
  criticality: z.enum(['low', 'medium', 'high', 'critical']).optional()
});

// Walidacja podpisu
const signatureSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
  signatureDate: dateSchema,
  signatureTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Nieprawidłowy format czasu"),
  location: z.string().min(1, "Miejsce podpisu jest wymagane"),
  signatureType: z.enum(['electronic', 'handwritten', 'digital_certificate']),
  status: z.enum(['pending', 'signed', 'rejected', 'expired']),
  digitalSignature: z.object({
    certificateId: z.string().optional(),
    algorithm: z.string().optional(),
    timestamp: z.string().optional(),
    hash: z.string().optional()
  }).optional(),
  physicalSignature: z.object({
    imageUrl: z.string().optional(),
    witnessName: z.string().optional(),
    witnessSignature: z.string().optional()
  }).optional(),
  declarations: z.object({
    accuracyConfirmation: z.boolean().refine(val => val === true, {
      message: "Wymagane potwierdzenie prawdziwości danych"
    }),
    responsibilityAcceptance: z.boolean().refine(val => val === true, {
      message: "Wymagane przyjęcie odpowiedzialności"
    }),
    confidentialityAgreement: z.boolean().refine(val => val === true, {
      message: "Wymagana zgoda na poufność"
    }),
    gdprConsent: z.boolean().refine(val => val === true, {
      message: "Wymagana zgoda RODO"
    })
  }),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  notes: z.string().optional()
});

// Główny schemat protokołu
export const protocolSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['draft', 'completed', 'approved', 'archived']),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  
  // Punkt 1: Podstawowe dane protokołu
  protocolNumber: protocolNumberSchema,
  assessmentType: z.enum(['P4', 'P5']),
  issueDate: dateSchema,
  
  // Punkt 2: Lokalizacja
  location: z.string().min(1, "Lokalizacja jest wymagana").max(200),
  depot: z.string().min(1, "Zakład jest wymagany").max(100),
  inspectionReason: z.string().min(1, "Powód kontroli jest wymagany").max(500),
  
  // Punkt 3-4: Dane pojazdu
  vehicleData: vehicleDataSchema,
  
  // Punkt 5: Komisja
  commission: z.array(commissionMemberSchema)
    .min(2, "Komisja musi składać się z minimum 2 członków")
    .max(10, "Komisja nie może mieć więcej niż 10 członków"),
  commissionChairman: z.string().min(1, "Przewodniczący komisji jest wymagany"),
  
  // Punkt 6: Podstawa prawna
  legalBasis: z.string().min(1, "Podstawa prawna jest wymagana"),
  regulations: z.array(z.string()).min(1, "Wymagane co najmniej jeden przepis"),
  
  // Punkt 7: Dokumentacja
  accompanyingDocuments: z.array(z.string()),
  previousInspections: z.array(z.string()),
  
  // Punkt 8: Warunki
  inspectionConditions: z.object({
    weather: z.string().min(1, "Warunki pogodowe są wymagane"),
    temperature: z.number().min(-50).max(60),
    humidity: z.number().min(0).max(100).optional(),
    other: z.string()
  }),
  
  // Punkt 9: Narzędzia
  toolsUsed: z.array(z.string()),
  measuringDevices: z.array(z.string()),
  
  // Punkt 10: Zakres
  assessmentScope: z.array(z.string()).min(1, "Zakres oceny jest wymagany"),
  excludedElements: z.array(z.string()),
  
  // Punkt 11-15: Stan techniczny
  technicalState: z.array(technicalStateItemSchema)
    .min(1, "Wymagana co najmniej jedna ocena stanu technicznego")
    .max(17, "Zbyt dużo elementów stanu technicznego"),
  
  // Punkt 16: Uwagi
  generalNotes: z.string().max(2000),
  recommendations: z.array(z.string()),
  defectsFound: z.array(z.string()),
  repairNeeded: z.boolean(),
  
  // Punkt 17: Podpisy
  signatures: z.array(signatureSchema)
    .min(1, "Wymagany co najmniej jeden podpis"),
  approvalDate: dateSchema.optional(),
  
  // Dodatkowe
  attachments: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  summary: z.string().max(1000).optional()
});

// Schemat dla tworzenia nowego protokołu (pola opcjonalne)
export const createProtocolSchema = protocolSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  signatures: true,
  approvalDate: true
});

// Typy wyekstraktowane ze schematów
export type ProtocolInput = z.infer<typeof protocolSchema>;
export type CreateProtocolInput = z.infer<typeof createProtocolSchema>;

export default protocolSchema;