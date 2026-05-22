'use client'

import { useState } from 'react'

import {
    ArrowLeft,
    RotateCcw
} from 'lucide-react'

import { useRouter } from 'next/navigation'

import {
    toast
} from 'sonner'

import LeftRoutePanel
    from '@/components/admin/route/LeftRoutePanel'

import RightRoutePanel
    from '@/components/admin/route/RightRoutePanel'

import {
    Driver
} from '@/types/admin/route'

import {
    resetDrivers
} from '@/services/admin/routeService'

const AREAS = [
    {
        key: 'seattle',
        label: 'Seattle',
    },
    {
        key: 'bay_area',
        label: 'Bay Area',
    },
]

export default function RoutePage() {

    const router = useRouter()

    const [
        selectedArea,
        setSelectedArea
    ] = useState('seattle')

    const [
        selectedDrivers,
        setSelectedDrivers
    ] = useState<Driver[]>([])

    const [
        refreshTrigger,
        setRefreshTrigger
    ] = useState(0)

    const [
        refreshOrdersFn,
        setRefreshOrdersFn
    ] = useState<(() => Promise<void>) | null>(null)

    const [
        resetting,
        setResetting
    ] = useState(false)

    const handleResetDrivers =
        async () => {

            const confirmed =
                window.confirm(
                    'Are you sure you want to reset all drivers?'
                )

            if (!confirmed) return

            try {

                setResetting(true)

                await resetDrivers()

                toast.success(
                    'Drivers reset successfully'
                )

                window.location.reload()

            } catch {

                toast.error(
                    'Failed to reset drivers'
                )

            } finally {

                setResetting(false)
            }
        }

    return (

        <div className="min-h-screen bg-[#F8F9FB]">

            {/* HEADER */}

            <div className="bg-white border-b border-gray-100 px-3 sm:px-4 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                {/* LEFT */}

                <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                    <button
                        onClick={() =>
                            router.back()
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                    >

                        <ArrowLeft size={16} className="sm:w-4.5 sm:h-4.5" />

                    </button>

                    <div className="min-w-0">

                        <h1 className="text-base sm:text-lg font-bold text-[#1E2A3A] truncate">

                            Delivery Routes

                        </h1>

                        <p className="text-[11px] sm:text-xs text-gray-400 truncate">

                            Manage delivery batches

                        </p>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-2 w-full lg:w-auto">

                    {/* RESET */}

                    <button
                        onClick={handleResetDrivers}
                        disabled={resetting}
                        className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 flex-1 lg:flex-none whitespace-nowrap"
                    >

                        <RotateCcw size={14} className="sm:w-3.75 sm:h-3.75" />

                        {
                            resetting
                                ? 'Resetting...'
                                : 'Reset Drivers'
                        }

                    </button>

                    {/* AREA */}

                    <select
                        value={selectedArea}
                        onChange={(e) =>
                            setSelectedArea(
                                e.target.value
                            )
                        }
                        className="border border-gray-200 rounded-xl px-2 sm:px-3 h-9 sm:h-10 text-xs sm:text-sm bg-white outline-none flex-1 lg:flex-none min-w-0"
                    >

                        {
                            AREAS.map(area => (

                                <option
                                    key={area.key}
                                    value={area.key}
                                >

                                    {area.label}

                                </option>

                            ))
                        }

                    </select>

                </div>

            </div>

            {/* CONTENT */}

            <div className="p-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* LEFT */}

                    <LeftRoutePanel
                        selectedArea={selectedArea}
                        selectedDrivers={selectedDrivers}
                        setSelectedDrivers={setSelectedDrivers}
                        setRefreshOrdersFn={setRefreshOrdersFn}
                    />

                    {/* RIGHT */}

                    <RightRoutePanel
                        selectedArea={
                            selectedArea
                        }
                        selectedDrivers={
                            selectedDrivers
                        }
                        refreshUnassignedOrders={
                            async () => {

                                setRefreshTrigger(
                                    prev => prev + 1
                                )

                            }
                        }
                    />

                </div>

            </div>

        </div>
    )
}