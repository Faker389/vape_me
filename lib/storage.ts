import { create } from "zustand"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, Timestamp } from "firebase/firestore"
import { ProductForm } from "./productModel"


interface ProductStore {
  products: ProductForm[]
  rawproducts: ProductForm[]
  isLoaded: boolean
  unsubscribe?: () => void
  listenToProducts: () => void
}

export const useProductsStore = create<ProductStore>((set, get) => ({
  products: [],
  rawproducts: [],
  isLoaded: false,

  listenToProducts: () => {
    if (get().unsubscribe) return // already listening

    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as ProductForm)
      set({ rawproducts: data, isLoaded: true })
    
      const tempData = data.map((e) => ({
        ...e,
        name: e.name.replace(/&/g, "")
      }))
    
      set({ products: tempData, isLoaded: true })
    })
    

    set({ unsubscribe: unsub })
  },
}))

export interface MessageForm {
  id:string
  title:string
  message:string
  isRead:boolean
  createdAt:Timestamp
  browserHash:string
}
interface MessageStore {
  products: MessageForm[]
  isLoaded: boolean
  unsubscribe?: () => void
  listenToProducts: () => void
}

export const useMessageForm = create<MessageStore>((set, get) => ({
  products: [],
  isLoaded: false,

  listenToProducts: () => {
    if (get().unsubscribe) return // already listening

    const unsub = onSnapshot(collection(db, "messages"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as MessageForm)
      set({ products: data, isLoaded: true })
    })

    set({ unsubscribe: unsub })
  },
}))



