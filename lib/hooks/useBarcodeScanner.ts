// hooks/useBarcodeScanner.ts
"use client"

import { useEffect, useState } from "react"

export function useBarcodeScanner(onScan: (code: string) => void) {
  const [buffer, setBuffer] = useState("")
  const [lastTime, setLastTime] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now()

      // If too much time between keys, reset buffer
      if (currentTime - lastTime > 100) {
        setBuffer("")
      }

      // Usually scanners send Enter (\r or \n) at the end
      if (e.key === "Enter") {
        if (buffer.length > 0) {
          onScan(buffer)
          setBuffer("")
        }
      } else if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setBuffer((prev) => prev + e.key)
      }

      setLastTime(currentTime)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [buffer, lastTime, onScan])
}
