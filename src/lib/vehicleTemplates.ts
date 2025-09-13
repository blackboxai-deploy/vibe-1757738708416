/**
 * Szablony opisów pojazdów kolejowych z autentycznymi opisami PKP PLK
 * Zawiera standardowe opisy stanu technicznego dla różnych typów pojazdów
 */

import { VehicleType, VehicleSeries } from '../types/vehicle';
import { TechnicalStateItem } from '../types/protocol';

// Standardowe punkty oceny stanu technicznego (a-q) zgodnie z załącznikiem nr 8
export const TECHNICAL_STATE_POINTS = {
  'a': 'Konstrukcja nośna (rama główna, ostoje, belki poprzeczne)',
  'b': 'Konstrukcja nadwozia (ściany, dach, okna, drzwi)',
  'c': 'Układ jezdny (wózki, osie, łożyska, resorowanie)',
  'd': 'Koła kolejowe (powierzchnie toczne, obręcze, zestawy kołowe)',
  'e': 'Układ hamulcowy (cylindry, przewody, szczęki, tarcze)',
  'f': 'Sprzęgi i aparaty pociągowe (sprzęgi automatyczne, zderzaki)',
  'g': 'Układ elektryczny trakcyjny (silniki, przekształtniki, pantografy)',
  'h': 'Układ elektryczny pomocniczy (oświetlenie, ogrzewanie, wentylacja)',
  'i': 'Układ napędowy spalinowy (silnik, skrzynia biegów, chłodnice)',
  'j': 'Układy pneumatyczne i hydrauliczne (sprężarki, zbiorniki, zawory)',
  'k': 'Kabina maszynisty (pulpit, siedzenia, systemy bezpieczeństwa)',
  'l': 'Wyposażenie wnętrza (siedzenia, poręcze, tablice informacyjne)',
  'm': 'Systemy bezpieczeństwa (SHP, radio-stop, czujniki)',
  'n': 'Aparatura kontrolno-pomiarowa (manometry, mierniki, rejestratory)',
  'o': 'Instalacje sanitarne (toalety, umywalki, zbiorniki)',
  'p': 'Wyposażenie specjalne (klimatyzacja, rozgłos, informacja pasażerska)',
  'q': 'Stan ogólny czystości i oznakowania pojazdu'
} as const;

