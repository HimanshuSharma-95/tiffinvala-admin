// src/app/(main)/admin/orders/components/OrdersTabs.tsx

import { OrderStatus } from '@/types/admin/orders'

interface Props {
    status: OrderStatus
    onChange: (v: OrderStatus) => void
}

export default function OrdersTabs({
    status,
    onChange
}: Props) {
    const tabs: {
        label: string
        value: OrderStatus
    }[] = [
            {
                label: 'Recieved',
                value: 'pending'
            },
            {
                label: 'Confirmed',
                value: 'confirmed'
            },
            {
                label: 'Cancelled',
                value: 'cancelled'
            }
        ]

    return (
        <div className="bg-[#EEF1F6] rounded-full p-1 flex w-full max-w-2xl">

            {tabs.map(tab => (

                <button
                    key={tab.value}
                    onClick={() =>
                        onChange(tab.value)
                    }
                    className={`flex-1 py-3 rounded-full text-sm font-medium transition-all
                    ${status === tab.value
                            ? 'bg-white text-[#1E1E1E] shadow-sm'
                            : 'text-gray-400'
                        }`}
                >
                    {tab.label}
                </button>

            ))}

        </div>
    )
}