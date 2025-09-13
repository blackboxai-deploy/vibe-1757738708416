import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Protokoły PKP PLK - System Oceny Stanu Technicznego",
  description: "Profesjonalna aplikacja do generowania protokołów oceny stanu technicznego pojazdów kolejowych P4/P5 zgodnie z wymogami PKP PLK",
  keywords: "PKP PLK, protokoły, pojazdy kolejowe, stan techniczny, P4, P5, lokomotywy, wagony",
  authors: [{ name: "PKP PLK S.A." }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="https://placehold.co/32x32?text=PKP" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-blue-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://placehold.co/48x48?text=PKP&bg=1e3a8a&color=white" 
                    alt="Logo PKP PLK" 
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">
                      Protokoły PKP PLK
                    </h1>
                    <p className="text-blue-200 text-sm">
                      System Oceny Stanu Technicznego Pojazdów Kolejowych
                    </p>
                  </div>
                </div>
                <nav className="flex space-x-6">
                  <a 
                    href="/" 
                    className="hover:text-blue-200 transition-colors px-3 py-2 rounded-md hover:bg-blue-800"
                  >
                    Nowy Protokół
                  </a>
                  <a 
                    href="/protocols" 
                    className="hover:text-blue-200 transition-colors px-3 py-2 rounded-md hover:bg-blue-800"
                  >
                    Lista Protokołów
                  </a>
                  <a 
                    href="/templates" 
                    className="hover:text-blue-200 transition-colors px-3 py-2 rounded-md hover:bg-blue-800"
                  >
                    Szablony
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    PKP Polskie Linie Kolejowe S.A.
                  </h3>
                  <p className="text-gray-300 text-sm">
                    System do generowania protokołów oceny stanu technicznego 
                    pojazdów kolejowych zgodnie z załącznikiem nr 8.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Typy Protokołów
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• P4 - Przeglądy okresowe</li>
                    <li>• P5 - Przeglądy główne</li>
                    <li>• Oceny po naprawach</li>
                    <li>• Kontrole doraźne</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Informacje Prawne
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Zgodność z załącznikiem nr 8 PKP PLK</li>
                    <li>• Standardy bezpieczeństwa kolejowego</li>
                    <li>• Przepisy UIC i TSI</li>
                    <li>• Certyfikacja pojazdów</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                <p>
                  © 2024 PKP Polskie Linie Kolejowe S.A. Wszystkie prawa zastrzeżone.
                </p>
                <p className="mt-2">
                  Wersja aplikacji: 1.0 | Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}