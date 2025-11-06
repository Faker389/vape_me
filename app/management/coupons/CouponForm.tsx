"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Coins, Save, Check, X } from "lucide-react"
import type { ProductForm } from "@/lib/productModel"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { type coupon, db } from "@/lib/firebase"
import { useProductsStore } from "@/lib/storage"

interface formCoupon {
  title: string
  category: string
  description: string
  discountPercent: number
  pointCost: number
  expiryDays: number
  minimalPrice: number
  imageUrl: string
}

const initialform: formCoupon = {
  title: "",
  category: "Zniżki",
  description: "",
  discountPercent: 0,
  pointCost: 0,
  expiryDays: 0,
  minimalPrice: 0,
  imageUrl: "",
}

const selectedForm = {
  id: 0,
  name: "",
  category: "",
  brand: "",
  price: 0,
  isNew: false,
  isBestseller: false,
  hasCBD: false,
  image: "",
  store1quantity: 0,
  store2quantity: 0,
  description: "",
}

export default function CouponForm({ fkc }: { fkc: (e: boolean) => void }) {
  const [discountForm, setDiscountForm] = useState<formCoupon>(initialform)
  const [selectedProduct, setSelectedProduct] = useState<ProductForm>(selectedForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemForm, setItemForm] = useState({ productId: 0, pointCost: 0, expiryDays: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { products, listenToProducts } = useProductsStore()

  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (!debouncedSearch.trim()) return products.slice(0, 24)

    const query = debouncedSearch.toLowerCase().trim()
    return products.filter((e) => e.id.toString().includes(query) || e.name.toLowerCase().includes(query)).slice(0, 24)
  }, [products, debouncedSearch])

  const handleProductSelect = useCallback((product: ProductForm) => {
    setSelectedProduct(product)
    setItemForm((prev) => ({ ...prev, productId: product.id }))
  }, [])

  async function addProduct(product: coupon) {
    try {
      const productRef = doc(db, "coupons", product.id.toString())
      await setDoc(productRef, product)
      console.log("Product added with ID:", product.id)
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setIsSubmitting(true)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + itemForm.expiryDays)
    const couponData: coupon = {
      id: crypto.randomUUID(),
      name: selectedProduct.name,
      description: `Zeskanuj kod przy kasie aby odebrać darmowy ${selectedProduct.name}. Kupon ważny do ${expiryDate.toLocaleDateString()}`,
      imageUrl: selectedProduct.image,
      pointsCost: itemForm.pointCost,
      category: selectedProduct.category,
      isDiscount: false,
      expiryDate: Timestamp.fromDate(expiryDate),
    } satisfies coupon
    console.log("Creating item coupon:", couponData)
    try {
      await addProduct(couponData)
      setTimeout(() => {
        setIsSubmitting(false)
        fkc(true)
        setDiscountForm(initialform)
        setTimeout(() => fkc(false), 3000)
      }, 1000)
    } catch (err) {
      console.log(err)
      setTimeout(() => {
        setIsSubmitting(false)
        fkc(false)
        setDiscountForm(initialform)
      }, 1000)
    }
  }

  return (
    <motion.div
      key="item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-8 border border-white/20"
    >
      <form onSubmit={handleItemSubmit} className="space-y-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Szukaj produktu po ID lub nazwie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2">
          {filteredProducts.map((product) => (
            <motion.button
              key={product.id}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProductSelect(product)}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all text-left ${
                selectedProduct.id === product.id
                  ? "bg-white/20 border-white/40 shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-24 md:h-32 object-cover rounded-lg mb-2 md:mb-3"
              />
              <h4 className="text-white font-bold mb-1 text-sm md:text-base line-clamp-2">{product.name}</h4>
              <p className="text-white/60 text-xs mb-1 md:mb-2 truncate">{product.category}</p>
              <p className="text-purple-300 font-bold text-sm md:text-base">{product.price} zł</p>
              {selectedProduct.id === product.id && (
                <div className="mt-2 flex items-center gap-1 text-green-400">
                  <Check className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-xs md:text-sm">Wybrano</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {selectedProduct !== selectedForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 rounded-xl p-4 md:p-6 border border-white/10"
          >
            <div className="flex justify-between items-center w-full mb-4">
              <h3 className="text-white font-bold text-center text-base md:text-lg">Podgląd kuponu</h3>
              <X
                className="w-5 md:w-6 h-5 md:h-6 text-white cursor-pointer"
                onClick={() => setSelectedProduct(selectedForm)}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-20 md:w-24 h-20 md:h-24 object-cover rounded-lg"
              />
              <div className="text-center md:text-left">
                <h4 className="text-white font-bold text-base md:text-lg">{selectedProduct.name}</h4>
                <p className="text-white/70 text-sm md:text-base">
                  Darmowy {selectedProduct.name} - {selectedProduct.category}
                </p>
                <p className="text-purple-300 font-bold mt-1">Wartość: {selectedProduct.price} zł</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-white font-medium mb-2 text-sm md:text-base">
              <Coins className="w-4 h-4 inline mr-1" />
              Koszt w punktach *
            </label>
            <input
              type="number"
              required
              min="1"
              value={itemForm.pointCost || ""}
              onChange={(e) => setItemForm({ ...itemForm, pointCost: Number(e.target.value) })}
              placeholder="150"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm md:text-base">
              <Calendar className="w-4 h-4 inline mr-1" />
              Ważność po zakupie (dni) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={itemForm.expiryDays || ""}
              onChange={(e) => setItemForm({ ...itemForm, expiryDays: Number(e.target.value) })}
              placeholder="30"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting || !selectedProduct}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Tworzenie...
            </>
          ) : (
            <>
              <Save className="w-4 md:w-5 h-4 md:h-5" />
              Utwórz Kupon Przedmiotowy
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
