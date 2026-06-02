'use client'

import {
    useEffect,
    useState
} from 'react'

import Image from 'next/image'

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    X
} from 'lucide-react'

import {
    toast
} from 'sonner'

import {
    getAllDriversByArea,
    getDriverHistory
} from '@/services/admin/routeService'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

import {
    useRouter
} from 'next/navigation'

const AREAS = [
    'seattle',
    'bay_area'
]

export default function DriverDeliveryStatusPage() {

    const router = useRouter()

    const [
        selectedArea,
        setSelectedArea
    ] = useState('seattle')

    const [
        drivers,
        setDrivers
    ] = useState<any[]>([])

    const [
        selectedDriver,
        setSelectedDriver
    ] = useState<any | null>(null)

    const [
        history,
        setHistory
    ] = useState<any | null>(null)

    const [
        loadingDrivers,
        setLoadingDrivers
    ] = useState(false)

    const [
        loadingHistory,
        setLoadingHistory
    ] = useState(false)

    const [
        imagePreview,
        setImagePreview
    ] = useState<string | null>(null)

    const loadDrivers =
        async (
            area: string
        ) => {

            try {

                setLoadingDrivers(true)

                const res =
                    await getAllDriversByArea(
                        area,
                        false
                    )

                setDrivers(
                    res.data.data.drivers || []
                )

            } catch {

                toast.error(
                    'Failed to load drivers'
                )

            } finally {

                setLoadingDrivers(false)
            }
        }

    const loadDriverHistory =
        async (
            driverId: string
        ) => {

            try {

                setLoadingHistory(true)

                const res =
                    await getDriverHistory(
                        driverId
                    )

                setHistory(
                    res.data.data
                )

            } catch {

                toast.error(
                    'Failed to load driver history'
                )

            } finally {

                setLoadingHistory(false)
            }
        }

    useEffect(() => {

        loadDrivers(selectedArea)

    }, [])

    return (

        <div className="min-h-screen bg-[#FAFAFA]">

            {/* HEADER */}

            <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-20">

                {/* LEFT */}

                <div className="flex items-center gap-3 min-w-0">

                    <button
                        onClick={() =>
                            router.back()
                        }
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                    >

                        <ArrowLeft
                            size={18}
                            className="text-gray-700"
                        />

                    </button>

                    <div className="min-w-0">

                        <h1 className="text-lg font-bold text-[#1E2A3A] truncate">

                            Delivery Status

                        </h1>

                        <p className="text-xs text-gray-400">

                            Track driver deliveries

                        </p>

                    </div>

                </div>

            </div>

            {/* AREA TABS */}

            <div className="px-4 mt-5 flex gap-2 overflow-x-auto scrollbar-hide">

                {
                    AREAS.map(area => (

                        <button
                            key={area}
                            onClick={() => {

                                setSelectedArea(area)

                                setSelectedDriver(null)

                                setHistory(null)

                                loadDrivers(area)
                            }}
                            className={`
                                px-4 h-9 rounded-xl text-xs font-medium whitespace-nowrap transition-all border
                                ${selectedArea === area
                                    ? 'bg-orange-50 border-orange-200 text-[#F97316]'
                                    : 'bg-white border-gray-200 text-gray-500'
                                }
                            `}
                        >

                            {area}

                        </button>
                    ))
                }

            </div>

            {/* DRIVERS */}

            <div className="px-4 mt-5">

                {
                    loadingDrivers
                        ? (

                            <div className="h-28 bg-white rounded-3xl flex items-center justify-center border border-gray-100">

                                <SubtleSpinner
                                    size={24}
                                    className="text-[#F97316]"
                                />

                            </div>

                        )
                        : (

                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

                                {
                                    drivers.map(driver => (

                                        <button
                                            key={driver.employeeId}
                                            onClick={() => {

                                                setSelectedDriver(driver)

                                                loadDriverHistory(
                                                    driver.employeeId
                                                )
                                            }}
                                            className={`
                                                min-w-55 rounded-2xl p-4 border text-left transition-all active:scale-[0.98]
                                                ${selectedDriver?.employeeId === driver.employeeId
                                                    ? 'border-orange-200 bg-orange-50'
                                                    : 'border-gray-200 bg-white'
                                                }
                                            `}
                                        >

                                            <div className="flex items-start justify-between gap-2">

                                                <div className="min-w-0">

                                                    <h3 className="text-sm font-semibold text-[#1E2A3A] truncate">

                                                        {driver.name}

                                                    </h3>

                                                    <p className="text-xs text-gray-400 mt-1 truncate">

                                                        {driver.email}

                                                    </p>

                                                </div>

                                            </div>

                                        </button>
                                    ))
                                }

                            </div>
                        )
                }

            </div>

            {/* HISTORY */}

            <div className="px-4 mt-5 pb-5 max-w-2xl">

                {
                    loadingHistory && (

                        <div className="bg-white rounded-3xl h-64 flex items-center justify-center border border-gray-100">

                            <SubtleSpinner
                                size={28}
                                className="text-[#F97316]"
                            />

                        </div>
                    )
                }

                {
                    history && (

                        history.batches?.length === 0
                            ? (

                                <div className="bg-white rounded-3xl border border-gray-100 h-52 flex flex-col items-center justify-center">

                                    <h2 className="text-base font-semibold text-[#1E2A3A]">

                                        No Orders

                                    </h2>

                                    <p className="text-sm text-gray-400 mt-2">

                                        This driver has no delivery history

                                    </p>

                                </div>

                            )
                            : (

                                <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide pr-1">

                                    {
                                        history.batches.map((batch: any) => (

                                            <div
                                                key={batch.batchId}
                                                className="bg-white rounded-3xl p-5 border border-gray-100"
                                            >

                                                {/* BATCH */}

                                                <div className="flex items-center justify-between gap-3 mb-5">
                                                    <div>
                                                        <h2 className="text-base font-semibold text-[#1E2A3A]">
                                                            Batch
                                                        </h2>

                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {batch.totalOrders} Orders ·{" "}

                                                            {batch.finalizedAt ?
                                                                new Date(batch.finalizedAt).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })
                                                                : ""}

                                                        </p>
                                                    </div>

                                                    <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 capitalize">

                                                        {batch.area}

                                                    </div>

                                                </div>

                                                {/* ORDERS */}

                                                <div className="space-y-3">

                                                    {
                                                        batch.orders.map((order: any) => (

                                                            <div
                                                                key={order.orderId}
                                                                className="border border-gray-100 rounded-2xl p-4"
                                                            >

                                                                <div className="flex items-start justify-between gap-4">

                                                                    {/* LEFT */}

                                                                    <div className="min-w-0 flex-1">

                                                                        <div className="flex items-center gap-2 flex-wrap">

                                                                            <div className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[10px] font-bold">

                                                                                {order.sequence}

                                                                            </div>

                                                                            <h3 className="text-sm font-semibold text-[#1E1E1E]">

                                                                                {order.user.full_name}

                                                                            </h3>

                                                                        </div>

                                                                        <p className="text-xs text-gray-400 mt-1">

                                                                            @{order.user.username}

                                                                        </p>

                                                                        {/* CONTACT */}

                                                                        <div className="mt-3 space-y-1">

                                                                            <p className="text-xs text-gray-500 break-all">

                                                                                {order.user.email}

                                                                            </p>

                                                                            <p className="text-xs text-gray-500">

                                                                                {
                                                                                    order.user.phone ||
                                                                                    order.user.phone_number
                                                                                }

                                                                            </p>

                                                                        </div>

                                                                        {/* ADDRESS */}

                                                                        <p className="text-sm text-gray-500 mt-3 leading-relaxed">

                                                                            {
                                                                                order.deliveryDetails.addressLine1
                                                                            }

                                                                        </p>

                                                                    </div>

                                                                    {/* RIGHT */}

                                                                    <div className="flex flex-col items-end gap-2 shrink-0">

                                                                        {
                                                                            order.isorderdelivered
                                                                                ? (

                                                                                    <>
                                                                                        <div className="px-3 py-2 rounded-xl bg-green-100 text-green-600 text-[11px] font-semibold flex items-center gap-1">

                                                                                            <CheckCircle2 size={13} />

                                                                                            Delivered

                                                                                        </div>

                                                                                        {
                                                                                            order.deliveryProofImage && (

                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        setImagePreview(
                                                                                                            order.deliveryProofImage
                                                                                                        )
                                                                                                    }
                                                                                                    className="text-xs font-medium text-blue-600"
                                                                                                >

                                                                                                    View Proof

                                                                                                </button>
                                                                                            )
                                                                                        }
                                                                                    </>

                                                                                )
                                                                                : (

                                                                                    <div className="px-3 py-2 rounded-xl bg-orange-50 text-[#F97316] text-[11px] font-semibold flex items-center gap-1">

                                                                                        <Clock3 size={13} />

                                                                                        Pending

                                                                                    </div>
                                                                                )
                                                                        }

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        ))
                                                    }

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>

                            )
                    )
                }

            </div>

            {/* IMAGE MODAL */}

            {
                imagePreview && (

                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

                        <div className="relative w-full max-w-3xl">

                            <button
                                onClick={() =>
                                    setImagePreview(null)
                                }
                                className="absolute -top-12 right-0 text-white"
                            >

                                <X size={26} />

                            </button>

                            <Image
                                src={imagePreview}
                                alt="Delivery Proof"
                                width={1200}
                                height={1200}
                                className="w-full rounded-3xl object-cover"
                            />

                        </div>

                    </div>
                )
            }

        </div>
    )
}