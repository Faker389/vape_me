"use client"

import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"

const Privacy = () => {
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
                Polityka <span className="text-purple-400">Prywatności</span>
              </h1>

              <p className="text-zinc-400 mt-6">
                Informacje dotyczące przetwarzania danych osobowych w aplikacji
                oraz na stronie programu lojalnościowego.
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

              {/* 1 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  1. <span className="text-purple-400">Informacje ogólne</span>
                </h2>

                <p>
                  Niniejsza polityka prywatności określa zasady przetwarzania,
                  przechowywania oraz ochrony danych osobowych użytkowników
                  korzystających z aplikacji mobilnej oraz strony internetowej
                  programu lojalnościowego.
                </p>

                <p>
                  Korzystanie z aplikacji oraz strony internetowej oznacza
                  akceptację zasad opisanych w niniejszej polityce prywatności.
                </p>
              </section>

              {/* 2 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  2. <span className="text-purple-400">Administrator danych</span>
                </h2>

                <p>
                  Administratorem danych osobowych jest właściciel aplikacji
                  oraz strony internetowej programu lojalnościowego.
                </p>

                <p>
                  Kontakt z administratorem możliwy jest poprzez adres e-mail
                  podany w stopce strony internetowej.
                </p>
              </section>

              {/* 3 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  3. <span className="text-purple-400">Zakres zbieranych danych</span>
                </h2>

                <p>Podczas korzystania z aplikacji lub strony mogą być zbierane następujące dane:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>adres e-mail – w celu utworzenia konta użytkownika</li>
                  <li>dane konta użytkownika – w celu obsługi programu lojalnościowego</li>
                  <li>informacje o zakupach – w celu przyznawania punktów lojalnościowych</li>
                  <li>dane techniczne – adres IP, typ urządzenia, informacje o przeglądarce</li>
                </ul>
              </section>

              {/* 4 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  4. <span className="text-purple-400">Cel przetwarzania danych</span>
                </h2>

                <p>Dane osobowe mogą być przetwarzane w celu:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>utworzenia oraz obsługi konta użytkownika</li>
                  <li>realizacji programu lojalnościowego</li>
                  <li>przyznawania punktów za zakupy</li>
                  <li>umożliwienia wymiany punktów na nagrody lub rabaty</li>
                  <li>kontaktu z użytkownikiem</li>
                  <li>analizy statystycznej działania aplikacji</li>
                  <li>wysyłki informacji marketingowych (wyłącznie za zgodą użytkownika)</li>
                </ul>
              </section>

              {/* 5 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  5. <span className="text-purple-400">Prawa użytkownika</span>
                </h2>

                <p>Każdy użytkownik ma prawo do:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>dostępu do swoich danych osobowych</li>
                  <li>sprostowania danych</li>
                  <li>usunięcia danych (prawo do bycia zapomnianym)</li>
                  <li>ograniczenia przetwarzania danych</li>
                  <li>przenoszenia danych</li>
                  <li>wniesienia sprzeciwu wobec przetwarzania danych</li>
                </ul>
              </section>

              {/* 6 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  6. <span className="text-purple-400">Bezpieczeństwo danych</span>
                </h2>

                <p>
                  Administrator stosuje odpowiednie środki techniczne i
                  organizacyjne w celu zapewnienia bezpieczeństwa danych
                  osobowych oraz ochrony ich przed nieuprawnionym dostępem,
                  utratą lub zniszczeniem.
                </p>

                <p>
                  Połączenia z serwisem są szyfrowane z wykorzystaniem
                  protokołu SSL.
                </p>
              </section>

              {/* 7 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  7. <span className="text-purple-400">Pliki cookies</span>
                </h2>

                <p>
                  Strona internetowa może wykorzystywać pliki cookies w celu
                  zapewnienia prawidłowego działania serwisu oraz analizy
                  sposobu korzystania z aplikacji przez użytkowników.
                </p>

                <p>
                  Użytkownik może zarządzać plikami cookies w ustawieniach
                  swojej przeglądarki internetowej.
                </p>
              </section>

              {/* 8 */}
              <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
                <h2 className="font-serif text-2xl text-white">
                  8. <span className="text-purple-400">Zmiany polityki prywatności</span>
                </h2>

                <p>
                  Administrator zastrzega sobie prawo do wprowadzania zmian
                  w niniejszej polityce prywatności.
                </p>

                <p>
                  Aktualna wersja dokumentu publikowana jest na stronie
                  internetowej oraz w aplikacji.
                </p>
              </section>

            </div>
          </motion.div>

        </div>
      </main>

    </div>
  )
}

export default Privacy