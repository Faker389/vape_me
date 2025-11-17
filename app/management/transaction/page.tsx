  "use client"

  import { useState, useEffect, useRef } from "react"
  import { AnimatePresence, motion } from "framer-motion"
  import Link from "next/link"
  import Image from "next/image"
  import { ArrowLeft, CheckCircle, XCircle, ShoppingCart, Tag, CreditCard, X, AlertCircle, Plus } from "lucide-react"
  import { auth, currentDate, db, transactions } from "@/lib/firebase"
  import { useBarcodeScanner } from "@/lib/hooks/useBarcodeScanner"
  import { arrayUnion, collection, doc, getDoc, getDocs, where, increment, query, updateDoc, writeBatch } from "firebase/firestore"
  import axios from "axios"
  import useOnlineStatus from "@/lib/hooks/useOnlineStatus"
import { useProductsStore } from "@/lib/storage"
import { ProductForm } from "@/lib/productModel"

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
  export const dynamic = 'force-dynamic'

  interface Alert {
    id: string
    message: string
    type: 'error' | 'success' | 'warning'
  }
  export default function TransactionPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);
  
    const [userScanned, setUserScanned] = useState<string|null>(null)
    const [searchQuery, setSearchQuery] =useState<string>("")
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
    const [scannedCoupons, setscannedCoupons] = useState<ScannedCoupon[]>([])
    const { products, listenToProducts } = useProductsStore()
    const currentLocation = useRef<string>("location1")
    const [alerts, setAlerts] = useState<Alert[]>([]) 
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused,setFocused]=useState<boolean>(false)
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
    const isOnline = useOnlineStatus();
    useEffect(() => {
      listenToProducts()
    }, [listenToProducts])
    async function fetchProduct(productId: string) {
      try {
        if (productId) {
            const data = products.find(e => e.id === parseInt(productId)) as ProductForm
            setScannedItems([...scannedItems, {
              id: data.id,
              name: data.name ?? "",
              price: Number(data.price ?? 0),
              points: parseInt((Number(data.price ?? 0)).toString()) * 2,
              image: data.image ?? "",
            }])
        }
      } catch(err) {
        showAlert("Błąd pobierania produktu", "error")
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
            showAlert("Podany użytkownik nie posiada danego kuponu","warning")
          }
        }
      } catch(err) {
        showAlert("Błąd pobierania kuponu", "error")
      }
    }

    async function checkIfExists(userID: string) {
        if (userID) {
          const docRef = doc(db, "users", userID);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setUserScanned(userID)
          } else {
            setUserScanned(null)
          }
        }
    }
      
    useBarcodeScanner((code) => {
      if (code.includes("coupon") && code.includes("user")) {
        const couponID = code.slice(6, code.indexOf("user"))
        const userID = `+${code.slice(code.indexOf("user") + 4)}`
        fetchCoupon(couponID, userID)
        checkIfExists(userID)
      } else if (code.includes("user")) {
        const userID = `+${code.slice(4)}`;
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
    
    const addParamsToUser=async ()=>{
      if (userScanned == null){ 
        showAlert("Użytkownik niezeskanowany", "error")  
        return false;
      }
        const docRefUser = doc(db, "users", userScanned);
        const docSnapUser = await getDoc(docRefUser);
        if (!docSnapUser.exists()){ 
          showAlert("Użytkownik nie istnieje", "error")  
          return false;
        }
        const newTransaction = {
          description: "Nowe zakupy",
          id: crypto.randomUUID(),
          imageUrl: "",
          points: totalPoints,
          rewardId: crypto.randomUUID(),
          timestamp: currentDate,
          type: "earn"
        } satisfies transactions
        try {
          await updateDoc(docRefUser, {
            points: increment(totalPoints),
            transactions: arrayUnion(newTransaction)
          });
          return true;
        } catch (error) {
          showAlert("Wystąpił błąd podczas aktualizacji użytkownika", "error")  
          return false;
        }
    }
    const updateProductsQuantity = async () => {
          const docRefProducts = doc(db, "products");
          const docSnapProducts = await getDoc(docRefProducts);
          if (!docSnapProducts.exists()) {
            showAlert("Nie można pobrać produktów", "error")  
            return false;
          }
          try {
            scannedItems.forEach((e)=>{
              const productRef = doc(db, "products", e.id.toString());
              const val = currentLocation.current=="location1"?{store1quantity:increment(-1)}:{store2quantity:increment(-1)};
              updateDoc(productRef,val);
            })
            return true;
          } catch (error) {
            showAlert("Wystąpił błąd podczas aktualizacji produktów", "error")
            return false;
          }
    }
    const updateCoupons = async()=>{
      if (userScanned == null){ 
        showAlert("Użytkownik niezeskanowany", "error")  
        return false;
      }
      try {
        for(let x=0;x<scannedCoupons.length;x++){
          const coupon = scannedCoupons[x];
          const couponRef = doc(db, "users", userScanned, "coupons", coupon.id);
          await updateDoc(couponRef, {
            isUsed: true,
            usedDate: currentDate
          });
        }
        return true;
      } catch (error) {
        showAlert("Wystąpił błąd podczas aktualizacji kuponu", "error")
        return false
      }
    }
    const sentNotification = async()=>{
      if (userScanned == null){ 
        showAlert("Użytkownik niezeskanowany", "error")  
        return false;
      }      
      const docRefUser = doc(db, "users", userScanned);
      const docSnapUser = await getDoc(docRefUser);
      if (!docSnapUser.exists()){ 
        showAlert("Użytkownik nie istnieje", "error")  
        return false;
      }
      try {
        const data = docSnapUser.data();
          const fcmToken = data.token ?? "";
           await axios.post("/api/send_notification", {
            title: "Otrzymujesz nowe buszki!",
            body: `Za twój ostatni zakup przyznaliśmy ci ${totalPoints} buszków!`,
            priority: "high",
            fcmToken,
            notificationType: "pointsActivity",
          });
          return true;
      } catch (error) {
          showAlert("Wystąpił błąd podczas wysyłania powiadomienia", "error")
          return false;
      }
    }
    const handleFinishTransaction = async() => {
      const handleFinishTransaction = async () => {
        const resp1 = await addParamsToUser()
        if (!resp1) return
    
        const resp2 = await updateProductsQuantity()
        if (!resp2) return
    
        const resp3 = await updateCoupons()
        if (!resp3) return
    
        await sentNotification()
    
        if (resp1 && resp2 && resp3) {
          showAlert("Transakcja zakończona pomyślnie!", "success")
          setTimeout(() => {
            setScannedItems([])
            setUserScanned(null)
            setscannedCoupons([])
          }, 1000)
        }
      }
    }
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setFocused(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user?.email !== "malgorzatamagryso2.pl@gmail.com"&&user?.email!=="vapeme123321@gmail.com") {
          window.location.href = "/"
        }
      })
      return () => unsubscribe()
    }, [])
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
    if (!mounted) return null; 

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
            <div className="mb-4 relative">
              <input
                type="text"
                ref={inputRef}
                onFocus={()=>setFocused(true)}
                placeholder="Szukaj produktu po ID lub nazwie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl pl-4 pr-12 py-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20
                          backdrop-blur-xl border border-white/10 text-white placeholder-white/50 
                          focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            
              {/* Icon inside input */}
              <Plus
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-80 cursor-pointer"
                size={20}
                onClick={()=>{fetchProduct(searchQuery.toString());setSearchQuery("")}}
              />
            </div>
                  <div>
                    {isOnline&&focused&&searchQuery.length>0&&products.filter((e)=>e.id.toString().includes(searchQuery)).slice(0,5).map((product,index)=>{
                      return <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {fetchProduct(product.id.toString());setSearchQuery("")}}
                      className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/50 transition-all"
                    >
                      <div className="w-20 h-20 rounded-lg bg-gray-800/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">{product.id}</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                        </div>
                      </div>
                    </motion.div>
                    })}
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Lokalizacja w której dokonujesz zakupu:</label>
              <select
                onChange={(e) => currentLocation.current = e.target.value}
                className="w-fit px-4 py-3 bg-gray-800/50 border mb-3 border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                <option value="location1">Dąbrowskiego</option>
                <option value="location2">Grunwaldzka</option>
              </select>
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
            onClick={isOnline?handleFinishTransaction:()=>{}}
            disabled={!userScanned}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
          Zakończ transakcję
          </motion.button>
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