"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, useSpring, type PanInfo } from "framer-motion"
import { useProductsStore } from "@/lib/storage"
import { ProductForm } from "@/lib/productModel"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const { products, listenToProducts } = useProductsStore()
  const [bestsellers, setBestsellers] = useState<ProductForm[]>([])
  const [newProducts, setNewProducts] = useState<ProductForm[]>([])
  const [mounted, setMounted] = useState(false)

  
  useEffect(() => {
    setIsVisible(true)
    listenToProducts()
  }, [listenToProducts])

  // Generate bestsellers list
  useEffect(() => {
    if (products.length > 0) {
      const bestsellerProducts = products.filter(p => p.isBestseller)
      
      // If we have less than 20 bestsellers, fill with other products
      if (bestsellerProducts.length < 20) {
        const otherProducts = products
          .filter(p => !p.isBestseller)
          .slice(0, 20 - bestsellerProducts.length)
        setBestsellers([...bestsellerProducts, ...otherProducts])
      } else {
        setBestsellers(bestsellerProducts.slice(0, 20))
      }
    }
  }, [products])

  // Generate new products list
  useEffect(() => {
    if (products.length > 0) {
      const newProductsList = products.filter(p => p.isNew)
      
      // If we have less than 20 new products, fill with other products
      if (newProductsList.length < 20) {
        const otherProducts = products
          .filter(p => !p.isNew)
          .slice(0, 20 - newProductsList.length)
        setNewProducts([...newProductsList, ...otherProducts])
      } else {
        setNewProducts(newProductsList.slice(0, 20))
      }
    }
  }, [products])

  return (
    <>
      {/* Navigation */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-6 gap-12 items-center"
        >
          <div className="space-y-8 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-6xl md:text-7xl mt-[-2rem] flex-wrap font-bold leading-tight gap-8 flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Zdobywaj
                <span className="gradient-text">Nagrody</span>
                <span> Robiąc <span className="gradient-text">Zakupy</span></span>
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Dołącz do programu lojalnościowego Vape Me i odbieraj ekskluzywne kupony, zniżki oraz nagrody za każdy
              zakup!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 w-fit"
            >
              <a href="/app-release.apk" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg glow-effect"
                >
                  Pobierz Aplikację
                </motion.button>
              </a>

              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 cursor-pointer glass-effect rounded-full text-white font-semibold"
                >
                  Zobacz Produkty
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-10 pt-8 w-fit"
            >
              {[
                { number: "10K+", label: "Użytkowników" },
                { number: "500+", label: "Produktów" },
                { number: "50K+", label: "Nagród" },
              ].map((stat, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} className="text-center">
                  <div className="text-3xl font-bold gradient-text">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {bestsellers.length > 0 && (
        <InfiniteScrollSection
          title="Bestsellery"
          subtitle="Najchętniej wybierane produkty"
          direction="left"
          products={bestsellers}
        />
      )}

      {newProducts.length > 0 && (
        <InfiniteScrollSection
          title="Nowo Dodane"
          subtitle="Sprawdź najnowsze produkty"
          direction="right"
          products={newProducts}
        />
      )}

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold gradient-text mb-16 text-center"
          >
            Dlaczego Vape Me?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎁",
                title: "Nagrody Za Zakupy",
                description: "Zbieraj punkty z każdym zakupem i wymieniaj je na ekskluzywne nagrody",
              },
              {
                icon: "📱",
                title: "Łatwa Aplikacja",
                description: "Intuicyjna aplikacja mobilna z prostym skanowaniem QR kodów",
              },
              {
                icon: "⚡",
                title: "Błyskawiczne Rabaty",
                description: "Natychmiastowe kupony i zniżki dostępne w aplikacji",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-effect rounded-2xl p-8 group cursor-pointer"
              >
                <motion.div transition={{ duration: 0.5 }} className="text-6xl mb-6">
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12"
          >
            <h2 className="text-5xl font-bold gradient-text mb-4 text-center">Skontaktuj Się Z Nami</h2>
            <p className="text-gray-400 text-center mb-12">Masz pytania? Chętnie pomożemy!</p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <input
                    type="text"
                    placeholder="Imię i Nazwisko"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
                  />
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="text"
                  placeholder="Temat"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <textarea
                  placeholder="Wiadomość"
                  rows={6}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none text-white"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold text-lg glow-effect"
              >
                Wyślij Wiadomość
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold gradient-text">Vape me</span>
              </Link>
              <p className="text-gray-400 text-sm">Program lojalnościowy nowej generacji</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produkty</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Wszystkie Produkty
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=bestsellers" className="hover:text-white transition-colors">
                    Bestsellery
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=new" className="hover:text-white transition-colors">
                    Nowości
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Firma</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    O Nas
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Regulamin
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Social Media</h4>
              <div className="flex gap-4">
                {["📘", "📸", "🐦"].map((icon, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.2 }}
                    className="w-10 h-10 glass-effect rounded-full flex items-center justify-center"
                  >
                    <span className="text-xl">{icon}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            © 2025 Vape me. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </>
  )
}

function InfiniteScrollSection({
  title,
  subtitle,
  direction,
  products,
}: {
  title: string
  subtitle: string
  direction: "left" | "right"
  products: ProductForm[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 50 })
  const [isDragging, setIsDragging] = useState(false)

  // Calculate total width for seamless loop
  const cardWidth = 288 + 24 // 72 * 4 (w-72) + gap-6
  const totalWidth = cardWidth * products.length

  useEffect(() => {
    if (isDragging) return

    const animate = () => {
      const currentX = x.get()
      const speed = direction === "left" ? -0.5 : 0.5
      const newX = currentX + speed

      // Seamless loop
      if (direction === "left" && newX <= -totalWidth / 2) {
        x.set(0)
      } else if (direction === "right" && newX >= 0) {
        x.set(-totalWidth / 2)
      } else {
        x.set(newX)
      }
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [x, direction, totalWidth, isDragging])

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false)
  }

  return (
    <section className="pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold gradient-text mb-4"
        >
          {title}
        </motion.h2>
        <p className="text-gray-400 text-lg">{subtitle}</p>
      </div>

      <div className="relative cursor-grab active:cursor-grabbing" ref={containerRef}>
        <motion.div
          className="flex gap-6"
          style={{ x: springX }}
          drag="x"
          dragConstraints={{ left: -totalWidth / 2, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
        >
          {/* Duplicate products for seamless loop */}
          {[...products, ...products].map((product, i) => (
            <Link key={`${product.id}-${i}`} href={`/products/${product.id}`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="flex-shrink-0 w-72 glass-effect rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-white/10"
              >
                <div className="h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 relative overflow-hidden p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  {product.isBestseller && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold shadow-lg">
                      BESTSELLER
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs font-bold shadow-lg">
                      NOWOŚĆ
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 truncate">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.category}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold gradient-text">{product.price} zł</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}