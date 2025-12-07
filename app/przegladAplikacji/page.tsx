import "./style.css"
export default function Przeglad(){

    return <>

<div className="title">Przegląd Techniczny - Vape Me</div>
<div className="subtitle">Platforma Lojalnościowa z Systemem Punktów</div>

<h1>1. APLIKACJA MOBILNA (iOS & Android)</h1>

<h2>1.1 System Uwierzytelniania</h2>
<ul>
<li><strong>Logowanie przez numer telefonu</strong> - uwierzytelnianie SMS z kodem weryfikacyjnym</li>
<li><strong>Automatyczne zarządzanie sesją</strong> - użytkownik pozostaje zalogowany między uruchomieniami aplikacji</li>
<li><strong>Kompatybilność iOS</strong> - aplikacja została skompilowana i przetestowana na urządzeniach Apple</li>
</ul>

<h2>1.2 Ekran Główny (Home)</h2>
<ul>
<li><strong>Animowane tło gradientowe</strong> - płynne przejścia kolorystyczne dla lepszego doświadczenia użytkownika</li>
<li><strong>Karta punktów</strong> - wyświetla aktualny stan punktów lojalnościowych z ikoną</li>
<li><strong>Generator kodu kreskowego</strong> - dynamiczne generowanie kodu do skanowania przy kasie</li>
<li><strong>Sekcja polecanych nagród</strong> - karuzela z najlepszymi ofertami wymiennymi</li>
<li><strong>Ostatnia aktywność</strong> - historia ostatnich transakcji punktowych</li>
<li><strong>Przyciski szybkich akcji</strong> - nawigacja do kluczowych funkcji aplikacji</li>
</ul>

<h2>1.3 System Nagród i Kuponów</h2>
<ul>
<li><strong>Przeglądanie dostępnych nagród</strong> - katalog produktów i zniżek do wymiany za punkty</li>
<li><strong>Filtrowanie nagród</strong> - sortowanie według kategorii, ceny punktowej, nowości</li>
<li><strong>Szczegóły nagrody</strong> - pełen opis, zdjęcie, wymagana liczba punktów</li>
<li><strong>Aktywne kupony</strong> - lista wszystkich aktywowanych kuponów przez użytkownika</li>
<li><strong>Organizacja kuponów</strong> - automatyczne grupowanie na: aktywne, użyte, wygasłe</li>
<li><strong>Kod QR kuponu</strong> - generowanie unikalnego kodu do zeskanowania w sklepie</li>
<li><strong>Data wygaśnięcia</strong> - ostrzeżenia o kuponach wygasających w ciągu 7 dni</li>
<li><strong>Warunki użycia</strong> - szczegółowe informacje o warunkach realizacji kuponu</li>
</ul>

<h2>1.4 Profil Użytkownika</h2>
<ul>
<li><strong>Karta profilu</strong> - wyświetlanie zdjęcia, imienia i email użytkownika</li>
<li><strong>Edycja profilu</strong> - możliwość zmiany danych osobowych, zdjęcia profilowego</li>
<li><strong>Menu nawigacyjne</strong> z następującymi opcjami:
<ul>
<li>Aktywne Kupony - dostęp do listy kuponów</li>
<li>Historia - przegląd wszystkich transakcji punktowych</li>
<li>Transfer Punktów - możliwość przesyłania punktów innym użytkownikom</li>
<li>Powiadomienia - ustawienia powiadomień push</li>
<li>Pomoc i Wsparcie - kontakt z supportem, FAQ</li>
<li>Polityka Prywatności - regulamin i zasady ochrony danych</li>
</ul>
</li>
<li><strong>Przycisk wylogowania</strong> - bezpieczne zakończenie sesji</li>
</ul>

<h2>1.5 Transfer Punktów</h2>
<ul>
<li><strong>Wyświetlanie salda</strong> - aktualna liczba dostępnych punktów w karcie gradientowej</li>
<li><strong>Pole numeru odbiorcy</strong> - wprowadzanie numeru telefonu użytkownika, któremu chcemy wysłać punkty</li>
<li><strong>Wybór liczby punktów</strong> - ręczne wpisywanie lub szybkie przyciski (10, 25, 50, 100)</li>
<li><strong>Walidacja salda</strong> - sprawdzenie czy użytkownik ma wystarczającą ilość punktów</li>
<li><strong>Dialog potwierdzenia</strong> - podsumowanie transakcji przed wykonaniem</li>
<li><strong>Historia transferów</strong> - zapisywanie wszystkich wysłanych i otrzymanych punktów</li>
</ul>

<h2>1.6 Ustawienia Powiadomień</h2>
<ul>
<li><strong>Powiadomienia ogólne</strong> - wiadomości o systemie, aktualizacjach</li>
<li><strong>Powiadomienia aktywności</strong> - informacje o nowych punktach, wygasających kuponach</li>
<li><strong>Powiadomienia marketingowe</strong> - promocje, specjalne oferty</li>
<li><strong>Przełączniki włącz/wyłącz</strong> - osobna kontrola dla każdego typu powiadomień</li>
<li><strong>Zapisywanie ustawień</strong> - trwałe przechowywanie preferencji użytkownika w lokalnej bazie</li>
</ul>

<h2>1.7 Pomoc i Wsparcie</h2>
<ul>
<li><strong>Opcje kontaktu</strong> - email, telefon, live chat z możliwością bezpośredniego połączenia</li>
<li><strong>Sekcja FAQ</strong> - rozwijane karty z najczęściej zadawanymi pytaniami</li>
<li><strong>Kolorowe ikony</strong> - intuicyjna nawigacja wizualna</li>
</ul>

<h2>1.8 Architektura Techniczna Mobile</h2>
<ul>
<li><strong>Framework Flutter</strong> - wieloplatformowa aplikacja (Android i iOS) z jednego kodu źródłowego</li>
<li><strong>Firebase Authentication</strong> - bezpieczne zarządzanie użytkownikami</li>
<li><strong>Cloud Firestore</strong> - baza danych w chmurze z synchronizacją w czasie rzeczywistym</li>
<li><strong>Hive (lokalna baza danych)</strong> - szybki cache danych offline</li>
<li><strong>Real-time Listener</strong> - automatyczne aktualizacje danych bez odświeżania</li>
<li><strong>Provider State Management</strong> - zarządzanie stanem aplikacji (dane użytkownika, punkty, kupony)</li>
<li><strong>QR Flutter</strong> - generowanie kodów QR dla kuponów</li>
<li><strong>SharedPreferences</strong> - przechowywanie ustawień użytkownika</li>
<li><strong>Responsive Design</strong> - adaptacja interfejsu do różnych rozmiarów ekranów</li>
<li><strong>Optymalizacja wydajności</strong> - minimalizacja zapytań do bazy, cache lokalny</li>
</ul>

<h1>2. APLIKACJA WEBOWA (Panel Administracyjny + Landing Page)</h1>

<h2>2.1 Landing Page (Strona Publiczna)</h2>

<h3>2.1.1 Strona Główna</h3>
<ul>
<li><strong>Sekcja Hero</strong> - duży baner z animowanym tłem gradientowym i przyciskiem pobierania aplikacji</li>
<li><strong>Logo maskotki</strong> - animowana maskotka Vape Me z efektami hover</li>
<li><strong>Karty funkcji</strong> - 4 główne funkcje aplikacji z ikonami i opisami</li>
<li><strong>Najlepiej sprzedające się produkty</strong> - karuzela z 10 produktami, auto-przewijanie od lewej do prawej</li>
<li><strong>Ostatnio dodane produkty</strong> - druga karuzela z nowymi produktami, przewijanie od prawej do lewej</li>
<li><strong>Dostępność w lokalizacjach</strong> - informacja czy produkt jest dostępny w Lokalizacji 1, 2 czy obu</li>
<li><strong>Formularz kontaktowy</strong> - sekcja z możliwością wysłania wiadomości do firmy</li>
<li><strong>Efekt glassmorphism</strong> - przezroczyste karty z efektem matowego szkła</li>
<li><strong>Responsywny design</strong> - pełna adaptacja do urządzeń mobilnych i tabletów</li>
</ul>

<h3>2.1.2 Strona Produktów</h3>
<p><strong>Panel filtrowania</strong> (lewa strona):</p>
<ul>
<li>Filtr kategorii - wybór typu produktu (Jednorazówki, Liquidy, itp.)</li>
<li>Filtr marki - wybór producenta (ELFBAR, Lost Mary, Vuse, itp.)</li>
<li>Filtr zakresu cen - suwak do ustawienia minimalnej i maksymalnej ceny</li>
<li>Filtr lokalizacji - checkboxy dla Lokalizacji 1 i 2</li>
<li>Opcje sortowania - sortowanie po cenie, punktach, nazwie</li>
<li>Przycisk resetowania filtrów</li>
</ul>

<p><strong>Siatka produktów</strong> (prawa strona):</p>
<ul>
<li>Karty produktów z obrazem, nazwą, ceną, punktami</li>
<li>Odznaki "NOWY" i "BESTSELLER"</li>
<li>Informacja o dostępności w lokalizacjach na dole karty</li>
<li>Animacje hover dla lepszej interaktywności</li>
</ul>

<p><strong>Licznik produktów</strong> - wyświetlanie ile produktów spełnia kryteria filtrowania</p>

<h2>2.2 Panel Zarządzania (Management Dashboard)</h2>

<h3>2.2.1 Główny Dashboard</h3>
<p><strong>4 główne moduły</strong> w formie animowanych kart:</p>
<ul>
<li>Zarządzanie Produktami</li>
<li>Dodawanie Produktów</li>
<li>Transakcje</li>
<li>Powiadomienia</li>
<li>Kupony</li>
</ul>
<ul>
<li><strong>Nawigacja</strong> - przycisk powrotu do strony głównej</li>
<li><strong>Gradientowe ikony</strong> - każdy moduł ma unikalny gradient kolorystyczny</li>
</ul>

<h3>2.2.2 Zarządzanie Produktami</h3>
<ul>
<li><strong>Lista produktów</strong> - wyświetlanie wszystkich produktów w sklepie</li>
<li><strong>Karta produktu zawiera</strong>:
<ul>
<li>Miniatura zdjęcia</li>
<li>Nazwa produktu</li>
<li>Ilość w magazynie</li>
<li>Cena i punkty</li>
<li>Przycisk edycji</li>
</ul>
</li>
<li><strong>Modal edycji</strong> z pełnym formularzem:
<ul>
<li>Nazwa produktu</li>
<li>Kategoria</li>
<li>Marka</li>
<li>Cena i punkty</li>
<li>Ilość w Lokalizacji 1 i 2</li>
<li>URL zdjęcia</li>
<li>Opis produktu</li>
<li><strong>Sekcja Features</strong> - dynamiczne dodawanie cech produktu (każda jako string)</li>
<li><strong>Sekcja Specifications</strong> - dynamiczne dodawanie specyfikacji (klucz-wartość, np. "Moc: 80W")</li>
<li>Checkboxy: Nowy produkt, Bestseller, Zawiera CBD</li>
<li>Dropdown lokalizacji</li>
</ul>
</li>
<li><strong>Funkcje dodawania/usuwania</strong> - możliwość dodania nieograniczonej liczby cech i specyfikacji</li>
<li><strong>Ikonki usuwania</strong> - pojawienie się na hover dla każdej cechy/specyfikacji</li>
<li><strong>Zapisywanie zmian</strong> - aktualizacja danych w bazie z walidacją</li>
<li><strong>Scrollowalna lista</strong> - obsługa dużej liczby produktów</li>
</ul>

<h3>2.2.3 Dodawanie Produktów</h3>
<ul>
<li><strong>Sekcja preview zdjęcia</strong> - wyświetlanie podglądu URL obrazu</li>
<li><strong>Pełny formularz produktu</strong>:
<ul>
<li>Wszystkie pola jak w edycji</li>
<li>Upload URL zdjęcia z możliwością usunięcia tła</li>
<li>Walidacja wymaganych pól</li>
<li><strong>Dynamiczne Features</strong> - dodawanie wielu cech produktu</li>
<li><strong>Dynamiczne Specifications</strong> - dodawanie par klucz-wartość</li>
</ul>
</li>
<li><strong>Animowane powiadomienie sukcesu</strong> - po dodaniu produktu</li>
</ul>

<h3>2.2.4 System Transakcji</h3>
<ul>
<li><strong>Status skanowania użytkownika</strong> - wizualna informacja czy użytkownik zeskanował aplikację (zielony checkmark lub czerwony X)</li>
<li><strong>Lista zeskanowanych produktów</strong>:
<ul>
<li>Miniatura produktu</li>
<li>Nazwa i ilość</li>
<li>Cena jednostkowa i całkowita</li>
<li>Ilość szt.</li>
</ul>
</li>
<li><strong>Kalkulacja punktów</strong> - automatyczne przeliczanie ceny na punkty (1 zł = 1 punkt)</li>
<li><strong>Sekcja kuponów</strong>:
<ul>
<li>Lista zastosowanych kuponów</li>
<li>Nazwa kuponu i wysokość zniżki</li>
<li>Wartość rabatu w złotówkach</li>
</ul>
</li>
<li><strong>Podsumowanie finansowe</strong>:
<ul>
<li>Suma częściowa (przed rabatem)</li>
<li>Suma rabatów z kuponów</li>
<li>Kwota końcowa do zapłaty</li>
</ul>
</li>
<li><strong>Przycisk finalizacji</strong> - zakończenie transakcji (aktywny tylko gdy użytkownik jest zeskanowany)</li>
</ul>

<h3>2.2.5 Moduł Powiadomień</h3>
<p><strong>Formularz tworzenia powiadomienia</strong>:</p>
<ul>
<li>Tytuł powiadomienia (wymagany)</li>
<li>Treść wiadomości - textarea z licznikiem znaków (max 500)</li>
<li>Wybór grupy docelowej:
<ul>
<li>Wszyscy użytkownicy</li>
<li>Aktywni użytkownicy (ostatnia aktywność &lt; 30 dni)</li>
<li>Nieaktywni użytkownicy (ostatnia aktywność &gt; 30 dni)</li>
</ul>
</li>
<li>Priorytet wiadomości (Niski, Średni, Wysoki)</li>
<li>Toggle "Wyślij natychmiast"</li>
<li>Harmonogram wysyłki - kalendarz i czas (gdy nie natychmiast)</li>
</ul>
<ul>
<li><strong>Karta informacyjna</strong> - statystyki dostępnych użytkowników</li>
<li><strong>Walidacja formularza</strong> - sprawdzenie wymaganych pól</li>
<li><strong>Stan ładowania</strong> - animacja podczas wysyłania</li>
<li><strong>Komunikat sukcesu</strong> - potwierdzenie wysłania powiadomienia</li>
</ul>

<h3>2.2.6 Zarządzanie Kuponami</h3>

<p><strong>Tryb dodawania:</strong></p>
<ul>
<li><strong>Wybór typu kuponu</strong> - tabsy nawigacyjne na górze:
<ul>
<li>Kupon zniżkowy</li>
<li>Kupon produktowy</li>
</ul>
</li>
<li><strong>Formularz kuponu zniżkowego</strong>:
<ul>
<li>Nazwa kuponu</li>
<li>Kategoria (np. "Zniżki")</li>
<li>Opis rabatu</li>
<li>Wysokość rabatu (%)</li>
<li>Minimalna kwota zakupu</li>
<li>Koszt w punktach</li>
<li>Czas trwania od momentu aktywacji (w dniach)</li>
<li>URL zdjęcia</li>
</ul>
</li>
<li><strong>Formularz kuponu produktowego</strong>:
<ul>
<li>Wybór produktu z bazy danych</li>
<li>Automatyczne wypełnienie: nazwa, opis, zdjęcie</li>
<li>Koszt w punktach (możliwość zmiany)</li>
<li>Czas ważności po aktywacji</li>
</ul>
</li>
<li><strong>Generowanie unikalnego ID</strong> - automatyczne tworzenie identyfikatora</li>
<li><strong>Preview</strong> - podgląd kuponu przed zapisaniem</li>
<li><strong>Zapisywanie do bazy</strong> - dodanie kuponu do katalogu</li>
</ul>

<p><strong>Tryb przeglądania:</strong></p>
<ul>
<li><strong>Lista wszystkich dostępnych kuponów</strong>:
<ul>
<li>Siatka kart z kuponami</li>
<li>Miniatura zdjęcia</li>
<li>Nazwa kuponu</li>
<li>Koszt w punktach</li>
<li>Data wygaśnięcia</li>
<li>Typ kuponu (ikona)</li>
</ul>
</li>
<li><strong>Przyciski akcji</strong> dla każdego kuponu:
<ul>
<li>Edycja - otwiera modal z formularzem</li>
<li>Usuń - usunięcie po potwierdzeniu</li>
</ul>
</li>
<li><strong>Modal edycji kuponu</strong>:
<ul>
<li>Wszystkie pola jak w dodawaniu</li>
<li>Wczytywanie istniejących danych</li>
<li>Aktualizacja z zachowaniem ID</li>
<li>Data modyfikacji</li>
</ul>
</li>
<li><strong>Filtrowanie</strong> - możliwość filtrowania po typie kuponu</li>
<li><strong>Sortowanie</strong> - po dacie dodania, cenie punktowej</li>
</ul>

<h2>2.3 Architektura Techniczna Web</h2>

<h3>2.3.1 Frontend</h3>
<ul>
<li><strong>Next.js 16</strong> - framework React z renderowaniem po stronie serwera</li>
<li><strong>TypeScript</strong> - typowanie statyczne dla bezpieczeństwa kodu</li>
<li><strong>Tailwind CSS</strong> - utility-first framework do stylowania</li>
<li><strong>Framer Motion</strong> - biblioteka animacji dla płynnych przejść</li>
<li><strong>React Hooks</strong> - zarządzanie stanem (useState, useEffect)</li>
<li><strong>App Router</strong> - nowoczesny routing Next.js</li>
<li><strong>Responsive Grid System</strong> - adaptacja do wszystkich urządzeń</li>
</ul>

<h3>2.3.2 Komponenty UI</h3>
<ul>
<li><strong>Glassmorphism cards</strong> - przezroczyste karty z efektem rozmycia</li>
<li><strong>Gradient backgrounds</strong> - animowane tła z przejściami kolorów</li>
<li><strong>Hover animations</strong> - interaktywne efekty po najechaniu myszką</li>
<li><strong>Modal dialogs</strong> - wyskakujące okna dialogowe</li>
<li><strong>Form validation</strong> - walidacja danych wejściowych w czasie rzeczywistym</li>
<li><strong>Toast notifications</strong> - powiadomienia o sukcesie/błędzie</li>
<li><strong>Loading states</strong> - animowane wskaźniki ładowania</li>
<li><strong>Empty states</strong> - komunikaty gdy brak danych</li>
</ul>

<h3>2.3.3 Dane i Synchronizacja</h3>
<ul>
<li><strong>Mock data</strong> - przykładowe dane produktów i kuponów</li>
<li><strong>Local state management</strong> - React state dla zarządzania formularzami</li>
<li><strong>Console logging</strong> - przygotowanie pod integrację z API</li>
<li><strong>Data validation</strong> - sprawdzanie poprawności danych przed zapisem</li>
<li><strong>Auto-scrolling carousels</strong> - automatyczne przewijanie list produktów</li>
</ul>

<h1>3. INTEGRACJE I BEZPIECZEŃSTWO</h1>

<h2>3.1 Bazy Danych</h2>
<ul>
<li><strong>Cloud Firestore</strong> - NoSQL baza w chmurze dla aplikacji mobilnej</li>
<li><strong>Hive</strong> - lokalna baza danych dla offline mode</li>
<li><strong>Real-time synchronization</strong> - automatyczne aktualizacje między urządzeniami</li>
<li><strong>Data caching</strong> - przechowywanie danych lokalnie dla szybszego dostępu</li>
</ul>

<h2>3.2 Uwierzytelnianie</h2>
<ul>
<li><strong>Firebase Auth</strong> - system zarządzania użytkownikami</li>
<li><strong>JWT Tokens</strong> - bezpieczne tokeny sesji</li>
<li><strong>Session management</strong> - automatyczne odnawianie sesji</li>
<li><strong>Secure logout</strong> - bezpieczne wylogowanie z usuwaniem tokenów</li>
</ul>

<h2>3.3 Optymalizacja Wydajności</h2>
<ul>
<li><strong>Lazy loading</strong> - ładowanie obrazów i komponentów na żądanie</li>
<li><strong>Code splitting</strong> - podział kodu na mniejsze części</li>
<li><strong>Image optimization</strong> - kompresja i optymalizacja zdjęć</li>
<li><strong>Caching strategy</strong> - strategia cachowania dla lepszej wydajności</li>
<li><strong>Debouncing</strong> - optymalizacja wyszukiwania i filtrowania</li>
</ul>

<h2>3.4 Bezpieczeństwo</h2>
<ul>
<li><strong>Input sanitization</strong> - oczyszczanie danych wejściowych</li>
<li><strong>XSS protection</strong> - ochrona przed atakami cross-site scripting</li>
<li><strong>Secure data transmission</strong> - szyfrowane połączenia HTTPS</li>
<li><strong>Data validation</strong> - walidacja po stronie klienta i serwera</li>
<li><strong>Environment variables</strong> - bezpieczne przechowywanie kluczy API</li>
</ul>


<h1>4. PODSUMOWANIE TECHNICZNE</h1>

<h2>Aplikacja Mobilna:</h2>
<ul>
<li><strong>25+ ekranów i komponentów</strong></li>
<li><strong>10+ głównych funkcjonalności</strong></li>
<li><strong>Pełna obsługa iOS i Android</strong></li>
<li><strong>Synchronizacja w czasie rzeczywistym</strong></li>
<li><strong>Obsługa offline</strong></li>
</ul>

<h2>Aplikacja Webowa:</h2>
<ul>
<li><strong>6 głównych modułów zarządzania</strong></li>
<li><strong>2 strony publiczne (landing + produkty)</strong></li>
<li><strong>Zaawansowany system filtrowania</strong></li>
<li><strong>Responsywny design</strong></li>
<li><strong>Gotowość do integracji z backendem</strong></li>
</ul>

<h2>Kluczowe Technologie:</h2>
<ul>
<li>Flutter (Mobile)</li>
<li>Next.js + React (Web)</li>
<li>Firebase (Backend)</li>
<li>Firestore (Database)</li>
<li>TypeScript (Type Safety)</li>
<li>Tailwind CSS (Styling)</li>
<li>Framer Motion (Animations)</li>
</ul>

<h1>5. PODSUMOWANIE</h1>

<div className="bg-text">

<ul>
<li><strong>Domena</strong> - opłacana przez 2 lata</li>
<li><strong>Wsparcie techniczne</strong> - darmowe przez 2 lata</li>
<li><strong>Wszelakie dodatki</strong> - cena do dogadania</li>
<li><strong>Utrzymanie bazy danych</strong> - maksymalnie 30 zł miesięcznie</li>
<li><strong>Cena końcowa</strong> - 7.200 zł</li>
</ul>
</div>
    </>
}