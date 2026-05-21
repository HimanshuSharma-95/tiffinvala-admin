'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft, Plus, Pencil, X,
    ChevronDown, ChevronUp
} from 'lucide-react'
import { getAllCombos, getCategories, createCombo } from '@/services/menuService'
import { Combo } from '@/types/menu'

interface ComboRuleForm {
    category: string[]
    quantity: number
    label: string
    isSelectionRequired: boolean
}

type View = 'list' | 'add'

export default function AllCombosPage() {
    const router = useRouter()
    const [view, setView] = useState<View>('list')
    const [combos, setCombos] = useState<Combo[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const hasFetched = useRef(false)

    // add combo form
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        size: '16oz',
        fullyVeg: false,
    })
    const [rules, setRules] = useState<ComboRuleForm[]>([
        { category: [], quantity: 1, label: '', isSelectionRequired: true }
    ])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [comboRes, catRes] = await Promise.all([
                getAllCombos(),
                getCategories(),
            ])
            setCombos(comboRes.data)
            setCategories(catRes.data.categories)
        } catch {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const addRule = () => setRules(p => [...p, { category: [], quantity: 1, label: '', isSelectionRequired: true }])
    const removeRule = (i: number) => setRules(p => p.filter((_, idx) => idx !== i))
    const updateRule = (i: number, field: keyof ComboRuleForm, value: any) =>
        setRules(p => p.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
    const toggleCategory = (ruleIndex: number, cat: string) => {
        const current = rules[ruleIndex].category
        updateRule(ruleIndex, 'category',
            current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]
        )
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.price) { toast.error('Fill required fields'); return }
        if (rules.some(r => r.category.length === 0 || !r.label)) {
            toast.error('Complete all rules')
            return
        }
        setSaving(true)
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                size: form.size,
                rules: rules.map(r => ({
                    category: r.category,
                    quantity: r.quantity,
                    label: r.label,
                    isSelectionRequired: r.isSelectionRequired,
                })),
                options: { fullyVeg: form.fullyVeg }
            }
            const res = await createCombo(payload)
            toast.success('Combo created!')
            setCombos(p => [...p, res.data])
            setForm({ name: '', description: '', price: '', size: '16oz', fullyVeg: false })
            setRules([{ category: [], quantity: 1, label: '', isSelectionRequired: true }])
            setView('list')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create combo')
        } finally {
            setSaving(false)
        }
    }

    // ── LIST VIEW
    if (view === 'list') return (
        <div className="min-h-screen bg-white pb-24">
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">All Combos</h1>
                </div>
                <span className="text-xs text-gray-400">{combos.length} combos</span>
            </div>

            {loading ? (
                <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : combos.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 gap-3 px-6">
                    <p className="text-sm text-gray-400">No combos yet</p>
                    <button
                        onClick={() => setView('add')}
                        className="bg-[#F97316] text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
                    >
                        Create First Combo
                    </button>
                </div>
            ) : (
                <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {combos.map(combo => (

                        <div
                            key={combo._id}
                            className="
    bg-gray-100
    rounded-2xl
    overflow-hidden
    border
    border-gray-100
    hover:shadow-sm
    transition
    flex
    min-h-42.5
"
                        >

                            {/* LEFT IMAGE */}
                            <div className="w-27.5 p-2 shrink-0">
                                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-200 relative">

                                    <img
                                        src={combo.image || '/defaultfood.png'}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Status dot */}
                                    {/* <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${combo.isActive ? 'bg-green-400' : 'bg-red-400'}`} /> */}
                                </div>
                            </div>

                            {/* RIGHT CONTENT */}
                            <div className="flex-1 p-3 flex flex-col justify-between">

                                {/* TOP */}
                                <div>
                                    {/* NAME */}
                                    <p className="text-sm font-semibold text-[#1E2A3A] leading-tight">
                                        {combo.name}
                                    </p>

                                    {/* DESCRIPTION */}
                                    {combo.description && (
                                        <p className="text-xs text-gray-500 mt-0.5 leading-tight line-clamp-2">
                                            {combo.description}
                                        </p>
                                    )}

                                    {/* PRICE */}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-sm font-bold text-[#F97316]">
                                            ${combo.price}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {combo.size}
                                        </span>
                                    </div>

                                    {/* RULE PREVIEW */}
                                    <div className="mt-1.5 space-y-0.5">

                                        {combo.rules.map((rule, i) => (
                                            <p
                                                key={i}
                                                className="text-xs text-gray-600 leading-tight"
                                            >
                                                {rule.quantity} × {rule.category.map(c => c.replace('_', ' ')).join(' / ')}
                                            </p>
                                        ))}

                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="mt-2">
                                    <button
                                        onClick={() => router.push(`/admin/menu-edit/all-combos/edit/${combo._id}`)}
                                        className="w-full bg-[#1E2A3A] text-white text-xs py-1.5 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            )}

            {/* Add FAB */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={() =>
                        router.push(
                            '/admin/menu-edit/all-combos/add'
                        )
                    }
                    className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-3 rounded-full shadow-lg font-semibold text-sm"
                >
                    <Plus size={18} />
                    Add Combo
                </button>
            </div>
        </div>
    )



}