// src/app/(main)/admin/orders/components/OrdersCalendar.tsx

'use client'

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface Props {
    selectedDate: Date | undefined
    onSelect: (
        date: Date | undefined
    ) => void
}

export default function OrdersCalendar({
    selectedDate,
    onSelect
}: Props) {
    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm">

            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onSelect}
            />

        </div>
    )
}