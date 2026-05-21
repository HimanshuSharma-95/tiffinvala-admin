export interface DriverBatch {

    batchId: string

    status: string

    viewToDriver: boolean

    createdAt: string

    updatedAt: string

    finalizedAt: string

    totalOrders: number

    orders: DriverOrder[]
}

export interface DriverOrder {

    sequence: number

    deliverySequence: number

    orderId: string

    orderNumber: string

    totalAmount: number

    status: string

    deliveredAt: string | null

    isorderdelivered: boolean

    deliveryProofImage: string | null

    paymentRequested: boolean

    deliveryDate: string

    paymentStatus: string

    paymentMethod: string

    user: {

        userId: string

        username: string

        full_name: string

        phone_number: string
    }

    deliveryDetails: {

        addressId: string

        addressLine1: string

        addressLine2: string

        city: string

        state: string

        zipCode: string

        country: string

        phone: string

        instructions: string

        location: {

            lat: number

            lng: number
        }
    }

    items: {

        name: string

        quantity: number

        subtotal: number
    }[]

    itemCount: number

    placedAt: string
}