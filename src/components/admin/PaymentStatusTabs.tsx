'use client'

interface Props {
    value: string
    onChange: (v: string) => void
}

export default function PaymentStatusTabs({
    value,
    onChange
}: Props) {

    return (
        <div className="w-full flex justify-center">

            <div className="bg-[#EEF1F6] rounded-full p-1 flex w-full max-w-md">

                {['pending', 'paid'].map(status => (

                    <button
                        key={status}
                        onClick={() => onChange(status)}
                        className={`flex-1 py-2 rounded-full text-xs font-medium capitalize transition-all

                        ${value === status
                                ? 'bg-white text-[#FF6B00] shadow-sm'
                                : 'text-gray-400'
                            }`}
                    >

                        {status}

                    </button>

                ))}

            </div>

        </div>
    )
}