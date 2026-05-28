// 'use client'

// import { useEffect, useState } from 'react'

// import { toast } from 'sonner'

// import {
//     ChefHat,
//     ArrowLeft
// } from 'lucide-react'

// import {
//     getKitchenOrders
// } from '@/services/orderService'

// import KitchenAreaTabs
//     from '@/components/admin/KitchenAreaTabs'

// import KitchenOrderCard
//     from '@/components/kitchen/KitchenOrderCard'

// import SubtleSpinner
//     from '@/components/general/SubtleSpinner'

// import {
//     KitchenUserGroup,
//     AggregatedItem,
//     KitchenOrdersResponse,
// } from '@/types/admin/kitchen'

// export default function AdminKitchenPage() {

//     const [area, setArea] =
//         useState('seattle')

//     const [userGroups, setUserGroups] =
//         useState<KitchenUserGroup[]>([])

//     const [aggregatedItems,
//         setAggregatedItems] =
//         useState<AggregatedItem[]>([])

//     const [totalOrders, setTotalOrders] =
//         useState(0)

//     const [loading, setLoading] =
//         useState(true)

//     const [refreshing, setRefreshing] =
//         useState(false)

//     useEffect(() => {

//         fetchOrders()

//     }, [area])

//     const fetchOrders = async (
//         isRefresh = false
//     ) => {

//         isRefresh
//             ? setRefreshing(true)
//             : setLoading(true)

//         try {

//             const res =
//                 await getKitchenOrders(area)

//             const data: KitchenOrdersResponse =
//                 res.data

//             setUserGroups(
//                 data.orders ?? []
//             )

//             setAggregatedItems(
//                 data.aggregatedItems ?? []
//             )

//             setTotalOrders(
//                 data.pagination?.totalOrders ?? 0
//             )

//         } catch (e) {

//             console.error(
//                 'Kitchen fetch error:',
//                 e
//             )

//             toast.error(
//                 'Failed to load orders'
//             )

//             setUserGroups([])

//             setAggregatedItems([])

//             setTotalOrders(0)

//         } finally {

//             setLoading(false)

//             setRefreshing(false)
//         }
//     }

//     const hasOrders =
//         userGroups.some(
//             g => (g.orders ?? []).length > 0
//         )

//     return (
//         <div className="min-h-screen bg-white">

//             {/* TOP BAR */}
//             <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3">

//                 <div className="flex items-center justify-between">

//                     <div>

//                         <div className="flex items-center gap-2">

//                             <button
//                                 onClick={() =>
//                                     window.history.back()
//                                 }
//                                 className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
//                             >

//                                 <ArrowLeft
//                                     size={16}
//                                     className="text-[#1E2A3A]"
//                                 />

//                             </button>

//                             <h1 className="text-base font-bold text-[#1E2A3A]">

//                                 Admin Kitchen

//                             </h1>

//                         </div>

//                         <p className="text-xs text-gray-400 mt-0.5 ml-10">

//                             {loading
//                                 ? '...'
//                                 : `${totalOrders} order${totalOrders !== 1 ? 's' : ''} today`
//                             }

//                         </p>

//                     </div>

//                     {/* <button
//                         onClick={() =>
//                             fetchOrders(true)
//                         }
//                         disabled={
//                             refreshing || loading
//                         }
//                         className="h-9 px-4 rounded-full bg-[#FF6B00] text-white flex items-center gap-2 disabled:opacity-60 text-xs font-semibold"
//                     >

//                         {refreshing && (

//                             <SubtleSpinner
//                                 size={12}
//                                 className="text-white"
//                             />

//                         )}

//                         Refresh

//                     </button> */}

//                 </div>

//                 <KitchenAreaTabs
//                     area={area}
//                     onChange={(v) => {

//                         if (v === area) return

//                         setArea(v)

//                         setLoading(true)

//                     }}
//                 />

//             </div>

//             {loading ? (

//                 <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pt-5 pb-10">

//                     {/* ORDER SKELETONS */}
//                     <div className="w-full max-w-2xl mx-auto space-y-3">

//                         {[1, 2, 3].map(i => (

//                             <div
//                                 key={i}
//                                 className="bg-white w-full rounded-3xl p-5 border border-gray-100 animate-pulse"
//                             >

//                                 <div className="flex items-start justify-between mb-5">

