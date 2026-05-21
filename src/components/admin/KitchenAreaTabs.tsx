'use client'

interface Props {
    area: string
    onChange: (v: string) => void
}

export default function KitchenAreaTabs({
    area,
    onChange
}: Props) {

    const areas = [
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
        <div className="bg-[#EEF1F6] m-auto rounded-full p-1 flex w-full max-w-sm">

            {areas.map(a => (

                <button
                    key={a.value}
                    onClick={() =>
                        onChange(a.value)
                    }
                    className={`flex-1 py-3 rounded-full text-sm font-medium transition-all

                    ${area === a.value
                            ? 'bg-white text-[#FF6B00] shadow-sm'
                            : 'text-gray-400'
                        }`}
                >

                    {a.label}

                </button>

            ))}

        </div>
    )
}