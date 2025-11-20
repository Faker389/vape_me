"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Plus, Save, Upload, X } from "lucide-react"
import { auth, db, storage } from "@/lib/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { useBarcodeScanner } from "@/lib/hooks/useBarcodeScanner"
import { ProductForm } from "@/lib/productModel"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useProductsStore } from "@/lib/storage"
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
interface productTemp{
    id: number
    name: string
    category: string
    brand: string
    price: number
    isNew: boolean
    isBestseller: boolean
    hasCBD: boolean
    image: string
    store1quantity:number
    store2quantity:number
    description:string;
    quantity?:string;
    location?:string
}

interface Alert {
  id: string
  message: string
  type: 'error' | 'success' | 'warning'
}
export const dynamic = 'force-dynamic'

const initialForm: ProductForm = {
  id: 0,
  name: "",
  category: "",
  brand: "",
  price: 0,
  isNew: false,
  isBestseller: false,
  hasCBD: false,
  store1quantity: 0,
  store2quantity: 0,
  description: "",
  imageFile: undefined,
  image: "",
  features: [],
  specifications: {},
}

export default function AddProductPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState<ProductForm>(initialForm)
  const [success, setSuccess] = useState(false)
  const [removeBG,setRemoveBG]=useState<boolean>(false)
  const [location, setLocation] = useState<"location1" | "location2">("location1")
  const isNew = useRef<boolean>(true)
  const [features, setFeatures] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")
  const { products, listenToProducts } = useProductsStore()
  const isOnline = useOnlineStatus();
  const [focused, setFocused] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([])
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
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
  const categories = products.reduce((prev:string[],item:productTemp)=>{
    if(!prev.includes(item.category)){
      prev.push(item.category)
    }
    return prev;
  },[]).filter(cat =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  )
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
  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])
  useBarcodeScanner((code) => {
    isNew.current = true
    handleInputChange("id", parseInt(code))
  })
  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature.trim()]
      setFeatures(updatedFeatures)
      setFormData({ ...formData, features: updatedFeatures })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index)
    setFeatures(updatedFeatures)
    setFormData({ ...formData, features: updatedFeatures })
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const updatedSpecs = { ...specifications, [newSpecKey.trim()]: newSpecValue.trim() }
      setSpecifications(updatedSpecs)
      setFormData({ ...formData, specifications: updatedSpecs })
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const updatedSpecs = { ...specifications }
    delete updatedSpecs[key]
    setSpecifications(updatedSpecs)
    setFormData({ ...formData, specifications: updatedSpecs })
  }
  const handleInputChange = (field: keyof productTemp, value: ProductFieldValue) => {
    console.log(field , typeof value)
    if (field === "id" && typeof value === "number") {
      checkIfExists(value)
      return
    }
  
    if (field === "quantity") {
      const quantityValue = Number(value) || 0
      if (location === "location1") {
        setFormData({ ...formData, store1quantity: quantityValue })
      } else {
        setFormData({ ...formData, store2quantity: quantityValue })
      }
      return
    }
  
    if (field === "location" && typeof value === "string") {
      const newLocation = value as "location1" | "location2"
      setLocation(newLocation)
      return
    }
  
    setFormData({ ...formData, [field]: value as never })
  }


  async function checkIfExists(id: number){
    try {
      const product = products.find(e => e.id === id)
      if (!product) {
        isNew.current = true
        setFormData({...initialForm,id})
        return;
      }
      const obj= {
        id: Number(product.id),
        name: product.name ?? "",
        category: product.category ?? "",
        brand: product.brand ?? "",
        price: Number(product.price ?? 0),
        isNew: Boolean(product.isNew),
        isBestseller: Boolean(product.isBestseller),
        hasCBD: Boolean(product.hasCBD),
        description: product.description ?? "",
        store1quantity: Number(product.store1quantity ?? 0),
        store2quantity: Number(product.store2quantity ?? 0),
        image: product.image ?? "",
      } satisfies ProductForm
      setFormData(obj)
      if(product.features){
        setFeatures(product.features)
      }
      if(product.specifications){
        setSpecifications(product.specifications)
      }
      isNew.current = false
      return true;
    } catch (e) {
      setFormData({ ...initialForm, id })
      isNew.current = true
      return false
    }
  }

  async function addProduct(product: ProductForm) {
    try {
      const productRef = doc(db, "products", product.id.toString())
      await setDoc(productRef, product)
      imageRef.current?imageRef.current.value="":"";
      showAlert("Pomyślnie dodano produkt", "success")
    } catch (error) {
      showAlert("Błąd podczas dodawania produktu", "error")
    }
  }

  async function updateProduct(productId: number, updatedData: Partial<ProductForm>) {
    try {
      const productRef = doc(db, "products", productId.toString())
  
      await updateDoc(productRef, updatedData)
      imageRef.current?imageRef.current.value="":"";
      showAlert("Pomyślnie zmodyfikowano produkt","success")
    } catch (error) {
      showAlert("Błąd podczas modyfikacji produktu", "error")
    }
  }
  const handleImageUpload = async()=>{
    let imageUrl = formData.image;
    const storageRef = ref(storage, `products/${formData.id}.webp`);
    // 1️⃣ Get image blob (from file upload or external URL)
    let fileBlob: Blob | null = null;
    if (formData.imageFile) {
      fileBlob = formData.imageFile;
    } else if (formData.image && formData.image.trim() !== "") {
      const idToken = auth.currentUser?.getIdToken();
      try {
        const res = await fetch("/api/download-image", {
          method: "POST",
          headers: { "Content-Type": "application/json","Authorization": `Bearer ${idToken}` },
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
        const idToken = auth.currentUser?.getIdToken();
        const bgRes = await fetch("/api/remove_bg", {
          headers:{
            "Authorization": `Bearer ${idToken}`,
          },
          method: "POST",
          body: formDataBg,
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      let imageUrl="";
      if(formData.image.includes("https://firebasestorage.googleapis.com")&&formData.imageFile==undefined){
        imageUrl=formData.image
      }else{
        imageUrl = await handleImageUpload();
      }
      // 4️⃣ Save product info
      const productData = { ...formData, image: imageUrl };
      delete productData.imageFile;
  
      if (isNew.current) await addProduct(productData);
      else await updateProduct(productData.id, productData);
  
      // 5️⃣ Reset form + state
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData(initialForm);
      setLocation("location1");
      setRemoveBG(false);
      setFeatures([]);
      setSpecifications({});
      showAlert("Pomyślnie dodano produkt","success")
    } catch (error) {
      showAlert("Błąd dodawania produktu", "error");
    }
  };
  useEffect(() => {
    console.log(formData.imageFile)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email !== "malgorzatamagryso2.pl@gmail.com"&&user?.email!=="vapeme123321@gmail.com") {
        window.location.href = "/"
      }
    })
    return () => unsubscribe()
  }, [])
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
          Dodaj Nowy Produkt
        </motion.h1>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
          >
            ✓ Produkt został pomyślnie dodany!
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={isOnline?handleSubmit:()=>{}}
          className="max-w-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Zdjęcie produktu</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-56 h-44 rounded-lg bg-gray-800/50 border border-white/10 flex items-center justify-center overflow-hidden">
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
          
              {/* Option 1: Direct URL */}
              <div className="flex items-start flex-wrap flex-col w-full justify-between">
                
              <input
                type="text"
                placeholder="URL zdjęcia lub wybierz plik"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="flex-1 w-full  px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
          
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
                className="text-md ml-2 mt-5 text-gray-300 underline cursor-pointer"
                />
              <label className="flex items-center p-5 gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={removeBG}
                onChange={() => setRemoveBG(!removeBG)}
                className="w-5 h-5 accent-purple-500 rounded border-white/10 bg-gray-800/50 text-purple-600 focus:ring-purple-500/50 transition-colors"
  />
              <span className="text-white  transition-colors">
                Usuń tło zdjęcia
              </span>
            </label>
                </div>
            </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">id Produktu *</label>
              <input
                      min={0}

                type="number"
                required
                value={Number.isNaN(formData.id)?0:formData.id}
                onChange={(e) => handleInputChange("id", Number.isNaN(Number.parseInt(e.target.value))?0:Number.parseFloat(e.target.value.trim()))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Np. 6123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa produktu *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Np. ELFBAR 600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 ">
            <div className="relative w-full max-w-sm">
            <label className="block text-sm font-medium text-gray-400 mb-2">Kategoria *</label>
            <input
              type="text"
              required
              value={formData.category}
              ref={inputRef}
              onFocus={() => setFocused(true)}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="Np. Jednorazówki"
            />

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {focused && categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full  w-full bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/10 max-h-64 overflow-y-auto z-50 shadow-lg"
                >
                  {categories.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        handleInputChange("category",item);
                        setFocused(false);
                      }}
                      className="bg-gray-800/50 cursor-pointer px-4 py-3 text-white hover:bg-purple-600/20 hover:border-purple-500/50 border-b border-white/10 last:border-b-0 transition-all"
                    >
                      {item}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Marka *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Np. ELFBAR"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cena (zł) *</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}

                  required
                  value={Number.isNaN(formData.price)?0:formData.price}
                  onChange={(e) => handleInputChange("price", Number.isNaN(Number.parseFloat(e.target.value))?0:Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ilość *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={location=="location1"?Number.isNaN(formData.store1quantity)?0:formData.store1quantity:Number.isNaN(formData.store2quantity)?0:formData.store2quantity}
                  onChange={(e) => handleInputChange(location=="location1"?"store1quantity":"store2quantity", Number.isNaN(Number.parseFloat(e.target.value))?0:Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Opis</label>
                <textarea value={formData.description } onChange={(e)=>handleInputChange("description",e.target.value)} 
                className="w-full resize-none h-48 px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >

                </textarea>
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Lokalizacja *</label>
              <select
                onChange={(e) => handleInputChange("location", e.target.value)}
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
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-400">Cechy produktu</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj cechę
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Np. Długi czas działania"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              {features.length > 0 && (
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between px-4 py-3 bg-gray-800/30 border border-white/5 rounded-lg group"
                    >
                      <span className="text-white">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-400">Specyfikacja techniczna</label>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="flex items-center gap-2 px-3 py-1.5 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg text-pink-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj specyfikację
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Nazwa (np. Moc)"
                  className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
                  placeholder="Wartość (np. 80V)"
                  className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
              </div>

              {Object.keys(specifications).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between px-4 py-3 bg-gray-800/30 border border-white/5 rounded-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-medium">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>{setFormData(initialForm);setRemoveBG(false)}}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Wyczyść formularz
            </motion.button>
            <motion.button
              disabled={!isOnline}
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Dodaj produkt
            </motion.button>
          </div>
        </motion.form>
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
