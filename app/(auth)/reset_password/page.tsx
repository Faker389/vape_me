"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const oobCode = searchParams.get("oobCode") || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isValidCode, setIsValidCode] = useState(false)
  const [isLoading,setIsLoading]=useState<boolean>(false)

  useEffect(() => {
    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, oobCode)
        setIsValidCode(true)
      } catch (error: any) {
        setErrorMessage("Link resetu jest nieprawidłowy lub wygasł")
      }
    }
    if (oobCode) verifyCode()
  }, [oobCode])

  const handleSubmit = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsLoading(false)
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Wszystkie pola są wymagane")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Hasła nie są identyczne")
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword.trim())
      setSuccessMessage("Hasło zostało zmienione! Możesz się teraz zalogować.")
      setTimeout(() => router.push("/"), 2000)
    } catch (error: any) {
      setErrorMessage(error.message || "Coś poszło nie tak")
    }finally{
    setIsLoading(true)

    }
  }

  if (!oobCode) {
    return (
      <div className="text-center text-white min-h-screen flex items-center justify-center">
        Brak kodu resetu hasła
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
      <Card className="w-full max-w-md z-10 shadow-xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ustaw nowe hasło
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Wpisz nowe hasło, aby zaktualizować swoje konto
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert className="mb-4 bg-red-900/40 border-red-800 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 bg-green-900/40 border-green-800 text-green-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {isValidCode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">Nowe hasło</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <Button
                onClick={handleSubmit}
                className="w-full h-12 relative overflow-hidden group transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium"
              >
                {isLoading?"Ładowanie...":"Zmień hasło"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
