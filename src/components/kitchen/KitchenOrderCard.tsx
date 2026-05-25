'use client'

import { useState } from 'react'
import { Clock3, User, X, MapPin, Phone, Mail, Loader2 } from 'lucide-react'
import { KitchenOrder, KitchenUserGroup, OrderUserDetails } from '@/types/admin/kitchen'
import { getOrderUserDetails } from '@/services/orderService'
import { toast } from 'sonner'

interface Props {
    name: string,
    city: string,
    order: KitchenOrder
    showCustomerDetails?: boolean
}

export default function KitchenOrderCard({
    name,
    city,
    order,
    showCustomerDetails = true
}: Props) {
    const [showDetails, setShowDetails] = useState(false)
    const [details, setDetails] = useState<OrderUserDetails | null>(null)
    const [loadingDetails, setLoadingDetails] = useState(false)

    const formattedTime = new Date(order.placedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })

    const handleCustomerDetails = async () => {
        setShowDetails(true)
        if (details) return
        setLoadingDetails(true)
        try {
            const res = await getOrderUserDetails(order.orderId)
            // res is ApiResponse wrapper → res.data is OrderUserDetails
            setDetails(res.data)
        } catch {
            toast.error('Failed to load customer details')
            setShowDetails(false)
        } finally {
            setLoadingDetails(false)
        }
    }

    const items = order?.items ?? []

    const userInitials = details?.user?.full_name
        ?.split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase() ?? '?'

    return (
        <>
            <div className="bg-gray-100 w-full max-w-xl rounded-3xl p-5 border border-gray-100 mx-auto">


                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 mb-3">

                    <div className="min-w-0">

                        {/* NAME */}
                        <p className="text-sm font-semibold text-[#1E1E1E] truncate">

                            {name}

                        </p>

                        {/* USERNAME */}
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">

                            Username : {order.username}

                        </p>

                        {/* CITY */}
                        {city && (

                            <p className="text-xs font-semibold text-gray-500 mt-0.5">

                                City : {city}

                            </p>

                        )}

                    </div>

                    <div className="text-right shrink-0">

                        <p className="text-xs text-gray-400 capitalize">

                            {order.status}

                        </p>

                    </div>

                </div>


                {/* ITEMS */}
                {items.length > 0 ? (
                    <div className="space-y-2 mb-4">

                        {items.map((item, index) => (

                            <div
                                key={`${order.orderId}-${item.name}-${index}`}
                                className="py-2"
                            >

                                {/* MAIN ITEM */}
                                <div className="flex items-center justify-between gap-3 text-sm">

                                    <div className="min-w-0 flex items-center gap-2 flex-wrap">

                                        <p className="text-[#1E1E1E] truncate font-semibold">
                                            {item.name}
                                        </p>

                                        {item.variant?.size &&
                                            item.variant.size !== 'default' && (

                                                <p className="text-[11px] text-gray-400 capitalize">

                                                    ({item.variant.size})

                                                </p>

                                            )}

                                    </div>

                                    <span className="text-[#F97316] shrink-0 font-semibold">

                                        × {item.quantity}

                                    </span>

                                </div>

                                {/* COMBO ITEMS */}
                                {item.type === 'combo' &&
                                    item.selections &&
                                    item.selections.length > 0 && (

                                        <div className="mt-2 ml-3 border-l border-orange-100 pl-3 space-y-1.5">

                                            {item.selections.map((selection, sIndex) => (

                                                <div
                                                    key={`${selection.ruleId}-${sIndex}`}
                                                    className="space-y-1"
                                                >

                                                    {selection.products.map((product, pIndex) => (

                                                        <div
                                                            key={`${product.productId}-${pIndex}`}
                                                            className="flex items-center justify-between gap-3"
                                                        >

                                                            <div className="flex items-center gap-2 min-w-0">

                                                                <div className="w-1 h-1 rounded-full bg-orange-300 shrink-0" />

                                                                <p className="text-[12px] text-gray-500 truncate">

                                                                    {product.name}

                                                                </p>

                                                            </div>

                                                            <span className="text-[11px] text-gray-400 shrink-0">

                                                                × {product.quantity}

                                                            </span>

                                                        </div>

                                                    ))}

                                                </div>

                                            ))}

                                        </div>

                                    )}

                            </div>

                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 mb-4">
                        No items
                    </p>
                )}

                {/* FOOTER */}
                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">

                    <span className="text-xs text-gray-400">

                        #{order.orderId.slice(-6)}

                    </span>

                    {showCustomerDetails && (

                        <button
                            onClick={handleCustomerDetails}
                            className="flex items-center gap-1 text-xs text-[#F97316] font-medium"
                        >

                            <User size={12} />

                            Customer Details

                        </button>

                    )}

                </div>
            </div>

            {/* MODAL */}
            {showDetails && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-[#1E1E1E]">Customer Details</h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {loadingDetails ? (
                            <div className="flex justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-[#F97316]" />
                            </div>
                        ) : details ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-orange-400">{userInitials}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1E2A3A]">{details.user?.full_name}</p>
                                        <p className="text-xs text-gray-400">@{details.user?.username}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <Mail size={14} className="text-gray-400 shrink-0" />
                                        <p className="text-sm text-[#1E2A3A] truncate">{details.user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <Phone size={14} className="text-gray-400 shrink-0" />
                                        <p className="text-sm text-[#1E2A3A]">{details.user?.phone_number}</p>
                                    </div>
                                    {details.deliveryDetails && (
                                        <div className="flex items-start gap-3 px-4 py-3">
                                            <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-[#1E2A3A]">{details.deliveryDetails.addressLine1}</p>
                                                {details.deliveryDetails.addressLine2 && (
                                                    <p className="text-sm text-[#1E2A3A]">{details.deliveryDetails.addressLine2}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {details.deliveryDetails.city}, {details.deliveryDetails.state} {details.deliveryDetails.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between bg-orange-50 rounded-2xl px-4 py-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Total Amount</p>
                                        <p className="text-sm font-bold text-[#1E2A3A]">${details.totalAmount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Payment</p>
                                        <p className="text-sm font-semibold text-[#F97316] capitalize">{details.payment?.status}</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    )
}