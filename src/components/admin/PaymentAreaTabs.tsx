'use client'

interface Props {
    value: string
    onChange: (v: string) => void
}

export default function PaymentAreaTabs({
    value,
    onChange
}: Props) {

    const tabs = [
        {
            label: 'Seattle',
            value: 'seattle'
        },
        {
            label: 'Bay Area',
            value: 'bay_area'
        }
    ]

    return (
        <div className="w-full flex justify-center">

            <div className="bg-[#EEF1F6] rounded-full p-1 flex w-full max-w-xl">

                {tabs.map(tab => (

                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all

                        ${value === tab.value
                                ? 'bg-white text-[#FF6B00] shadow-sm'
                                : 'text-gray-400'
                            }`}
                    >

                        {tab.label}

                    </button>

                ))}

            </div>

        </div>
    )
}