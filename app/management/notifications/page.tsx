"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Send, Bell, X, AlertCircle } from "lucide-react"
import axios from "axios"
import { OfflineBanner } from "@/components/offline-banner"
import { ErrorToast } from "@/components/error-toast"
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"
import { auth } from "@/lib/firebase"

interface NotificationData {
  title: string
  message: string
  priority: "normal" | "high"
  sendImmediately: boolean
  scheduledDate?: string
  scheduledTime?: string
}
export const dynamic = 'force-dynamic'
interface Alert {
  id: string
  message: string
  type: 'error' | 'success' | 'warning'
}
export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    message: "",
    priority: "normal",
    sendImmediately: true,
    scheduledDate: "",
    scheduledTime: "",
  })

  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
    const [alerts, setAlerts] = useState<Alert[]>([])
    const isOnline = useOnlineStatus();
  const showAlert = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
    const newAlert: Alert = {
      id: crypto.randomUUID(),
      message,
      type
    }
    
    setAlerts(prev => [...prev, newAlert])
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
    }, 3000)
  }
  const getAlertStyles = (type: 'error' | 'success' | 'warning') => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-400'
      case 'warning':
        return 'bg-yellow-600 border-yellow-400'
      case 'error':
      default:
        return 'bg-red-600 border-red-400'
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.message.trim()) {
      showAlert("Tytuł i treść wiadomości są wymagane","error")
      return
    }
    setIsSending(true)

    try {
      await axios.post("/api/send_notification/all", {
        title: formData.title,
        body: formData.message,
        priority: formData.priority,
        notificationType:"pushNotifications" 
         
      })
      setIsSending(false)
      setShowSuccess(true)

      setFormData({
        title: "",
        message: "",
        priority: "normal",
        sendImmediately: true,
        scheduledDate: "",
        scheduledTime: "",
      })
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (err) {
      console.log(err)
      showAlert("Nie udało się wysłać powiadomienia. Spróbuj ponownie.","error")
      setIsSending(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com"&&user?.email!=="vapeme123321@gmail.com") {
        window.location.href = "/"
      }
    })
    return () => unsubscribe()
  }, [])
  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <OfflineBanner />

      <div className="fixed top-8 right-8 z-50 space-y-3 max-w-md">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${getAlertStyles(alert.type)} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border-2`}
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">{alert.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>


      <div className="relative z-10 p-8 ">
        <div className="mb-8">
          <Link
            href="/management"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Powrót do zarządzania
          </Link>
          <div className="flex justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Bell className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Wyślij Powiadomienie</h1>
              <p className="text-purple-300">Zarządzaj powiadomieniami dla użytkowników aplikacji</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-semibold mb-2">Tytuł Powiadomienia *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Np. Nowa Promocja!"
                  className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-semibold mb-2">Treść Wiadomości *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Wpisz treść powiadomienia, które zobaczą użytkownicy..."
                  className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-purple-300/70 text-xs mt-2">{formData.message.length} / 500 znaków</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">Priorytet</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="normal" className="bg-slate-800">
                      Normalny
                    </option>
                    <option value="high" className="bg-slate-800">
                      Wysoki
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="sendImmediately"
                    checked={formData.sendImmediately}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-500 bg-white/10 border-purple-300/30 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="ml-3 text-purple-200 font-medium group-hover:text-purple-100 transition-colors">
                    Wyślij natychmiast
                  </span>
                </label>
              </div>

              {!formData.sendImmediately && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                >
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">Data Wysłania</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">Godzina Wysłania</label>
                    <input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSending||!isOnline}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Wysyłanie...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Wyślij Powiadomienie
                  </>
                )}
              </motion.button>
            </div>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 backdrop-blur-lg border border-green-500/50 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-100 mb-2">Powiadomienie Wysłane!</h3>
                <p className="text-green-200">Twoje powiadomienie zostało pomyślnie wysłane do użytkowników.</p>
              </motion.div>
            )}

            <div className="bg-blue-500/10 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-blue-200 font-semibold mb-3 flex items-center gap-2">
                <Bell size={20} />
                Informacje o Powiadomieniach
              </h3>
              <ul className="text-blue-200/80 text-sm space-y-2">
                <li>• Powiadomienia są wysyłane przez Firebase Cloud Messaging</li>
                <li>• Użytkownicy muszą mieć włączone powiadomienia w aplikacji</li>
                <li>• Wysyłka może potrwać do 5 minut</li>
              </ul>
            </div>
          </form>
        </motion.div>
        <AnimatePresence>
        {!isOnline && (
    <motion.div
      key="offline-alert"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed bottom-8 left-8 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border border-white/20"
    >
      <X className="w-6 h-6" />
      <span className="font-semibold">Brak połączenia z internetem. Połącz się, aby kontynuować.</span>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </div>
  )
}
