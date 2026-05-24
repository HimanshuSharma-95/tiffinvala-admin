'use client'

import { useEffect, useState } from 'react'

import {
    ArrowLeft,
    Receipt,
    RefreshCw
} from 'lucide-react'

import {
    getPaymentHistory,
    getPaymentOrders
} from '@/services/paymentService'

import {
    PaymentHistoryResponse,
    PaymentOrder,
    PaymentOrdersResponse
} from '@/types/admin/payment'

import PaymentAreaTabs
    from '@/components/admin/PaymentAreaTabs'

import PaymentStatusTabs
    from '@/components/admin/PaymentStatusTabs'

import PaymentOrderCard
    from '@/components/admin/PaymentOrderCard'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

export default function PaymentStatusPage() {

    const today =
        new Date().toISOString().split('T')[0]

    const formatDate = (date: string) => {

        if (!date) return ''

        return new Date(date)
            .toLocaleDateString('en-GB')
    }

    const [area, setArea] =
        useState('seattle')

    const [paymentStatus, setPaymentStatus] =
        useState('pending')

    const [startDate, setStartDate] =
        useState(today)

    const [endDate, setEndDate] =
        useState(today)

    const [orders, setOrders] =
        useState<PaymentOrder[]>([])

    const [report, setReport] =
        useState<PaymentHistoryResponse['report'] | null>(null)

    const [loading, setLoading] =
        useState(true)

    const [refreshing, setRefreshing] =
        useState(false)

    useEffect(() => {

        fetchData()

    }, [
        area,
        paymentStatus,
        startDate,
        endDate
    ])

    const fetchData = async (
        silent = false
    ) => {

        if (silent) {

            setRefreshing(true)

        } else {

            setLoading(true)
        }

        try {

            const [
                ordersRes,
                reportRes
            ] = await Promise.all([

                getPaymentOrders(
                    area,
                    paymentStatus,
                    startDate,
                    endDate
                ),

                getPaymentHistory(
                    area,
                    startDate,
                    endDate
                )

            ])

            const ordersData: PaymentOrdersResponse =
                ordersRes.data

            const reportData: PaymentHistoryResponse =
                reportRes.data

            setOrders(
                ordersData.orders || []
            )

            setReport(
                reportData.report
            )

        } finally {

            setLoading(false)

            setRefreshing(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">

            {/* TOP */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() =>
                                window.history.back()
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >

                            <ArrowLeft size={16} />

                        </button>

                        <h1 className="text-base font-bold text-[#1E2A3A]">

                            Payment Status

                        </h1>

                    </div>

                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="h-9 px-4 rounded-full bg-[#FF6B00] text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-60"
                    >

                        {refreshing && (

                            <RefreshCw
                                size={12}
                                className="animate-spin"
                            />

                        )}

                        Refresh

                    </button>

                </div>

            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,850px)_320px] gap-6 px-4 py-5 items-start">

                {/* LEFT */}
                <div className="order-3 xl:order-0">

                    <div className="space-y-4 mb-5">

                        <PaymentAreaTabs
                            value={area}
                            onChange={setArea}
                        />

                        <PaymentStatusTabs
                            value={paymentStatus}
                            onChange={setPaymentStatus}
                        />

                        {/* DATES */}
                        <div className="flex items-center max-w-xl m-auto gap-3">

                            {/* START DATE */}
                            <div className="flex-1">

                                <p className="text-[11px] text-gray-400 mb-1 px-1">

                                    Start Date

                                </p>

                                <div className="relative">

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm text-transparent caret-transparent"
                                    />

                                    <span className="absolute inset-0 flex items-center px-4 text-sm text-[#1E2A3A] pointer-events-none">

                                        {formatDate(startDate)}

                                    </span>

                                </div>

                            </div>

                            {/* END DATE */}
                            <div className="flex-1">

                                <p className="text-[11px] text-gray-400 mb-1 px-1">

                                    End Date

                                </p>

                                <div className="relative">

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm text-transparent caret-transparent"
                                    />

                                    <span className="absolute inset-0 flex items-center px-4 text-sm text-[#1E2A3A] pointer-events-none">

                                        {formatDate(endDate)}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* MOBILE/TABLET REPORT */}
                    <div className="xl:hidden mb-5 animate-slide-up">

                        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5">

                            <div className="flex items-center gap-2 mb-5">

                                <Receipt
                                    size={18}
                                    className="text-[#FF6B00]"
                                />

                                <h2 className="font-semibold text-[#1E2A3A]">

                                    Report

                                </h2>

                            </div>

                            {report && (

                                <div className="space-y-4">

                                    <div className="bg-white rounded-2xl p-4 border border-orange-100">

                                        <p className="text-[11px] text-gray-400 mb-1">

                                            Delivery Cycle

                                        </p>

                                        <p className="text-sm font-semibold text-[#1E2A3A]">

                                            {`${formatDate(startDate)} → ${formatDate(endDate)}`}

                                        </p>

                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Total Orders</span>
                                        <span className="font-semibold">{report.totalConfirmedOrders}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Paid</span>
                                        <span className="font-semibold text-green-500">{report.paid}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Unpaid</span>
                                        <span className="font-semibold text-red-400">{report.unpaid}</span>
                                    </div>

                                    {/* <div className="flex items-center justify-between text-sm">
                                        <span>Total Amount</span>
                                        <span className="font-semibold">${report.totalAmount}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Received</span>
                                        <span className="font-semibold text-green-500">${report.received}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Remaining</span>
                                        <span className="font-semibold text-[#FF6B00]">${report.remaining}</span>
                                    </div> */}

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Total Amount </span>
                                        <span className="font-semibold">
                                            ${Number(report.totalAmount).toFixed(4)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Received</span>
                                        <span className="font-semibold text-green-500">
                                            ${Number(report.received).toFixed(4)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Remaining</span>
                                        <span className="font-semibold text-[#FF6B00]">
                                            ${Number(report.remaining).toFixed(4)}
                                        </span>
                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* ORDERS */}
                    {loading ? (

                        <div className="flex justify-center py-20">

                            <SubtleSpinner size={18} />

                        </div>

                    ) : orders.length === 0 ? (

                        <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up">

                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                                <Receipt
                                    size={26}
                                    className="text-gray-300"
                                />

                            </div>

                            <h3 className="text-sm font-semibold text-[#1E2A3A]">

                                No Orders Found

                            </h3>

                            <p className="text-xs text-gray-400 mt-1">

                                No payment orders available for selected filters

                            </p>

                        </div>

                    ) : (

                        <div
                            className={`max-h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-3 custom-scrollbar transition-all duration-300

                            ${refreshing
                                    ? 'opacity-60'
                                    : 'opacity-100'
                                }`}
                        >

                            {orders.map((order, index) => (

                                <div
                                    key={order.orderId}
                                    className="animate-slide-up"
                                    style={{
                                        animationDelay: `${index * 45}ms`
                                    }}
                                >

                                    <PaymentOrderCard
                                        order={order}
                                        onPaid={() => fetchData(true)}
                                    />

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                {/* DESKTOP REPORT */}
                <div className="hidden xl:block animate-slide-up">

                    <div className="sticky top-4 bg-orange-50 border border-orange-100 rounded-3xl p-5">

                        <div className="flex items-center gap-2 mb-5">

                            <Receipt
                                size={18}
                                className="text-[#FF6B00]"
                            />

                            <h2 className="font-semibold text-[#1E2A3A]">

                                Report

                            </h2>

                        </div>

                        {report && (

                            <div className="space-y-4">

                                <div className="bg-white rounded-2xl p-4 border border-orange-100">

                                    <p className="text-[11px] text-gray-400 mb-1">

                                        Delivery Cycle

                                    </p>

                                    <p className="text-sm font-semibold text-[#1E2A3A]">

                                        {`${formatDate(startDate)} → ${formatDate(endDate)}`}

                                    </p>

                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Total Orders</span>
                                    <span className="font-semibold">{report.totalConfirmedOrders}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Paid</span>
                                    <span className="font-semibold text-green-500">{report.paid}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Unpaid</span>
                                    <span className="font-semibold text-red-400">{report.unpaid}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Total Amount</span>

                                    <span className="font-semibold">${Number(report.totalAmount).toFixed(4)}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Received</span>
                                    <span className="font-semibold text-green-500">${Number(report.received).toFixed(4)}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Remaining</span>
                                    <span className="font-semibold text-[#FF6B00]">${Number(report.remaining).toFixed(4)}</span>
                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}