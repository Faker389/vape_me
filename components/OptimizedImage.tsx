"use client"
import { useState, useEffect, useRef, memo } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
}

const OptimizedImage = memo(({ 
  src, 
  alt, 
  priority = false, 
  width = 256, 
  height = 256,
  className = "object-cover rounded-lg",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!src || src.trim() === "") {
      setImageSrc("/placeholder.svg")
      setIsLoading(false)
      return
    }

    // Priority images load immediately
    if (priority) {
      setImageSrc(src)
      return
    }

    // Use Intersection Observer for lazy loading
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src)
              if (observerRef.current && imgRef.current) {
                observerRef.current.unobserve(imgRef.current)
              }
            }
          })
        },
        {
          rootMargin: "50px", // Start loading 50px before entering viewport
          threshold: 0.01,
        }
      )

      observerRef.current = observer

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => {
        if (observerRef.current && imgRef.current) {
          observerRef.current.unobserve(imgRef.current)
        }
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src)
    }
  }, [src, priority])

  if (hasError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">Image Error</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse rounded-lg" />
      )}
      {imageSrc && (
        <Image
          src={imageSrc}
          width={width}
          height={height}
          className={className}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          quality={75}
          sizes={sizes}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect fill='%23391f5c' width='256' height='256'/%3E%3C/svg%3E"
        />
      )}
    </div>
  )
})

OptimizedImage.displayName = "OptimizedImage"

export default OptimizedImage

