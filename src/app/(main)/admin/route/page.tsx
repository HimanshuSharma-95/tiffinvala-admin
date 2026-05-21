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

            <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">

                {/* LEFT */}

                <div className="flex items-center gap-3">

                    <button
                        onClick={() =>
                            router.back()
                        }
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    >

                        <ArrowLeft size={18} />

                    </button>

                    <div>

                        <h1 className="text-lg font-bold text-[#1E2A3A]">

                            Delivery Routes

                        </h1>

                        <p className="text-xs text-gray-400">

                            Manage delivery batches

                        </p>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-2">

                    {/* RESET */}

                    <button
                        onClick={handleResetDrivers}
                        disabled={resetting}
                        className="h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-medium flex items-center gap-2 disabled:opacity-60"
                    >

                        <RotateCcw size={15} />

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
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none"
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