import api from '@/lib/api'

import {
    CreateDriverPayload
} from '@/types/admin/drivers'

export const getDriversByArea = async (
    area: string
) => {

    const response = await api.get(
        `/admin/drivers?assignedArea=${area}&status=verified`
    )

    return response.data
}

export const createDriver = async (
    data: CreateDriverPayload
) => {

    const response = await api.post(
        '/admin/startRegistration',
        data
    )

    const employeeId =
        response.data.data.id

    // AUTO VERIFY
    await api.post(
        `/admin/employee/verify/${employeeId}`
    )

    return response.data
}


export const deleteDriver = async (
    employeeId: string
) => {

    const response = await api.delete(
        `/admin/employee/${employeeId}`
    )

    return response.data
}