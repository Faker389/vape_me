"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import OptimizedImage from "@/components/OptimizedImage"
import { ArrowLeft, Edit, X, AlertCircle } from "lucide-react"
import { auth, } from "@/lib/firebase"
import type { ProductForm } from "@/lib/productModel"
import { useProductsStore } from "@/lib/storage"
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"
import EditForm from "./EditForm"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


export const dynamic = "force-dynamic"
 
interface Alert {
  id: string
  message: string
  type: "error" | "success" | "warning"
}

export default function ItemsManagementPage() {
  const [mounted, setMounted] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null)
  const [formData, setFormData] = useState<ProductForm | null>(null)
  const { products, listenToProducts } = useProductsStore()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const showAlert = useCallback((message: string, type: "error" | "success" | "warning" = "error") => {
    const newAlert: Alert = {
      id: crypto.randomUUID(),
      message,
      type,
    }

    setAlerts((prev) => [...prev, newAlert])

    requestAnimationFrame(() => {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
      }, 3000)
    })
  }, [])
  function handleCloseFkc(){
    setEditingProduct(null)
  }
  const isOnline = useOnlineStatus()

  useEffect(() => {
    setMounted(true)
  }, [])

  

  const getAlertStyles = useCallback((type: "error" | "success" | "warning") => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-400"
      case "warning":
        return "bg-yellow-600 border-yellow-400"
      case "error":
      default:
        return "bg-red-600 border-red-400"
    }
  }, [])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    const query = debouncedSearchQuery.toLowerCase().trim()
    if (!query) return products.slice(0, 50)

    return products
      .filter((e) => {
        return e.id.toString().includes(query) || e.name.toLowerCase().includes(query)
      })
      .slice(0, 50)
  }, [products, debouncedSearchQuery])

  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])

  const handleEdit = useCallback((product: ProductForm) => {
    setEditingProduct(product)
    setFormData({ ...product })
    
  }, [])
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com" && user?.email !== "vapeme123321@gmail.com") {
        window.location.href = "/"
      }
    })
    return () => unsubscribe()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Blobs */}
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

      {/* Navigation */}
      <nav className="relative border-b border-white/10 backdrop-blur-xl bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/management" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Powrót do zarządzania</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Zarządzaj Produktami
        </motion.h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Szukaj produktu po ID lub nazwie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            data-form-type="other"
            className="w-full rounded-2xl px-4 py-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="space-y-4">
              {isOnline &&
                products &&
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/50 transition-all"
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-800/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <OptimizedImage
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                        priority={index < 10}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                        {product.isNew && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                            NEW
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                            BESTSELLER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>
                          Ilość na Dąbrowskiego:{" "}
                          <span className="text-white font-medium">{product.store1quantity}</span>
                        </span>
                        <span>
                          Ilość na Grunwaldzkiej:{" "}
                          <span className="text-white font-medium">{product.store2quantity}</span>
                        </span>
                        <span>
                          Cena: <span className="text-white font-medium">{product.price.toFixed(2)} zł</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edytuj
                    </button>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
            {editingProduct && formData&&<EditForm product={editingProduct} showAlert={showAlert} handleCloseFkc={handleCloseFkc}/>}
    </AnimatePresence>
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
  )
}
