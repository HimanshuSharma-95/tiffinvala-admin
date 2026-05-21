'use client'

import {
    Check,
    MapPin
} from 'lucide-react'

import { Order } from '@/types/admin/route'

interface Props {
    order: Order
    selected: boolean
    onToggle: () => void
    onMapClick: () => void
}

export default function UnassignedOrderCard({
    order,
    selected,
    onToggle,
    onMapClick
}: Props) {

    return (

        <button
            onClick={onToggle}
            className={`w-full rounded-3xl border p-4 text-left transition-all

            ${selected
                    ? 'border-[#F97316] bg-orange-50'
                    : 'border-gray-100 bg-white'
                }`}
        >

            <div className="flex items-start justify-between gap-3">

                {/* LEFT */}

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2 flex-wrap">

                        <h3 className="text-sm font-semibold text-[#1E1E1E] truncate">

                            {order.user.full_name}

                        </h3>

                        {/* <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500 font-medium">

                            {order.payment?.status}

                        </span> */}

                    </div>

                    <p className="text-xs text-gray-400 mt-1">

                        username : {order.user.username}

                    </p>

                    <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">

                        {order.deliveryDetails.addressLine1}

                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">

                        <span className="text-[11px] text-gray-500">

                            {order.user.phone}

                        </span>

                        <span className="text-gray-300 text-[10px]">

                            •

                        </span>

                        <span className="text-[11px] text-gray-500">

                            {order.itemCount} items

                        </span>

                        {/* <span className="text-gray-300 text-[10px]">

                            •

                        </span>

                        <span className="text-[11px] font-semibold text-[#1E2A3A]">

                            ${order.totalAmount}

                        </span> */}

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-center gap-3 shrink-0">

                    <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center

                        ${selected
                                ? 'bg-[#F97316] border-[#F97316]'
                                : 'border-gray-300 bg-white'
                            }`}
                    >

                        {
                            selected && (

                                <Check
                                    size={11}
                                    className="text-white"
                                />

                            )
                        }

                    </div>

                    <div
                        onClick={(e) => {

                            e.stopPropagation()

                            onMapClick()

                        }}
                        className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"
                    >

                        <MapPin
                            size={15}
                            className="text-blue-500"
                        />

                    </div>

                </div>

            </div>

        </button>

    )
}