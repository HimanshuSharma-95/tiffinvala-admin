'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export default function UnauthorizedToast() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (searchParams.get('unauthorized') === '1') {
            toast.error('Access Denied', {
                description: "You can visite pages that don't belong to your role",
                duration: 3000,
            })

            const clean = new URLSearchParams(searchParams.toString())
            clean.delete('unauthorized')
            const newUrl = pathname + (clean.toString() ? `?${clean}` : '')
            router.replace(newUrl)
        }
    }, [searchParams, pathname, router])

    return null
}
