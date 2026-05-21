'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const ROLE_REDIRECT = {
  admin: '/admin/dashboard',
  kitchen: '/kitchen/dashboard',
  driver: '/driver/dashboard',
}

export default function RootPage() {
  const router = useRouter()
  const { isLoggedIn, getRole } = useAuthStore()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
      return
    }

    const role = getRole()
    if (role && ROLE_REDIRECT[role]) {
      router.replace(ROLE_REDIRECT[role])
    } else {
      router.replace('/login')
    }
  }, [])

  return null
}