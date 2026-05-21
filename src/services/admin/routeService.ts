import api from '@/lib/api'



//left pannel

export const getDriversByArea = async (
    assignedArea: string,
    upForNextDelivery: boolean
) => {

    return api.get(
        '/admin/drivers',
        {
            params: {
                assignedArea,
                isDriverAvailable: true,
                status: 'verified',
                upForNextDelivery,
            },
        }
    )
}

//all driver of area
export const getAllDriversByArea = async (
    assignedArea: string,
    upForNextDelivery: boolean
) => {

    return api.get(
        '/admin/drivers',
        {
            params: {
                assignedArea,
                isDriverAvailable: true,
                status: 'verified'
            },
        }
    )
}

export const getNextDeliveryDate =
    async () => {

        return api.get(
            '/orders/nextdeliverydate'
        )
    }

export const setDriverForNextDelivery =
    async (
        driverId: string,
        payload: {
            upForNextDelivery: boolean
            nextDeliveryDate: string
        }
    ) => {

        return api.post(
            `/admin/setdriverfornextdelivery?driverId=${driverId}`,
            payload
        )
    }

export const getUnassignedConfirmedOrders =
    async (
        area: string
    ) => {

        return api.get(
            `/admin/orders/unassigned-confirmed?area=${area}`
        )
    }

export const upsertBatch =
    async (
        payload: {
            driverId: string
            area: string
            orderIds: string[]
        }
    ) => {

        return api.post(
            '/admin/upsertBatch',
            payload
        )
    }




//right pannel


export const getDriverActiveBatch =
    async (
        driverId: string
    ) => {

        return api.get(
            `/admin/getDriverActiveBatch/${driverId}`
        )
    }

export const unassignSingleOrder =
    async (
        orderId: string
    ) => {

        return api.post(
            `/admin/unassignSingleOrder/${orderId}`
        )
    }

export const reorderDeliveryBatch =
    async (
        batchId: string,
        payload: {
            orders: {
                orderId: string
                sequence: number
            }[]
        }
    ) => {

        return api.patch(
            `/admin/deliverybatch/reorder/${batchId}`,
            payload
        )
    }

export const finalizeDeliveryBatch =
    async (
        batchId: string
    ) => {

        return api.patch(
            `/admin/deliverybatch/finalize/${batchId}`
        )
    }


export const getDriverHistory =
    async (
        driverId: string
    ) => {

        return api.get(
            `/admin/driverbatch/history/${driverId}`
        )
    }


export const resetDrivers =
    async () => {

        return api.post(
            '/admin/resetdrivers'
        )
    }