"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ShieldCheck, AlertCircle } from "lucide-react"

export function AgeVerificationModal() {
  const [isVerified, setIsVerified] = useState(true)
  const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const verified = localStorage.getItem("ageVerified")
    if (verified !== "true") {
      setIsVerified(false)
    }
  }, [])

  const calculateAge = (day: number, month: number, year: number) => {
    const today = new Date()
    const birthDateObj = new Date(year, month - 1, day)
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }

    return age
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const day = Number.parseInt(birthDate.day)
    const month = Number.parseInt(birthDate.month)
    const year = Number.parseInt(birthDate.year)

    // Validation
    if (!day || !month || !year) {
      setError("Proszę wypełnić wszystkie pola")
      setIsSubmitting(false)
      return
    }

    if (day < 1 || day > 31) {
      setError("Nieprawidłowy dzień")
      setIsSubmitting(false)
      return
    }

    if (month < 1 || month > 12) {
      setError("Nieprawidłowy miesiąc")
      setIsSubmitting(false)
      return
    }

    const currentYear = new Date().getFullYear()
    if (year < 1900 || year > currentYear) {
      setError("Nieprawidłowy rok")
      setIsSubmitting(false)
      return
    }

    // Check if date is valid
    const testDate = new Date(year, month - 1, day)
    if (testDate.getDate() !== day || testDate.getMonth() !== month - 1 || testDate.getFullYear() !== year) {
      setError("Nieprawidłowa data")
      setIsSubmitting(false)
      return
    }

    const age = calculateAge(day, month, year)

    setTimeout(() => {
      if (age >= 18) {
        localStorage.setItem("ageVerified", "true")
        setIsVerified(true)
      } else {
        setError("Musisz mieć ukończone 18 lat, aby uzyskać dostęp do tej strony")
        localStorage.setItem("ageVerified", "false")
      }
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <AnimatePresence>
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
            {/* Animated background blobs */}
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

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Weryfikacja Wieku
            </h2>
            <p className="text-center text-white/70 mb-8">
              Aby uzyskać dostęp do tej strony, musisz mieć ukończone 18 lat
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className=" text-white font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data urodzenia
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="DD"
                    min="1"
                    max="31"
                    value={birthDate.day}
                    onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                  <input
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    value={birthDate.month}
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                  <input
                    type="number"
                    placeholder="RRRR"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={birthDate.year}
                    onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Weryfikacja...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Potwierdź wiek
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center text-white/50 text-xs mt-6">
              Ta strona zawiera produkty przeznaczone wyłącznie dla osób pełnoletnich
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
