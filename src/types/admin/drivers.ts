export interface Driver {
    employeeId: string
    name: string
    username: string
    email: string
    phone: string
    role: string
    assignedArea: string
    isDriverAvailable: boolean
    status: string
    profile_image: string
    createdAt: string
}

export interface DriversResponse {
    filters: {
        status: string
        assignedArea: string
        isDriverAvailable: boolean | null
        search: string | null
    }

    totalDrivers: number

    drivers: Driver[]
}

export interface CreateDriverPayload {
    name: string
    email: string
    phone: string
    password: string
    role: 'driver'
    assignedArea: 'seattle' | 'bay_area'
}