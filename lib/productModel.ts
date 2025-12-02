export interface ProductForm {
    id: number
    name: string
    category: string
    brand: string
    price: number
    isNew: boolean
    isBestseller: boolean
    hasCBD: boolean
    image: string
    store1quantity:number
    store2quantity:number
    imageFile?:File|null
    description:string;
    features?:string[]
    specifications?:Record<string, string>|null;
  }