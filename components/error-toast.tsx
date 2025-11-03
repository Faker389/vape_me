"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface ErrorToastProps {
  message: string
  type?: "error" | "success" | "info"
  onClose: () => void
  duration?: number
}

export function ErrorToast({ message, type = "error", onClose, duration = 5000 }: ErrorToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  }

  const colors = {
    error: "from-red-500/90 to-red-600/90 border-red-500/50",
    success: "from-green-500/90 to-green-600/90 border-green-500/50",
    info: "from-blue-500/90 to-blue-600/90 border-blue-500/50",
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-20 right-4 z-[90] bg-gradient-to-r ${colors[type]} backdrop-blur-lg border rounded-xl p-4 shadow-2xl max-w-md`}
    >
      <div className="flex items-start gap-3">
        <div className="text-white mt-0.5">{icons[type]}</div>
        <p className="text-white flex-1 text-sm leading-relaxed">{message}</p>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
