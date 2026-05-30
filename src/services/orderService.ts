import api from '@/lib/api'

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

export const getOrdersByArea = async (
    area: string,
    status: string
) => {

    const response = await api.get(
        `/admin/orders/area?area=${area}&status=${status}`
    )

    return response.data
}

export const updateOrderStatus = async (
    orderId: string,
    status: string
) => {

    const response = await api.patch(
        `/admin/order/orderstatus/${orderId}`,
        { status }
    )

    return response.data
}

export const getUnassignedConfirmedOrders = async (
    area: string
) => {

    const response = await api.get(
        `/admin/orders/unassigned-confirmed?area=${area}`
    )

    return response.data
}

export const getKitchenOrders = async (
    area: string
) => {

    const response = await api.get(
        `/admin/orders/kitchen/area?area=${area}`
    )

    return response.data
}

export const getOrderUserDetails = async (
    orderId: string
) => {

    const response = await api.get(
        `/admin/orders/getuserdetails/${orderId}`
    )

    return response.data
}

// ─────────────────────────────────────────────
// NEXT DELIVERY DATE
// ─────────────────────────────────────────────

export const getNextDeliveryDate = async () => {

    const response = await api.get(
        `/orders/nextdeliverydate`
    )

    return response.data
}

// ─────────────────────────────────────────────
// DRIVERS
// ─────────────────────────────────────────────

export const getAvailableDrivers = async () => {

    const response = await api.get(
        `/admin/drivers?isDriverAvailable=true&status=verified`
    )

    return response.data
}

// GENERAL DRIVER FILTER API

export const getDriversByArea = async (
    area: string,
    isDriverAvailable: boolean = true,
    status: string = 'verified',
    upForNextDelivery?: boolean
) => {

    let url =
        `/admin/drivers?assignedArea=${area}` +
        `&isDriverAvailable=${isDriverAvailable}` +
        `&status=${status}`

    if (upForNextDelivery !== undefined) {
        url += `&upForNextDelivery=${upForNextDelivery}`
    }

    const response = await api.get(url)

    return response.data
}










// OLD AREA ASSIGNMENT API
// KEEPING BECAUSE MAY STILL BE USED SOMEWHERE

export const assignDriverArea = async (
    employeeId: string,
    assignedArea: string,
    action: 'add' | 'remove'
) => {

    const response = await api.post(
        '/admin/assignarea/driver',
        {
            employeeId,
            assignedArea,
            action
        }
    )

    return response.data
}

// SET DRIVER FOR NEXT DELIVERY

export const setDriverForNextDelivery = async (
    driverId: string,
    body: {
        upForNextDelivery: boolean
        nextDeliveryDate: string
    }
) => {

    const response = await api.post(
        `/admin/setdriverfornextdelivery?driverId=${driverId}`,
        body
    )

    return response.data
}

// REMOVE DRIVER FROM NEXT DELIVERY

export const removeDriverFromNextDelivery = async (
    driverId: string
) => {

    const response = await api.post(
        `/admin/setdriverfornextdelivery?driverId=${driverId}`,
        {
            upForNextDelivery: false,
            nextDeliveryDate: null
        }
    )

    return response.data
}


// ─────────────────────────────────────────────
// DELIVERY BATCHES
// ─────────────────────────────────────────────

export const createDeliveryBatch = async (
    data: {
        driverId: string
        area: string
        orderIds: string[]
    }
) => {

    const response = await api.post(
        '/admin/createdeliverybatch',
        data
    )

    return response.data
}

// VIEW DRIVER BATCHES

export const viewDriverBatches = async (
    driverId: string
) => {

    const response = await api.get(
        `/admin/viewdriverbatches/${driverId}`
    )

    return response.data
}

// REORDER DELIVERY BATCH

export const reorderDeliveryBatch = async (
    batchId: string,
    body: {
        orders: {
            orderId: string
            sequence: number
        }[]
    }
) => {

    const response = await api.patch(
        `/admin/deliverybatch/reorder/${batchId}`,
        body
    )

    return response.data
}

// FINALIZE DELIVERY BATCH

export const finalizeDeliveryBatch = async (
    batchId: string
) => {

    const response = await api.patch(
        `/admin/deliverybatch/finalize/${batchId}`
    )

    return response.data
}

// OPTIONAL
// UNASSIGN ORDER FROM BATCH

export const unassignOrderFromBatch = async (
    batchId: string,
    orderId: string
) => {

    const response = await api.patch(
        `/admin/deliverybatch/unassign/${batchId}`,
        {
            orderId
        }
    )

    return response.data
}






//Live - Offline Orders

// ─────────────────────────────────────────────
// ORDER ACCEPTANCE
// ─────────────────────────────────────────────

export const getOrderAcceptanceStatus = async () => {

    const response = await api.get(
        `/orders/getorderacceptancestatus`
    )

    return response.data
}

export const toggleOrderAcceptance = async () => {

    const response = await api.post(
        `/admin/toggleorderacceptance`
    )

    return response.data
}