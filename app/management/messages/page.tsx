"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, ChevronDown, ChevronUp, Mail, MailOpen, Calendar, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { MessageForm, useMessageForm } from "@/lib/storage"
import {  Timestamp, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Alert {
    id: string
    message: string
    type: 'error' | 'success' | 'warning'
  }
export default function MessagesPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [messages, setMessages] = useState<MessageForm[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const { products, listenToProducts } = useMessageForm()
  async function markAllAsRead(products:MessageForm[]){
    const filteredMessages = products.filter((m) => !m.isRead);
    if(filteredMessages.length==0)return;
    try{
        await Promise.all(
          filteredMessages.map(async(e)=>{
            // Query by the id field in the document data, not the document ID
            const q = query(collection(db, "messages"), where("id", "==", e.id));
            const querySnapshot = await getDocs(q);
            // Wait for all updates to complete
            await Promise.all(
              querySnapshot.docs.map(async (docSnapshot) => {
                await updateDoc(docSnapshot.ref, {isRead:true});
              })
            );
          })
        )
    } catch(err){
    }
  }
  useEffect(() => {
    listenToProducts()
  }, [listenToProducts])
  useEffect(()=>{
    try{
        if(!products)return;
        if(messages.length==0&&products.length==0) return;
        if(messages.length==0){
            setMessages(products)
        }
        markAllAsRead(products);
    }catch(e){
        showAlert("Błąd podczas pobierania wiadomości","error")
    }
  },[products])
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
  // Memoized filtered messages for performance
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages

    const query = searchQuery.toLowerCase()
    return messages.filter(
      (msg) => msg.title.toLowerCase().includes(query) || msg.message.toLowerCase().includes(query),
    )
  }, [messages, searchQuery])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleRead = (id: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, isRead: !msg.isRead } : msg)))
  }

  const getPreviewText = (text: string, maxLines = 2) => {
    const maxLength = maxLines * 80 // Approximate characters per line
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  const formatDate = (date: Date | Timestamp) => {
    // Convert Firestore Timestamp to Date if needed
    const dateObj = date instanceof Timestamp ? date.toDate() : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Dzisiaj, ${dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return "Wczoraj"
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`
    } else {
      return dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
    }
  }
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background */}
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

      <div className="relative container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Wiadomości od użytkowników
        </motion.h1>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj w tytule lub treści wiadomości..."
              className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Messages list */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">
                  {searchQuery ? "Nie znaleziono wiadomości pasujących do zapytania" : "Brak wiadomości"}
                </p>
              </motion.div>
            ) : (
              filteredMessages.map((message, index) => {
                const isExpanded = expandedIds.has(message.id)
                const displayText = isExpanded ? message.message : getPreviewText(message.message)
                const needsExpand = message.message.length > 160

                return (
                    <motion.div
                      key={message.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative bg-gradient-to-br backdrop-blur-xl border rounded-xl p-5 transition-all ${
                        message.isRead
                          ? "from-gray-800/40 to-gray-700/40 border-white/5"
                          : "from-purple-600/20 to-pink-600/20 border-white/10"
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {!message.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse" />
                      )}
                  
                      <div className="flex items-start gap-4">
                        {/* Read/Unread icon */}
                        <button
                          onClick={() => toggleRead(message.id)}
                          className="flex-shrink-0 mt-1 text-gray-400 hover:text-purple-400 transition-colors"
                          title={message.isRead ? "Oznacz jako nieprzeczytane" : "Oznacz jako przeczytane"}
                        >
                          {message.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                        </button>
                  
                        {/* Message content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className={`text-lg font-semibold ${message.isRead ? "text-gray-300" : "text-white"}`}>
                              {message.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-white flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {message.createdAt && formatDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                  
                          <p
                            className={`text-sm leading-relaxed mb-3 ${message.isRead ? "text-gray-400" : "text-gray-300"}`}
                          >
                            {displayText}
                          </p>
                  
                          {/* Action buttons */}
                          <div className="flex items-center gap-3">
                            {needsExpand && (
                              <button
                                onClick={() => toggleExpand(message.id)}
                                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Zwiń
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    Rozwiń
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400"
          >
            <span>
              Wszystkich: <span className="text-white font-medium">{messages.length}</span>
            </span>
            <span>
              Nieprzeczytanych:{" "}
              <span className="text-purple-400 font-medium">{messages.filter((m) => !m.isRead).length}</span>
            </span>
            {searchQuery && (
              <span>
                Wyników wyszukiwania: <span className="text-pink-400 font-medium">{filteredMessages.length}</span>
              </span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
