import api from '@/lib/api'

export const getDriverBatches =
    async () => {

        return api.get(
            '/admin/driver/batches'
        )
    }

export const markOrderDelivered =
    async (
        orderId: string,
        image: File
    ) => {

        const formData =
            new FormData()

        formData.append(
            'deliveryImage',
            image
        )

        return api.post(
            `/admin/driver/markorderdelivered/${orderId}`,
            formData,
            {
                headers: {
                    'Content-Type':
                        'multipart/form-data'
                }
            }
        )
    }