'use client'

import {
    useEffect,
    useRef,
    useState
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import {
    AnimatePresence,
    motion
} from 'framer-motion'

import OrdersTabs from '@/components/admin/OrdersTabs'
import OrdersAreaTabs from '@/components/admin/OrderAreaTabs'
import OrderCard from '@/components/admin/OrderCard'
import SubtleSpinner from '@/components/general/SubtleSpinner'

import {
    getOrdersByArea,
    updateOrderStatus
} from '@/services/orderService'

import {
    Order,
    OrderStatus
} from '@/types/admin/orders'

export default function OrdersPage() {

    const router = useRouter()

    const [status, setStatus] =
        useState<OrderStatus>('pending')

    const [area, setArea] =
        useState('seattle')

    const [orders, setOrders] =
        useState<Order[]>([])

    const [loading, setLoading] =
        useState(false)

    const [refreshing, setRefreshing] =
        useState(false)

    const hasFetchedInitially =
        useRef(false)


    const isFetchingRef = useRef(false)

    const fetchOrders = async () => {

        // prevent duplicate requests
        if (isFetchingRef.current) return

        try {

            isFetchingRef.current = true

            if (!refreshing) {
                setLoading(true)
            }

            const res = await getOrdersByArea(
                area,
                status
            )

            setOrders(res.data.orders || [])

        } catch {

            setOrders([])

            toast.error(
                'Failed to fetch orders'
            )

        } finally {

            setLoading(false)

            isFetchingRef.current = false

        }
    }

    useEffect(() => {
        fetchOrders()
    }, [status, area])

    const handleRefresh = async () => {
        try {

            setRefreshing(true)

            const res = await getOrdersByArea(
                area,
                status
            )

            setOrders(res.data.orders || [])

        } catch {

            toast.error(
                'Failed to refresh orders'
            )

        } finally {

            setRefreshing(false)

        }
    }

    const handleStatusUpdate = async (
        orderId: string,
        nextStatus: 'confirmed' | 'cancelled'
    ) => {

        try {

            const response =
                await updateOrderStatus(
                    orderId,
                    nextStatus
                )

            // ONLY update if backend success
            if (response?.success) {

                // animated remove
                setOrders(prev =>
                    prev.filter(
                        o => o.orderId !== orderId
                    )
                )

                toast.success(
                    `Order ${nextStatus}`
                )

                // sync current list
                const res =
                    await getOrdersByArea(
                        area,
                        status
                    )

                setOrders(
                    res.data.orders || []
                )

            } else {

                toast.error(
                    'Failed to update order'
                )

            }

        } catch {

            toast.error(
                'Failed to update order'
            )

        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-4">

                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>

                <h1 className="text-lg font-bold text-[#1E2A3A]">
                    Orders
                </h1>

            </div>

            {/* MAIN */}
            <div className="max-w-5xl mx-auto px-4 pb-8">

                {/* FILTERS */}
                <div className="flex flex-col items-center gap-5">

                    <OrdersTabs
                        status={status}
                        onChange={setStatus}
                    />

                    <OrdersAreaTabs
                        area={area}
                        onChange={setArea}
                    />

                </div>

                {/* CONTENT */}
                <div className="flex justify-center mt-10">

                    <div className="w-full max-w-xl">

                        {/* TOP */}
                        <div className="flex items-center justify-between mb-4">

                            <h2 className="text-xl font-semibold text-[#1E1E1E]">
                                Total Orders - {orders.length}
                            </h2>

                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="text-[#FF6B00] font-semibold hover:opacity-80 transition-opacity flex items-center gap-2 disabled:opacity-60"
                            >

                                {refreshing && (
                                    <SubtleSpinner size={14} />
                                )}

                                <span>
                                    Refresh
                                </span>

                            </button>

                        </div>

                        {/* ORDERS */}
                        <div className="space-y-4">

                            {loading ? (

                                <div className="bg-white rounded-3xl p-10 flex items-center justify-center shadow-sm">

                                    <div className="flex items-center gap-3 text-gray-400">

                                        <SubtleSpinner size={18} />

                                        <span className="text-sm">
                                            Loading orders...
                                        </span>

                                    </div>

                                </div>

                            ) : !loading &&
                                orders.length === 0 ? (

                                <div className="bg-white rounded-3xl p-10 text-center text-gray-400 shadow-sm">
                                    No orders found
                                </div>

                            ) : (

                                <AnimatePresence mode="popLayout">

                                    {orders.map(order => (

                                        <motion.div
                                            key={order.orderId}

                                            layout

                                            initial={{
                                                opacity: 0,
                                                y: 14,
                                                scale: 0.98
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1
                                            }}

                                            exit={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.96
                                            }}

                                            transition={{
                                                duration: 0.22,
                                                ease: 'easeOut'
                                            }}
                                        >

                                            <OrderCard
                                                order={order}
                                                currentStatus={status}
                                                onConfirm={() =>
                                                    handleStatusUpdate(
                                                        order.orderId,
                                                        'confirmed'
                                                    )
                                                }
                                                onCancel={() =>
                                                    handleStatusUpdate(
                                                        order.orderId,
                                                        'cancelled'
                                                    )
                                                }
                                            />

                                        </motion.div>

                                    ))}

                                </AnimatePresence>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}