'use client'

import {
    useEffect,
    useMemo,
    useState
} from 'react'

import {
    GripVertical,
    MapPin,
    Share2,
    X
} from 'lucide-react'

import { toast } from 'sonner'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from '@dnd-kit/sortable'

import {
    CSS
} from '@dnd-kit/utilities'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

import SingleOrderMapModal
    from './SingleOrderMapModel'

import {
    Driver
} from '@/types/admin/route'

import {
    finalizeDeliveryBatch,
    getDriverActiveBatch,
    reorderDeliveryBatch,
    unassignSingleOrder
} from '@/services/admin/routeService'
import RouteMapModal from './RouteMapModel'

interface Props {
    selectedDrivers: Driver[]
    selectedArea: string
    refreshUnassignedOrders: () => Promise<void>
}

interface BatchOrder {
    sequence: number
    orderId: string
    orderNumber: string
    status: string
    totalAmount: number

    user: {
        username: string
        full_name: string
        phone_number: string
    }

    deliveryDetails: {
        addressLine1: string

        location: {
            lat: number
            lng: number
        }
    }

    items: {
        name: string
        quantity: number
    }[]
}

export default function RightRoutePanel({
    selectedDrivers,
    selectedArea,
    refreshUnassignedOrders
}: Props) {

    const [
        selectedDriver,
        setSelectedDriver
    ] = useState<Driver | null>(null)

    const [
        batch,
        setBatch
    ] = useState<any>(null)

    const [
        orders,
        setOrders
    ] = useState<BatchOrder[]>([])

    const [
        loading,
        setLoading
    ] = useState(false)

    const [
        savingSequence,
        setSavingSequence
    ] = useState(false)

    const [
        sequenceChanged,
        setSequenceChanged
    ] = useState(false)

    const [
        finalizing,
        setFinalizing
    ] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor)
    )

    const [
        removingOrderId,
        setRemovingOrderId
    ] = useState<string | null>(null)

    const [
        showRouteMap,
        setShowRouteMap
    ] = useState(false)

    const [
        singleMapOrder,
        setSingleMapOrder
    ] = useState<any>(null)

    const loadBatch =
        async (
            driver: Driver
        ) => {

            try {

                setLoading(true)

                setSelectedDriver(driver)

                const res =
                    await getDriverActiveBatch(
                        driver.employeeId
                    )

                const batchData =
                    res.data.data.batch

                setBatch(batchData)

                if (batchData) {

                    setOrders(
                        batchData.orders || []
                    )

                } else {

                    setOrders([])
                }

                setSequenceChanged(false)

            } catch (error) {

                console.error(error)

                toast.error(
                    'Failed to load route'
                )
            } finally {

                setLoading(false)
            }
        }

    useEffect(() => {

        setSelectedDriver(null)

        setBatch(null)

        setOrders([])

        setSequenceChanged(false)

        setShowRouteMap(false)

        setSingleMapOrder(null)

    }, [selectedArea])


    useEffect(() => {

        if (
            selectedDriver &&
            !selectedDrivers.some(
                driver =>
                    driver.employeeId ===
                    selectedDriver.employeeId
            )
        ) {

            setSelectedDriver(null)

            setBatch(null)

            setOrders([])

            setSequenceChanged(false)

            setShowRouteMap(false)

            setSingleMapOrder(null)
        }

    }, [selectedDrivers, selectedDriver])

    const handleDragEnd =
        (event: any) => {

            const {
                active,
                over
            } = event

            if (
                !over ||
                active.id === over.id
            ) return

            const oldIndex =
                orders.findIndex(
                    x =>
                        x.orderId ===
                        active.id
                )

            const newIndex =
                orders.findIndex(
                    x =>
                        x.orderId ===
                        over.id
                )

            const reordered =
                arrayMove(
                    orders,
                    oldIndex,
                    newIndex
                ).map((order, index) => ({
                    ...order,
                    sequence:
                        index + 1
                }))

            setOrders(reordered)

            setSequenceChanged(true)
        }

    const handleSaveSequence =
        async () => {

            try {

                setSavingSequence(true)

                await reorderDeliveryBatch(
                    batch.batchId,
                    {
                        orders:
                            orders.map(order => ({
                                orderId:
                                    order.orderId,

                                sequence:
                                    order.sequence
                            }))
                    }
                )

                toast.success(
                    'Sequence updated'
                )

                setSequenceChanged(false)

            } catch {

                toast.error(
                    'Failed to save sequence'
                )

            } finally {

                setSavingSequence(false)
            }
        }

    const handleUnassignOrder =
        async (
            orderId: string
        ) => {

            try {

                setRemovingOrderId(orderId)

                await unassignSingleOrder(
                    orderId
                )

                const updated =
                    orders.filter(
                        x =>
                            x.orderId !==
                            orderId
                    )

                setOrders(updated)

                await refreshUnassignedOrders()

                if (selectedDriver) {

                    await loadBatch(selectedDriver)
                }

                toast.success(
                    'Order unassigned'
                )

            } catch {

                toast.error(
                    'Failed to unassign'
                )

            } finally {

                setRemovingOrderId(null)
            }
        }

    const handleFinalize =
        async () => {

            try {

                setFinalizing(true)

                await finalizeDeliveryBatch(
                    batch.batchId
                )

                toast.success(
                    'Shared with driver'
                )

            } catch {

                toast.error(
                    'Failed'
                )

            } finally {

                setFinalizing(false)
            }
        }




    return (

        <div className="bg-white rounded-3xl p-4 h-full">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-5">

                <div>

                    <h2 className="text-lg font-bold text-[#1E2A3A]">

                        Driver Routes

                    </h2>

                    <p className="text-xs text-gray-400 mt-1">

                        Select driver to manage route

                    </p>

                </div>

            </div>

            {/* DRIVER LIST */}

            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">

                {
                    selectedDrivers.map(driver => (

                        <button
                            key={driver.employeeId}
                            onClick={() =>
                                loadBatch(driver)
                            }
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all

                            ${selectedDriver?.employeeId === driver.employeeId
                                    ? 'bg-[#F97316] text-white'
                                    : 'bg-orange-50 text-[#F97316]'
                                }`}
                        >

                            {driver.name}

                        </button>

                    ))
                }

            </div>

            {/* EMPTY */}

            {
                !selectedDriver &&
                !loading && (

                    <div className="h-125 flex items-center justify-center">

                        <p className="text-sm text-gray-400">

                            Select driver to create route

                        </p>

                    </div>

                )
            }

            {/* LOADING */}

            {
                loading && (

                    <div className="h-125 flex items-center justify-center">

                        <SubtleSpinner
                            size={24}
                            className="text-[#F97316]"
                        />

                    </div>

                )
            }

            {/* BATCH */}

            {
                selectedDriver &&
                !loading && (

                    <>

                        {
                            !batch && (

                                <div className="h-30 flex flex-col items-center justify-center">

                                    <p className="text-sm font-medium text-gray-500">

                                        No orders assigned

                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">

                                        Assign orders from left panel

                                    </p>

                                </div>

                            )
                        }

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-3 mb-5">

                            <div>

                                <h3 className="text-sm font-bold text-[#1E2A3A]">

                                    {selectedDriver.name}

                                </h3>

                                <p className="text-xs text-gray-400 mt-1">

                                    {orders.length} orders

                                </p>

                            </div>

                            <div className="flex items-center gap-2 shrink-0">

                                {
                                    sequenceChanged && (

                                        <button
                                            disabled={savingSequence}
                                            onClick={handleSaveSequence}
                                            className="h-10 px-4 rounded-xl bg-[#F97316] text-white text-xs font-semibold flex items-center justify-center"
                                        >

                                            {
                                                savingSequence
                                                    ? (
                                                        <SubtleSpinner
                                                            size={15}
                                                            className="text-white"
                                                        />
                                                    )
                                                    : 'Save Sequence'
                                            }

                                        </button>

                                    )
                                }

                                <button
                                    onClick={() => {

                                        if (selectedDriver) {

                                            loadBatch(selectedDriver)
                                        }
                                    }}
                                    disabled={loading}
                                    className="h-10 px-4 rounded-xl bg-orange-50 text-[#F97316] text-sm font-semibold flex items-center justify-center"
                                >

                                    {
                                        loading
                                            ? (
                                                <SubtleSpinner
                                                    size={13}
                                                    className="text-[#F97316]"
                                                />
                                            )
                                            : 'Refresh'
                                    }

                                </button>

                                {
                                    orders.length > 0 && (

                                        <button
                                            onClick={() =>
                                                setShowRouteMap(true)
                                            }
                                            className="h-10 px-4 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold"
                                        >

                                            View Route

                                        </button>

                                    )
                                }

                            </div>

                        </div>


                        {/* ORDERS */}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >

                            <SortableContext
                                items={
                                    orders.map(
                                        x => x.orderId
                                    )
                                }
                                strategy={
                                    verticalListSortingStrategy
                                }
                            >

                                <div className="space-y-3 max-h-[70vh] overflow-y-auto">

                                    {
                                        orders.map(order => (

                                            <SortableOrderCard
                                                key={order.orderId}
                                                order={order}
                                                removing={
                                                    removingOrderId ===
                                                    order.orderId
                                                }
                                                onMapClick={() =>
                                                    setSingleMapOrder(order)
                                                }
                                                onRemove={() =>
                                                    handleUnassignOrder(
                                                        order.orderId
                                                    )
                                                }
                                            />

                                        ))
                                    }

                                </div>

                            </SortableContext>

                        </DndContext>

                        {/* FINALIZE */}

                        {
                            orders.length > 0 && (

                                <button
                                    disabled={finalizing}
                                    onClick={handleFinalize}
                                    className="w-full mt-5 h-12 rounded-2xl bg-[#F97316] text-white font-semibold flex items-center justify-center gap-2"
                                >

                                    {
                                        finalizing
                                            ? (
                                                <SubtleSpinner
                                                    size={18}
                                                    className="text-white"
                                                />
                                            )
                                            : (
                                                <>
                                                    <Share2 size={17} />
                                                    Share With Driver
                                                </>
                                            )
                                    }

                                </button>

                            )
                        }

                    </>

                )
            }

            {
                singleMapOrder && (

                    <SingleOrderMapModal
                        order={singleMapOrder}
                        onClose={() =>
                            setSingleMapOrder(null)
                        }
                    />

                )
            }

            {
                showRouteMap && (

                    <RouteMapModal
                        orders={orders}
                        onClose={() =>
                            setShowRouteMap(false)
                        }
                    />

                )
            }

        </div>

    )
}












function SortableOrderCard({
    order,
    onRemove,
    removing,
    onMapClick
}: any) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: order.orderId
    })

    const style = {
        transform:
            CSS.Transform.toString(
                transform
            ),
        transition
    }

    return (

        <div
            ref={setNodeRef}
            style={style}
            className="border border-gray-100 rounded-2xl p-3 bg-white"
        >

            <div className="flex items-start justify-between gap-3">

                {/* LEFT */}

                <div className="flex gap-2.5 min-w-0 flex-1">

                    {/* DRAG + SEQUENCE */}

                    <div className="flex flex-col items-center shrink-0">

                        <div className="w-6 h-6 mb-2 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[10px] font-bold">

                            {order.sequence}

                        </div>

                        <button
                            {...attributes}
                            {...listeners}
                            className="mt-1"
                        >

                            <GripVertical
                                size={15}
                                className="text-gray-400"
                            />

                        </button>

                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                        <h3 className="text-sm font-semibold text-[#1E2A3A] leading-none truncate">

                            {order.user.full_name}

                        </h3>

                        <p className="text-[11px] text-gray-400 mt-1 truncate">

                            username : {order.user.username}

                        </p>

                        <p className="text-[11px] text-gray-500 mt-2 leading-snug line-clamp-2">

                            {order.deliveryDetails.addressLine1}

                        </p>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">

                            <span className="text-[11px] text-gray-500">

                                {order.user.phone_number}

                            </span>

                            <span className="text-gray-300 text-[10px]">

                                •

                            </span>

                            <span className="text-[11px] font-medium text-[#F97316]">

                                {order.items?.length || 0} items

                            </span>

                        </div>

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col gap-1.5 shrink-0">

                    <button
                        onClick={onMapClick}
                        className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center"
                    >
                        <MapPin
                            size={14}
                            className="text-blue-500"
                        />

                    </button>

                    <button
                        onClick={onRemove}
                        disabled={removing}
                        className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"
                    >

                        {
                            removing
                                ? (

                                    <SubtleSpinner
                                        size={13}
                                        className="text-red-500"
                                    />

                                )
                                : (

                                    <X
                                        size={14}
                                        className="text-red-500"
                                    />

                                )
                        }

                    </button>

                </div>

            </div>



        </div>

    )
}