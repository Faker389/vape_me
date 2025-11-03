"use client"
import { Suspense } from "react"
import LoginForm from ".//LoginForm"


import "../../app/globals.css";

export default function SpecialLayout() {
    return <html lang="en">
      <body className={`font-sans antialiased`}>
      <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
      </body></html>
  }
  