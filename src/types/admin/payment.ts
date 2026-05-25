export interface PaymentOrderUser {
    userId: string
    name: string
    username: string
    email?: string
    phone: string
}

export interface PaymentVariant {
    size: string
    price: number
}

export interface PaymentSelectionProduct {
    productId: string
    name: string
    category: string
    quantity: number
}

export interface PaymentSelection {
    ruleId: string
    products: PaymentSelectionProduct[]
}

export interface PaymentOrderItem {
    productId?: string
    comboId?: string | null

    name: string
    quantity: number
    type: string

    variant: PaymentVariant

    subtotal: number

    selections?: PaymentSelection[]
}

export interface PaymentOrder {
    orderId: string

    user: PaymentOrderUser

    status: string

    payment: {
        method: string
        status: string
    }

    paymentRequested: boolean

    totalAmount: number

    deliveryDate: string

    deliveredAt: string | null

    isorderdelivered: boolean

    deliveryProofImage: string | null

    itemCount: number

    items: PaymentOrderItem[]

    placedAt: string
}

export interface PaymentOrdersResponse {
    area: string

    orders: PaymentOrder[]

    pagination: {
        totalOrders: number
        currentPage: number
        totalPages: number
        limit: number
    }
}

export interface PaymentReport {
    title: string
    deliveryCycle: string
    totalOrders: number
    totalConfirmedOrders: number
    totalDeliveredOrders: number
    paid: number
    unpaid: number
    totalAmount: number
    received: number
    remaining: number
}

export interface PaymentHistoryResponse {
    area: string
    report: PaymentReport
}