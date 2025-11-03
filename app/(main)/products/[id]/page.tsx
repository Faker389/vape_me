"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useProductsStore } from "@/lib/storage"
import { ProductForm } from "@/lib/productModel"
import { Loader2 } from "lucide-react"



interface Specification{
  Moc:string;
  Bateria:string;
  Material:string;
  Wymiary:string;
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string 
  const [product,setProduct]=useState<ProductForm>()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showWorkerOptions,setShowWorkerOptions]=useState<boolean>(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { products, listenToProducts } = useProductsStore()
  const [relatedProducts, setRelatedProducts] = useState<ProductForm[]>([])
 
  useEffect(()=>{
    listenToProducts();
  },[listenToProducts])

  useEffect(()=>{
    const prod = products.filter((e)=>e.id==parseInt(id));
    setProduct(prod[0])
  },[products, id])

  // Get related products based on category or random if category doesn't match
  useEffect(() => {
    if (product && products.length > 0) {
      // Filter products: same category, different product, limit to 4
      const related = products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
      
      // If not enough products in same category, fill with other products
      if (related.length < 4) {
        const otherProducts = products
          .filter(p => p.id !== product.id && p.category !== product.category)
          .slice(0, 4 - related.length)
        setRelatedProducts([...related, ...otherProducts])
      } else {
        setRelatedProducts(related)
      }
    }
  }, [product, products])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email === "malgorzatamagryso2.pl@gmail.com") {
        setShowWorkerOptions(true);
      } else {
        setShowWorkerOptions(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getLocationText = (locations: number[]) => {
    if (locations.length === 2) return "Obie lokalizacje"
    return `Lokalizacja ${locations[0]}`
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <>
      {/* Navigation */}
     

      {product?<div className="max-w-7xl mt-12 mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-md text-gray-400 mb-8"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            Produkty
          </Link>
          <span>/</span>
          <span className="text-white">{product!.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="glass-effect rounded-3xl p-9">
              <div className="h-96 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  key={selectedImage}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <img
                    src={product.image}
                    className="h-full w-auto object-contain"
                    alt="Product image" 
                  />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product!.isNew && (
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold shadow-lg">
                      NOWOŚĆ
                    </div>
                  )}
                  {product!.isBestseller && (
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-bold shadow-lg">
                      BESTSELLER
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">
                  {product!.category}
                </span>
                <span className="text-sm text-gray-400">{product!.brand}</span>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-4">{product!.name}</h1>
            </div>

            {/* Description */}
            {product.description && (
              <div className="glass-effect rounded-2xl p-6 relative overflow-hidden mb-6">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 gradient-text">O Produkcie</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {isDescriptionExpanded ? product.description : truncateText(product.description)}
                    </p>
                    {product.description.length > 150 && (
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="mt-3 text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold flex items-center gap-1"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            Pokaż mniej
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Pokaż więcej
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Price - Aligned to bottom */}
            <div className="glass-effect rounded-2xl p-6 relative overflow-hidden mt-auto">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent opacity-50"></div>
              
              <div className="relative">
                <p className="text-sm text-gray-400 mb-1">Cena</p>
                <div className="text-4xl font-bold gradient-text">{product!.price} zł</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features and Specifications - Same Level Below */}
        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Features */}
          {product.features && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 gradient-text">Cechy Produktu</h3>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-purple-400">✓</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 gradient-text">Specyfikacja Produktu</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
                  >
                    <span className="text-gray-400">{key}</span>
                    <span className="font-semibold">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-4xl font-bold gradient-text mb-8">Podobne Produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="glass-effect rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10"
                  >
                    <div className="h-48 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center p-4">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 truncate">{relatedProduct.name}</h3>
                      <div className="text-xl font-bold gradient-text">{relatedProduct.price} zł</div>
                      {relatedProduct.isNew && (
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                          NOWOŚĆ
                        </span>
                      )}
                      {relatedProduct.isBestseller && (
                        <span className="inline-block mt-2 ml-2 text-xs px-2 py-1 bg-orange-500/20 rounded-full text-orange-300">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>:<div className="flex items-center justify-center h-96"><h1 className="flex flex-row items-center gap-3 text-white text-2xl"><Loader2 className="w-8 h-8 animate-spin"/>Ładowanie Produktu</h1></div>}

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          © 2025 Vape me. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </>
  )
}