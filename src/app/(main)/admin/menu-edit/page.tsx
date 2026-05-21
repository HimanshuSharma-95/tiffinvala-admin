'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, UtensilsCrossed, PackagePlus, MapPin } from 'lucide-react'

export default function MenuEditPage() {
    const router = useRouter()

    const sections = [
        {
            title: 'All Items',
            description: 'View and manage all products',
            icon: UtensilsCrossed,
            color: 'text-orange-400',
            href: '/admin/menu-edit/all-items',
        },
        {
            title: 'All Combos',
            description: 'View and manage all combo packages',
            icon: PackagePlus,
            color: 'text-purple-400',
            href: '/admin/menu-edit/all-combos',
        },
        {
            title: 'Seattle Menu',
            description: 'Manage Seattle area specific menu',
            icon: MapPin,
            color: 'text-blue-400',
            href: '/admin/menu-edit/area/seattle',
        },
        {
            title: 'Bay Area Menu',
            description: 'Manage Bay Area specific menu',
            icon: MapPin,
            color: 'text-green-400',
            href: '/admin/menu-edit/area/bay-area',
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            <div className="flex items-center gap-3 px-4 py-4">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-bold text-[#1E2A3A]">Menu Management</h1>
            </div>

            <div className="max-w-md mx-auto px-4 mt-2 space-y-3">
                {sections.map((section) => (
                    <button
                        key={section.href}
                        onClick={() => router.push(section.href)}
                        className="w-full bg-gray-100 rounded-2xl px-4 py-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <section.icon size={18} className={section.color} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-[#1E2A3A]">{section.title}</p>
                                <p className="text-xs text-gray-400">{section.description}</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                ))}
            </div>
        </div>
    )
}