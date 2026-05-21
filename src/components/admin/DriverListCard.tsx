'use client'

import {
    Phone,
    Mail,
    Trash2,
    Loader2
} from 'lucide-react'

import {
    Driver
} from '@/types/admin/drivers'

interface Props {
    driver: Driver
    onDelete: () => void
    deleting?: boolean
}

export default function DriverListCard({
    driver,
    onDelete,
    deleting
}: Props) {

    return (
        <div className="bg-gray-100 rounded-3xl p-4 border border-gray-100 relative">

            {/* DELETE */}
            <button
                onClick={onDelete}
                disabled={deleting}
                className="absolute top-4 right-4 text-red-400 hover:text-red-500 disabled:opacity-50"
            >

                {deleting ? (

                    <Loader2
                        size={15}
                        className="animate-spin"
                    />

                ) : (

                    <Trash2 size={15} />

                )}

            </button>

            <div className="flex items-start justify-between gap-3 pr-8">

                <div className="min-w-0">

                    <h3 className="font-semibold text-[#1E2A3A]">

                        {driver.name}

                    </h3>

                    <p className="text-xs text-gray-400 mt-1 capitalize">

                        {driver.assignedArea.replace(
                            '_',
                            ' '
                        )}

                    </p>

                </div>

                <div className={`px-3 py-1 rounded-full text-[10px] font-semibold shrink-0

                ${driver.isDriverAvailable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-500'
                    }`}>

                    {driver.isDriverAvailable
                        ? 'Available'
                        : 'Busy'}

                </div>

            </div>

            <div className="mt-4 space-y-2">

                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">

                    <Mail size={12} className="shrink-0" />

                    <p className="truncate">

                        {driver.email}

                    </p>

                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">

                    <Phone size={12} />

                    {driver.phone}

                </div>

            </div>

        </div>
    )
}