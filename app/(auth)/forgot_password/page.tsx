"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const handleSubmit = async () => {
    setErrorMessage(null)
    setIsLoading(true)
    setSuccessMessage(null)

    if (!email) {
      setErrorMessage("Wpisz swój email")
      return
    }

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setSuccessMessage("Email z linkiem do resetu hasła został wysłany!")
    } catch (error: any) {
      setErrorMessage(error.message || "Coś poszło nie tak")
    }finally{
        setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
      <Card className="relative w-full max-w-md z-10 shadow-xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl text-white">
        <Link href="/login" className="absoulte flex items-center gap-2 pl-2    " >
            <ArrowLeft className="w-4 h-4"/> Powrót</Link> 
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resetowanie hasła
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Wpisz swój email, a wyślemy Ci link do resetu hasła
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

            <Button
              onClick={handleSubmit}
              className="w-full h-12 relative overflow-hidden group transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium"
            >
              {isLoading?"Ładowanie...":"Wyślij link"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
