export interface KitchenItemVariant {
    size: string
    price: number
}

export interface KitchenSelectionProduct {
    productId: string
    name: string
    category: string
    quantity: number
}

export interface KitchenSelection {
    ruleId: string
    products: KitchenSelectionProduct[]
}

export interface KitchenOrderItem {
    name: string
    quantity: number
    type: string
    variant: KitchenItemVariant
    subtotal: number

    // NEW
    selections?: KitchenSelection[]
}

export interface KitchenOrder {
    orderId: string
    username: string
    status: string
    itemCount: number
    items: KitchenOrderItem[]
    placedAt: string
}

export interface KitchenUserGroup {
    username: string
    totalOrders: number
    orders: KitchenOrder[]
}

export interface AggregatedItemVariants {
    [size: string]: number
}

export interface AggregatedItem {
    name: string
    category: string
    totalQuantity: number
    total16ozEquivalent: number
    variants: AggregatedItemVariants
}

export interface KitchenPagination {
    totalOrders: number
    currentPage: number
    totalPages: number
    limit: number
}

export interface KitchenOrdersResponse {
    area: string
    citiesCovered: string[]
    orders: KitchenUserGroup[]
    aggregatedItems: AggregatedItem[]
    pagination: KitchenPagination
}

export interface OrderUserDetail {
    _id: string
    username: string
    full_name: string
    phone_number: string
    email: string
    gender: string
    DOB: string
    is_email_verified: boolean
    avatar: string
    createdAt: string
}

export interface OrderDeliveryDetail {
    location: {
        lat: number
        lng: number
    }

    addressId: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
}

export interface OrderUserDetails {
    orderId: string
    orderStatus: string
    totalAmount: number
    deliveryDate: string

    payment: {
        method: string
        status: string
    }

    user: OrderUserDetail

    deliveryDetails: OrderDeliveryDetail
}