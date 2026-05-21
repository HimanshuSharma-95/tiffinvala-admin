export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'cancelled'

export interface ComboSelectionProduct {
    productId: string
    name: string
    category: string
    quantity: number
}

export interface ComboSelection {
    ruleId: string
    products: ComboSelectionProduct[]
}

export interface OrderItem {
    productId?: string
    comboId?: string

    name: string
    quantity: number
    price?: number
    type: string
    total?: number

    variant?: {
        size: string
        price: number
    }

    selections?: ComboSelection[]
}
export interface OrderUser {
    userId: string
    username: string
    name: string
    email: string
    phone: string
}

export interface DeliveryDetails {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
}

export interface Order {
    orderId: string
    status: OrderStatus

    totalAmount: number
    itemCount: number

    paymentRequested: boolean

    placedAt: string
    deliveryDate: string | null
    deliveredAt: string | null

    user: OrderUser
    items: OrderItem[]
    deliveryDetails: DeliveryDetails

    payment: {
        method: string
        status: string
    }
}