// Szczegółowe opisy dla różnych typów pojazdów
export const DETAILED_DESCRIPTIONS = {
  lokomotywa_elektryczna: {
    'a': 'Rama główna - spawana konstrukcja stalowa, ostoje silników trakcyjnych, mocowania transformatora głównego, belki poprzeczne i wzdłużne konstrukcji nośnej',
    'b': 'Nadwozie maszynowe - ściany boczne i czołowe, dach z zamocowaniami pantografów, okna kabiny, drzwi maszynowe i kabinowe',
    'c': 'Wózki napędowe i toczne - ramy wózków, resorowanie I i II stopnia, prowadnice zestawów kołowych, amortyzatory',
    'd': 'Zestawy kołowe napędne - koła monoblokowe, osie korbowe, łożyska toczne, przekładnie trakcyjne',
    'e': 'Hamulec elektrodynamiczny i pneumatyczny - rezystory hamowania, cylindry hamulcowe, szczęki kompozytowe, przewody hamulcowe',
    'f': 'Sprzęgi automatyczne typ SA3 - głowice sprzęgowe, amortyzatory, przewody pneumatyczne i elektryczne',
    'g': 'Napęd elektryczny - silniki trakcyjne asynchroniczne, przekształtniki trakcyjne, pantografy typu 5ZU, transformator główny',
    'h': 'Instalacja pomocnicza - przekształtniki pomocnicze, ogrzewanie elektryczne, oświetlenie LED, wentylatory chłodzące',
    'i': 'Nie dotyczy - pojazd trakcji elektrycznej',
    'j': 'Sprężarka główna, zbiorniki powietrza główny i pomocniczy, zawory redukcyjne, osuszacz powietrza',
    'k': 'Kabina maszynisty - pulpit sterowniczy Medcom, fotele, systemy bezpieczeństwa SHP/CA, radio Motorola',
    'l': 'Nie dotyczy - lokomotywa bez pomieszczeń pasażerskich',
    'm': 'SHP - samoczynne hamowanie pociągu, CA - czuwak aktywny, system RADIOSTOP, detektory nagrzania łożysk ASDEK',
    'n': 'Mierniki cyfrowe - amperomierze, woltomierze, manometry, rejestratory parametrów jazdy',
    'o': 'Nie dotyczy - brak instalacji sanitarnych w lokomotywie',
    'p': 'Klimatyzacja kabiny, system diagnostyki pokładowej, łączność radiowa GSM-R',
    'q': 'Malowanie zgodne z instrukcją PKP PLK Ir-12, oznakowania UIC, tablice ostrzegawcze, czystość pojazdu'
  },
  
  lokomotywa_spalinowa: {
    'a': 'Rama główna - spawana konstrukcja stalowa, mocowania silnika spalinowego i generatora, belki wzdłużne i poprzeczne',
    'b': 'Nadwozie maszynowe - komora silnikowa z kratami wentylacyjnymi, kabina maszynisty, drzwi serwisowe',
    'c': 'Wózki napędowe - konstrukcja spawana, resorowanie listkowe i gumowe, prowadnice osi, tłumiki drgań',
    'd': 'Zestawy kołowe - koła jednolite lub składane, osie korbowe, łożyska ślizgowe lub toczne, maźnice',
    'e': 'Hamulec pneumatyczny - cylinder hamulcowy, szczęki żeliwne lub kompozytowe, przewody, zawory',
    'f': 'Sprzęgi śrubowe lub automatyczne - aparaty zderzno-pociągowe, resory buforowe, łańcuchy bezpieczeństwa',
    'g': 'Prądnica główna prądu stałego, regulatory napięcia, rozrusznik silnika spalinowego, akumulatory',
    'h': 'Instalacja 24V - oświetlenie, sygnalizacja, ogrzewanie kabiny, wentylatory chłodzące prądnicę',
    'i': 'Silnik spalinowy wysokoprężny - blok cylindrów, pompa wtryskowa, turbosprężarka, chłodnice',
    'j': 'Sprężarka powietrza, zbiorniki główny i pomocniczy, regulatory ciśnienia, osuszacze powietrza',
    'k': 'Kabina maszynisty - kontroler jazdy, hamulec maszynisty, manometry, mierniki temperatury i obrotów',
    'l': 'Nie dotyczy - lokomotywa bez pomieszczeń pasażerskich',
    'm': 'Czuwak mechaniczny, sygnał alarmowy, układ zabezpieczenia przed przeciążeniem silnika',
    'n': 'Manometry pneumatyczne, termometry, obrotomierz silnika, mierniki prądu i napięcia analogowe',
    'o': 'Nie dotyczy - brak instalacji sanitarnych',
    'p': 'Ogrzewanie niezależne kabiny, wentylacja przymusowa komory silnikowej, radio analogowe',
    'q': 'Malowanie ochronne antykorozyjne, oznakowania eksploatacyjne, czystość komory silnikowej'
  },

  zespol_trakcyjny_elektryczny: {
    'a': 'Konstrukcja nośna wagonu silnikowego i doczepnego - profile aluminiowe lub stalowe, połączenia spawane i nitowane',
    'b': 'Nadwozia wagonów - ściany zewnętrzne, okna bezpieczne, drzwi automatyczne dla pasażerów, przedziały',
    'c': 'Wózki napędne i toczne - konstrukcja spawana, resorowanie pneumatyczne, stabilizatory poprzeczne',
    'd': 'Zestawy kołowe - koła odporne na hamowanie, profile S1002, łożyska toczne, detektory nagrzania',
    'e': 'Hamulec elektrodynamiczny i pneumatyczny - rezystory dachowe, cylindry hamulcowe, tarcze hamulcowe',
    'f': 'Sprzęgi międzywagonowe stałe, sprzęgi automatyczne na końcach składu, amortyzatory',
    'g': 'Silniki asynchroniczne, falowniki trakcyjne, pantografy, transformatory, układy filtrujące',
    'h': 'Przetwornice pomocnicze, oświetlenie LED, klimatyzacja, ogrzewanie elektryczne przedziałów',
    'i': 'Nie dotyczy - trakcja elektryczna',
    'j': 'Sprężarki bezolejowe, zbiorniki powietrza, regulatory, zawory sterujące drzwiami',
    'k': 'Kabina maszynisty - pulpit mikroprocesorowy, systemy bezpieczeństwa, ergonomiczne fotele',
    'l': 'Siedzenia pasażerskie, poręcze, tablice informacyjne, podłogi antypoślizgowe, oświetlenie wnętrza',
    'm': 'SHP/CA, RADIOSTOP, system przeciwpoślizgowy, czujniki drzwi, system zarządzania pociągiem',
    'n': 'Komputery pokładowe, wyświetlacze LCD, systemy diagnostyczne, rejestratory parametrów',
    'o': 'Toalety pasażerskie z recyrkulacją, umywalki, zbiorniki na nieczystości, pompy próżniowe',
    'p': 'Klimatyzacja komfortowa, system informacji pasażerskiej, Wi-Fi, gniazdka 230V, rozgłośnia',
    'q': 'Malowanie zgodne ze standardami przewoźnika, czystość wnętrz, sprawność oznakowania'
  },

  wagon_osobowy: {
    'a': 'Rama podwozia stalowa spawana, belki główne wzdłużne, poprzecznice, mocowania wózków',
    'b': 'Nadwozie - konstrukcja stalowa lub aluminiowa, okna, drzwi wejściowe, przedziały pasażerskie',
    'c': 'Wózki pasażerskie typ Y25 lub podobne, resorowanie wielostopniowe, tłumiki kołysania',
    'd': 'Zestawy kołowe standardowe, koła monoblokowe, osie, łożyska toczne, maźnice',
    'e': 'Hamulec pneumatyczny - cylinder, szczęki kompozytowe, klocki, przewody, zawory',
    'f': 'Sprzęgi śrubowe z aparatami zderzno-pociągowymi, resory buforowe, łańcuchy',
    'g': 'Nie dotyczy - wagon bez napędu własnego',
    'h': 'Instalacja elektryczna 1000V lub 3000V - oświetlenie, ogrzewanie, gniazdka, przewody',
    'i': 'Nie dotyczy - brak napędu spalinowego',
    'j': 'Przewody hamulcowe, kurki końcowe, zawory odcięcia, złączki międzywagonowe',
    'k': 'Nie dotyczy - brak kabiny maszynisty',
    'l': 'Siedzenia pasażerskie, stoły, bagażniki, poręcze, podłogi, tapicerka, oświetlenie',
    'm': 'Instalacja alarmowa, gaśnice, młotki bezpieczeństwa, instrukcje ewakuacji',
    'n': 'Nie dotyczy - brak aparatury pomiarowej',
    'o': 'Toalety z systemem grawitacyjnym lub recyrkulacyjnym, umywalki, lustry, dozowniki',
    'p': 'Ogrzewanie elektryczne lub parowe, wentylacja naturalna lub wymuszona, rolety',
    'q': 'Stan malowania zewnętrznego i wewnętrznego, czystość, kompletność oznakowania'
  }
};

