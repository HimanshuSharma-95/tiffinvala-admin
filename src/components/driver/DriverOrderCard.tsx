'use client'

import {
    CheckCircle2,
    MapPin
} from 'lucide-react'

import {
    DriverOrder
} from '@/types/driver/route'

interface Props {

    order: DriverOrder

    onMapClick: () => void

    onDeliver: () => void
}

export default function DriverOrderCard({
    order,
    onMapClick,
    onDeliver
}: Props) {

    return (

        <div className="w-full rounded-3xl border border-gray-100 bg-white p-4">

            <div className="flex items-start justify-between gap-3">

                {/* LEFT */}

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2 flex-wrap">

                        <div className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[10px] font-bold">

                            {order.sequence}

                        </div>

                        <h3 className="text-sm font-semibold text-[#1E1E1E] truncate">

                            {order.user.full_name}

                        </h3>

                    </div>

                    <p className="text-xs text-gray-400 mt-1">

                        username : {order.user.username}

                    </p>

                    <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.addressLine1}
                    </p>
                    <p className="text-xs text-gray-500 mt-0 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.addressLine2}
                    </p>
                    <p className="text-xs text-gray-500 mt-0 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.city}
                    </p>
                    <p className="text-xs text-gray-500 mt-0 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.state}
                    </p>
                    <p className="text-xs text-gray-500 mt-0 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.zipCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-0 line-clamp-2 leading-relaxed">
                        {order.deliveryDetails.country}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">

                        <span className="text-[11px] text-gray-500">

                            {order.user.phone_number}

                        </span>

                        <span className="text-gray-300 text-[10px]">

                            •

                        </span>

                        <span className="text-[11px] text-gray-500">

                            {order.itemCount} items

                        </span>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-center gap-3 shrink-0">


                    {
                        order.isorderdelivered
                            ? (

                                <button
                                    onClick={onDeliver}
                                    className="px-3 py-2 rounded-xl bg-green-100 text-green-600 text-[11px] font-semibold flex items-center gap-1 active:scale-[0.98] transition-all"
                                >

                                    <CheckCircle2 size={13} />

                                    Delivered

                                </button>

                            )
                            : (

                                <button
                                    onClick={onDeliver}
                                    className="px-3 py-2 rounded-xl bg-[#F97316] text-white text-[11px] font-semibold active:scale-[0.98] transition-all"
                                >

                                    Mark Delivered

                                </button>
                            )
                    }

                </div>

            </div>

        </div>
    )
}