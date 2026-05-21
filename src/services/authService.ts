import api from '@/lib/api'
import { LoginData } from '@/types/auth'

export const loginStaff = async (data: LoginData) => {
    const response = await api.post('/admin/employee/login', data)
    return response.data
}

export const logoutStaff = async () => {
    const response = await api.post('/admin/employee/logout')
    return response.data
}