"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useParams } from 'next/navigation'
import { useProductsStore } from "@/lib/storage"
import type { ProductForm } from "@/lib/productModel"
import { Loader2, X } from 'lucide-react'
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"

export const dynamic = "force-dynamic"

const RelatedProductCard = ({ product }: { product: ProductForm }) => (
  <Link href={`/products/${product.id}`}>
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-effect rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10"
    >
      <div className="h-40 md:h-48 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center p-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={192}
          height={192}
          className="h-full w-auto object-contain"
          loading="lazy"
          quality={75}
        />
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-bold mb-2 truncate text-sm md:text-base">{product.name}</h3>
        <div className="text-lg md:text-xl font-bold gradient-text">{product.price} zł</div>
        <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
          {product.isNew && (
            <span className="inline-block text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
              NOWOŚĆ
            </span>
          )}
          {product.isBestseller && (
            <span className="inline-block text-xs px-2 py-1 bg-orange-500/20 rounded-full text-orange-300">
              BESTSELLER
            </span>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
)

export default function ProductDetailPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<ProductForm>()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { products, listenToProducts } = useProductsStore()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])

  useEffect(() => {
    const prod = products.filter((e) => e.id == Number.parseInt(id))
    setProduct(prod[0])
  }, [products, id])

  const relatedProducts = useMemo(() => {
    if (!product || products.length === 0) return []
    
    const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

    if (related.length < 4) {
      const otherProducts = products
        .filter((p) => p.id !== product.id && p.category !== product.category)
        .slice(0, 4 - related.length)
      return [...related, ...otherProducts]
    }
    return related
  }, [product, products])

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }
  if (!mounted) return null;
  return (
    <>
      {product ? (
        <div className="max-w-7xl mt-12 mx-auto px-4 md:px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm md:text-md text-gray-400 mb-6 md:mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Produkty
            </Link>
            <span>/</span>
            <span className="text-white truncate">{product!.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="glass-effect rounded-3xl p-4 md:p-9">
                <div className="h-64 md:h-96 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    key={0}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex items-center justify-center"
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      className="h-full w-auto object-contain"
                      alt={product.name}
                      width={384}
                      height={384}
                      priority
                      quality={85}
                    />
                  </motion.div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product!.isNew && (
                      <div className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        NOWOŚĆ
                      </div>
                    )}
                    {product!.isBestseller && (
                      <div className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        BESTSELLER
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs md:text-sm px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">
                    {product!.category}
                  </span>
                  <span className="text-xs md:text-sm text-gray-400">{product!.brand}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-4">{product!.name}</h1>
              </div>

              {product.description && (
                <div className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden mb-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 md:w-6 h-5 md:h-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold mb-3 gradient-text">O Produkcie</h3>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {isDescriptionExpanded ? product.description : truncateText(product.description)}
                      </p>
                      {product.description.length > 150 && (
                        <button
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="mt-3 text-purple-400 hover:text-purple-300 transition-colors text-xs md:text-sm font-semibold flex items-center gap-1"
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

              <div className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden mt-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent opacity-50"></div>

                <div className="relative">
                  <p className="text-xs md:text-sm text-gray-400 mb-1">Cena</p>
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{product!.price} zł</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8 md:mt-12">
            {product.features && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-2xl p-4 md:p-6"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4 gradient-text">Cechy Produktu</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-3 text-gray-300 text-sm md:text-base"
                    >
                      <span className="text-purple-400">✓</span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {product.specifications&&Object.entries(product.specifications).length > 0&& (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-2xl p-4 md:p-6"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4 gradient-text">Specyfikacja Produktu</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex justify-between items-center py-2 border-b border-white/10 last:border-0 text-sm md:text-base"
                    >
                      <span className="text-gray-400">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 md:mt-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6 md:mb-8">Podobne Produkty</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <h1 className="flex flex-row items-center gap-3 text-white text-xl md:text-2xl">
            <Loader2 className="w-6 md:w-8 h-6 md:h-8 animate-spin" />
            Ładowanie Produktu
          </h1>
        </div>
      )}

      <AnimatePresence>
        {!isOnline && (
          <motion.div
            key="offline-alert"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="fixed bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-auto bg-red-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border border-white/20"
          >
            <X className="w-5 md:w-6 h-5 md:h-6 flex-shrink-0" />
            <span className="font-semibold text-sm md:text-base">
              Brak połączenia z internetem. Połącz się, aby kontynuować.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-8 md:py-12 border-t border-white/10 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-gray-400 text-xs md:text-sm">
          © 2025 Vape me. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </>
  )
}
