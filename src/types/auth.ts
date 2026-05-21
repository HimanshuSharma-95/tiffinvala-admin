export type Role = 'admin' | 'kitchen' | 'driver'

export interface Staff {
    _id: string
    name: string
    email: string
    phone: string
    role: Role
    assignedArea?: string    // ← add this
    status: string
    profile_image: string
    createdAt: string
    updatedAt: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    staff: Staff
    accesstoken: string
    refreshtoken: string
}