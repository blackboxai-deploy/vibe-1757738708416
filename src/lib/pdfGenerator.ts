/**
 * Generator PDF dla protokołów PKP PLK
 * Tworzy dokumenty zgodne z formatem załącznika nr 8
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Protocol } from '@/types/protocol';
import { TECHNICAL_STATE_POINTS } from './vehicleTemplates';

// Konfiguracja dokumentu
const PDF_CONFIG = {
  format: 'a4' as const,
  orientation: 'portrait' as const,
  unit: 'mm' as const,
  margins: {
    top: 20,
    bottom: 20,
    left: 15,
    right: 15
  },
  lineHeight: 6,
  fontSize: {
    title: 14,
    subtitle: 12,
    normal: 10,
    small: 8
  }
};

// Kolory zgodne z identyfikacją PKP PLK
const COLORS = {
  primary: '#1e3a8a',    // Niebieski PKP
  secondary: '#64748b',  // Szary
  text: '#1f2937',      // Ciemny szary
  border: '#d1d5db',    // Jasny szary
  background: '#f8fafc' // Bardzo jasny szary
};

export class ProtocolPDFGenerator {
  private doc: jsPDF;
  private currentY: number;
  private pageNumber: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: PDF_CONFIG.orientation,
      unit: PDF_CONFIG.unit,
      format: PDF_CONFIG.format
    });
    this.currentY = PDF_CONFIG.margins.top;
    this.pageNumber = 1;
  }

  // Główna funkcja generowania PDF
  async generateProtocolPDF(protocol: Protocol): Promise<Blob> {
    this.setupDocument();
    
    // Nagłówek dokumentu
    this.addHeader(protocol);
    
    // Punkty protokołu
    this.addBasicInfo(protocol);           // Punkty 1-2
    this.addVehicleInfo(protocol);         // Punkty 3-4
    this.addCommissionInfo(protocol);      // Punkty 5-6
    this.addDocumentationInfo(protocol);   // Punkt 7
    this.addInspectionConditions(protocol); // Punkt 8
    this.addToolsAndScope(protocol);       // Punkty 9-10
    this.addTechnicalState(protocol);     // Punkty 11-15
    this.addGeneralNotes(protocol);       // Punkt 16
    this.addSignatures(protocol);         // Punkt 17
    
    // Stopka
    this.addFooter(protocol);

    return this.doc.output('blob');
  }

  // Konfiguracja dokumentu
  private setupDocument(): void {
    this.doc.setProperties({
      title: 'Protokół Oceny Stanu Technicznego PKP PLK',
      subject: 'Protokół P4/P5',
      creator: 'System PKP PLK',
      keywords: 'PKP PLK, protokół, stan techniczny, pojazdy kolejowe'
    });
  }

  // Nagłówek dokumentu
  private addHeader(protocol: Protocol): void {
    // Logo i nagłówek PKP PLK
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 0, 210, 25, 'F');
    
    this.doc.setTextColor('#ffffff');
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PKP POLSKIE LINIE KOLEJOWE S.A.', 15, 12);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Protokół Oceny Stanu Technicznego Pojazdów Kolejowych', 15, 18);
    
    // Numer protokołu i typ
    this.doc.setTextColor(COLORS.text);
    this.doc.setFontSize(10);
    this.doc.text(`Nr protokołu: ${protocol.protocolNumber}`, 140, 12);
    this.doc.text(`Typ oceny: ${protocol.assessmentType}`, 140, 18);
    
    this.currentY = 35;
    this.addSeparator();
  }

  // Punkt 1-2: Podstawowe informacje
  private addBasicInfo(protocol: Protocol): void {
    this.addSectionTitle('1-2. PODSTAWOWE DANE PROTOKOŁU');
    
    const data = [
      ['Numer protokołu:', protocol.protocolNumber],
      ['Typ oceny:', `${protocol.assessmentType} - ${this.getAssessmentTypeDescription(protocol.assessmentType)}`],
      ['Data wystawienia:', this.formatDate(protocol.issueDate)],
      ['Lokalizacja:', protocol.location],
      ['Zakład/Lokomotywownia:', protocol.depot],
      ['Powód przeprowadzenia oceny:', protocol.inspectionReason]
    ];

    this.addDataTable(data);
  }

  // Punkty 3-4: Informacje o pojeździe
  private addVehicleInfo(protocol: Protocol): void {
    this.addSectionTitle('3-4. DANE IDENTYFIKACYJNE I TECHNICZNE POJAZDU');
    
    const vehicle = protocol.vehicleData;
    
    // Identyfikacja
    this.addSubsectionTitle('Identyfikacja pojazdu:');
    const identificationData = [
      ['Numer pojazdu:', vehicle.identification.vehicleNumber],
      ['Seria:', vehicle.identification.series],
      ['Typ pojazdu:', this.getVehicleTypeDescription(vehicle.vehicleType)],
      ['Producent:', vehicle.identification.manufacturer],
      ['Rok produkcji:', vehicle.identification.productionYear.toString()],
      ['Numer fabryczny:', vehicle.identification.factoryNumber || 'Brak danych'],
      ['Numer UIC:', vehicle.identification.uicNumber || 'Brak danych']
    ];
    this.addDataTable(identificationData);

    // Dane techniczne
    this.addSubsectionTitle('Dane techniczne:');
    const technicalData = [
      ['Długość [mm]:', vehicle.technicalData.length.toString()],
      ['Szerokość [mm]:', vehicle.technicalData.width.toString()],
      ['Wysokość [mm]:', vehicle.technicalData.height.toString()],
      ['Masa [kg]:', vehicle.technicalData.weight.toString()],
      ['Prędkość maksymalna [km/h]:', vehicle.technicalData.maxSpeed.toString()],
      ['Nacisk na oś [t]:', vehicle.technicalData.axleLoad.toString()],
      ['Rozstaw szyn [mm]:', vehicle.technicalData.gauge.toString()],
      ['Typy hamulców:', vehicle.technicalData.brakeType.join(', ')],
      ['Status eksploatacyjny:', this.getOperationalStatusDescription(vehicle.operationalStatus)],
      ['Aktualna lokalizacja:', vehicle.currentLocation]
    ];
    this.addDataTable(technicalData);
  }

  // Punkty 5-6: Komisja i podstawa prawna
  private addCommissionInfo(protocol: Protocol): void {
    this.addSectionTitle('5-6. SKŁAD KOMISJI I PODSTAWA PRAWNA');
    
    // Podstawa prawna
    this.addSubsectionTitle('Podstawa prawna:');
    this.addText(protocol.legalBasis);
    
    if (protocol.regulations.length > 0) {
      this.addText('Przepisy szczegółowe:');
      protocol.regulations.forEach(regulation => {
        this.addText(`• ${regulation}`, 20);
      });
    }

    // Skład komisji
    this.addSubsectionTitle('Skład komisji:');
    this.addText(`Przewodniczący komisji: ${protocol.commissionChairman}`);
    
    protocol.commission.forEach((member, index) => {
      this.addText(`${index + 1}. ${member.firstName} ${member.lastName}`, 15);
      this.addText(`   Funkcja: ${this.getCommissionRoleDescription(member.role)}`, 15);
      this.addText(`   Stanowisko: ${member.position}, ${member.company}`, 15);
      this.addText(`   Kwalifikacje: ${member.qualifications.join(', ')}`, 15);
      if (member.licenseNumber) {
        this.addText(`   Nr uprawnień: ${member.licenseNumber}`, 15);
      }
    });
  }

  // Pozostałe punkty - dokumentacja, warunki, narzędzia
  private addDocumentationInfo(protocol: Protocol): void {
    this.addSectionTitle('7. DOKUMENTACJA TOWARZYSZĄCA');
    
    if (protocol.accompanyingDocuments.length > 0) {
      this.addText('Dokumenty towarzyszące:');
      protocol.accompanyingDocuments.forEach(doc => {
        this.addText(`• ${doc}`, 15);
      });
    }

    if (protocol.previousInspections.length > 0) {
      this.addText('Poprzednie kontrole:');
      protocol.previousInspections.forEach(inspection => {
        this.addText(`• ${inspection}`, 15);
      });
    }
  }

  private addInspectionConditions(protocol: Protocol): void {
    this.addSectionTitle('8. WARUNKI PRZEPROWADZENIA OCENY');
    
    const conditions = [
      ['Warunki pogodowe:', protocol.inspectionConditions.weather],
      ['Temperatura [°C]:', protocol.inspectionConditions.temperature.toString()],
      ['Inne warunki:', protocol.inspectionConditions.other || 'Brak szczególnych uwag']
    ];
    
    this.addDataTable(conditions);
  }

  private addToolsAndScope(protocol: Protocol): void {
    this.addSectionTitle('9-10. NARZĘDZIA I ZAKRES OCENY');
    
    if (protocol.toolsUsed.length > 0) {
      this.addText('Wykorzystane narzędzia:');
      protocol.toolsUsed.forEach(tool => {
        this.addText(`• ${tool}`, 15);
      });
    }

    if (protocol.measuringDevices.length > 0) {
      this.addText('Przyrządy pomiarowe:');
      protocol.measuringDevices.forEach(device => {
        this.addText(`• ${device}`, 15);
      });
    }

    if (protocol.assessmentScope.length > 0) {
      this.addText('Zakres oceny:');
      protocol.assessmentScope.forEach(scope => {
        this.addText(`• ${scope}`, 15);
      });
    }
  }

  // Punkty 11-15: Stan techniczny
  private addTechnicalState(protocol: Protocol): void {
    this.addSectionTitle('11-15. OCENA STANU TECHNICZNEGO (PUNKTY a-q)');
    
    // Sprawdzenie czy potrzeba nowej strony dla tabeli
    if (this.currentY > 200) {
      this.addPage();
    }

    // Nagłówek tabeli
    const tableStartY = this.currentY;
    const colWidths = [15, 110, 25, 15, 25]; // Szerokości kolumn
    const headers = ['Pkt', 'Opis elementu', 'Stan', 'Kryt.', 'Uwagi'];
    
    // Rysowanie nagłówka tabeli
    let currentX = PDF_CONFIG.margins.left;
    this.doc.setFillColor(COLORS.background);
    this.doc.rect(currentX, this.currentY, 190, 8, 'F');
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      this.doc.text(header, currentX + 2, this.currentY + 5);
      currentX += colWidths[index];
    });
    
    this.currentY += 8;

    // Wiersze tabeli
    protocol.technicalState.forEach(item => {
      if (this.currentY > 270) { // Sprawdzenie końca strony
        this.addPage();
      }

      const rowHeight = this.calculateRowHeight(item);
      currentX = PDF_CONFIG.margins.left;
      
      // Tło wiersza
      this.doc.setFillColor('#ffffff');
      this.doc.rect(currentX, this.currentY, 190, rowHeight, 'F');
      
      // Obramowanie
      this.doc.setDrawColor(COLORS.border);
      this.doc.setLineWidth(0.1);
      this.doc.rect(currentX, this.currentY, 190, rowHeight, 'S');
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      
      // Punkt
      this.doc.text(item.point, currentX + 2, this.currentY + 4);
      currentX += colWidths[0];
      
      // Opis - może być wieloliniowy
      const description = TECHNICAL_STATE_POINTS[item.point as keyof typeof TECHNICAL_STATE_POINTS] || item.description;
      this.addWrappedText(description, currentX + 2, this.currentY + 4, colWidths[1] - 4);
      currentX += colWidths[1];
      
      // Stan
      this.doc.text(this.getConditionDescription(item.condition), currentX + 2, this.currentY + 4);
      currentX += colWidths[2];
      
      // Krytyczność
      this.doc.text(this.getCriticalityDescription(item.criticality), currentX + 2, this.currentY + 4);
      currentX += colWidths[3];
      
      // Uwagi
      if (item.notes) {
        this.addWrappedText(item.notes, currentX + 2, this.currentY + 4, colWidths[4] - 4);
      }
      
      this.currentY += rowHeight;
    });
    
    this.addSeparator();
  }

  // Punkt 16: Uwagi ogólne
  private addGeneralNotes(protocol: Protocol): void {
    this.addSectionTitle('16. UWAGI OGÓLNE I ZALECENIA');
    
    if (protocol.generalNotes) {
      this.addText('Uwagi ogólne:');
      this.addText(protocol.generalNotes, 15);
    }

    if (protocol.defectsFound.length > 0) {
      this.addText('Wykryte usterki:');
      protocol.defectsFound.forEach(defect => {
        this.addText(`• ${defect}`, 15);
      });
    }

    if (protocol.recommendations.length > 0) {
      this.addText('Zalecenia:');
      protocol.recommendations.forEach(recommendation => {
        this.addText(`• ${recommendation}`, 15);
      });
    }

    if (protocol.repairNeeded) {
      this.doc.setTextColor('#dc2626');
      this.doc.setFont('helvetica', 'bold');
      this.addText('⚠️ POJAZD WYMAGA NAPRAWY PRZED DOPUSZCZENIEM DO EKSPLOATACJI');
      this.doc.setTextColor(COLORS.text);
      this.doc.setFont('helvetica', 'normal');
    }
  }

  // Punkt 17: Podpisy
  private addSignatures(protocol: Protocol): void {
    this.addSectionTitle('17. PODPISY CZŁONKÓW KOMISJI');
    
    // Sprawdzenie miejsca na podpisy
    if (this.currentY > 200) {
      this.addPage();
    }

    protocol.commission.forEach((member, index) => {
      if (this.currentY > 250) {
        this.addPage();
      }

      // Ramka dla podpisu
      this.doc.setDrawColor(COLORS.border);
      this.doc.rect(PDF_CONFIG.margins.left, this.currentY, 180, 25);
      
      // Dane członka komisji
      this.doc.setFontSize(9);
      this.addText(`${member.firstName} ${member.lastName}`, 5);
      this.addText(`${member.role} • ${member.position}`, 5);
      this.addText(`${member.company}`, 5);
      
      // Miejsce na podpis
      this.doc.text('Podpis:', 120, this.currentY - 15);
      this.doc.text('Data:', 120, this.currentY - 8);
      
      // Linie do podpisu
      this.doc.line(135, this.currentY - 12, 180, this.currentY - 12);
      this.doc.line(135, this.currentY - 5, 180, this.currentY - 5);
      
      this.currentY += 30;
    });

    if (protocol.approvalDate) {
      this.addText(`Data zatwierdzenia protokołu: ${this.formatDate(protocol.approvalDate)}`);
    }
  }

  // Stopka dokumentu
  private addFooter(protocol: Protocol): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Linia stopki
      this.doc.setDrawColor(COLORS.border);
      this.doc.line(15, 280, 195, 280);
      
      // Tekst stopki
      this.doc.setFontSize(8);
      this.doc.setTextColor(COLORS.secondary);
      this.doc.text('Protokół wygenerowany przez System PKP PLK', 15, 285);
      this.doc.text(`Strona ${i} z ${pageCount}`, 170, 285);
      this.doc.text(`Wygenerowano: ${new Date().toLocaleString('pl-PL')}`, 15, 290);
    }
  }

  // Funkcje pomocnicze
  private addPage(): void {
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = PDF_CONFIG.margins.top;
  }

  private addSectionTitle(title: string): void {
    if (this.currentY > 260) {
      this.addPage();
    }
    
    this.currentY += 5;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(title, PDF_CONFIG.margins.left, this.currentY);
    this.doc.setTextColor(COLORS.text);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 8;
  }

  private addSubsectionTitle(title: string): void {
    this.currentY += 3;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, PDF_CONFIG.margins.left, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 5;
  }

  private addText(text: string, indent: number = 0): void {
    if (this.currentY > 270) {
      this.addPage();
    }
    
    this.doc.setFontSize(10);
    this.doc.text(text, PDF_CONFIG.margins.left + indent, this.currentY);
    this.currentY += PDF_CONFIG.lineHeight;
  }

  private addDataTable(data: string[][]): void {
    data.forEach(row => {
      if (this.currentY > 270) {
        this.addPage();
      }
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(row[0], PDF_CONFIG.margins.left, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(row[1], PDF_CONFIG.margins.left + 50, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;
    });
    
    this.currentY += 3;
  }

  private addSeparator(): void {
    this.currentY += 2;
    this.doc.setDrawColor(COLORS.border);
    this.doc.line(PDF_CONFIG.margins.left, this.currentY, 195, this.currentY);
    this.currentY += 5;
  }

  private addWrappedText(text: string, x: number, y: number, maxWidth: number): void {
    const lines = this.doc.splitTextToSize(text, maxWidth);
    let currentY = y;
    
    lines.forEach((line: string) => {
      this.doc.text(line, x, currentY);
      currentY += 4;
    });
  }

  private calculateRowHeight(item: any): number {
    const baseHeight = 8;
    const descriptionHeight = item.description.length > 50 ? 4 : 0;
    const notesHeight = item.notes && item.notes.length > 30 ? 4 : 0;
    
    return baseHeight + descriptionHeight + notesHeight;
  }

  // Funkcje mapowania wartości
  private formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL');
  }

  private getAssessmentTypeDescription(type: string): string {
    const types = {
      'P4': 'Przegląd okresowy',
      'P5': 'Przegląd główny'
    };
    return types[type as keyof typeof types] || type;
  }

  private getVehicleTypeDescription(type: string): string {
    const types = {
      'lokomotywa_elektryczna': 'Lokomotywa elektryczna',
      'lokomotywa_spalinowa': 'Lokomotywa spalinowa',
      'zespol_trakcyjny_elektryczny': 'Zespół trakcyjny elektryczny',
      'wagon_osobowy': 'Wagon osobowy'
    };
    return types[type as keyof typeof types] || type;
  }

  private getOperationalStatusDescription(status: string): string {
    const statuses = {
      'czynny': 'Czynny',
      'usterka': 'Usterka',
      'naprawa_biezaca': 'Naprawa bieżąca',
      'naprawa_glowna': 'Naprawa główna',
      'odstawiony': 'Odstawiony',
      'rezerwowy': 'Rezerwowy'
    };
    return statuses[status as keyof typeof statuses] || status;
  }

  private getCommissionRoleDescription(role: string): string {
    const roles = {
      'przewodniczacy': 'Przewodniczący komisji',
      'czlonek': 'Członek komisji',
      'sekretarz': 'Sekretarz komisji',
      'ekspert': 'Ekspert techniczny',
      'rzeczoznawca': 'Rzeczoznawca'
    };
    return roles[role as keyof typeof roles] || role;
  }

  private getConditionDescription(condition: string): string {
    const conditions = {
      'sprawny': 'Sprawny',
      'niesprawny': 'Niesprawny',
      'wymaga_naprawy': 'Do naprawy',
      'do_wymiany': 'Do wymiany',
      'nie_dotyczy': 'N/D'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  }

  private getCriticalityDescription(criticality?: string): string {
    const levels = {
      'low': 'N',
      'medium': 'Ś', 
      'high': 'W',
      'critical': 'K'
    };
    return levels[criticality as keyof typeof levels] || '';
  }
}

// Funkcja eksportująca do użycia w komponentach
export async function generateProtocolPDF(protocol: Protocol): Promise<Blob> {
  const generator = new ProtocolPDFGenerator();
  return await generator.generateProtocolPDF(protocol);
}

export default ProtocolPDFGenerator;