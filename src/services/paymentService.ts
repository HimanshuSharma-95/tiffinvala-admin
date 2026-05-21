import api from '@/lib/api'

export const getPaymentOrders = async (
    area: string,
    paymentStatus: string,
    startDate: string,
    endDate: string
) => {

    const response = await api.get(
        `/admin/orders/area?page=1&limit=999999&status=confirmed&paymentStatus=${paymentStatus}&area=${area}&startDate=${startDate}&endDate=${endDate}`
    )

    return response.data
}

export const getPaymentHistory = async (
    area: string,
    startDate: string,
    endDate: string
) => {

    const response = await api.get(
        `/admin/paymenthistory/area?area=${area}&status=confirmed&startDate=${startDate}&endDate=${endDate}`
    )

    return response.data
}

export const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: string
) => {

    const response = await api.patch(
        `/admin/order/updatepaymentstatus/${orderId}`,
        {
            paymentStatus
        }
    )

    return response.data
}