export interface ProductVariant {
    size: string
    price: number
}

export interface Product {
    _id: string
    name: string
    description: string
    image: string
    category: string
    food_class: string
    product_type: string
    variants: ProductVariant[]
    isAvailable: boolean
    areas: string[]
    createdAt: string
    updatedAt: string
}

/* NEW CATEGORY TYPE */
export interface Category {
    _id: string
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CategoryGroup {
    category: string
    products: Product[]
}

export interface ComboRule {
    _id?: string
    category: string[]
    quantity: number
    isFixed?: boolean
    isOptional?: boolean
    allowCustomSelection?: boolean
    label?: string
    isSelectionRequired?: boolean
    fixedItems?: any[]
}

export interface Combo {
    _id: string
    name: string
    description?: string
    price: number
    size: string
    rules: ComboRule[]
    isActive: boolean
    areas: string[]
    createdAt: string
    updatedAt: string
    image?: string
}