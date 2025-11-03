"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/lib/firebase"
import { ProductForm } from "@/lib/productModel"
import { useProductsStore } from "@/lib/storage"

const cbdOptions = ["Wszystkie", "Z CBD", "Bez CBD"]
export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  

  const [brands,setBrands]=useState<string[]>([])
  const [categories,setCategories]=useState<string[]>([])
  const [searchQuery,setSearchQuery]=useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie")
  const [selectedBrand, setSelectedBrand] = useState("Wszystkie")
  const [selectedCBD, setSelectedCBD] = useState("Wszystkie")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("default")
  const [showWorkerOptions, setShowWorkerOptions] = useState<boolean>(false)
  const { products, listenToProducts } = useProductsStore()
  
  useEffect(() => {
    listenToProducts()
    
  }, [listenToProducts])
  
  useEffect(()=>{
    if(products){
      getBrands(products)
      getCategories(products)
    }
  },[products])
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300) // 300ms delay
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  const [locationFilters, setLocationFilters] = useState({
    location1: false,
    location2: false
  })
  
  function getBrands(items:ProductForm[]){
    const brands = ["Wszystkie"]
    for(let x=0;x<items.length;x++){
      if(!brands.includes(items[x].brand)) brands.push(items[x].brand)
    }
    setBrands(brands);
  }
  
  function getCategories(items:ProductForm[]){
    const categories = ["Wszystkie"]
    for(let x=0;x<items.length;x++){
      if(!categories.includes(items[x].category)) categories.push(items[x].category)
    }
    setCategories(categories);
  }
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setShowWorkerOptions(user?.email === "malgorzatamagryso2.pl@gmail.com")
    })
    return () => unsubscribe()
  }, [])

  const getLocationText = (store1: number, store2: number) => {
    if (store1 > 0 && store2 > 0) return `Produkt dostępny w obu punktach (Dąbrowskiego: ${store1}, Grunwaldzka: ${store2})`
    if (store1 > 0 && store2 === 0) return `Produkt dostępny na Dąbrowskiego (ilość: ${store1})`
    if (store1 === 0 && store2 > 0) return `Produkt dostępny na Grunwaldzkiej (ilość: ${store2})`
    return "Produkt chwilowo nie dostępny"
  }
  
  // Use useMemo to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Wszystkie" || product.category === selectedCategory;
    
      const matchesBrand =
        selectedBrand === "Wszystkie" || product.brand === selectedBrand;
    
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
    
      const matchesLocation =
        (!locationFilters.location1 && !locationFilters.location2) ||
        (locationFilters.location1 && locationFilters.location2 && product.store1quantity > 0 && product.store2quantity > 0) ||
        (locationFilters.location1 && !locationFilters.location2 && product.store1quantity > 0) ||
        (!locationFilters.location1 && locationFilters.location2 && product.store2quantity > 0);
    
      const query = (debouncedSearch || "").toString();
      const matchesIdOrName =
        !query || product.id.toString().includes(query) || product.name.toLowerCase().includes(query.toLowerCase());
    
      const matchesCBD =
        selectedCBD === "Wszystkie" ||
        (selectedCBD === "Z CBD" && product.hasCBD) ||
        (selectedCBD === "Bez CBD" && !product.hasCBD);
    
      return matchesCategory && matchesBrand && matchesPrice && matchesLocation && matchesCBD && matchesIdOrName;
    }).sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        return 0
      })
  }, [products, selectedCategory, selectedBrand, priceRange, locationFilters, debouncedSearch, selectedCBD, sortBy])
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("Wszystkie")
    setSelectedBrand("Wszystkie")
    setSelectedCBD("Wszystkie")
    setPriceRange([0, 200])
    setSortBy("default")
    setSearchQuery("")
    setLocationFilters({ location1: false, location2: false })
  }
  
  return (
    <>
      {/* Navigation */}
     
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mt-10 gradient-text mb-4"
          >
            Nasze Produkty
          </motion.h1>

          <p className="text-gray-400 text-lg">
            Znaleziono {filteredProducts.length} produktów
          </p>
        </div>

        <div className="flex gap-8">
          <AnimatePresence>
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-full md:w-80 flex-shrink-0 space-y-6"
              >
                {/* Location Filter */}
                {showWorkerOptions?
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 gradient-text">📍 Lokalizacja</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={locationFilters.location1}
                        onChange={(e) => setLocationFilters({ ...locationFilters, location1: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-purple-500 bg-transparent checked:bg-purple-500 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Piłsudzkiego</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={locationFilters.location2}
                        onChange={(e) => setLocationFilters({ ...locationFilters, location2: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-purple-500 bg-transparent checked:bg-purple-500 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Dąbrowskiego</span>
                    </label>
                  </div>
                </motion.div>:""}

                {/* Category Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 gradient-text">Kategoria</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                            : "bg-white/5 hover:bg-white/10 text-gray-300"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Brand Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 gradient-text">Marka</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <motion.button
                        key={brand}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          selectedBrand === brand
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                            : "bg-white/5 hover:bg-white/10 text-gray-300"
                        }`}
                      >
                        {brand}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* CBD Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.125 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 gradient-text">CBD</h3>
                  <div className="space-y-2">
                    {cbdOptions.map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCBD(option)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          selectedCBD === option
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                            : "bg-white/5 hover:bg-white/10 text-gray-300"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

               

                {/* Sort By */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.175 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 gradient-text">Sortuj</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="default">Domyślne</option>
                    <option value="price-asc">Cena: Rosnąco</option>
                    <option value="price-desc">Cena: Malejąco</option>
                  </select>
                </motion.div>

                {/* Reset Filters */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                >
                  Resetuj Filtry
                </motion.button>
              </motion.aside>
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1">
          <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Szukaj produktu po ID lub nazwie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl px-4 py-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -10 }}
                    className="glass-effect rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image src={product.image} height={256} width={256} className="h-full w-full object-cover" alt={product.name} /> 
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {product.isNew && (
                          <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                            NOWOŚĆ
                          </div>
                        )}
                        {product.isBestseller && (
                          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold">
                            HIT
                          </div>
                        )}
                      </div>

                        <Link href={`/products/${product.id}`} className="cursor-pointer">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="px-6 py-3 bg-white text-black rounded-full font-semibold"
                        >
                          Zobacz Szczegóły
                        </motion.button>
                      </motion.div></Link>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                          {product.category}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{product.brand}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold gradient-text">{product.price} zł</div>
                        </div>
                      </div>
                      {showWorkerOptions?
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <span>📍</span>
                        <span>{getLocationText(product.store1quantity,product.store2quantity)}</span>
                      </div>:""}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}