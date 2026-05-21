export interface Driver {
    employeeId: string
    name: string
    username: string
    email: string
    phone: string
    role: string
    assignedArea: string
    isDriverAvailable: boolean
    upForNextDelivery: boolean
    nextDeliveryDate: string | null
    status: string
    profile_image: string
    createdAt: string
}

export interface NextDeliveryDate {
    acceptingOrders: boolean
    date: string
    formatted: string
    day: string
}

export interface Order {
    orderId: string
    totalAmount: number
    itemCount: number
    status: string
    deliveryDate: string

    payment?: {
        method: string
        status: string
    }

    user: {
        username: string
        full_name: string
        email: string
        phone: string
    }

    deliveryDetails: {
        addressLine1: string
        city: string
        state: string
        zipCode: string
        phone: string

        location: {
            lat: number
            lng: number
        }
    }
}