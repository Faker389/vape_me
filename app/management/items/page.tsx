"use client"

import { useState,useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, X, Save, Upload, Plus, AlertCircle } from "lucide-react"
import { auth, db, storage } from "@/lib/firebase"
import {  doc, updateDoc } from "firebase/firestore"
import { ProductForm } from "@/lib/productModel"
import { useProductsStore } from "@/lib/storage"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"
type ProductFieldValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined
  | Record<string, string>
  | string[]

// Demo data
export const dynamic = 'force-dynamic'
interface Alert {
  id: string
  message: string
  type: 'error' | 'success' | 'warning'
}
export default function ItemsManagementPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null)
  const [formData, setFormData] = useState<ProductForm | null>(null)
  const [location, setLocation] = useState<"location1" | "location2">("location1")
  const { products, listenToProducts } = useProductsStore()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [removeBG,setRemoveBG]=useState<boolean>(false)
  const [newSpecValue, setNewSpecValue] = useState("")
  const imageRef = useRef<HTMLInputElement>(null)
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
  const filteredProducts = products&&products.filter(e => {
    const query = searchQuery.toLowerCase().trim()
    return (
      e.id.toString().includes(query) || e.name.toLowerCase().includes(query)
    )
  })
  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])
  

  const handleEdit = (product: ProductForm) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setFeatures(product.features || [])
    setSpecifications({
      ...specifications,
      [newSpecKey.trim()]: newSpecValue.trim(),
    })
  }
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications({
        ...specifications,
        [newSpecKey.trim()]: newSpecValue.trim(),
      })
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications }
    delete newSpecs[key]
    setSpecifications(newSpecs)
  }
  const handleClose = () => {
    setEditingProduct(null)
    setFormData(null)
    setFeatures([])
    setSpecifications({})
    setNewFeature("")
    setNewSpecKey("")
    setNewSpecValue("")
  }
  async function updateProduct(productId: string, updatedData: Partial<ProductForm>) {

    try {
      const productRef = doc(db, "products", productId); // reference to the doc
      await updateDoc(productRef, updatedData); // update fields
      showAlert("Product updated successfully","success");
    } catch (error) {
      showAlert("Error updating product:", "error");
    }
  }
  const handleImageUpload = async()=>{
    if(!formData) return "";
    let imageUrl = formData.image;
    const storageRef = ref(storage, `products/${formData.id}.webp`);
    // 1️⃣ Get image blob (from file upload or external URL)
    let fileBlob: Blob | null = null;
    if (formData.imageFile) {
      fileBlob = formData.imageFile;
    } else if (formData.image && formData.image.trim() !== "") {
      try {
        const token = await auth.currentUser?.getIdToken()
        const res = await fetch("/api/download-image", {
          method: "POST",
          headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}` },
          body: JSON.stringify({ url: formData.image }),
        });
        if (!res.ok) throw new Error("Image download failed");
        fileBlob = await res.blob();
      } catch (e) {
        showAlert("Błąd pobierania zdjęcia", "error");
      }
    }

    // 2️⃣ Try to remove background (if requested)
    if (removeBG && fileBlob) {
      try {
        const formDataBg = new FormData();
        formDataBg.append("file", fileBlob, "input.png");
        const token = await auth.currentUser?.getIdToken()
        const bgRes = await fetch("/api/remove_bg", {
          method: "POST",
          body: formDataBg,
          headers:{
            "Authorization":`Bearer ${token}`
          }
        });

        if (!bgRes.ok) throw new Error("Background removal failed");

        const bgBlob = await bgRes.blob();
        if (bgBlob && bgBlob.size > 0) {
          fileBlob = bgBlob; // replace with processed image
        } else {
          showAlert("Nie udalo sie usunąć tła",'warning');
        }
      } catch (err) {
        showAlert("Nie udalo sie usunąć tła",'warning');
      }
    }

    // 3️⃣ Upload image (original or processed) to Firebase Storage
    if (fileBlob) {
      await uploadBytes(storageRef, fileBlob);
      imageUrl = await getDownloadURL(storageRef);
    } else {
      imageUrl = "";
    }
    return imageUrl
  }
  const handleSave = async () => {
    if (!formData) return
  
    try {
      let imageUrl="";
      if(formData.image.includes("https://firebasestorage.googleapis.com")&&formData.imageFile==undefined){
        imageUrl=formData.image
      }else{
        imageUrl = await handleImageUpload();
      }
  
      // Prepare product data
      const productData = { ...formData, image: imageUrl,features,specifications };
      delete productData.imageFile; // cleanup before sending
  
      // Save or update product
      await updateProduct(productData.id.toString(), productData);
      handleClose()
  
      
      setFormData(null);
      setLocation("location1");
      showAlert("Wszystkie działania sie powiodły","success")
    } catch (error) {
      showAlert("Nie udało sie zapiasć produktu", "error");
    }
  };
  const handleInputChange = (field: keyof ProductForm, value: ProductFieldValue) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
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
                      className="w-full rounded-2xl px-4 py-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
        
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="space-y-4">
              {isOnline&&products&&filteredProducts.slice(0,50).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                        Ilość na Dąbrowskiego: <span className="text-white font-medium">{product.store1quantity}</span>
                      </span>
                      <span>
                        Ilość na Grunwaldzkiej: <span className="text-white font-medium">{product.store2quantity}</span>
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
        {editingProduct && formData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 overflow-x-hidden bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Edytuj Produkt
                </h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Zdjęcie produktu</label>
            <div className="flex flex-row gap-8">
              <div  className="w-44 h-32 rounded-lg bg-gray-800/50 border border-white/10 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Product preview"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-600" />
                )}
              </div>
          <div  className="w-full">

              {/* Option 1: Direct URL */}
              <input
                type="text"
                placeholder="URL zdjęcia lub wybierz plik"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="flex-1 w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <div className=" h-[5rem] flex justify-center items-center">

              {/* Option 2: File upload */}
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, imageFile: file }); // temporary field for upload
                  }
                }}
                className="text-sm text-gray-300 underline cursor-pointer"
                />
                <>
                <input
                type="checkbox"
                checked={removeBG}
                onChange={() => setRemoveBG(!removeBG)}
                className="w-5 h-5 accent-purple-500 rounded border-white/10 bg-gray-800/50 text-purple-600 focus:ring-purple-500/50 transition-colors"
  />
              <span className="text-white  transition-colors">
                Usuń tło zdjęcia
              </span></>
                </div>
          </div>

            </div>
          </div>


              <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ID produktu</label>
                  <input
                    type="number"
                    min={0}

                    value={Number.isNaN(formData.id)?0:formData.id}
                    onChange={(e) => handleInputChange("id", Number.isNaN(Number.parseInt(e.target.value.trim()))?0:Number.parseFloat(e.target.value.trim()))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa produktu</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value.trim())}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Kategoria</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value.trim())}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Marka</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value.trim())}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Cena (zł)</label>
                    <input
                      type="number"
                      step="1"
                      min={0}
                      value={Number.isNaN(formData.price)?0:formData.price}
                      onChange={(e) => handleInputChange("price", Number.isNaN(Number.parseFloat(e.target.value.trim()))?0:Number.parseFloat(e.target.value.trim()))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Ilość *</label>
                    <input
                      type="number"
                      min={0}
                      value={
                        location === "location1"
                          ? Number.isNaN(formData.store1quantity)
                            ? 0
                            : formData.store1quantity
                          : Number.isNaN(formData.store2quantity)
                          ? 0
                          : formData.store2quantity
                      }
                      onChange={(e) =>
                        handleInputChange(
                          location === "location1" ? "store1quantity" : "store2quantity",
                          Number.isNaN(Number.parseFloat(e.target.value))
                            ? 0
                            : Number.parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lokalizacja *</label>
                <select
                  value={location} // local state for selected location
                  onChange={(e) => setLocation(e.target.value as "location1" | "location2")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  <option value="location1">Dąbrowskiego</option>
                  <option value="location2">Grunwaldzka</option>
                </select>
              </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => handleInputChange("isNew", e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-gray-800/50 text-purple-600 focus:ring-purple-500/50"
                    />
                    <span className="text-white group-hover:text-purple-400 transition-colors">Nowy produkt</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => handleInputChange("isBestseller", e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-gray-800/50 text-purple-600 focus:ring-purple-500/50"
                    />
                    <span className="text-white group-hover:text-purple-400 transition-colors">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.hasCBD}
                      onChange={(e) => handleInputChange("hasCBD", e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-gray-800/50 text-purple-600 focus:ring-purple-500/50"
                    />
                    <span className="text-white group-hover:text-purple-400 transition-colors">Zawiera CBD</span>
                  </label>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-400">Cechy produktu</label>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      placeholder="Np. Długi czas pracy"
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                    />
                    <button
                      onClick={addFeature}
                      className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group flex items-center justify-between px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-lg"
                        >
                          <span className="text-white text-sm">{feature}</span>
                          <button
                            onClick={() => removeFeature(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-400">Specyfikacja</label>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Nazwa (np. Moc)"
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors text-sm"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSpecification()}
                      placeholder="Wartość (np. 80W)"
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors text-sm"
                    />
                    <button
                      onClick={addSpecification}
                      className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-pink-400" />
                    </button>
                  </div>

                  {Object.entries(specifications).length !== 0 && (
                    <div className="space-y-2">
                      {Object.entries(specifications).length !== 0&&Object.entries(specifications).map(([key, value]) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group flex items-center justify-between px-4 py-2 bg-pink-600/10 border border-pink-500/20 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">{key}</span>
                            <span className="text-white text-sm">{value}</span>
                          </div>
                          <button
                            onClick={() => removeSpecification(key)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Zapisz zmiany
                </motion.button>
              </div>
            </motion.div>
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
