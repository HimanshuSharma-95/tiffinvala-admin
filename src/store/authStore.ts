import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Staff, Role } from '@/types/auth'

interface AuthStore {
    staff: Staff | null
    role: Role | null

    setAuth: (staff: Staff) => void
    logout: () => void
    isLoggedIn: () => boolean
    getRole: () => Role | null
    getAssignedArea: () => string | null   // ← add this
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            staff: null,
            role: null,

            setAuth: (staff) => {
                set({ staff, role: staff.role })
                // tiny plain cookie just for middleware to read
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
                document.cookie = `user-role=${staff.role}; expires=${expires}; path=/; SameSite=Strict`
            },

            // logout: () => {
            //     set({ staff: null, role: null })
            //     document.cookie = `user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            // },

            logout: () => {
                set({ staff: null, role: null })

                const expired =
                    'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'

                // Clear cookies
                document.cookie = `user-role=; ${expired}`
                document.cookie = `accesstoken=; ${expired}`
                document.cookie = `refreshtoken=; ${expired}`

                // Optional secure variants
                document.cookie = `user-role=; ${expired}; Secure`
                document.cookie = `accesstoken=; ${expired}; Secure`
                document.cookie = `refreshtoken=; ${expired}; Secure`

                // Clear storage if used
                localStorage.removeItem('accesstoken')
                localStorage.removeItem('refreshtoken')

                sessionStorage.removeItem('accesstoken')
                sessionStorage.removeItem('refreshtoken')
            },

            isLoggedIn: () => !!get().staff,
            getRole: () => get().role,
            getAssignedArea: () => get().staff?.assignedArea || null,  // ← add this
        }),
        { name: 'admin-auth' }
    )
)