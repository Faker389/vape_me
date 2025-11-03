"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle, XCircle, ShoppingCart, Tag, CreditCard, X } from "lucide-react"
import { auth, currentDate, db, transactions } from "@/lib/firebase"
import { useBarcodeScanner } from "@/lib/hooks/useBarcodeScanner"
import { ProductForm } from "@/lib/productModel"
import { arrayUnion, collection, doc, getDoc, getDocs, where, increment, query, updateDoc, writeBatch } from "firebase/firestore"
import axios from "axios"

interface ScannedItem {
  id: number
  name: string
  price: number
  points: number
  image: string
}

interface ScannedCoupon {
  id: string
  code: string
  title: string
  imageUrl: string
  minimalPrice?: number
  isDiscount: boolean
  discountamount?: number
}

export default function TransactionPage() {
  const [userScanned, setUserScanned] = useState<string|null>(null)
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
  const [scannedCoupons, setscannedCoupons] = useState<ScannedCoupon[]>([])

  async function fetchProduct(productId: string) {
    try {
      if (productId) {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setScannedItems([...scannedItems, {
            id: parseInt(data.id),
            name: data.name ?? "",
            price: Number(data.price ?? 0),
            points: parseInt((Number(data.price ?? 0)).toString()) * 2,
            image: data.image ?? "",
          }])
        } else {
          console.log("No such product!");
        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  async function fetchCoupon(couponId: string, userId: string) {
    try {
      if (couponId && userId ) {
        // Access the coupon from the user's coupons subcollection
        const docRef = doc(db, "users", userId, "coupons", couponId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setscannedCoupons([...scannedCoupons,{
            id: couponId,
            code: data.code ?? "",
            title: data.title ?? "",
            imageUrl: data.imageUrl ?? "",
            minimalPrice: data.minimalPrice,
            isDiscount: data.isDiscount ?? false,
            discountamount: data.discountamount ?? 0,
          }])
        } else {
          console.log("No such coupon for this user!");
        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  async function checkIfExists(userID: string) {
    try {
      if (userID) {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUserScanned(userID)
        } else {
          setUserScanned(null)
        }
      }
    } catch(err) {
      console.log(err)
    }
  }
    
  useBarcodeScanner((code) => {
    if (code.includes("coupon") && code.includes("user")) {
      var couponID = code.slice(6, code.indexOf("user"))
      var userID = `+${code.slice(code.indexOf("user") + 4)}`
      fetchCoupon(couponID, userID)
      checkIfExists(userID)
    } else if (code.includes("user")) {
      var userID = `+${code.slice(4)}`;
      checkIfExists(userID)
    } else {
      fetchProduct(code)
    }
  })

  // Remove item handler
  const removeItem = (index: number) => {
    setScannedItems(scannedItems.filter((_, i) => i !== index))
  }

  // Remove coupon handler
  const removeCoupon = () => {
    setscannedCoupons([])
  }

  // Calculate totals
  const totalPrice = scannedItems.reduce((sum, item) => sum + item.price, 0)
  const totalPoints = scannedItems.reduce((sum, item) => sum + item.points, 0)
  
  // Calculate coupon discount
  const couponDiscount = scannedCoupons.reduce((sum, coupon) => {
    if (coupon.isDiscount && coupon.discountamount) {
      // If it's a percentage discount
      return sum + (totalPrice * (coupon.discountamount / 100))
    } else if (!coupon.isDiscount && coupon.discountamount) {
      // If it's a fixed amount discount
      return sum + coupon.discountamount
    }
    return sum
  }, 0)
  
  const finalPrice = Math.max(0, totalPrice - couponDiscount)
  
  const vapesIDs = scannedItems.map((e: ScannedItem) => {
    return e.id;
  })

  async function decreaseProductQuantitiesByIds() {
    try {
      if (vapesIDs.length === 0) return
  
      const batch = writeBatch(db)
  
      for (const id of vapesIDs) {
        const q = query(collection(db, "products"), where("id", "==", id))
        const querySnapshot = await getDocs(q)
  
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref
          const data = querySnapshot.docs[0].data()
  
          const newQuantity = Math.max(0, Number(data.store1quantity ?? 0) - 1)
  
          batch.update(docRef, { store1quantity: newQuantity })
        } else {
          console.warn(`Product with id ${id} not found.`)
        }
      }
  
      await batch.commit()
      console.log("Quantities updated successfully.")
    } catch (error) {
      console.error("Error updating quantities:", error)
    }
  }

  const handleFinishTransaction = async() => {
    try {
      if (userScanned !== null) {
        const docRef = doc(db, "users", userScanned);
        const docSnap = await getDoc(docRef);
        var newTransaction = {
          description: "Nowe zakupy",
          id: crypto.randomUUID(),
          imageUrl: "",
          points: totalPoints,
          rewardId: crypto.randomUUID(),
          timestamp: currentDate,
          type: "earn"
        } satisfies transactions
        if (!docSnap.exists()) return;
        await updateDoc(docRef, {
          points: increment(totalPoints),
          transactions: arrayUnion(newTransaction)
        });
        console.log(`Added ${totalPoints} points to ${userScanned}`);

        for(var x=0;x<scannedCoupons.length;x++){
          const coupon = scannedCoupons[x];
          const couponRef = doc(db, "users", userScanned, "coupons", coupon.id);
          await updateDoc(couponRef, {
            isUsed: true,
            usedDate: currentDate
          });
          console.log(`Marked coupon ${coupon.id} as used`);
        }

        setUserScanned(userScanned);
        const data = docSnap.data();
        var fcmToken = data.token ?? "";

        const request = await axios.post("/api/send_notification", {
          title: "Otrzymujesz nowe buszki!",
          body: `Za twój ostatni zakup przyznaliśmy ci ${totalPoints} buszków!`,
          priority: "high",
          fcmToken,
          notificationType: "pointsActivity",
        });
        const response = await request.data
        console.log(response)
      } 
      await decreaseProductQuantitiesByIds();
    } catch (error) {
      console.log(error)
    } finally {
      setScannedItems([])
      setUserScanned(null)
      setscannedCoupons([])
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com") {
        window.location.href = "/"
      } 
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-600/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
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
      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Realizacja Transakcji
        </motion.h1>

        {/* User Scan Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            {userScanned !== null ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold text-green-400">Użytkownik zeskanowany</h3>
                  <p className="text-green-400">Aplikacja klienta została pomyślnie zeskanowana</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-600" />
                <div>
                  <h3 className="text-xl font-bold text-red-500">Użytkownik niezeskanowany</h3>
                  <p className="text-red-500">Zeskanuj aplikację klienta aby kontynuować</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Scanned Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Zeskanowane produkty</h2>
          </div>

          <div className="space-y-3">
            {scannedItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-white/5"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{item.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{(item.price).toFixed(2)} zł</p>
                  <p className="text-purple-400 text-sm">+{item.points} pkt</p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="ml-2 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Total Points */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl border border-purple-500/30">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Punkty do zdobycia:</span>
              <span className="text-2xl font-bold text-purple-300">+{totalPoints} punktów</span>
            </div>
          </div>
        </motion.div>

        {/* Scanned Coupons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-6 bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">Zeskanowane kupony</h2>
          </div>

          {scannedCoupons.length > 0 ? (
            <div className="space-y-3">
              {scannedCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-white/5"
                >
                  <div>
                    <h3 className="text-white font-semibold">{coupon.title}</h3>
                    <p className="text-sm text-gray-400">Kod: {coupon.code}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-pink-400 font-bold text-lg">
                      {coupon.isDiscount 
                        ? `-${coupon.discountamount}%` 
                        : `-${coupon.discountamount} zł`}
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Brak zeskanowanych kuponów</p>
            </div>
          )}
        </motion.div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Podsumowanie</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Suma produktów:</span>
              <span>{totalPrice.toFixed(2)} zł</span>
            </div>
            {scannedCoupons.length > 0 && couponDiscount > 0 && (
              <div className="flex justify-between text-pink-400">
                <span>Zniżka z kuponów:</span>
                <span>-{couponDiscount.toFixed(2)} zł</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between text-white text-xl font-bold">
              <span>Do zapłaty:</span>
              <span className="text-purple-400">{finalPrice.toFixed(2)} zł</span>
            </div>
          </div>
        </motion.div>

        {/* Finish Transaction Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinishTransaction}
          disabled={!userScanned}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {userScanned ? "Zakończ transakcję" : "Zeskanuj użytkownika aby kontynuować"}
        </motion.button>
      </div>
    </div>
  )
}