// Szablony dla różnych serii pojazdów
export const VEHICLE_TEMPLATES = {
  // Lokomotywy elektryczne
  'ET22': {
    vehicleType: 'lokomotywa_elektryczna' as VehicleType,
    defaultDescription: DETAILED_DESCRIPTIONS.lokomotywa_elektryczna,
    specificPoints: [
      'Transformator główny typu OLMb 3150/25',
      'Silniki trakcyjne typu 1LM315M',
      'Przekształtniki statyczne IGBT',
      'Pantografy typu 5ZU z głowicami 1600mm'
    ],
    commonDefects: [
      'Zużycie szczęk hamulcowych',
      'Przecieki oleju z przekładni trakcyjnych', 
      'Zużycie obręczy kół',
      'Problemy z układem chłodzenia transformatora'
    ]
  },

  'EU07': {
    vehicleType: 'lokomotywa_elektryczna' as VehicleType,
    defaultDescription: DETAILED_DESCRIPTIONS.lokomotywa_elektryczna,
    specificPoints: [
      'Transformator główny typu OLMb 2500/25',
      'Silniki trakcyjne 6 sztuk typu LK450',
      'Prostowniki krzemowe typu VPKSz',
      'Pantografy typu 95NA'
    ],
    commonDefects: [
      'Zużycie szczotek silników trakcyjnych',
      'Przecieki oleju z łożysk',
      'Korozja elementów nadwozia',
      'Zużycie przekładni głównych'
    ]
  },

  // Zespoły trakcyjne
  'EN57': {
    vehicleType: 'zespol_trakcyjny_elektryczny' as VehicleType,  
    defaultDescription: DETAILED_DESCRIPTIONS.zespol_trakcyjny_elektryczny,
    specificPoints: [
      'Skład 3-wagonowy (wagon silnikowy + doczepny + silnikowy)',
      'Silniki trakcyjne 4 x 185kW',
      'Hamulec elektrodynamiczny',
      'Drzwi automatyczne sterowane pneumatycznie'
    ],
    commonDefects: [
      'Zużycie prowadnic drzwi',
      'Problemy z układem pneumatycznym', 
      'Zużycie tapicerki siedzeń',
      'Usterki oświetlenia LED'
    ]
  },

  'EN71': {
    vehicleType: 'zespol_trakcyjny_elektryczny' as VehicleType,
    defaultDescription: DETAILED_DESCRIPTIONS.zespol_trakcyjny_elektryczny,
    specificPoints: [
      'Nowoczesny skład z klimatyzacją',
      'Silniki asynchroniczne sterowane falownikami IGBT',
      'System informacji pasażerskiej LCD',
      'Monitoring wizyjny wnętrza'
    ],
    commonDefects: [
      'Usterki systemu klimatyzacji',
      'Problemy z wyświetlaczami informacji',
      'Zużycie klocków hamulcowych',
      'Usterki czujników drzwi'
    ]
  }
};

