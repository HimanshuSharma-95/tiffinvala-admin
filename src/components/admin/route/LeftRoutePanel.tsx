'use client'

import { useCallback } from 'react'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import DriverChip from './DriverChip'

import {
    Driver,
    NextDeliveryDate,
    Order
} from '@/types/admin/route'

import {
    getDriversByArea,
    getNextDeliveryDate,
    getUnassignedConfirmedOrders,
    setDriverForNextDelivery,
    upsertBatch
} from '@/services/admin/routeService'

import UnassignedOrderCard
    from './UnassignedOrderCard'

import SingleOrderMapModal
    from './SingleOrderMapModel'

import SubtleSpinner
    from '@/components/general/SubtleSpinner'

interface Props {
    selectedArea: string

    selectedDrivers: Driver[]

    setSelectedDrivers: React.Dispatch<
        React.SetStateAction<Driver[]>
    >

    setRefreshOrdersFn: React.Dispatch<
        React.SetStateAction<
            (() => Promise<void>) | null
        >
    >
}

export default function LeftRoutePanel({
    selectedArea,
    selectedDrivers,
    setSelectedDrivers,
    setRefreshOrdersFn
}: Props) {

    const [
        availableDrivers,
        setAvailableDrivers
    ] = useState<Driver[]>([])


    const [
        nextDeliveryDate,
        setNextDeliveryDate
    ] = useState<NextDeliveryDate | null>(null)

    const [
        unassignedOrders,
        setUnassignedOrders
    ] = useState<Order[]>([])

    const [
        loading,
        setLoading
    ] = useState(false)

    const [
        unassignedOrdersLoading,
        setUnassignedOrdersLoading
    ] = useState(false)

    const [
        removeDriver,
        setRemoveDriver
    ] = useState<Driver | null>(null)

    const [
        assigningDriver,
        setAssigningDriver
    ] = useState<string | null>(null)

    const [
        selectedOrders,
        setSelectedOrders
    ] = useState<string[]>([])

    const [
        mapOrder,
        setMapOrder
    ] = useState<Order | null>(null)

    const [
        assignDriverModal,
        setAssignDriverModal
    ] = useState(false)

    const [
        batchLoading,
        setBatchLoading
    ] = useState<string | null>(null)


    const refreshUnassignedOrders =
        useCallback(async () => {

            try {

                setUnassignedOrdersLoading(true)

                const ordersRes =
                    await getUnassignedConfirmedOrders(
                        selectedArea
                    )

                setUnassignedOrders(
                    ordersRes.data.data.orders || []
                )

            } catch {

                toast.error(
                    'Failed to refresh orders'
                )

            } finally {

                setUnassignedOrdersLoading(false)
            }

        }, [selectedArea])

    useEffect(() => {

        loadData()

    }, [selectedArea])

    useEffect(() => {

        setRefreshOrdersFn(
            () => refreshUnassignedOrders
        )

    }, [refreshUnassignedOrders])



    const toggleOrder = (
        orderId: string
    ) => {

        setSelectedOrders(prev => {

            if (prev.includes(orderId)) {

                return prev.filter(
                    x => x !== orderId
                )
            }

            return [...prev, orderId]
        })
    }

    const loadData = async () => {

        try {

            setLoading(true)

            const [
                availableRes,
                selectedRes,
                nextDateRes,
                ordersRes
            ] = await Promise.all([

                getDriversByArea(
                    selectedArea,
                    false
                ),

                getDriversByArea(
                    selectedArea,
                    true
                ),

                getNextDeliveryDate(),

                getUnassignedConfirmedOrders(
                    selectedArea
                )

            ])

            setAvailableDrivers(
                availableRes.data.data.drivers || []
            )

            setSelectedDrivers(
                selectedRes.data.data.drivers || []
            )

            setNextDeliveryDate(
                nextDateRes.data.data
            )

            setUnassignedOrders(
                ordersRes.data.data.orders || []
            )

        } catch {

            toast.error(
                'Failed to load'
            )

        } finally {

            setLoading(false)
        }
    }

    const handleAssignDriver =
        async (
            driver: Driver
        ) => {

            if (!nextDeliveryDate) return

            try {

                setAssigningDriver(
                    driver.employeeId
                )

                await setDriverForNextDelivery(
                    driver.employeeId,
                    {
                        upForNextDelivery: true,
                        nextDeliveryDate:
                            nextDeliveryDate.date
                    }
                )

                setAvailableDrivers(prev =>
                    prev.filter(
                        x =>
                            x.employeeId !==
                            driver.employeeId
                    )
                )

                setSelectedDrivers(prev => [

                    ...prev,

                    {
                        ...driver,
                        upForNextDelivery: true
                    }
                ])

                toast.success(
                    'Driver added'
                )

            } catch {

                toast.error(
                    'Failed'
                )

            } finally {

                setAssigningDriver(null)
            }
        }

    const handleRemoveDriver =
        async (
            driver: Driver
        ) => {

            if (!nextDeliveryDate) return

            try {

                setAssigningDriver(
                    driver.employeeId
                )

                await setDriverForNextDelivery(
                    driver.employeeId,
                    {
                        upForNextDelivery: false,
                        nextDeliveryDate:
                            nextDeliveryDate.date
                    }
                )

                setSelectedDrivers(prev =>
                    prev.filter(
                        x =>
                            x.employeeId !==
                            driver.employeeId
                    )
                )

                setAvailableDrivers(prev => [

                    ...prev,

                    {
                        ...driver,
                        upForNextDelivery: false
                    }
                ])

                setUnassignedOrdersLoading(true)

                const ordersRes =
                    await getUnassignedConfirmedOrders(
                        selectedArea
                    )

                setUnassignedOrders(
                    ordersRes.data.data.orders || []
                )

                setUnassignedOrdersLoading(false)

                toast.success(
                    'Driver removed'
                )

            } catch {

                setUnassignedOrdersLoading(false)

                toast.error(
                    'Failed'
                )

            } finally {

                setAssigningDriver(null)
            }
        }

    const handleAssignOrders =
        async (
            driver: Driver
        ) => {

            try {

                setBatchLoading(
                    driver.employeeId
                )

                await upsertBatch({
                    driverId:
                        driver.employeeId,

                    area: selectedArea,

                    orderIds:
                        selectedOrders
                })

                await refreshUnassignedOrders()

                toast.success(
                    'Orders assigned successfully'
                )

                setSelectedOrders([])

                setAssignDriverModal(false)

            } catch {

                toast.error(
                    'Failed to assign orders'
                )

            } finally {

                setBatchLoading(null)
            }
        }

    return (

        <div className="space-y-4">

            {
                loading && (

                    <div className="bg-white rounded-3xl p-10 flex items-center justify-center">

                        <SubtleSpinner
                            size={24}
                            className="text-[#F97316]"
                        />

                    </div>

                )
            }

            {
                !loading && (

                    <>

                        {/* DRIVERS */}

                        <div className="bg-white rounded-3xl p-4 space-y-4">

                            {/* AVAILABLE */}

                            <div>

                                <div className="flex items-center gap-2 mb-3">

                                    <h2 className="text-sm font-bold text-[#1E2A3A]">

                                        Available Drivers

                                    </h2>

                                    <span className="text-xs font-medium text-gray-400">

                                        ({availableDrivers.length})

                                    </span>

                                </div>

                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">

                                    {
                                        availableDrivers.map(driver => (

                                            <DriverChip
                                                key={driver.employeeId}
                                                driver={driver}
                                                type="add"
                                                loading={
                                                    assigningDriver ===
                                                    driver.employeeId
                                                }
                                                onClick={() =>
                                                    handleAssignDriver(
                                                        driver
                                                    )
                                                }
                                            />

                                        ))
                                    }

                                </div>

                            </div>

                            {/* DIVIDER */}

                            <div className="border-t border-gray-100" />

                            {/* SELECTED */}

                            <div>

                                <div className="mb-3">

                                    <div className="flex items-center gap-2">

                                        <h2 className="text-sm font-bold text-[#1E2A3A]">

                                            Next Delivery Drivers

                                        </h2>

                                        <span className="text-xs font-medium text-gray-400">

                                            ({selectedDrivers.length})

                                        </span>

                                    </div>

                                    <p className="text-[11px] text-gray-400 mt-0.5">

                                        {nextDeliveryDate?.formatted}

                                    </p>

                                </div>

                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">

                                    {
                                        selectedDrivers.map(driver => (

                                            <DriverChip
                                                key={driver.employeeId}
                                                driver={driver}
                                                type="remove"
                                                loading={
                                                    assigningDriver ===
                                                    driver.employeeId
                                                }
                                                onClick={() =>
                                                    setRemoveDriver(driver)
                                                }
                                            />

                                        ))
                                    }

                                </div>

                            </div>

                        </div>

                        {/* REMOVE DRIVER MODAL */}

                        {
                            removeDriver && (

                                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

                                    <div className="bg-white w-full max-w-sm rounded-3xl p-5">

                                        <h2 className="text-lg font-bold text-[#1E2A3A]">

                                            Remove Driver

                                        </h2>

                                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">

                                            Are you sure you want to remove

                                            <span className="font-semibold text-[#1E2A3A]">
                                                {' '}
                                                {removeDriver.name}
                                            </span>

                                            {' '}from the next delivery batch?

                                        </p>

                                        <div className="flex gap-3 mt-6">

                                            <button
                                                onClick={() =>
                                                    setRemoveDriver(null)
                                                }
                                                className="flex-1 h-11 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600"
                                            >

                                                Cancel

                                            </button>

                                            <button
                                                disabled={
                                                    assigningDriver ===
                                                    removeDriver.employeeId
                                                }
                                                onClick={async () => {

                                                    await handleRemoveDriver(
                                                        removeDriver
                                                    )

                                                    setRemoveDriver(null)

                                                }}
                                                className="flex-1 h-11 rounded-2xl bg-red-500 text-white text-sm font-semibold flex items-center justify-center"
                                            >

                                                {
                                                    assigningDriver ===
                                                        removeDriver.employeeId
                                                        ? (

                                                            <SubtleSpinner
                                                                size={16}
                                                                className="text-white"
                                                            />

                                                        )
                                                        : 'Remove'
                                                }

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        }


                        {/* UNASSIGNED ORDERS */}

                        <div className="bg-white rounded-3xl p-4">

                            <div className="flex items-start justify-between gap-3 mb-4">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <h2 className="text-sm font-bold text-[#1E2A3A]">

                                            Unassigned Orders

                                        </h2>

                                        <span className="text-xs font-medium text-gray-400">

                                            ({unassignedOrders.length})

                                        </span>

                                    </div>

                                    <p className="text-[11px] text-gray-400 mt-1">

                                        Select orders to assign

                                    </p>

                                </div>

                                <div className="flex items-center gap-2 shrink-0">

                                    {/* REFRESH */}

                                    <button
                                        onClick={refreshUnassignedOrders}
                                        disabled={unassignedOrdersLoading}
                                        className="w-25 h-9 rounded-xl bg-orange-50 flex items-center justify-center"
                                    >

                                        {
                                            unassignedOrdersLoading
                                                ? (

                                                    <SubtleSpinner
                                                        size={11}
                                                        className="text-[#F97316] text-xs"
                                                    />

                                                )
                                                : (

                                                    <span className="text-[#F97316] text-sm font-semibold">

                                                        Refresh

                                                    </span>

                                                )
                                        }

                                    </button>

                                    {/* ASSIGN */}

                                    {
                                        selectedOrders.length > 0 && (

                                            <button
                                                onClick={() =>
                                                    setAssignDriverModal(true)
                                                }
                                                className="h-9 px-4 rounded-xl bg-[#F97316] text-white text-xs font-semibold"
                                            >

                                                Assign To Driver

                                            </button>

                                        )
                                    }

                                </div>

                            </div>

                            <div className="max-h-[70vh] overflow-y-auto">

                                {
                                    unassignedOrdersLoading
                                        ? (

                                            <div className="py-14 flex items-center justify-center">

                                                <div className="flex flex-col items-center gap-3">

                                                    <SubtleSpinner
                                                        size={22}
                                                        className="text-[#F97316]"
                                                    />

                                                    <p className="text-xs text-gray-400">

                                                        Refreshing orders...

                                                    </p>

                                                </div>

                                            </div>

                                        )
                                        : (

                                            <div className="space-y-3">

                                                {
                                                    unassignedOrders.map(order => (

                                                        <UnassignedOrderCard
                                                            key={order.orderId}
                                                            order={order}
                                                            selected={
                                                                selectedOrders.includes(
                                                                    order.orderId
                                                                )
                                                            }
                                                            onToggle={() =>
                                                                toggleOrder(
                                                                    order.orderId
                                                                )
                                                            }
                                                            onMapClick={() =>
                                                                setMapOrder(order)
                                                            }
                                                        />

                                                    ))
                                                }

                                            </div>

                                        )
                                }

                            </div>

                        </div>

                        {/* ASSIGN DRIVER MODAL */}

                        {
                            assignDriverModal && (

                                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

                                    <div className="bg-white w-full max-w-md rounded-3xl p-5">

                                        <div className="flex items-center justify-between mb-5">

                                            <div>

                                                <h2 className="text-lg font-bold text-[#1E2A3A]">

                                                    Assign Orders

                                                </h2>

                                                <p className="text-xs text-gray-400 mt-1">

                                                    Select a driver for
                                                    {' '}
                                                    {selectedOrders.length}
                                                    {' '}
                                                    orders

                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    setAssignDriverModal(false)
                                                }
                                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                                            >

                                                ✕

                                            </button>

                                        </div>

                                        <div className="space-y-3 max-h-100 overflow-y-auto">

                                            {
                                                selectedDrivers.map(driver => (

                                                    <button
                                                        key={driver.employeeId}
                                                        disabled={!!batchLoading}
                                                        onClick={() =>
                                                            handleAssignOrders(
                                                                driver
                                                            )
                                                        }
                                                        className="w-full rounded-2xl border border-gray-100 p-4 flex items-center justify-between text-left hover:border-[#F97316] transition-all"
                                                    >

                                                        <div>

                                                            <h3 className="text-sm font-semibold text-[#1E2A3A]">

                                                                {driver.name}

                                                            </h3>

                                                            <p className="text-xs text-gray-400 mt-1">

                                                                {driver.phone}

                                                            </p>

                                                        </div>

                                                        {
                                                            batchLoading ===
                                                                driver.employeeId
                                                                ? (

                                                                    <SubtleSpinner
                                                                        size={16}
                                                                        className="text-[#F97316]"
                                                                    />

                                                                )
                                                                : (

                                                                    <div className="text-xs font-medium text-[#F97316]">

                                                                        Assign

                                                                    </div>

                                                                )
                                                        }

                                                    </button>

                                                ))
                                            }

                                        </div>

                                    </div>

                                </div>

                            )
                        }

                        {/* MAP */}

                        <SingleOrderMapModal
                            order={mapOrder}
                            onClose={() =>
                                setMapOrder(null)
                            }
                        />

                    </>

                )
            }

        </div>

    )
}