//                                     <div className="space-y-2">

//                                         <div className="h-4 w-28 bg-gray-200 rounded-full" />

//                                         <div className="h-3 w-20 bg-gray-100 rounded-full" />

//                                     </div>

//                                     <div className="space-y-2 flex flex-col items-end">

//                                         <div className="h-4 w-16 bg-gray-200 rounded-full" />

//                                         <div className="h-3 w-12 bg-gray-100 rounded-full" />

//                                     </div>

//                                 </div>

//                                 <div className="space-y-3">

//                                     {[1, 2].map(j => (

//                                         <div
//                                             key={j}
//                                             className="flex items-center justify-between"
//                                         >

//                                             <div className="h-3 w-40 bg-gray-100 rounded-full" />

//                                             <div className="h-3 w-8 bg-gray-200 rounded-full" />

//                                         </div>

//                                     ))}

//                                 </div>

//                             </div>

//                         ))}

//                     </div>

//                     {/* SUMMARY SKELETON */}
//                     <div className="hidden xl:flex justify-center">

//                         <div className="w-full max-w-55 space-y-3">

//                             {[1, 2, 3, 4, 5].map(i => (

//                                 <div
//                                     key={i}
//                                     className="flex items-center justify-between animate-pulse"
//                                 >

//                                     <div className="h-3 w-24 bg-gray-100 rounded-full" />

//                                     <div className="h-3 w-8 bg-gray-200 rounded-full" />

//                                 </div>

//                             ))}

//                         </div>

//                     </div>

//                 </div>

//             ) : !hasOrders ? (

//                 <div className="flex flex-col items-center justify-center mt-20 gap-3 px-6">

//                     <ChefHat
//                         size={40}
//                         className="text-gray-200"
//                     />

//                     <p className="text-sm text-gray-400">

//                         No orders for {area.replace('_', ' ')}

//                     </p>

//                 </div>

//             ) : (

//                 <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pt-5 pb-10">

//                     {/* SUMMARY */}
//                     <div className="w-full xl:flex xl:justify-center order-first xl:order-last">

//                         {/* MOBILE */}
//                         <div className="xl:hidden mb-5">

//                             <div className="bg-orange-50 border border-orange-100 rounded-3xl p-4">

//                                 <div className="flex items-center justify-between mb-3">

//                                     <h2 className="text-sm font-semibold text-[#1E2A3A]">

//                                         Summary

//                                     </h2>

//                                     <span className="text-xs text-orange-400">

//                                         {aggregatedItems.length} items

//                                     </span>

//                                 </div>

//                                 <div className="grid grid-cols-2 gap-x-5 gap-y-2">

//                                     {aggregatedItems.map((item, i) => (

//                                         <div
//                                             key={`${item.name}-${i}`}
//                                             className="flex items-center justify-between text-sm gap-2"
//                                         >

//                                             <span className="text-[#1E1E1E] truncate">

//                                                 {item.name}

//                                             </span>

//                                             <span className="text-[#F97316] font-semibold shrink-0">

//                                                 × {item.total16ozEquivalent}

//                                             </span>

//                                         </div>

//                                     ))}

//                                 </div>

//                             </div>

//                         </div>

//                         {/* DESKTOP */}
//                         <div className="hidden xl:block sticky top-4 w-full max-w-55 h-fit">

//                             <div className="flex items-center justify-between mb-4 px-1">

//                                 <h2 className="text-sm font-semibold text-[#1E2A3A]">

//                                     Summary

//                                 </h2>

//                                 <span className="text-xs text-gray-400">

//                                     {aggregatedItems.length} items

//                                 </span>

//                             </div>

//                             <div className="space-y-2">

//                                 {aggregatedItems.map((item, i) => (

//                                     <div
//                                         key={`${item.name}-${item.category}-${i}`}
//                                     >

//                                         <div className="flex items-center justify-between text-sm">

//                                             <span className="text-[#1E1E1E] truncate">

//                                                 {item.name}

//                                             </span>

//                                             <span className="text-[#F97316] font-semibold shrink-0 ml-3">

//                                                 × {item.total16ozEquivalent}

//                                             </span>

//                                         </div>

//                                         {/* {Object.keys(item.variants).length > 1 && (

//                                             <div className="mt-0.5 ml-1 space-y-0.5">

//                                                 {Object.entries(item.variants).map(([size, qty]) => (

