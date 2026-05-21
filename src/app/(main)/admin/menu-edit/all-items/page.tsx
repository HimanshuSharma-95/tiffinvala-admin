'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Pencil } from 'lucide-react'
import { getAllProducts } from '@/services/menuService'
import { CategoryGroup, Product } from '@/types/menu'

export default function AllItemsPage() {
    const router = useRouter()
    const [groups, setGroups] = useState<CategoryGroup[]>([])
    const [loading, setLoading] = useState(true)
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await getAllProducts()
            // response.data.list is grouped by category
            setGroups(response.data.list)
        } catch {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white pb-24">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">All Items</h1>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="px-4 space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i}>
                            <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse mb-3" />
                            <div className="
    flex gap-3 overflow-x-auto pb-2
    md:grid md:grid-cols-6 md:overflow-visible
">
                                {[1, 2, 3, 4].map(j => (
                                    <div
                                        key={j}
                                        className="
        min-w-42.5
        h-40
        bg-gray-100
        rounded-xl
        animate-pulse
        shrink-0
    "
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-4 space-y-6">
                    {groups.map(group => (
                        <div key={group.category}>

                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-[#1E2A3A] capitalize">
                                    {group.category.replace('_', ' ')}
                                    <span className="text-gray-400 font-normal ml-1">
                                        ({group.products.length})
                                    </span>
                                </h2>
                            </div>

                            {/* 4 column grid */}
                            <div className="
    flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide
    md:grid md:grid-cols-6 md:overflow-visible
">
                                {group.products.map(product => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onEdit={() => router.push(`/admin/menu-edit/all-items/edit/${product._id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Item FAB */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={() => router.push('/admin/menu-edit/all-items/add')}
                    className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-3 rounded-full shadow-lg font-semibold text-sm"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>
        </div>
    )
}



function ProductCard({ product, onEdit }: { product: Product; onEdit: () => void }) {
    return (
        // <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col">
        <div
            className="
        min-w-42.5
        max-w-42.5
        md:min-w-0
        md:max-w-none
        bg-gray-100
        border
        border-gray-200
        rounded-xl
        overflow-hidden
        flex
        flex-col
        shrink-0
        snap-start
    "
        >

            {/* Image */}
            <div className="w-full bg-gray-200 overflow-hidden relative" style={{ aspectRatio: '4/3' }}>
                <img
                    src={product.image?.trim() || '/defaultfood.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/defFoodImage.png'
                    }}
                />

                {/* Availability */}
                {/* <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-400' : 'bg-red-400'}`} /> */}
            </div>

            {/* Info */}
            <div className="p-2 flex flex-col gap-1">

                {/* Name */}
                <p className="text-xs font-semibold text-[#1E2A3A] line-clamp-1">
                    {product.name}
                </p>

                {/* Description (optional small) */}
                <p className="text-[10px] text-gray-400 line-clamp-1">
                    {product.description}
                </p>

                {/* Variants pricing */}
                <div className="flex flex-wrap gap-1 mt-1">
                    {product.variants?.map((variant, index) => (
                        <span
                            key={index}
                            className="text-[10px] bg-orange-50 text-[#F97316] px-2 py-0.5 rounded-md font-medium"
                        >
                            {variant.size}: ${variant.price}
                        </span>
                    ))}
                </div>

                {/* Edit button */}
                <button
                    onClick={onEdit}
                    className="w-full flex items-center justify-center gap-1 bg-[#1E2A3A] text-white text-[10px] py-1 rounded-lg mt-1"
                >
                    Edit
                </button>
            </div>
        </div>
    )
}


