'use client'

import {
    Plus,
    X,
    Loader2
} from 'lucide-react'

import { Driver } from '@/types/admin/route'

interface Props {
    driver: Driver
    type: 'add' | 'remove'
    loading?: boolean
    onClick: () => void
}

export default function DriverChip({
    driver,
    type,
    loading,
    onClick
}: Props) {

    return (

        <button
            onClick={onClick}
            disabled={loading}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50"
        >

            <div className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[10px] font-bold">

                {driver.name[0]}

            </div>

            <span className="text-[11px] font-semibold text-[#1E2A3A] whitespace-nowrap">

                {driver.name}

            </span>

            {
                loading
                    ? (
                        <Loader2
                            size={16}
                            className="animate-spin text-[#F97316]"
                        />
                    )
                    : type === 'add'
                        ? (
                            <Plus
                                size={16}
                                className="text-[#F97316]"
                            />
                        )
                        : (
                            <X
                                size={16}
                                className="text-[#F97316]"
                            />
                        )
            }

        </button>

    )
}