//                                                     <p
//                                                         key={`${item.name}-${size}`}
//                                                         className="text-[11px] text-gray-400"
//                                                     >

//                                                         {size}: ×{qty}

//                                                     </p>

//                                                 ))}

//                                             </div>

//                                         )} */}

//                                     </div>

//                                 ))}

//                             </div>

//                         </div>

//                     </div>

//                     {/* ORDERS */}
//                     <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[calc(100vh-200px)] pr-1">

//                         {/* HEADER */}
//                         <div className="w-full bg-white sticky top-0 z-10 pb-4">

//                             <div className="flex items-center justify-between rounded-3xl border border-orange-100 bg-orange-50 px-4 py-3">

//                                 <div>

//                                     <h2 className="text-sm font-semibold text-[#1E2A3A]">

//                                         Orders

//                                     </h2>

//                                     <p className="text-xs text-orange-400 mt-0.5">

//                                         {totalOrders} confirmed order{totalOrders !== 1 ? 's' : ''}

//                                     </p>

//                                 </div>

//                                 <button
//                                     onClick={() =>
//                                         fetchOrders(true)
//                                     }
//                                     disabled={refreshing}
//                                     className="h-9 px-4 rounded-full bg-[#FF6B00] text-white flex items-center gap-2 disabled:opacity-60"
//                                 >

//                                     {refreshing && (

//                                         <SubtleSpinner
//                                             size={12}
//                                             className="text-white"
//                                         />

//                                     )}

//                                     <span className="text-xs font-semibold">

//                                         Refresh

//                                     </span>

//                                 </button>

//                             </div>

//                         </div>

//                         {/* GROUPED ORDERS */}
//                         <div className="space-y-6">

//                             {userGroups.map((group, gi) => {

//                                 const orders =
//                                     group.orders ?? []

//                                 if (orders.length === 0)
//                                     return null

//                                 return (

//                                     <div
//                                         key={`${group.username}-${gi}`}
//                                     >


//                                         {/* USER HEADER */}
//                                         <div className="flex items-center gap-2 mb-3 px-1">

//                                             <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">

//                                                 <span className="text-[10px] font-bold text-orange-400">

//                                                     {group.username?.[0]?.toUpperCase() ?? '?'}

//                                                 </span>

//                                             </div>

//                                             <span className="text-sm font-semibold text-[#1E2A3A]">

//                                                 {group.username}

//                                             </span>

//                                             <span className="text-xs text-gray-400">

//                                                 {orders.length} order{orders.length !== 1 ? 's' : ''}

//                                             </span>

//                                             <div className="flex-1 border-t border-gray-100" />

//                                         </div>

//                                         {/* ORDERS LIST */}
//                                         <div className="space-y-3">

//                                             {orders.map((order, oi) => (

//                                                 <KitchenOrderCard
//                                                     key={`${order.orderId}-${oi}`}
//                                                     name={group.full_name}
//                                                     city={group.city}
//                                                     order={order}
//                                                 />

//                                             ))}

//                                         </div>

//                                     </div>

//                                 )

//                             })}

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </div>
//     )
// }

































'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import {
    ChefHat,
    ArrowLeft,
    Download,
} from 'lucide-react'

import {
    getKitchenOrders
} from '@/services/orderService'

import KitchenAreaTabs
    from '@/components/admin/KitchenAreaTabs'

import KitchenOrderCard
    from '@/components/kitchen/KitchenOrderCard'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

import {
    KitchenUserGroup,
    AggregatedItem,
    KitchenOrdersResponse,
} from '@/types/admin/kitchen'

