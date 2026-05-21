import { Suspense } from 'react'
import UnauthorizedToast from '@/components/general/UnauthorizedToast'
import NavBar from '@/components/layout/NavBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <NavBar /> */}
            <Suspense>  {/* required because it uses useSearchParams */}
                <UnauthorizedToast />
            </Suspense>
            {children}
        </>
    )
}