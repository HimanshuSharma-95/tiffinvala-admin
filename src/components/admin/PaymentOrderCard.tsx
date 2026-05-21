'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import {
    Loader2,
    User,
    X,
    Mail,
    Phone,
    MapPin
} from 'lucide-react'

import {
    updatePaymentStatus
} from '@/services/paymentService'

import {
    getOrderUserDetails
} from '@/services/orderService'

import {
    PaymentOrder
} from '@/types/admin/payment'

interface Props {
    order: PaymentOrder
    onPaid: () => void
}

export default function PaymentOrderCard({
    order,
    onPaid
}: Props) {

    const [loading, setLoading] =
        useState(false)

    const [detailsLoading, setDetailsLoading] =
        useState(false)

    const [showDetails, setShowDetails] =
        useState(false)

    const [details, setDetails] =
        useState<any>(null)

    const handleMarkPaid = async () => {

        setLoading(true)

        try {

            await updatePaymentStatus(
                order.orderId,
                order.payment.status === 'paid'
                    ? 'pending'
                    : 'paid'
            )

            toast.success(
                'Payment updated'
            )

            onPaid()

        } catch {

            toast.error(
                'Failed to update payment'
            )

        } finally {

            setLoading(false)
        }
    }

    const handleCustomerDetails = async () => {

        setShowDetails(true)

        if (details) return

        setDetailsLoading(true)

        try {

            const res =
                await getOrderUserDetails(
                    order.orderId
                )

            setDetails(res.data)

        } catch {

            toast.error(
                'Failed to load customer details'
            )

        } finally {

            setDetailsLoading(false)
        }
    }

    return (
        <>
            <div className="bg-gray-100 border border-gray-100 rounded-3xl max-w-2xl mx-auto p-5">

                <div className="flex flex-col">

                    {/* USER */}
                    <div className="mb-3">

                        <h3 className="font-semibold text-[15px] text-[#1E1E1E]">

                            {order.user.name}

                        </h3>

                        <p className="text-[11px] text-gray-400 mt-0.5">

                            Username : {order.user.username}

                        </p>

                    </div>

                    {/* ORDER SUMMARY */}
                    {/* ORDER SUMMARY */}
                    <div className="space-y-2">

                        {order.items.map((item, i) => (

                            <div
                                key={`${item.name}-${i}`}
                                className="text-sm"
                            >

                                {/* MAIN ITEM */}
                                <div className="flex items-center justify-between gap-3">

                                    <div className="flex items-center gap-1 min-w-0 flex-wrap">

                                        <p className="text-[#1E1E1E] truncate font-medium text-[13px]">

                                            {item.name}

                                        </p>

                                        {item.variant?.size !== 'default' && (

                                            <p className="text-[10px] text-gray-400 shrink-0">

                                                ({item.variant.size})

                                            </p>

                                        )}

                                    </div>

                                    <span className="text-[#FF6B00] font-semibold text-[12px] shrink-0">

                                        ×{item.quantity}

                                    </span>

                                </div>

                                {/* COMBO ITEMS */}
                                {item.type === 'combo' &&
                                    item.selections &&
                                    item.selections.length > 0 && (

                                        <div className="mt-1 pl-3 space-y-1">

                                            {item.selections.flatMap(
                                                selection => selection.products
                                            ).map((product, pIndex) => (

                                                <div
                                                    key={`${product.productId}-${pIndex}`}
                                                    className="flex items-center justify-between text-xs"
                                                >

                                                    <p className="text-gray-400">

                                                        • {product.name}

                                                    </p>

                                                    <span className="text-gray-400 shrink-0">

                                                        × {product.quantity}

                                                    </span>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                            </div>

                        ))}

                    </div>

                    {/* CUSTOMER DETAILS */}
                    <button
                        onClick={handleCustomerDetails}
                        className="mt-4 flex items-center gap-1 text-[11px] text-[#FF6B00] font-semibold w-fit"
                    >

                        <User size={11} />

                        Customer Details

                    </button>

                    {/* BOTTOM SECTION */}
                    <div className="mt-5 pt-4 border-t border-white/80 flex items-center justify-between gap-4 flex-wrap">

                        {/* LEFT */}
                        <div className="flex items-center gap-2 flex-wrap">

                            {/* AMOUNT */}
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full">

                                <p className="text-[10px] text-gray-400">

                                    Amount

                                </p>

                                <p className="font-bold text-[#FF6B00] text-[13px]">

                                    ${order.totalAmount}

                                </p>

                            </div>

                            {/* STATUS */}
                            <div className={`px-3 py-1.5 rounded-full text-[10px] font-semibold capitalize inline-flex

                            ${order.payment.status === 'paid'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-red-100 text-red-500'
                                }`}>

                                {order.payment.status}

                            </div>

                            {/* REQUESTED */}
                            {order.payment.status !== 'paid' && (

                                <div className={`px-3 py-1.5 rounded-full text-[10px] font-semibold inline-flex

                                ${order.paymentRequested
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-500'
                                    }`}>

                                    Requested By User :
                                    {' '}
                                    {order.paymentRequested
                                        ? 'Yes'
                                        : 'No'}

                                </div>

                            )}

                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleMarkPaid}
                            disabled={loading}
                            className={`h-8 px-3 rounded-full text-white text-[10px] font-semibold disabled:opacity-60 flex items-center gap-1.5 transition-all shrink-0

                            ${order.payment.status === 'paid'
                                    ? 'bg-red-400 hover:bg-red-500'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >

                            {loading && (

                                <Loader2
                                    size={10}
                                    className="animate-spin"
                                />

                            )}

                            {order.payment.status === 'paid'
                                ? 'Mark Unpaid'
                                : 'Mark Paid'}

                        </button>

                    </div>

                </div>

            </div>

            {/* MODAL */}
            {showDetails && (

                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDetails(false)}
                >

                    <div
                        className="bg-white w-full max-w-md rounded-3xl p-6"
                        onClick={e => e.stopPropagation()}
                    >

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-lg font-bold">

                                Customer Details

                            </h2>

                            <button
                                onClick={() => setShowDetails(false)}
                            >

                                <X size={18} />

                            </button>

                        </div>

                        {detailsLoading ? (

                            <div className="flex justify-center py-10">

                                <Loader2 className="animate-spin" />

                            </div>

                        ) : details ? (

                            <div className="space-y-4">

                                <div>

                                    <p className="font-bold text-[#1E2A3A]">

                                        {details.user.full_name}

                                    </p>

                                    <p className="text-xs text-gray-400">

                                        Username : {details.user.username}

                                    </p>

                                </div>

                                <div className="space-y-3 bg-gray-50 rounded-2xl p-4">

                                    <div className="flex items-center gap-3">

                                        <Mail
                                            size={14}
                                            className="text-gray-400"
                                        />

                                        <p className="text-sm">

                                            {details.user.email}

                                        </p>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <Phone
                                            size={14}
                                            className="text-gray-400"
                                        />

                                        <p className="text-sm">

                                            {details.user.phone_number}

                                        </p>

                                    </div>

                                    <div className="flex items-start gap-3">

                                        <MapPin
                                            size={14}
                                            className="text-gray-400 mt-0.5"
                                        />

                                        <div>

                                            <p className="text-sm">

                                                {details.deliveryDetails.addressLine1}

                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">

                                                {details.deliveryDetails.city},
                                                {' '}
                                                {details.deliveryDetails.state}

                                            </p>

                                        </div>

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