export default function AdminKitchenPage() {

    const [area, setArea] =
        useState('seattle')

    const [userGroups, setUserGroups] =
        useState<KitchenUserGroup[]>([])

    const [aggregatedItems,
        setAggregatedItems] =
        useState<AggregatedItem[]>([])

    const [totalOrders, setTotalOrders] =
        useState(0)

    const [loading, setLoading] =
        useState(true)

    const [refreshing, setRefreshing] =
        useState(false)

    const [pdfLoading, setPdfLoading] =
        useState(false)

    useEffect(() => {

        fetchOrders()

    }, [area])

    const fetchOrders = async (
        isRefresh = false
    ) => {

        isRefresh
            ? setRefreshing(true)
            : setLoading(true)

        try {

            const res =
                await getKitchenOrders(area)

            const data: KitchenOrdersResponse =
                res.data

            setUserGroups(
                data.orders ?? []
            )

            setAggregatedItems(
                data.aggregatedItems ?? []
            )

            setTotalOrders(
                data.pagination?.totalOrders ?? 0
            )

        } catch (e) {

            console.error(
                'Kitchen fetch error:',
                e
            )

            toast.error(
                'Failed to load orders'
            )

            setUserGroups([])

            setAggregatedItems([])

            setTotalOrders(0)

        } finally {

            setLoading(false)

            setRefreshing(false)
        }
    }

    const handleDownloadPdf = async () => {

        if (pdfLoading) return

        setPdfLoading(true)

        try {

            // Lazy-import so jsPDF is not in the initial bundle
            const { generateKitchenPdf } =
                await import('@/utils/generateKitchenPdf')

            generateKitchenPdf(
                area,
                userGroups,
                aggregatedItems,
                totalOrders,
            )

            toast.success('PDF downloaded!')

        } catch (err) {

            console.error('PDF error:', err)

            toast.error('Failed to generate PDF')
        } finally {

            setPdfLoading(false)

        }

    }

    const hasOrders =
        userGroups.some(
            g => (g.orders ?? []).length > 0
        )

    return (
        <div className="min-h-screen bg-white">

            {/* TOP BAR */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3">

                <div className="flex items-center justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <button
                                onClick={() =>
                                    window.history.back()
                                }
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                            >

                                <ArrowLeft
                                    size={16}
                                    className="text-[#1E2A3A]"
                                />

                            </button>

                            <h1 className="text-base font-bold text-[#1E2A3A]">

                                Admin Kitchen

                            </h1>

                        </div>

                        <p className="text-xs text-gray-400 mt-0.5 ml-10">

                            {loading
                                ? '...'
                                : `${totalOrders} order${totalOrders !== 1 ? 's' : ''} today`
                            }

                        </p>

                    </div>

                    {/* DOWNLOAD PDF BUTTON */}
                    <button
                        onClick={handleDownloadPdf}
                        disabled={loading || pdfLoading || !hasOrders}
                        className="h-9 px-4 rounded-full bg-[#1E2A3A] text-white flex items-center gap-2 disabled:opacity-40 text-xs font-semibold hover:bg-[#2d3f57] transition"
                    >

                        {pdfLoading ? (

                            <SubtleSpinner
                                size={12}
                                className="text-white"
                            />

                        ) : (

                            <Download size={13} />

                        )}

                        <span>
                            {pdfLoading ? 'Generating…' : 'Download PDF'}
                        </span>

                    </button>

                </div>

                <KitchenAreaTabs
                    area={area}
                    onChange={(v) => {

                        if (v === area) return

                        setArea(v)

                        setLoading(true)

                    }}
                />

            </div>

            {loading ? (

                <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pt-5 pb-10">

                    {/* ORDER SKELETONS */}
                    <div className="w-full max-w-2xl mx-auto space-y-3">

                        {[1, 2, 3].map(i => (

                            <div
                                key={i}
                                className="bg-white w-full rounded-3xl p-5 border border-gray-100 animate-pulse"
                            >

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

                                    {[1, 2].map(j => (

                                        <div
                                            key={j}
                                            className="flex items-center justify-between"
                                        >

                                            <div className="h-3 w-40 bg-gray-100 rounded-full" />

                                            <div className="h-3 w-8 bg-gray-200 rounded-full" />

                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* SUMMARY SKELETON */}
                    <div className="hidden xl:flex justify-center">

                        <div className="w-full max-w-55 space-y-3">

                            {[1, 2, 3, 4, 5].map(i => (

                                <div
                                    key={i}
                                    className="flex items-center justify-between animate-pulse"
                                >

                                    <div className="h-3 w-24 bg-gray-100 rounded-full" />

                                    <div className="h-3 w-8 bg-gray-200 rounded-full" />

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            ) : !hasOrders ? (

                <div className="flex flex-col items-center justify-center mt-20 gap-3 px-6">

                    <ChefHat
                        size={40}
                        className="text-gray-200"
                    />

                    <p className="text-sm text-gray-400">

                        No orders for {area.replace('_', ' ')}

                    </p>

                </div>

            ) : (

                <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_240px] gap-5 xl:gap-6 px-4 pt-5 pb-10">

                    {/* SUMMARY */}
                    <div className="w-full xl:flex xl:justify-center order-first xl:order-last">

                        {/* MOBILE */}
                        <div className="xl:hidden mb-5">

                            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-4">

                                <div className="flex items-center justify-between mb-3">

                                    <h2 className="text-sm font-semibold text-[#1E2A3A]">

                                        Summary

                                    </h2>

                                    <span className="text-xs text-orange-400">

                                        {aggregatedItems.length} items

                                    </span>

                                </div>

                                <div className="grid grid-cols-2 gap-x-5 gap-y-2">

                                    {aggregatedItems.map((item, i) => (

                                        <div
                                            key={`${item.name}-${i}`}
                                            className="flex items-center justify-between text-sm gap-2"
                                        >

                                            <span className="text-[#1E1E1E] truncate">

                                                {item.name}

                                            </span>

                                            <span className="text-[#F97316] font-semibold shrink-0">

                                                × {item.total16ozEquivalent}

                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                        {/* DESKTOP */}
                        <div className="hidden xl:block sticky top-4 w-full max-w-55 h-fit">

                            <div className="flex items-center justify-between mb-4 px-1">

                                <h2 className="text-sm font-semibold text-[#1E2A3A]">

                                    Summary

                                </h2>

                                <span className="text-xs text-gray-400">

                                    {aggregatedItems.length} items

                                </span>

                            </div>

                            <div className="space-y-2">

                                {aggregatedItems.map((item, i) => (

                                    <div
                                        key={`${item.name}-${item.category}-${i}`}
                                    >

                                        <div className="flex items-center justify-between text-sm">

                                            <span className="text-[#1E1E1E] truncate">

                                                {item.name}

                                            </span>

                                            <span className="text-[#F97316] font-semibold shrink-0 ml-3">

                                                × {item.total16ozEquivalent}

                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                    {/* ORDERS */}
                    <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[calc(100vh-200px)] pr-1">

                        {/* HEADER */}
                        <div className="w-full bg-white sticky top-0 z-10 pb-4">

                            <div className="flex items-center justify-between rounded-3xl border border-orange-100 bg-orange-50 px-4 py-3">

                                <div>

                                    <h2 className="text-sm font-semibold text-[#1E2A3A]">

                                        Orders

                                    </h2>

                                    <p className="text-xs text-orange-400 mt-0.5">

                                        {totalOrders} confirmed order{totalOrders !== 1 ? 's' : ''}

                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        fetchOrders(true)
                                    }
                                    disabled={refreshing}
                                    className="h-9 px-4 rounded-full bg-[#FF6B00] text-white flex items-center gap-2 disabled:opacity-60"
                                >

                                    {refreshing && (

                                        <SubtleSpinner
                                            size={12}
                                            className="text-white"
                                        />

                                    )}

                                    <span className="text-xs font-semibold">

                                        Refresh

                                    </span>

                                </button>

                            </div>

                        </div>

                        {/* GROUPED ORDERS */}
                        <div className="space-y-6">

                            {userGroups.map((group, gi) => {

                                const orders =
                                    group.orders ?? []

                                if (orders.length === 0)
                                    return null

                                return (

                                    <div
                                        key={`${group.username}-${gi}`}
                                    >


                                        {/* USER HEADER */}
                                        <div className="flex items-center gap-2 mb-3 px-1">

                                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">

                                                <span className="text-[10px] font-bold text-orange-400">

                                                    {group.username?.[0]?.toUpperCase() ?? '?'}

                                                </span>

                                            </div>

                                            <span className="text-sm font-semibold text-[#1E2A3A]">

                                                {group.username}

                                            </span>

                                            <span className="text-xs text-gray-400">

                                                {orders.length} order{orders.length !== 1 ? 's' : ''}

                                            </span>

                                            <div className="flex-1 border-t border-gray-100" />

                                        </div>

                                        {/* ORDERS LIST */}
                                        <div className="space-y-3">

                                            {orders.map((order, oi) => (

                                                <KitchenOrderCard
                                                    key={`${order.orderId}-${oi}`}
                                                    name={group.full_name}
                                                    city={group.city}
                                                    order={order}
                                                />

                                            ))}

                                        </div>

                                    </div>

                                )

                            })}

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}