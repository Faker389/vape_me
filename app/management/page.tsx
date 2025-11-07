"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { useEffect } from "react"
import { Package, PlusCircle, Receipt, Bell, Gift } from "lucide-react"
import { OfflineBanner } from "@/components/offline-banner"
export const dynamic = 'force-dynamic'

export default function ManagementPage() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com"&&user?.email!=="vapeme123321@gmail.com") {
        window.location.href = "/"
      }
    })
    return () => unsubscribe()
  }, [])
  const cards = [
    {
      title: "Zarządzaj Produktami",
      description: "Przeglądaj i edytuj istniejące produkty",
      icon: Package,
      href: "/management/items",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Dodaj Produkt",
      description: "Dodaj nowy produkt do katalogu",
      icon: PlusCircle,
      href: "/management/add",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Transakcje",
      description: "Sprawdź i finalizuj transakcje",
      icon: Receipt,
      href: "/management/transaction",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Powiadomienia",
      description: "Wyślij powiadomienia do użytkowników",
      icon: Bell,
      href: "/management/notifications",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Dodaj Kupony",
      description: "Twórz kupony rabatowe i przedmiotowe",
      icon: Gift,
      href: "/management/coupons",
      gradient: "from-emerald-500 to-teal-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <OfflineBanner />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            top: "10%",
            left: "10%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Panel Zarządzania</h1>
          <p className="text-xl text-purple-200">Zarządzaj produktami, transakcjami i użytkownikami</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {" "}
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer h-full shadow-2xl"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <card.icon className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{card.title}</h2>
                  <p className="text-purple-200">{card.description}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
