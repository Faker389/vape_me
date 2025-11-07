"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Percent, Package, Check, X, List } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import DiscountForm from "./DiscountForm"
import CouponForm from "./CouponForm"
import CouponList from "./CouponList"
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"

export const dynamic = "force-dynamic"

export default function AddCouponsPage() {
  const [viewMode, setViewMode] = useState<"add-discount" | "add-item" | "manage">("add-discount")
  const [showSuccess, setShowSuccess] = useState(false)

  const isOnline = useOnlineStatus()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com"&&user?.email!=="vapeme123321@gmail.com") {
        window.location.href = "/"
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="mb-8">
          <Link href="/management">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Powrót do zarządzania
            </motion.button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dodaj Kupon</h1>
          <p className="text-white/70 text-sm md:text-base">Utwórz nowy kupon rabatowy lub przedmiotowy</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (isOnline ? setViewMode("add-discount") : "")}
            className={`px-6 md:px-8 py-4 rounded-xl backdrop-blur-xl border-2 transition-all flex items-center gap-3 ${
              viewMode === "add-discount"
                ? "bg-white/20 border-white/40 shadow-lg shadow-purple-500/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <Percent
              className={`w-5 md:w-6 h-5 md:h-6 ${viewMode === "add-discount" ? "text-white" : "text-white/60"}`}
            />
            <div className="text-left">
              <h3 className="text-base md:text-lg font-bold text-white">Kupon Rabatowy</h3>
              <p className="text-white/70 text-xs">Zniżka procentowa</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (isOnline ? setViewMode("add-item") : "")}
            className={`px-6 md:px-8 py-4 rounded-xl backdrop-blur-xl border-2 transition-all flex items-center gap-3 ${
              viewMode === "add-item"
                ? "bg-white/20 border-white/40 shadow-lg shadow-pink-500/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <Package className={`w-5 md:w-6 h-5 md:h-6 ${viewMode === "add-item" ? "text-white" : "text-white/60"}`} />
            <div className="text-left">
              <h3 className="text-base md:text-lg font-bold text-white">Kupon Przedmiotowy</h3>
              <p className="text-white/70 text-xs">Darmowy produkt</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (isOnline ? setViewMode("manage") : "")}
            className={`px-6 md:px-8 py-4 rounded-xl backdrop-blur-xl border-2 transition-all flex items-center gap-3 ${
              viewMode === "manage"
                ? "bg-white/20 border-white/40 shadow-lg shadow-green-500/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <List className={`w-5 md:w-6 h-5 md:h-6 ${viewMode === "manage" ? "text-white" : "text-white/60"}`} />
            <div className="text-left">
              <h3 className="text-base md:text-lg font-bold text-white">Dostępne Kupony</h3>
              <p className="text-white/70 text-xs">Zarządzaj kuponami</p>
            </div>
          </motion.button>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {isOnline ? (
              viewMode == "add-discount" ? (
                <DiscountForm fkc={setShowSuccess} />
              ) : viewMode == "add-item" ? (
                <CouponForm fkc={setShowSuccess} />
              ) : (
                <CouponList />
              )
            ) : (
              ""
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-4 md:right-8 bg-green-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <Check className="w-5 md:w-6 h-5 md:h-6" />
              <span className="font-bold text-sm md:text-base">Kupon został utworzony!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOnline && (
            <motion.div
              key="offline-alert"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed bottom-8 left-4 md:left-8 bg-red-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border border-white/20"
            >
              <X className="w-5 md:w-6 h-5 md:h-6" />
              <span className="font-semibold text-sm md:text-base">
                Brak połączenia z internetem. Połącz się, aby kontynuować.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
