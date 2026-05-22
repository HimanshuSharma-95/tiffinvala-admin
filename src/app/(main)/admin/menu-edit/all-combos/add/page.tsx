'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Plus,
    X,
    ImageIcon
} from 'lucide-react'

import {
    createCombo,
    getCategories,
    updateComboImage
} from '@/services/menuService'

import { Category } from '@/types/menu'

interface RuleForm {
    category: string[]
    quantity: number
    label: string
    allowCustomSelection: boolean
}

export default function AddComboPage() {
    const router = useRouter()

    const [categories, setCategories] = useState<Category[]>([])

    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    const [comboId, setComboId] = useState<string | null>(null)

    const [image, setImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const hasFetched = useRef(false)

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        size: '16oz',
        fullyVeg: false,
    })


    const [rules, setRules] = useState<RuleForm[]>([
        {
            category: [],
            quantity: 1,
            label: '',
            allowCustomSelection: true
        }
    ])

    useEffect(() => {
        if (hasFetched.current) return

        hasFetched.current = true

        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await getCategories()

            setCategories(res.data.categories || [])
        } catch {
            toast.error('Failed to load categories')
        }
    }

    const addRule = () => {
        setRules(prev => [
            ...prev,
            {
                category: [],
                quantity: 1,
                label: '',
                allowCustomSelection: true
            }
        ])
    }

    const removeRule = (index: number) => {
        if (rules.length === 1) return

        setRules(prev =>
            prev.filter((_, i) => i !== index)
        )
    }

    const updateRule = (
        index: number,
        field: keyof RuleForm,
        value: any
    ) => {
        setRules(prev =>
            prev.map((rule, i) =>
                i === index
                    ? { ...rule, [field]: value }
                    : rule
            )
        )
    }

    const toggleCategory = (
        ruleIndex: number,
        categoryName: string
    ) => {
        const current = rules[ruleIndex].category

        updateRule(
            ruleIndex,
            'category',
            current.includes(categoryName)
                ? current.filter(c => c !== categoryName)
                : [...current, categoryName]
        )
    }

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        setImage(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const isFormValid = () => {
        return (
            form.name &&
            form.price &&
            rules.every(r => r.category.length > 0)
        )
    }

    const handleCreate = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        if (!isFormValid()) {
            toast.error('Fill all required fields')
            return
        }

        const payload = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            size: form.size,
            rules: rules.map(rule => ({
                category: rule.category,
                quantity: rule.quantity,
                label: rule.label,
                allowCustomSelection:
                    rule.allowCustomSelection
            })),
            options: {
                fullyVeg: form.fullyVeg
            }
        }

        setSaving(true)

        try {
            const res = await createCombo(payload)

            setComboId(res.combo._id)

            toast.success(
                'Combo created! Now upload image.'
            )
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                'Failed to create combo'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleUploadImage = async () => {
        if (!comboId || !image) return

        setUploadingImage(true)

        try {
            await updateComboImage(comboId, image)

            toast.success('Image uploaded!')

            router.back()
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                'Failed to upload image'
            )
        } finally {
            setUploadingImage(false)
        }
    }

    return (
        <div className="min-h-screen bg-white pb-10">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-4">

                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>

                <h1 className="text-lg font-bold text-[#1E2A3A]">
                    Add Combo
                </h1>

            </div>

            <form
                onSubmit={handleCreate}
                className="max-w-md mx-auto px-4 space-y-5"
            >

                {/* NAME */}
                <div>
                    <label className="text-xs text-gray-500 font-medium">
                        NAME *
                    </label>

                    <input
                        value={form.name}
                        onChange={e =>
                            setForm(p => ({
                                ...p,
                                name: e.target.value
                            }))
                        }
                        placeholder="The Trio"
                        className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-xs text-gray-500 font-medium">
                        DESCRIPTION
                    </label>

                    <textarea
                        value={form.description}
                        onChange={e =>
                            setForm(p => ({
                                ...p,
                                description: e.target.value
                            }))
                        }
                        rows={3}
                        placeholder="Describe combo..."
                        className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    />
                </div>

                {/* PRICE + SIZE */}
                {/* <div className="flex gap-3">

                    <div className="flex-1">
                        <label className="text-xs text-gray-500 font-medium">
                            PRICE *
                        </label>

                        <input
                            type="number"
                            value={form.price}
                            onChange={e =>
                                setForm(p => ({
                                    ...p,
                                    price: e.target.value
                                }))
                            }
                            className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-xs text-gray-500 font-medium">
                            SIZE
                        </label>

                        <select
                            value={form.size}
                            onChange={e =>
                                setForm(p => ({
                                    ...p,
                                    size: e.target.value
                                }))
                            }
                            className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                        >
                            <option value="8oz">
                                8oz
                            </option>
                            <option value="16oz">
                                16oz
                            </option>
                            <option value="32oz">
                                32oz
                            </option>
                        </select>
                    </div>

                </div> */}

                {/* PRICE + SIZE */}
                <div className="flex gap-3">

                    <div className="flex-1">
                        <label className="text-xs text-gray-500 font-medium">
                            PRICE *
                        </label>

                        <input
                            type="number"
                            value={form.price}
                            onChange={e =>
                                setForm(p => ({
                                    ...p,
                                    price: e.target.value
                                }))
                            }
                            className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-xs text-gray-500 font-medium">
                            SIZE
                        </label>

                        <select
                            value={form.size}
                            onChange={e =>
                                setForm(p => ({
                                    ...p,
                                    size: e.target.value
                                }))
                            }
                            className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                        >
                            <option value="8oz">
                                8oz
                            </option>

                            <option value="16oz">
                                16oz
                            </option>

                            <option value="32oz">
                                32oz
                            </option>
                        </select>
                    </div>

                </div>

                {/* RULES */}
                <div>

                    <div className="flex items-center justify-between mb-2">

                        <label className="text-xs text-gray-500 font-medium">
                            COMBO RULES
                        </label>

                        <button
                            type="button"
                            onClick={addRule}
                            className="text-xs text-[#F97316] font-semibold flex items-center gap-1"
                        >
                            <Plus size={12} />
                            Add Rule
                        </button>

                    </div>

                    <div className="space-y-3">

                        {rules.map((rule, index) => (

                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-3 space-y-3"
                            >

                                <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold text-[#1E2A3A]">
                                        Rule {index + 1}
                                    </p>

                                    {rules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeRule(index)
                                            }
                                            className="text-red-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}

                                </div>

                                <input
                                    value={rule.label}
                                    onChange={e =>
                                        updateRule(
                                            index,
                                            'label',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Label"
                                    className="w-full bg-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-200"
                                />

                                <input
                                    type="number"
                                    min={1}
                                    value={rule.quantity}
                                    onChange={e =>
                                        updateRule(
                                            index,
                                            'quantity',
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="w-full bg-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-200"
                                />

                                <div className="flex flex-wrap gap-1.5">

                                    {categories.map(category => (

                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() =>
                                                toggleCategory(
                                                    index,
                                                    category.name
                                                )
                                            }
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize transition-colors
                                            ${rule.category.includes(
                                                category.name
                                            )
                                                    ? 'bg-[#F97316] text-white border-[#F97316]'
                                                    : 'bg-white text-gray-500 border-gray-200'
                                                }`}
                                        >
                                            {category.name.replace(
                                                /_/g,
                                                ' '
                                            )}
                                        </button>

                                    ))}

                                </div>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateRule(
                                                index,
                                                'allowCustomSelection',
                                                !rule.allowCustomSelection
                                            )
                                        }
                                        className={`w-10 h-5 rounded-full transition-colors ${rule.allowCustomSelection
                                                ? 'bg-[#F97316]'
                                                : 'bg-gray-300'
                                            }`}
                                    >

                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mx-0.5
            ${rule.allowCustomSelection
                                                    ? 'translate-x-5'
                                                    : 'translate-x-0'
                                                }`}
                                        />

                                    </button>

                                    <span className="text-xs text-gray-500">
                                        Custom selection allowed
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* FULLY VEG */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            setForm(p => ({
                                ...p,
                                fullyVeg: !p.fullyVeg
                            }))
                        }
                        className={`w-12 h-6 rounded-full transition-colors
                        ${form.fullyVeg
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5
                            ${form.fullyVeg
                                    ? 'translate-x-6'
                                    : 'translate-x-0'
                                }`}
                        />
                    </button>

                    <span className="text-sm text-gray-500">
                        Fully Vegetarian
                    </span>

                </div>

                {/* CREATE */}
                <button
                    type="submit"
                    disabled={
                        saving || !isFormValid()
                    }
                    className={`w-full py-3 rounded-xl font-semibold transition-colors
                    ${saving || !isFormValid()
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-[#F97316] text-white'
                        }`}
                >
                    {saving
                        ? 'Creating...'
                        : 'Create Combo'}
                </button>

                {/* IMAGE SECTION */}
                {comboId && (

                    <div className="space-y-3 border-t border-gray-200 pt-5">

                        <div className="flex justify-center">

                            <div className="w-48 h-48 p-2 bg-gray-100 rounded-2xl">

                                <img
                                    src={
                                        previewUrl ||
                                        '/defaultfood.png'
                                    }
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        (
                                            e.currentTarget as HTMLImageElement
                                        ).src =
                                            '/defaultfood.png'
                                    }}
                                />

                            </div>

                        </div>

                        <div className="flex gap-2">

                            <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-xl py-2.5 text-sm text-gray-500 cursor-pointer">

                                <ImageIcon size={15} />

                                {image
                                    ? image.name.slice(0, 20)
                                    : 'Choose Image'}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                    className="hidden"
                                />

                            </label>

                            {image && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null)
                                        setPreviewUrl(null)
                                    }}
                                    className="w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"
                                >
                                    <X size={15} />
                                </button>
                            )}

                        </div>

                        <button
                            type="button"
                            onClick={
                                handleUploadImage
                            }
                            disabled={
                                !image ||
                                uploadingImage
                            }
                            className={`w-full py-3 rounded-xl font-semibold
                            ${!image ||
                                    uploadingImage
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-[#1E2A3A] text-white'
                                }`}
                        >
                            {uploadingImage
                                ? 'Uploading...'
                                : 'Upload Image'}
                        </button>

                    </div>

                )}

            </form>

        </div>
    )
}