// Funkcja generująca domyślny stan techniczny dla typu pojazdu
export function generateDefaultTechnicalState(vehicleType: VehicleType, series?: VehicleSeries): TechnicalStateItem[] {
  const descriptions = (DETAILED_DESCRIPTIONS as any)[vehicleType] || DETAILED_DESCRIPTIONS.lokomotywa_elektryczna;
  
  return Object.entries(TECHNICAL_STATE_POINTS).map(([point, baseDescription]) => ({
    id: `tech-${point}-${Date.now()}`,
    point: point as any,
    description: (descriptions as any)[point] || baseDescription,
    condition: 'sprawny' as const,
    notes: '',
    criticality: 'medium' as const
  }));
}

// Funkcja pobierająca szablon dla konkretnej serii
export function getVehicleTemplate(series: VehicleSeries) {
  return (VEHICLE_TEMPLATES as any)[series] || null;
}

// Funkcja pobierająca typowe usterki dla typu pojazdu
export function getCommonDefects(vehicleType: VehicleType, series?: VehicleSeries): string[] {
  if (series && (VEHICLE_TEMPLATES as any)[series]) {
    return (VEHICLE_TEMPLATES as any)[series].commonDefects;
  }
  
  // Ogólne usterki według typu pojazdu
  const commonDefectsByType = {
    lokomotywa_elektryczna: [
      'Zużycie szczotek silników trakcyjnych',
      'Przecieki oleju z przekładni',
      'Zużycie obręczy kół',
      'Problemy z transformatorem głównym',
      'Usterki pantografów'
    ],
    lokomotywa_spalinowa: [
      'Zużycie silnika spalinowego',
      'Problemy z prądnicą główną',
      'Przecieki płynów eksploatacyjnych',
      'Zużycie układu hamulcowego',
      'Korozja konstrukcji'
    ],
    zespol_trakcyjny_elektryczny: [
      'Usterki drzwi automatycznych',
      'Problemy z klimatyzacją',
      'Zużycie wyposażenia wnętrza',
      'Usterki systemów informacyjnych',
      'Problemy z hamulcami'
    ],
    wagon_osobowy: [
      'Zużycie wyposażenia wnętrza',
      'Przecieki instalacji sanitarnej',
      'Problemy z ogreaniem',
      'Zużycie układu hamulcowego',
      'Korozja konstrukcji'
    ]
  };

  return (commonDefectsByType as any)[vehicleType] || [];
}

export default {
  TECHNICAL_STATE_POINTS,
  DETAILED_DESCRIPTIONS,
  VEHICLE_TEMPLATES,
  generateDefaultTechnicalState,
  getVehicleTemplate,
  getCommonDefects
};