import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import OptimizedImage from "@/components/OptimizedImage"
import { ArrowLeft, Edit, X, Save, Upload, Plus, AlertCircle } from "lucide-react"
import { auth, db, getCurrentUser, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import type { ProductForm } from "@/lib/productModel"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
interface params{
    handleCloseFkc: () => void;
    showAlert:(e1:string,e2?:"error"|"warning"|"success")=>void
    product:ProductForm
}
type ProductFieldValue = string | number | boolean | File | null | undefined | Record<string, string> | string[]

interface Alert {
  id: string
  message: string
  type: "error" | "success" | "warning"
}
const initialForm= {
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
    imageFile:null,
    description:"",
    features:[],
    specifications:null
} as ProductForm
export default function EditForm({handleCloseFkc,showAlert,product}:params){
  const [formData, setFormData] = useState<ProductForm >(initialForm)
  const [location, setLocation] = useState<"location1" | "location2">("location1")
  const [features, setFeatures] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [removeBG, setRemoveBG] = useState<boolean>(false)
  const [newSpecValue, setNewSpecValue] = useState("")
  const imageRef = useRef<HTMLInputElement>(null)
  
  const removeFeature = useCallback((index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addSpecification = useCallback(() => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications((prev) => ({
        ...prev,
        [newSpecKey.trim()]: newSpecValue.trim(),
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }, [newSpecKey, newSpecValue])

  const removeSpecification = useCallback((key: string) => {
    setSpecifications((prev) => {
      const newSpecs = { ...prev }
      delete newSpecs[key]
      return newSpecs
    })
  }, [])
  const handleSave = async () => {
    if (!formData) return

    try {
      let imageUrl = ""

      if (formData.image.includes("https://firebasestorage.googleapis.com") && formData.imageFile === undefined) {
        imageUrl = formData.image
      } else {
        imageUrl = await handleImageUpload()
      }

      const productData = { ...formData, image: imageUrl, features, specifications }
      delete productData.imageFile

      await updateProduct(productData.id.toString(), productData)
      handleClose()
      setFormData(initialForm)
      setLocation("location1")
      showAlert("Wszystkie działania sie powiodły", "success")
    } catch (error) {
      showAlert("Nie udało sie zapiasć produktu", "error")
    }
  }

  const handleInputChange = useCallback((field: keyof ProductForm, value: ProductFieldValue) => {
    setFormData((prev) => {
      if (!prev) return initialForm
      return { ...prev, [field]: value }
    })
  }, [])
  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()])
      setNewFeature("")
    }
  }, [newFeature])



  const handleClose = useCallback(() => {
    setFormData(initialForm)
    setFeatures([])
    setSpecifications({})
    setNewFeature("")
    setNewSpecKey("")
    setNewSpecValue("")
    handleCloseFkc()
  }, [])

  async function updateProduct(productId: string, updatedData: Partial<ProductForm>) {
    try {
      const productRef = doc(db, "products", productId)
      let data

      if (
        updatedData.specifications &&
        Object.keys(updatedData.specifications).length === 1 &&
        Object.keys(updatedData.specifications)[0] === ""
      ) {
        data = { ...updatedData, specifications: null }
      } else {
        data = { ...updatedData }
      }

      await updateDoc(productRef, data)
      showAlert("Product updated successfully", "success")
    } catch (error) {
      console.log(error)
      showAlert("Error updating product:", "error")
    }
  }
  useEffect(()=>{
    if(product==null) return;
    setFormData(product)
    setFeatures(product.features || [])
    setSpecifications(product.specifications || {})
  },[product])
  const handleImageUpload = async () => {
    if (!formData) return ""

    let imageUrl = formData.image
    const storageRef = ref(storage, `products/${formData.id}.webp`)

    let fileBlob: Blob | null = null

    if (formData.imageFile) {
      fileBlob = formData.imageFile
    } else if (formData.image && formData.image.trim() !== "") {
      try {
        const idToken = await getCurrentUser()
        const res = await fetch("/api/download-image", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ url: formData.image }),
        })
        if (!res.ok) throw new Error("Image download failed")
        fileBlob = await res.blob()
      } catch (e) {
        showAlert("Błąd pobierania zdjęcia", "error")
      }
    }

    if (removeBG && fileBlob) {
      try {
        const formDataBg = new FormData()
        formDataBg.append("file", fileBlob, "input.png")
        const idToken = await getCurrentUser()
        const bgRes = await fetch("/api/remove_bg", {
          method: "POST",
          body: formDataBg,
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        if (!bgRes.ok) throw new Error("Background removal failed")
        const bgBlob = await bgRes.blob()
        if (bgBlob && bgBlob.size > 0) {
          fileBlob = bgBlob
        } else {
          showAlert("Nie udalo sie usunąć tła", "warning")
        }
      } catch (err) {
        showAlert("Nie udalo sie usunąć tła", "warning")
      }
    }

    if (fileBlob) {
      await uploadBytes(storageRef, fileBlob)
      imageUrl = await getDownloadURL(storageRef)
    } else {
      imageUrl = ""
    }

    return imageUrl
  }
  
    return <motion.div
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
              <div className="w-44 h-32 rounded-lg bg-gray-800/50 border border-white/10 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Product preview"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-600" />
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="URL zdjęcia lub wybierz plik"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  autoComplete="off"
                  data-form-type="other"
                  className="flex-1 w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <div className="h-[5rem] flex justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({ ...formData, imageFile: file })
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
                    <span className="text-white transition-colors">Usuń tło zdjęcia</span>
                  </>
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
                value={Number.isNaN(formData.id) ? 0 : formData.id}
                onChange={(e) =>
                  handleInputChange(
                    "id",
                    Number.isNaN(Number.parseInt(e.target.value.trim()))
                      ? 0
                      : Number.parseFloat(e.target.value.trim()),
                  )
                }
                autoComplete="off"
                data-form-type="other"
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa produktu</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value.trim())}
                autoComplete="off"
                data-form-type="other"
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
                  autoComplete="off"
                  data-form-type="other"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Marka</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value.trim())}
                  autoComplete="off"
                  data-form-type="other"
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
                  value={Number.isNaN(formData.price) ? 0 : formData.price}
                  onChange={(e) =>
                    handleInputChange(
                      "price",
                      Number.isNaN(Number.parseFloat(e.target.value.trim()))
                        ? 0
                        : Number.parseFloat(e.target.value.trim()),
                    )
                  }
                  autoComplete="off"
                  data-form-type="other"
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
                      Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value),
                    )
                  }
                  autoComplete="off"
                  data-form-type="other"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Lokalizacja *</label>
              <select
                value={location}
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
                  autoComplete="off"
                  data-form-type="other"
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
                  autoComplete="off"
                  data-form-type="other"
                  className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors text-sm"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSpecification()}
                  placeholder="Wartość (np. 80W)"
                  autoComplete="off"
                  data-form-type="other"
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
                  {Object.entries(specifications).length !== 0 &&
                    Object.entries(specifications).map(([key, value]) => (
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
    }