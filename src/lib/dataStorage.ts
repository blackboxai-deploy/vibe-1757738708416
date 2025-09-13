/**
 * System zarządzania danymi protokołów PKP PLK
 * Obsługa localStorage z możliwością archiwizacji i eksportu
 */

import { Protocol, ProtocolFilters, ProtocolStatistics } from '../types/protocol';

const STORAGE_KEYS = {
  PROTOCOLS: 'pkp_protocols',
  TEMPLATES: 'pkp_protocol_templates',
  SETTINGS: 'pkp_app_settings',
  BACKUP: 'pkp_protocols_backup'
} as const;

// Interfejs ustawień aplikacji
interface AppSettings {
  autoSave: boolean;
  backupEnabled: boolean;
  defaultDepot: string;
  defaultLocation: string;
  lastProtocolNumber: string;
  theme: 'light' | 'dark';
}

// Klasa zarządzania danymi
export class ProtocolDataManager {
  private static instance: ProtocolDataManager;
  
  private constructor() {}
  
  static getInstance(): ProtocolDataManager {
    if (!ProtocolDataManager.instance) {
      ProtocolDataManager.instance = new ProtocolDataManager();
    }
    return ProtocolDataManager.instance;
  }
  
  // Sprawdzenie dostępności localStorage
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  
  // Bezpieczne odczytywanie z localStorage
  private safeGetItem(key: string): string | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage: ${error}`);
      return null;
    }
  }
  
  // Bezpieczne zapisywanie do localStorage
  private safeSetItem(key: string, value: string): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage: ${error}`);
      return false;
    }
  }
  
  // Pobieranie wszystkich protokołów
  getAllProtocols(): Protocol[] {
    const data = this.safeGetItem(STORAGE_KEYS.PROTOCOLS);
    if (!data) return [];
    
    try {
      const protocols = JSON.parse(data) as Protocol[];
      // Konwersja stringów dat z powrotem na obiekty Date
      return protocols.map(this.deserializeProtocol);
    } catch (error) {
      console.error('Error parsing protocols from storage:', error);
      return [];
    }
  }
  
  // Pobieranie protokołu po ID
  getProtocol(id: string): Protocol | null {
    const protocols = this.getAllProtocols();
    return protocols.find(p => p.id === id) || null;
  }
  
  // Zapisywanie protokołu
  saveProtocol(protocol: Protocol): boolean {
    try {
      const protocols = this.getAllProtocols();
      const existingIndex = protocols.findIndex(p => p.id === protocol.id);
      
      // Serializacja dat
      const serializedProtocol = this.serializeProtocol({
        ...protocol,
        updatedAt: new Date()
      });
      
      if (existingIndex >= 0) {
        protocols[existingIndex] = serializedProtocol;
      } else {
        protocols.push(serializedProtocol);
      }
      
      const success = this.safeSetItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(protocols));
      
      if (success) {
        this.createBackup();
      }
      
      return success;
    } catch (error) {
      console.error('Error saving protocol:', error);
      return false;
    }
  }
  
  // Usuwanie protokołu
  deleteProtocol(id: string): boolean {
    try {
      const protocols = this.getAllProtocols();
      const filteredProtocols = protocols.filter(p => p.id !== id);
      
      const success = this.safeSetItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(filteredProtocols.map(this.serializeProtocol)));
      
      if (success) {
        this.createBackup();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting protocol:', error);
      return false;
    }
  }
  
  // Filtrowanie protokołów
  filterProtocols(filters: ProtocolFilters): Protocol[] {
    const protocols = this.getAllProtocols();
    
    return protocols.filter(protocol => {
      // Filtr statusu
      if (filters.status && filters.status.length > 0 && !filters.status.includes(protocol.status)) {
        return false;
      }
      
      // Filtr typu pojazdu
      if (filters.vehicleType && filters.vehicleType.length > 0 && 
          !filters.vehicleType.includes(protocol.vehicleData.vehicleType)) {
        return false;
      }
      
      // Filtr typu oceny
      if (filters.assessmentType && filters.assessmentType.length > 0 && 
          !filters.assessmentType.includes(protocol.assessmentType)) {
        return false;
      }
      
      // Filtr dat
      if (filters.dateFrom && protocol.issueDate < filters.dateFrom) {
        return false;
      }
      
      if (filters.dateTo && protocol.issueDate > filters.dateTo) {
        return false;
      }
      
      // Filtr zakładu
      if (filters.depot && !protocol.depot.toLowerCase().includes(filters.depot.toLowerCase())) {
        return false;
      }
      
      // Filtr numeru protokołu
      if (filters.protocolNumber && 
          !protocol.protocolNumber.toLowerCase().includes(filters.protocolNumber.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  // Generowanie statystyk
  getStatistics(): ProtocolStatistics {
    const protocols = this.getAllProtocols();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return {
      total: protocols.length,
      byStatus: protocols.reduce((acc, protocol) => {
        acc[protocol.status] = (acc[protocol.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byVehicleType: protocols.reduce((acc, protocol) => {
        acc[protocol.vehicleData.vehicleType] = (acc[protocol.vehicleData.vehicleType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byAssessmentType: protocols.reduce((acc, protocol) => {
        acc[protocol.assessmentType] = (acc[protocol.assessmentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: protocols.filter(p => p.createdAt >= thirtyDaysAgo).length
    };
  }
  
  // Eksport danych do JSON
  exportData(): string {
    const protocols = this.getAllProtocols();
    const settings = this.getSettings();
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      protocols: protocols.map(this.serializeProtocol),
      settings
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  // Import danych z JSON
  importData(jsonData: string): { success: boolean; message: string; imported: number } {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.protocols || !Array.isArray(data.protocols)) {
        return { success: false, message: 'Nieprawidłowy format danych', imported: 0 };
      }
      
      const existingProtocols = this.getAllProtocols();
      const existingIds = new Set(existingProtocols.map(p => p.id));
      
      let imported = 0;
      const protocolsToImport = data.protocols
        .map(this.deserializeProtocol)
        .filter((protocol: Protocol) => {
          if (!existingIds.has(protocol.id)) {
            imported++;
            return true;
          }
          return false;
        });
      
      const allProtocols = [...existingProtocols, ...protocolsToImport];
      
      const success = this.safeSetItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(allProtocols.map(this.serializeProtocol)));
      
      if (success && data.settings) {
        this.saveSettings(data.settings);
      }
      
      return {
        success,
        message: success ? `Pomyślnie zaimportowano ${imported} protokołów` : 'Błąd podczas importu',
        imported
      };
    } catch (error) {
      return { success: false, message: `Błąd parsowania danych: ${error}`, imported: 0 };
    }
  }
  
  // Zarządzanie ustawieniami
  getSettings(): AppSettings {
    const data = this.safeGetItem(STORAGE_KEYS.SETTINGS);
    
    const defaultSettings: AppSettings = {
      autoSave: true,
      backupEnabled: true,
      defaultDepot: '',
      defaultLocation: '',
      lastProtocolNumber: '',
      theme: 'light'
    };
    
    if (!data) return defaultSettings;
    
    try {
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
      return defaultSettings;
    }
  }
  
  saveSettings(settings: Partial<AppSettings>): boolean {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    return this.safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  }
  
  // System tworzenia kopii zapasowych
  createBackup(): boolean {
    const exportData = this.exportData();
    return this.safeSetItem(STORAGE_KEYS.BACKUP, exportData);
  }
  
  restoreFromBackup(): { success: boolean; message: string } {
    const backupData = this.safeGetItem(STORAGE_KEYS.BACKUP);
    
    if (!backupData) {
      return { success: false, message: 'Brak kopii zapasowej' };
    }
    
    const result = this.importData(backupData);
    return {
      success: result.success,
      message: result.success ? 'Przywrócono z kopii zapasowej' : result.message
    };
  }
  
  // Czyszczenie danych
  clearAllData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROTOCOLS);
      localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
      localStorage.removeItem(STORAGE_KEYS.BACKUP);
      return true;
    } catch {
      return false;
    }
  }
  
  // Generowanie następnego numeru protokołu
  generateNextProtocolNumber(depot: string): string {
    const protocols = this.getAllProtocols();
    const currentYear = new Date().getFullYear();
    const depotCode = depot.substring(0, 3).toUpperCase();
    
    // Znajdź najwyższy numer w tym roku dla tego zakładu
    const yearProtocols = protocols.filter(p => 
      p.protocolNumber.includes(currentYear.toString()) && 
      p.protocolNumber.startsWith(depotCode)
    );
    
    const numbers = yearProtocols
      .map(p => {
        const match = p.protocolNumber.match(/\/(\d+)\//);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
    
    return `${depotCode}/${nextNumber}/${currentYear}`;
  }
  
  // Serializacja protokołu (konwersja dat na stringi)
  private serializeProtocol(protocol: Protocol): any {
    return {
      ...protocol,
      createdAt: protocol.createdAt.toISOString(),
      updatedAt: protocol.updatedAt.toISOString(),
      issueDate: protocol.issueDate.toISOString(),
      approvalDate: protocol.approvalDate?.toISOString(),
      vehicleData: {
        ...protocol.vehicleData,
        commissioningDate: protocol.vehicleData.commissioningDate?.toISOString(),
        lastOverhaul: protocol.vehicleData.lastOverhaul?.toISOString(),
        lastInspection: protocol.vehicleData.lastInspection?.toISOString()
      },
      signatures: protocol.signatures.map(sig => ({
        ...sig,
        signatureDate: sig.signatureDate.toISOString()
      }))
    };
  }
  
  // Deserializacja protokołu (konwersja stringów na daty)
  private deserializeProtocol(data: any): Protocol {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      issueDate: new Date(data.issueDate),
      approvalDate: data.approvalDate ? new Date(data.approvalDate) : undefined,
      vehicleData: {
        ...data.vehicleData,
        commissioningDate: data.vehicleData.commissioningDate ? new Date(data.vehicleData.commissioningDate) : undefined,
        lastOverhaul: data.vehicleData.lastOverhaul ? new Date(data.vehicleData.lastOverhaul) : undefined,
        lastInspection: data.vehicleData.lastInspection ? new Date(data.vehicleData.lastInspection) : undefined
      },
      signatures: data.signatures.map((sig: any) => ({
        ...sig,
        signatureDate: new Date(sig.signatureDate)
      }))
    };
  }
}

// Eksport instancji singletona
export const dataManager = ProtocolDataManager.getInstance();

// Funkcje pomocnicze
export function saveProtocol(protocol: Protocol): boolean {
  return dataManager.saveProtocol(protocol);
}

export function loadProtocol(id: string): Protocol | null {
  return dataManager.getProtocol(id);
}

export function loadAllProtocols(): Protocol[] {
  return dataManager.getAllProtocols();
}

export function deleteProtocol(id: string): boolean {
  return dataManager.deleteProtocol(id);
}

export function filterProtocols(filters: ProtocolFilters): Protocol[] {
  return dataManager.filterProtocols(filters);
}

export function getStatistics(): ProtocolStatistics {
  return dataManager.getStatistics();
}

export default dataManager;