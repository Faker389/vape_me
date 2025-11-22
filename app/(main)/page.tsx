"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useProductsStore } from "@/lib/storage"
import type { ProductForm } from "@/lib/productModel"
import useOnlineStatus from "@/lib/hooks/useOnlineStatus"
import { AlertCircle, X, Sparkles, TrendingUp } from "lucide-react"
import ContactForm from "./ContactForm"
export const dynamic = "force-dynamic"
interface EmailInterface {
  title: string
  message: string
}
const initialForm = {
  title: "",
  message: "",
}
interface Alert {
  id: string
  message: string
  type: "error" | "success" | "warning"
}
export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const { products, listenToProducts } = useProductsStore()
  const isOnline = useOnlineStatus()
  const [formData, setFormData] = useState<EmailInterface>(initialForm)
  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])
  useEffect(() => {
    setIsVisible(true)
  }, [])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const showAlert = (message: string, type: "error" | "success" | "warning" = "error") => {
    const newAlert: Alert = {
      id: crypto.randomUUID(),
      message,
      type,
    }

    setAlerts((prev) => [...prev, newAlert])

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
    }, 3000)
  }
  const bestsellers = useMemo(() => {
    if (products.length === 0) return []

    const bestsellerProducts = products.filter((p) => p.isBestseller)

    if (bestsellerProducts.length < 20) {
      const otherProducts = products.filter((p) => !p.isBestseller).slice(0, 20 - bestsellerProducts.length)
      return [...bestsellerProducts, ...otherProducts]
    }
    return bestsellerProducts.slice(0, 20)
  }, [products])

  const newProducts = useMemo(() => {
    if (products.length === 0) return []

    const newProductsList = products.filter((p) => p.isNew)

    if (newProductsList.length < 20) {
      const otherProducts = products.filter((p) => !p.isNew).slice(0, 20 - newProductsList.length)
      return [...newProductsList, ...otherProducts]
    }
    return newProductsList.slice(0, 20)
  }, [products])
  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const res = await fetch("/api/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      showAlert("Błąd podczas wysyłania wiadomości", "error")
    } else {
      showAlert("Pomyślnie wysłano wiadomość", "success")
    }
    setFormData(initialForm)
  }
  const getAlertStyles = (type: "error" | "success" | "warning") => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-400"
      case "warning":
        return "bg-yellow-600 border-yellow-400"
      case "error":
      default:
        return "bg-red-600 border-red-400"
    }
  }
  if (!mounted) return null
  return (
    <>
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
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 gap-12 items-center"
        >
          <div className="space-y-6 sm:space-y-8 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className=" text-5xl    sm:text-6xl md:text-7xl mt-[-2rem] flex-wrap font-bold leading-tight gap-8 flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Zdobywaj
                <span className="gradient-text">Nagrody</span>
                <span>
                  {" "}
                  Robiąc <span className="gradient-text">Zakupy</span>
                </span>
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
              className="flex flex-wrap gap-4"
            >
              <a href="/vape me.apk" download className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg glow-effect flex items-center gap-3"
                >
                  <Image src="/android-logo.svg" alt="Android Logo" width={20} height={20} />
                  Pobierz na Android
                </motion.button>
              </a>

              <a href="/vape me.ipa" download className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold text-lg glow-effect flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Pobierz na iOS
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
            <p className="text-gray-400 text-center mb-12">Masz pytania lub propozycje? Chętnie o nich usłyszymy</p>

            <ContactForm showAlert={showAlert} />
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
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            © 2025 Vape me. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </>
  )
}

// Optimized badge component with no animations
const ProductBadge = ({ variant }: { variant: "bestseller" | "new" }) => {
  if (variant === "bestseller") {
    return (
      <div className="absolute top-3 right-3 z-10">
        <div className="px-3 py-1.5 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-lg text-xs font-black uppercase tracking-wide shadow-xl border-2 border-yellow-300/50 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-yellow-950">Bestseller</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-3 left-3 z-10">
      <div className="px-3 py-1.5 bg-gradient-to-br from-pink-400 via-fuchsia-500 to-pink-600 rounded-lg text-xs font-black uppercase tracking-wide shadow-xl border-2 border-pink-300/50 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="text-white">Nowość</span>
      </div>
    </div>
  )
}

const InfiniteScrollSection = ({
  title,
  subtitle,
  direction,
  products,
}: {
  title: string
  subtitle: string
  direction: "left" | "right"
  products: ProductForm[]
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 30, mass: 0.5 })
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number>(0)

  // Calculate total width for seamless loop
  const cardWidth = 288 + 24 // 72 * 4 (w-72) + gap-6
  const totalWidth = cardWidth * products.length

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const animate = () => {
      const currentX = x.get()
      const speed = direction === "left" ? -0.8 : 0.8

      const newX = currentX + speed

      // Seamless loop
      if (direction === "left" && newX <= -totalWidth / 2) {
        x.set(0)
      } else if (direction === "right" && newX >= 0) {
        x.set(-totalWidth / 2)
      } else {
        x.set(newX)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [x, direction, totalWidth, isPaused])

  const handleTouchStart = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handleDragStart = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsPaused(false)
  }, [])

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

      <div
        className="relative cursor-grab active:cursor-grabbing"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex gap-6"
          style={{ x: springX }}
          drag="x"
          dragConstraints={{ left: -totalWidth / 2, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        >
          {/* Duplicate products for seamless loop */}
          {[...products, ...products].map((product, i) => (
            <Link key={`${product.id}-${i}`} href={`/products/${product.id}`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="flex-shrink-0 w-48 sm:w-60 md:w-72 glass-effect rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-white/10"
              >
                <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 relative overflow-hidden p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={256}
                      height={256}
                      className="h-full w-auto object-contain"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                  {product.isBestseller && <ProductBadge variant="bestseller" />}
                  {product.isNew && <ProductBadge variant="new" />}
                </div>
                <div className="p-6 flex flex-col h-full">
                  <h3 className="font-bold text-xl mb-2 group-hover:gradient-text transition-all line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex flex-col gap-3 mt-auto">
                    <span className="text-2xl font-bold gradient-text">{product.price.toFixed(2)} zł</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold"
                    >
                      Sprawdź
                    </motion.button>
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