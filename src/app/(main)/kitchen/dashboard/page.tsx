
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut, ChefHat } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logoutStaff } from '@/services/authService'
import { getKitchenOrders } from '@/services/orderService'
import KitchenOrderCard from '@/components/kitchen/KitchenOrderCard'
import SubtleSpinner from '@/components/general/SubtleSpinner'
import {
    KitchenOrder,
    KitchenUserGroup,
    AggregatedItem,
    KitchenOrdersResponse,
} from '@/types/admin/kitchen'
import { group } from 'console'

export default function KitchenDashboard() {
    const router = useRouter()
    const { staff, logout, getAssignedArea } = useAuthStore()

    const [mounted, setMounted] = useState(false)
    const area = mounted ? getAssignedArea() : ''

    const [userGroups, setUserGroups] = useState<KitchenUserGroup[]>([])
    const [aggregatedItems, setAggregatedItems] = useState<AggregatedItem[]>([])
    const [totalOrders, setTotalOrders] = useState(0)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const hasFetched = useRef(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (hasFetched.current) return
        hasFetched.current = true
        fetchOrders()
    }, [mounted])

    const fetchOrders = async (isRefresh = false) => {
        if (!area) { toast.error('No area assigned to this kitchen'); return }
        isRefresh ? setRefreshing(true) : setLoading(true)
        try {
            const res = await getKitchenOrders(area)
            const data: KitchenOrdersResponse = res.data
            setUserGroups(data.orders || [])
            setAggregatedItems(data.aggregatedItems || [])
            setTotalOrders(data.pagination.totalOrders)
        } catch {
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleLogout = async () => {
        setLoggingOut(true)
        try { await logoutStaff() } catch { }
        finally { logout(); router.push('/login') }
    }

    // Flatten all orders for rendering
    const allOrders: KitchenOrder[] = userGroups.flatMap(g => g.orders)

    const initials = staff?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'K'

    return (
        <div className="min-h-screen bg-white">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-500">{initials}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1E2A3A]">{staff?.name}</p>
                        <div className="flex items-center gap-1.5">
                            <ChefHat size={11} className="text-gray-400" />
                            <p className="text-xs text-gray-400 capitalize">
                                Kitchen · {mounted ? area?.replace('_', ' ') : '...'}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="h-9 px-4 rounded-full bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loggingOut
                        ? <SubtleSpinner size={13} className="text-red-400" />
                        : <LogOut size={14} className="text-red-400" />
                    }
                    <span className="text-sm font-medium text-[#1E2A3A]">Logout</span>
                </button>
            </div>

            {/* AREA BADGE */}
            <div className="px-4 py-3 flex items-center gap-2">
                <span className="text-xs bg-orange-100 text-[#F97316] font-semibold px-3 py-1 rounded-full capitalize">
                    {mounted ? area?.replace('_', ' ') : '...'} Kitchen
                </span>
                <span className="text-xs text-gray-400">
                    {loading ? '...' : `${totalOrders} order${totalOrders !== 1 ? 's' : ''}`}
                </span>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pb-10">
                    <div className="w-full max-w-2xl mx-auto space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white w-full rounded-3xl p-5 border border-gray-100 animate-pulse">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="space-y-2">
                                        <div className="h-4 w-28 bg-gray-200 rounded-full" />
                                        <div className="h-3 w-20 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="space-y-2 flex flex-col items-end">
                                        <div className="h-4 w-16 bg-gray-200 rounded-full" />
                                        <div className="h-3 w-12 bg-gray-100 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(j => (
                                        <div key={j} className="flex items-center justify-between">
                                            <div className="h-3 w-40 bg-gray-100 rounded-full" />
                                            <div className="h-3 w-8 bg-gray-200 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden xl:flex justify-center">
                        <div className="w-full max-w-55 space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center justify-between animate-pulse">
                                    <div className="h-3 w-24 bg-gray-100 rounded-full" />
                                    <div className="h-3 w-8 bg-gray-200 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            ) : allOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 gap-3 px-6">
                    <ChefHat size={40} className="text-gray-200" />
                    <p className="text-sm text-gray-400">No orders right now</p>
                </div>

            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pb-10">

                    {/* SUMMARY — right on desktop, top on mobile */}
                    <div className="w-full xl:flex xl:justify-center order-first xl:order-last">

                        {/* Mobile */}
                        <div className="xl:hidden mb-5">
                            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-[#1E2A3A]">Summary</h2>
                                    <span className="text-xs text-orange-400">{aggregatedItems.length} items</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                                    {aggregatedItems.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm gap-2">
                                            <span className="text-[#1E1E1E] truncate">{item.name}</span>
                                            <span className="text-[#F97316] font-semibold shrink-0">× {item.total16ozEquivalent}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* {aggregatedItems.some(i => Object.keys(i.variants).length > 1) && (
                                    <div className="mt-3 pt-3 border-t border-orange-100 space-y-1.5">
                                        {aggregatedItems.map((item, i) =>
                                            Object.keys(item.variants).length > 1 ? (
                                                <div key={i} className="text-xs text-gray-400">
                                                    <span className="font-medium text-[#1E1E1E]">{item.name}: </span>
                                                    {Object.entries(item.variants).map(([size, qty]) => (
                                                        <span key={size}>{size} ×{qty} </span>
                                                    ))}
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Desktop */}
                        <div className="hidden xl:block sticky top-4 w-full max-w-55 h-fit">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-sm font-semibold text-[#1E2A3A]">Summary</h2>
                                <span className="text-xs text-gray-400">{aggregatedItems.length} items</span>
                            </div>
                            <div className="space-y-2">
                                {aggregatedItems.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#1E1E1E] truncate">{item.name}</span>
                                            <span className="text-[#F97316] font-semibold shrink-0 ml-3">× {item.total16ozEquivalent}</span>
                                        </div>
                                        {/* Size breakdown if multiple variants */}
                                        {/* {Object.keys(item.variants).length > 1 && (
                                            <div className="mt-0.5 ml-1 space-y-0.5">
                                                {Object.entries(item.variants).map(([size, qty]) => (
                                                    <p key={size} className="text-[11px] text-gray-400">
                                                        {size}: ×{qty}
                                                    </p>
                                                ))}
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ORDERS — left */}
                    <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[calc(100vh-170px)] pr-1">

                        {/* Sticky top bar */}
                        <div className="w-full bg-white sticky top-0 z-10 pb-4">
                            <div className="flex items-center justify-between rounded-3xl border border-orange-100 bg-orange-50 px-4 py-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-[#1E2A3A]">Orders</h2>
                                    <p className="text-xs text-orange-400 mt-0.5">{totalOrders} confirmed order{totalOrders !== 1 ? 's' : ''}</p>
                                </div>
                                <button
                                    onClick={() => fetchOrders(true)}
                                    disabled={refreshing}
                                    className="h-9 px-4 rounded-full bg-[#FF6B00] text-white flex items-center gap-2 disabled:opacity-60"
                                >
                                    {refreshing && <SubtleSpinner size={12} className="text-white" />}
                                    <span className="text-xs font-semibold">Refresh</span>
                                </button>
                            </div>
                        </div>

                        {/* Order cards */}
                        {/* <div className="space-y-3">
                            {allOrders.map(order => (
                                <KitchenOrderCard 
                                name={}
                                city={}
                                key={order.orderId} 
                                order={order} 
                                showCustomerDetails={false} />
                            ))}
                        </div> */}

                        {userGroups.map((group, gi) => (

                            <div
                                key={`${group.username}-${gi}`}
                                className="space-y-3 py-2"
                            >

                                {group.orders.map((order, oi) => (

                                    <KitchenOrderCard
                                        key={`${order.orderId}-${oi}`}
                                        name={group.full_name}
                                        city={group.city}
                                        order={order}
                                        showCustomerDetails={false}
                                    />

                                ))}

                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}