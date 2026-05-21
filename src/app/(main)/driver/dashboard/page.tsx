'use client'

import {
    useEffect,
    useState
} from 'react'

import {
    useRouter
} from 'next/navigation'

import {
    LogOut,
    Navigation,
    RefreshCw
} from 'lucide-react'

import {
    toast
} from 'sonner'

import {
    DriverBatch,
    DriverOrder
} from '@/types/driver/route'

import {
    getDriverBatches
} from '@/services/driver/driverService'

import {
    logoutStaff
} from '@/services/authService'

import DriverOrderCard
    from '@/components/driver/DriverOrderCard'

import RouteMapModal
    from '@/components/admin/route/RouteMapModel'

import SingleOrderMapModal
    from '@/components/admin/route/SingleOrderMapModel'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

import {
    useAuthStore
} from '@/store/authStore'

export default function DriverDashboardPage() {

    const router = useRouter()

    const staff =
        useAuthStore(
            state => state.staff
        )

    const logout =
        useAuthStore(
            state => state.logout
        )

    const [
        loading,
        setLoading
    ] = useState(false)

    const [
        logoutLoading,
        setLogoutLoading
    ] = useState(false)

    const [
        batch,
        setBatch
    ] = useState<DriverBatch | null>(null)

    const [
        showRouteMap,
        setShowRouteMap
    ] = useState(false)

    const [
        singleMapOrder,
        setSingleMapOrder
    ] = useState<DriverOrder | null>(null)

    const loadBatches = async () => {

        try {

            setLoading(true)

            const res =
                await getDriverBatches()

            const batches =
                res.data.data.batches || []

            if (batches.length > 0) {

                setBatch(batches[0])

            } else {

                setBatch(null)
            }

        } catch {

            toast.error(
                'Failed to load deliveries'
            )

        } finally {

            setLoading(false)
        }
    }

    const handleLogout =
        async () => {

            try {

                setLogoutLoading(true)

                await logoutStaff()

            } catch {

                // ignore api failure

            } finally {

                logout()

                router.push('/login')

                setLogoutLoading(false)
            }
        }

    useEffect(() => {

        loadBatches()

    }, [])

    if (loading && !batch) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">

                <SubtleSpinner
                    size={28}
                    className="text-[#F97316]"
                />

            </div>
        )
    }

    return (

        <div className="min-h-screen bg-[#FAFAFA] p-4 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                {/* TOP CARD */}

                <div className="bg-white rounded-[28px] p-5 mb-4 border border-gray-100 shadow-sm">

                    <div className="flex flex-col gap-5">

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-3">

                            {/* LEFT */}

                            <div className="min-w-0">

                                <div className="flex items-center gap-2 mb-2">

                                    <div className="w-2 h-2 rounded-full bg-[#F97316]" />

                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F97316]">

                                        Today's Deliveries

                                    </p>

                                </div>

                                <h1 className="text-[16px] leading-none font-bold text-[#1E2A3A] truncate">

                                    {staff?.name}

                                </h1>

                                <p className="text-sm text-gray-400 mt-2 truncate">

                                    {staff?.email}

                                </p>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex items-center gap-2 shrink-0">

                                {/* REFRESH */}

                                <button
                                    onClick={loadBatches}
                                    disabled={loading}
                                    className="w-11 h-11 rounded-2xl bg-[#F6F6F7] active:scale-95 transition-all text-gray-600 flex items-center justify-center"
                                >

                                    {
                                        loading
                                            ? (

                                                <SubtleSpinner
                                                    size={15}
                                                    className="text-gray-600"
                                                />

                                            )
                                            : (

                                                <RefreshCw size={17} />

                                            )
                                    }

                                </button>

                                {/* LOGOUT */}

                                <button
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className="w-11 h-11 rounded-2xl bg-[#F6F6F7] active:scale-95 transition-all text-gray-600 flex items-center justify-center disabled:opacity-70"
                                >

                                    {
                                        logoutLoading
                                            ? (

                                                <SubtleSpinner
                                                    size={15}
                                                    className="text-gray-600"
                                                />

                                            )
                                            : (

                                                <LogOut size={18} />

                                            )
                                    }

                                </button>

                            </div>

                        </div>

                        {/* BOTTOM */}

                        <div className="flex items-center justify-between gap-3">

                            {/* STATS */}

                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-1">

                                {
                                    staff?.assignedArea && (

                                        <div className="shrink-0 px-3 py-1.5 rounded-full bg-[#F6F6F7] text-gray-700 text-xs font-medium">

                                            {staff.assignedArea}

                                        </div>
                                    )
                                }

                                <div className="shrink-0 px-3 py-1.5 rounded-full bg-[#F6F6F7] text-gray-700 text-xs font-medium">

                                    {batch?.orders.length || 0} Orders

                                </div>

                                <div className="shrink-0 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-medium">

                                    {
                                        batch?.orders.filter(
                                            x => x.isorderdelivered
                                        ).length || 0
                                    } Delivered

                                </div>

                            </div>

                            {/* VIEW ROUTE */}

                            {
                                batch && (

                                    <button
                                        onClick={() =>
                                            setShowRouteMap(true)
                                        }
                                        className="h-11 px-4 rounded-2xl bg-[#EEF4FF] text-blue-600 text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 transition-all"
                                    >

                                        <Navigation size={15} />

                                        <span className="hidden sm:block">

                                            View Route

                                        </span>

                                    </button>
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* EMPTY */}

                {
                    !batch && (

                        <div className="bg-white rounded-3xl h-96 flex flex-col items-center justify-center">

                            <h2 className="text-lg font-semibold text-[#1E2A3A]">

                                No Deliveries Assigned

                            </h2>

                            <p className="text-sm text-gray-400 mt-2">

                                Your route will appear here

                            </p>

                        </div>
                    )
                }

                {/* ORDERS */}

                {
                    batch && (

                        <div className="h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide pr-1">

                            <div className="space-y-4">

                                {
                                    batch.orders.map(order => (

                                        <DriverOrderCard
                                            key={order.orderId}
                                            order={order}
                                            onMapClick={() =>
                                                setSingleMapOrder(order)
                                            }
                                            onDeliver={() =>
                                                router.push(
                                                    `/driver/deliver/${order.orderId}?data=${encodeURIComponent(
                                                        JSON.stringify(order)
                                                    )}`
                                                )
                                            }
                                        />
                                    ))
                                }

                            </div>

                        </div>
                    )
                }

            </div>

            {/* ROUTE MAP */}

            {
                showRouteMap &&
                batch && (

                    <RouteMapModal
                        orders={batch.orders}
                        onClose={() =>
                            setShowRouteMap(false)
                        }
                    />
                )
            }

            {/* SINGLE MAP */}

            {/* {
                singleMapOrder && (

                    <SingleOrderMapModal
                        order={singleMapOrder}
                        onClose={() =>
                            setSingleMapOrder(null)
                        }
                    />
                )
            } */}

        </div>
    )
}