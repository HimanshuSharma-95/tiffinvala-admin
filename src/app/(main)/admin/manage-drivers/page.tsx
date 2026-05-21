'use client'

import { useEffect, useState } from 'react'

import {
    ArrowLeft,
    Plus,
    Loader2,
    UserRound,
    Eye,
    EyeOff,
    Trash2
} from 'lucide-react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import {
    createDriver,
    deleteDriver,
    getDriversByArea
} from '@/services/admin/driverService'

import {
    Driver
} from '@/types/admin/drivers'

import {
    createDriverSchema
} from '@/lib/validators'

import DriverListCard
    from '@/components/admin/DriverListCard'

export default function ManageDriversPage() {

    const router = useRouter()

    const [loading, setLoading] =
        useState(true)

    const [creating, setCreating] =
        useState(false)

    const [showModal, setShowModal] =
        useState(false)

    const [showPassword, setShowPassword] =
        useState(false)

    const [deletingId, setDeletingId] =
        useState<string | null>(null)

    const [seattleDrivers, setSeattleDrivers] =
        useState<Driver[]>([])

    const [bayDrivers, setBayDrivers] =
        useState<Driver[]>([])

    const [form, setForm] =
        useState<{
            name: string
            email: string
            phone: string
            password: string
            assignedArea: 'seattle' | 'bay_area'
        }>({
            name: '',
            email: '',
            phone: '',
            password: '',
            assignedArea: 'seattle'
        })

    useEffect(() => {

        fetchDrivers()

    }, [])

    const fetchDrivers = async () => {

        setLoading(true)

        try {

            const [
                seattle,
                bay
            ] = await Promise.all([

                getDriversByArea(
                    'seattle'
                ),

                getDriversByArea(
                    'bay_area'
                )

            ])

            setSeattleDrivers(
                seattle.data.drivers || []
            )

            setBayDrivers(
                bay.data.drivers || []
            )

        } finally {

            setLoading(false)
        }
    }

    const handleCreateDriver = async () => {

        const parsed =
            createDriverSchema.safeParse(form)

        if (!parsed.success) {

            toast.error(
                parsed.error.issues[0].message
            )

            return
        }

        setCreating(true)

        try {

            const response =
                await createDriver({
                    ...form,
                    role: 'driver'
                })

            const createdDriver =
                response.data

            toast.success(
                'Driver created successfully'
            )

            // OPTIMISTIC ADD
            if (
                createdDriver.assignedArea ===
                'seattle'
            ) {

                setSeattleDrivers(prev => [

                    {
                        employeeId: createdDriver.id,
                        name: createdDriver.name,
                        username: '',
                        email: createdDriver.email,
                        phone: form.phone,
                        role: 'driver',
                        assignedArea: 'seattle',
                        isDriverAvailable: true,
                        status: 'verified',
                        profile_image: '',
                        createdAt:
                            createdDriver.createdAt
                    },

                    ...prev
                ])

            } else {

                setBayDrivers(prev => [

                    {
                        employeeId: createdDriver.id,
                        name: createdDriver.name,
                        username: '',
                        email: createdDriver.email,
                        phone: form.phone,
                        role: 'driver',
                        assignedArea: 'bay_area',
                        isDriverAvailable: true,
                        status: 'verified',
                        profile_image: '',
                        createdAt:
                            createdDriver.createdAt
                    },

                    ...prev
                ])
            }

            setShowModal(false)

            setForm({
                name: '',
                email: '',
                phone: '',
                password: '',
                assignedArea: 'seattle'
            })

        } catch {

            toast.error(
                'Failed to create driver'
            )

        } finally {

            setCreating(false)
        }
    }

    const handleDeleteDriver = async (
        employeeId: string,
        area: string
    ) => {

        const confirmed =
            window.confirm(
                'Delete this driver?'
            )

        if (!confirmed) return

        setDeletingId(employeeId)

        try {

            await deleteDriver(
                employeeId
            )

            toast.success(
                'Driver deleted'
            )

            // OPTIMISTIC DELETE
            if (area === 'seattle') {

                setSeattleDrivers(prev =>
                    prev.filter(
                        driver =>
                            driver.employeeId !==
                            employeeId
                    )
                )

            } else {

                setBayDrivers(prev =>
                    prev.filter(
                        driver =>
                            driver.employeeId !==
                            employeeId
                    )
                )
            }

        } catch {

            toast.error(
                'Failed to delete driver'
            )

        } finally {

            setDeletingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-white pb-10">

            {/* TOP */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() =>
                                router.back()
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >

                            <ArrowLeft size={16} />

                        </button>

                        <h1 className="font-bold text-[#1E2A3A]">

                            Manage Drivers

                        </h1>

                    </div>

                    <button
                        onClick={() =>
                            setShowModal(true)
                        }
                        className="h-9 px-4 rounded-full bg-[#FF6B00] text-white text-xs font-semibold flex items-center gap-2"
                    >

                        <Plus size={14} />

                        Add Driver

                    </button>

                </div>

            </div>

            {loading ? (

                <div className="flex justify-center py-20">

                    <Loader2
                        size={20}
                        className="animate-spin text-[#FF6B00]"
                    />

                </div>

            ) : (

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4">

                    {/* SEATTLE */}
                    <div>

                        <div className="flex items-center gap-2 mb-4">

                            <UserRound
                                size={16}
                                className="text-[#FF6B00]"
                            />

                            <h2 className="font-semibold text-[#1E2A3A]">

                                Seattle Drivers

                            </h2>

                        </div>

                        <div className="space-y-3">

                            {seattleDrivers.length === 0 ? (

                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-10 text-center">

                                    <p className="text-sm font-medium text-gray-500">

                                        No drivers added

                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">

                                        No drivers assigned to Seattle

                                    </p>

                                </div>

                            ) : (

                                seattleDrivers.map(driver => (

                                    <div
                                        key={driver.employeeId}
                                        className="animate-slide-up"
                                    >

                                        <DriverListCard
                                            driver={driver}
                                            deleting={
                                                deletingId ===
                                                driver.employeeId
                                            }
                                            onDelete={() =>
                                                handleDeleteDriver(
                                                    driver.employeeId,
                                                    'seattle'
                                                )
                                            }
                                        />

                                    </div>

                                ))

                            )}

                        </div>
                    </div>

                    {/* BAY AREA */}
                    <div>

                        <div className="flex items-center gap-2 mb-4">

                            <UserRound
                                size={16}
                                className="text-[#FF6B00]"
                            />

                            <h2 className="font-semibold text-[#1E2A3A]">

                                Bay Area Drivers

                            </h2>

                        </div>

                        <div className="space-y-3">

                            {bayDrivers.length === 0 ? (

                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-10 text-center">

                                    <p className="text-sm font-medium text-gray-500">

                                        No drivers added

                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">

                                        No drivers assigned to Bay Area

                                    </p>

                                </div>

                            ) : (

                                bayDrivers.map(driver => (

                                    <div
                                        key={driver.employeeId}
                                        className="animate-slide-up"
                                    >

                                        <DriverListCard
                                            driver={driver}
                                            deleting={
                                                deletingId ===
                                                driver.employeeId
                                            }
                                            onDelete={() =>
                                                handleDeleteDriver(
                                                    driver.employeeId,
                                                    'bay_area'
                                                )
                                            }
                                        />

                                    </div>

                                ))

                            )}

                        </div>
                    </div>

                </div>

            )}

            {/* MODAL */}
            {showModal && (

                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        className="bg-white w-full max-w-md rounded-3xl p-6 animate-slide-up"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h2 className="font-bold text-lg mb-5">

                            Add Driver

                        </h2>

                        <div className="space-y-4">

                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value
                                    })
                                }
                                className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm"
                            />

                            <input
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value
                                    })
                                }
                                className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm"
                            />

                            <input
                                placeholder="Phone"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value
                                    })
                                }
                                className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm"
                            />

                            {/* PASSWORD */}
                            <div className="relative">

                                <input
                                    placeholder="Password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password:
                                                e.target.value
                                        })
                                    }
                                    className="w-full h-11 px-4 pr-11 rounded-2xl border border-gray-200 outline-none text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >

                                    {showPassword ? (

                                        <EyeOff size={16} />

                                    ) : (

                                        <Eye size={16} />

                                    )}

                                </button>

                            </div>

                            <select
                                value={form.assignedArea}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        assignedArea:
                                            e.target.value as
                                            'seattle' | 'bay_area'
                                    })
                                }
                                className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none text-sm"
                            >

                                <option value="seattle">
                                    Seattle
                                </option>

                                <option value="bay_area">
                                    Bay Area
                                </option>

                            </select>

                            <button
                                onClick={handleCreateDriver}
                                disabled={creating}
                                className="w-full h-11 rounded-2xl bg-[#FF6B00] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                            >

                                {creating && (

                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />

                                )}

                                Create Driver

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}