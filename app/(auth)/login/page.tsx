"use client"
import { AnimatePresence, motion } from "framer-motion"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
interface Alert {
  id: string
  message: string
  type: 'error' | 'success' | 'warning'
}
export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const [alerts, setAlerts] = useState<Alert[]>([])

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
  const loginFKC = async () => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(
        auth,
        email.replace(/\s+/g, "").trim(),
        password.replace(/\s+/g, "").trim()
      );
      showAlert("Pomyślnie zalogowano", "success")
      setTimeout(() => {
        window.location.href = "/"
      }, 2000);
    } catch (error) {
      showAlert("Błąd podczas logowania", "error")
    }finally{
      setIsLoading(false)
    }
  }
  const registerFKC = async () => {
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(
        auth,
        email.replace(/\s+/g, "").trim(),
        password.replace(/\s+/g, "").trim()
      );
      setIsLogin(true)
      showAlert("Pomyślnie zarejestrowano", "success")
    } catch (error) {
      showAlert("Błąd podczas rejestrowania", "error")
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  const handleSubmit = () => {
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("Wszystkie pola są wymagane")
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Hasła nie są identyczne")
      return
    }

    // Your authentication logic here
    if(isLogin){
      loginFKC();
    }else{
      registerFKC();
    }
    
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setErrorMessage(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
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
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
      {/* Logo in top left */}
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
      <div className="absolute top-6 left-6 z-20">
        <div className="h-24 w-auto cursor-pointer text-white text-2xl font-bold">
          LOGO
        </div>
      </div>

      {/* Background floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Card */}
      <Card className="w-full max-w-md z-10 shadow-xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isLogin ? "Witamy z powrotem" : "Utwórz konto"}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {isLogin 
              ? "Zaloguj się do swojego konta" 
              : "Zarejestruj się aby rozpocząć"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert className="mb-4 bg-red-900/40 border-red-800 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Potwierdź hasło</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full h-12 relative overflow-hidden group transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium"
            >
              {isLogin ? isLoading?"Ładowanie...":"Zaloguj się" :isLoading?"Ładowanie...":"Zarejestruj się"}
            </Button>
          </div>


          <div className="text-center text-sm flex justify-between text-gray-400">
            <div>
            {isLogin ? "Nie masz konta? " : "Masz już konto? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
              {isLogin ? "Zarejestruj się" : "Zaloguj się"}
            </button>
            </div>
            {isLogin?<div>
              <Link href="/forgot_password"className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Zapomniałeś hasła?</Link>
            </div>:""}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}