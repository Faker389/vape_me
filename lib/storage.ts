import { create } from "zustand"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { ProductForm } from "./productModel"


interface ProductStore {
  products: ProductForm[]
  isLoaded: boolean
  unsubscribe?: () => void
  listenToProducts: () => void
}

export const useProductsStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoaded: false,

  listenToProducts: () => {
    if (get().unsubscribe) return // already listening

    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as ProductForm)
      set({ products: data, isLoaded: true })
    })

    set({ unsubscribe: unsub })
  },
}))
