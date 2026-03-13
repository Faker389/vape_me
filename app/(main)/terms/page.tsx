"use client"

import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"

const Terms = () => {
  return (
    <div className="min-h-screen text-zinc-200 bg-[#0b0b15] relative overflow-hidden">

      {/* gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full"/>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-pink-600/20 blur-[150px] rounded-full"/>
      </div>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >

            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.25em] uppercase text-zinc-400 mb-4">
                Dokumenty
              </p>

              <h1 className="font-serif text-4xl md:text-5xl text-white">
                Regulamin <span className="text-purple-400">Aplikacji</span>
              </h1>

              <p className="text-zinc-400 mt-6">
                Regulamin korzystania z aplikacji oraz strony internetowej programu
                lojalnościowego.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12 text-zinc-400 leading-relaxed">

              <p className="text-sm">
                Ostatnia aktualizacja:{" "}
                <span className="text-white font-medium">
                  {new Date().toLocaleDateString("pl-PL")}
                </span>
              </p>

              {/* §1 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §1 <span className="text-purple-400">Postanowienia ogólne</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Regulamin określa zasady korzystania z aplikacji mobilnej
                    oraz strony internetowej programu lojalnościowego.
                  </li>
                  <li>
                    Program lojalnościowy umożliwia użytkownikom zdobywanie
                    punktów za zakupy dokonywane w sklepie oraz wymianę tych
                    punktów na nagrody, rabaty lub inne korzyści.
                  </li>
                  <li>
                    Korzystanie z aplikacji oraz strony internetowej oznacza
                    akceptację niniejszego regulaminu.
                  </li>
                </ol>
              </section>

              {/* §2 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §2 <span className="text-purple-400">Konto użytkownika</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Korzystanie z programu lojalnościowego wymaga utworzenia
                    konta użytkownika.
                  </li>
                  <li>
                    Użytkownik zobowiązuje się do podania prawdziwych i
                    aktualnych danych podczas rejestracji.
                  </li>
                  <li>
                    Użytkownik ponosi odpowiedzialność za bezpieczeństwo
                    swojego konta oraz danych logowania.
                  </li>
                </ol>
              </section>

              {/* §3 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §3 <span className="text-purple-400">Program lojalnościowy</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Użytkownicy otrzymują punkty za zakupy dokonane w sklepie.
                  </li>
                  <li>
                    Liczba przyznawanych punktów zależy od wartości zakupów
                    lub aktualnych promocji.
                  </li>
                  <li>
                    Punkty zapisywane są na koncie użytkownika w aplikacji.
                  </li>
                  <li>
                    Punkty mogą być wymieniane na nagrody, rabaty lub inne
                    korzyści oferowane w programie.
                  </li>
                </ol>
              </section>

              {/* §4 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §4 <span className="text-purple-400">Ważność punktów</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Punkty mogą posiadać określony termin ważności.
                  </li>
                  <li>
                    Po upływie terminu ważności niewykorzystane punkty mogą
                    zostać usunięte z konta użytkownika.
                  </li>
                  <li>
                    Szczegółowe informacje dotyczące ważności punktów mogą być
                    prezentowane w aplikacji.
                  </li>
                </ol>
              </section>

              {/* §5 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §5 <span className="text-purple-400">Odpowiedzialność</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Administrator dokłada wszelkich starań, aby aplikacja
                    działała w sposób ciągły i bez zakłóceń.
                  </li>
                  <li>
                    Administrator nie ponosi odpowiedzialności za przerwy
                    techniczne wynikające z prac serwisowych lub problemów
                    niezależnych od niego.
                  </li>
                </ol>
              </section>

              {/* §6 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §6 <span className="text-purple-400">Prawa autorskie</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Wszystkie elementy aplikacji oraz strony internetowej
                    podlegają ochronie prawnej.
                  </li>
                  <li>
                    Zabrania się kopiowania, modyfikowania oraz
                    rozpowszechniania treści bez zgody właściciela.
                  </li>
                </ol>
              </section>

              {/* §7 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §7 <span className="text-purple-400">Reklamacje</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Reklamacje dotyczące działania aplikacji lub programu
                    lojalnościowego należy zgłaszać drogą elektroniczną.
                  </li>
                  <li>
                    Reklamacja powinna zawierać dane kontaktowe oraz opis
                    problemu.
                  </li>
                  <li>
                    Reklamacje rozpatrywane są w terminie do 14 dni.
                  </li>
                </ol>
              </section>

              {/* §8 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  §8 <span className="text-purple-400">Postanowienia końcowe</span>
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Administrator zastrzega sobie prawo do zmiany niniejszego
                    regulaminu.
                  </li>
                  <li>
                    Aktualna wersja regulaminu publikowana jest na stronie
                    internetowej oraz w aplikacji.
                  </li>
                  <li>
                    Dalsze korzystanie z aplikacji oznacza akceptację zmian
                    regulaminu.
                  </li>
                </ol>
              </section>

            </div>
          </motion.div>

        </div>
      </main>

    </div>
  )
}

export default Terms