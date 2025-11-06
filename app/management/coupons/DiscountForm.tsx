
import React, { useState  } from "react"
import { motion } from "framer-motion"
import {  Calendar, Coins, Save, DollarSign } from "lucide-react"
import {  doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import DiscountBox from "@/components/discountPhoto"
interface coupon {
    id: string
    name: string
    description: string
    imageUrl: string
    pointsCost: number
    category: string
    isDiscount: boolean
    discountamount?: number
    expiryDate: Date
    minimalPrice?: number
  }
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
    minimalPrice:0,
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
    store1quantity:0,
    store2quantity:0,
    description:"",
  }
export default function DiscountForm({fkc}:{fkc:(e:boolean)=> void}){
    const [discountForm, setDiscountForm] = useState<formCoupon>(initialform)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function addProduct(product: coupon) {
        try {
          const productRef = doc(db, "coupons", product.id.toString())
          await setDoc(productRef, product)
          console.log("Product added with ID:", product.id)
        } catch (error) {
          console.error("Error adding product:", error)
        }
      }

    const handleDiscountSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + Number(discountForm.expiryDays))
        const couponData: coupon = {
          id: crypto.randomUUID(),
          name: discountForm.title,
          description: discountForm.description,
          imageUrl: discountForm.imageUrl,
          pointsCost: discountForm.pointCost,
          category: "Zniżki",
          isDiscount: true,
          discountamount: discountForm.discountPercent,
          minimalPrice: discountForm.minimalPrice,
          expiryDate,
        } satisfies coupon;
        try{
          await addProduct(couponData);
          setTimeout(() => {
            setIsSubmitting(false)
            fkc(true)
            setDiscountForm(initialform)
            setTimeout(() => fkc(false), 3000)
          }, 1000)
        }catch(err){
          console.log(err)
          setTimeout(() => {
            setIsSubmitting(false)
            fkc(false)
            setDiscountForm(initialform)
          }, 1000)
        }
      }
    return<motion.div
    key="discount"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
  >
    <form onSubmit={handleDiscountSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-white font-medium mb-2">Tytuł kuponu *</label>
          <input
            type="text"
            required
            value={discountForm.title}
            onChange={(e) => setDiscountForm({ ...discountForm, title: e.target.value })}
            placeholder="Np. 20% zniżki na wszystko"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Discount Percent */}
        <div>
          <label className="block text-white font-medium mb-2">Procent zniżki *</label>
          <input
            type="number"
            required
            min="1"
            max="100"
            value={discountForm.discountPercent}
            onChange={(e) => setDiscountForm({ ...discountForm, discountPercent: Number(e.target.value) })}
            placeholder="20"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-white font-medium mb-2">Opis *</label>
        <textarea
          required
          value={discountForm.description}
          onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
          placeholder="Szczegółowy opis kuponu..."
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Point Cost */}
        <div>
          <label className="block text-white font-medium mb-2">
            <Coins className="w-4 h-4 inline mr-1" />
            Koszt w punktach *
          </label>
          <input
            type="number"
            required
            min="1"
            value={discountForm.pointCost}
            onChange={(e) => setDiscountForm({ ...discountForm, pointCost: Number(e.target.value) })}
            placeholder="100"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Expiry Days */}
        <div>
          <label className="block text-white font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Ważność (dni) *
          </label>
          <input
            type="number"
            required
            min="1"
            value={discountForm.expiryDays}
            onChange={(e) => setDiscountForm({ ...discountForm, expiryDays: Number(e.target.value) })}
            placeholder="30"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Minimalna wartość zakupu
          </label>
          <input
            type="number"
            required
            min="1"
            value={discountForm.minimalPrice}
            onChange={(e) => setDiscountForm({ ...discountForm, minimalPrice: Number(e.target.value) })}
            placeholder="30"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Image URL */}
        <div>
          <label className="block text-white font-medium mb-2">
            Zdjęcie
          </label>
            <DiscountBox percentage={discountForm.discountPercent} />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Tworzenie...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Utwórz Kupon Rabatowy
          </>
        )}
      </motion.button>
    </form>
  </motion.div>
}