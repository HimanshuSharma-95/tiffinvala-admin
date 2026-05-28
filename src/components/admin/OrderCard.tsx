// 'use client'

// import { useState } from 'react'

// import {
//     Order,
//     OrderStatus
// } from '@/types/admin/orders'

// import SubtleSpinner from '@/components/general/SubtleSpinner'

// interface Props {
//     order: Order
//     currentStatus: OrderStatus
//     onConfirm: () => Promise<void> | void
//     onCancel: () => Promise<void> | void
// }

// export default function OrderCard({
//     order,
//     currentStatus,
//     onConfirm,
//     onCancel
// }: Props) {

//     const [actionLoading, setActionLoading] =
//         useState<'confirm' | 'cancel' | null>(null)

//     const handleConfirm = async () => {
//         try {
//             setActionLoading('confirm')

//             await onConfirm()
//         } finally {
//             setActionLoading(null)
//         }
//     }

//     const handleCancel = async () => {
//         try {
//             setActionLoading('cancel')

//             await onCancel()
//         } finally {
//             setActionLoading(null)
//         }
//     }

//     return (
//         <div className="bg-white w-full max-w-xl rounded-3xl p-5 shadow-sm border border-gray-100 mx-auto">

//             {/* HEADER */}
//             <div className="flex items-start justify-between gap-4 mb-4">

//                 <div className="min-w-0">

//                     <h3 className="font-semibold text-[#1E1E1E] truncate">
//                         {order.user.name}
//                     </h3>
//                     <h3 className="font-semibold text-[#1E1E1E] truncate">
//                         {order.user.phone}
//                     </h3>

//                     <p className="text-xs text-gray-400 mt-0.5">
//                         #{order.orderId.slice(-6)}
//                     </p>

//                 </div>

//                 <div className="text-right shrink-0">

//                     <p className="font-bold text-[#1E1E1E]">
//                         ${order.totalAmount}
//                     </p>

//                     <p className="text-xs text-gray-400 capitalize">
//                         {order.payment.status}
//                     </p>

//                 </div>

//             </div>

//             {/* ITEMS */}
//             <div className="space-y-2">

//                 {order.items.map(item => (

//                     <div
//                         key={item.productId}
//                         className="flex items-center justify-between gap-3 text-sm"
//                     >

//                         <span className="text-[#1E1E1E] truncate">
//                             {item.name}
//                         </span>

//                         <span className="text-gray-500 shrink-0">
//                             × {item.quantity}
//                         </span>

//                     </div>

//                 ))}

//             </div>

//             {/* TOTAL */}
//             <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between font-semibold text-[#1E1E1E]">

//                 <span>Total</span>

//                 <span>
//                     ${order.totalAmount}
//                 </span>

//             </div>

//             {/* ACTIONS */}
//             {/* ACTIONS */}
//             <div className="mt-5">

//                 {currentStatus === 'pending' && (

//                     <div className="grid grid-cols-2 gap-2">

//                         {/* CONFIRM */}
//                         <button
//                             onClick={handleConfirm}
//                             disabled={actionLoading !== null}
//                             className="bg-[#FF6B00] text-white h-10 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
//                         >

//                             {actionLoading === 'confirm' && (
//                                 <SubtleSpinner size={13} />
//                             )}

//                             <span>
//                                 Confirm
//                             </span>

//                         </button>

//                         {/* CANCEL */}
//                         <button
//                             onClick={handleCancel}
//                             disabled={actionLoading !== null}
//                             className="border border-[#FF6B00] text-[#FF6B00] h-10 rounded-xl font-medium hover:bg-orange-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
//                         >

//                             {actionLoading === 'cancel' && (
//                                 <SubtleSpinner size={13} />
//                             )}

//                             <span>
//                                 Cancel
//                             </span>

//                         </button>

//                     </div>

//                 )}

//                 {currentStatus === 'confirmed' && (

//                     <button
//                         onClick={handleCancel}
//                         disabled={actionLoading !== null}
//                         className="w-full border border-red-300 text-red-500 h-10 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
//                     >

//                         {actionLoading === 'cancel' && (
//                             <SubtleSpinner size={13} />
//                         )}

//                         <span>
//                             Cancel Order
//                         </span>

//                     </button>

//                 )}

//                 {currentStatus === 'cancelled' && (

//                     <button
//                         onClick={handleConfirm}
//                         disabled={actionLoading !== null}
//                         className="w-full bg-[#FF6B00] text-white h-10 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
//                     >

//                         {actionLoading === 'confirm' && (
//                             <SubtleSpinner size={13} />
//                         )}

//                         <span>
//                             Confirm Order
//                         </span>

//                     </button>

//                 )}

//             </div>

//         </div>
//     )
// }







'use client'

import { useState } from 'react'

import {
    Order,
    OrderStatus
} from '@/types/admin/orders'

import SubtleSpinner from '@/components/general/SubtleSpinner'

import {
    AnimatePresence,
    motion
} from 'framer-motion'

interface Props {
    order: Order
    currentStatus: OrderStatus
    onConfirm: () => Promise<void> | void
    onCancel: () => Promise<void> | void
}

export default function OrderCard({
    order,
    currentStatus,
    onConfirm,
    onCancel
}: Props) {

    const [actionLoading, setActionLoading] =
        useState<'confirm' | 'cancel' | null>(null)

    const [showCustomerDetails, setShowCustomerDetails] =
        useState(false)

    const handleConfirm = async () => {

        try {

            setActionLoading('confirm')

            await onConfirm()

        } finally {

            setActionLoading(null)
        }
    }

    const handleCancel = async () => {

        try {

            setActionLoading('cancel')

            await onCancel()

        } finally {

            setActionLoading(null)
        }
    }

    return (
        <>
            <div className="bg-white w-full max-w-xl rounded-3xl p-5 shadow-sm border border-gray-100 mx-auto">

                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 mb-4">

                    <div className="min-w-0">

                        <h3 className="font-semibold text-[#1E1E1E] truncate">
                            {order.user.name}
                        </h3>

                        {/* <h3 className="font-semibold text-[#1E1E1E] truncate">
                            {order.user.phone}
                        </h3> */}

                        <p className="text-xs text-gray-400 mt-0.5">
                            {order.user.username}
                        </p>

                    </div>

                    <div className="text-right shrink-0">

                        <p className="font-bold text-[#1E1E1E]">
                            ${order.totalAmount.toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400 capitalize">
                            {order.payment.status}
                        </p>

                    </div>

                </div>

                {/* CUSTOMER DETAILS BUTTON */}
                <button
                    onClick={() =>
                        setShowCustomerDetails(true)
                    }
                    className="mb-4 text-sm text-[#FF6B00] font-medium hover:opacity-80 transition-opacity"
                >
                    Customer Details
                </button>


                {/* ITEMS */}
                <div className="space-y-2">

                    {order.items.map((item, index) => (

                        <div
                            key={`${item.productId || item.comboId}-${index}`}
                            className="text-sm"
                        >

                            {/* MAIN ITEM */}
                            <div className="flex items-center justify-between gap-3">

                                <div className="min-w-0 flex items-center gap-2 flex-wrap">

                                    <p className="text-[#1E1E1E] font-medium">

                                        {item.name}

                                    </p>

                                    {item.variant?.size &&
                                        item.variant.size !== 'default' && (

                                            <span className="text-[11px] text-gray-400">

                                                ({item.variant.size})

                                            </span>

                                        )}

                                </div>

                                <span className="text-gray-500 shrink-0">

                                    × {item.quantity}

                                </span>

                            </div>

                            {/* COMBO PRODUCTS */}
                            {item.type === 'combo' &&
                                item.selections &&
                                item.selections.length > 0 && (

                                    <div className="mt-1 pl-3 space-y-1">

                                        {item.selections.flatMap(
                                            selection => selection.products
                                        ).map((product, pIndex) => (

                                            <div
                                                key={`${product.productId}-${pIndex}`}
                                                className="flex items-center justify-between text-xs"
                                            >

                                                <p className="text-gray-400">

                                                    • {product.name}

                                                </p>

                                                <span className="text-gray-400">

                                                    × {product.quantity}

                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                )}

                        </div>

                    ))}

                </div>

                {/* TOTAL */}
                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between font-semibold text-[#1E1E1E]">

                    <span>Total</span>

                    <span>
                        ${order.totalAmount.toFixed(2)}
                    </span>

                </div>

                {/* ACTIONS */}
                <div className="mt-5">

                    {currentStatus === 'pending' && (

                        <div className="grid grid-cols-2 gap-2">

                            {/* CONFIRM */}
                            <button
                                onClick={handleConfirm}
                                disabled={actionLoading !== null}
                                className="bg-[#FF6B00] text-white h-10 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                            >

                                {actionLoading === 'confirm' && (
                                    <SubtleSpinner size={13} />
                                )}

                                <span>
                                    Confirm
                                </span>

                            </button>

                            {/* CANCEL */}
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading !== null}
                                className="border border-[#FF6B00] text-[#FF6B00] h-10 rounded-xl font-medium hover:bg-orange-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >

                                {actionLoading === 'cancel' && (
                                    <SubtleSpinner size={13} />
                                )}

                                <span>
                                    Cancel
                                </span>

                            </button>

                        </div>

                    )}

                    {currentStatus === 'confirmed' && (

                        <button
                            onClick={handleCancel}
                            disabled={actionLoading !== null}
                            className="w-full border border-red-300 text-red-500 h-10 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >

                            {actionLoading === 'cancel' && (
                                <SubtleSpinner size={13} />
                            )}

                            <span>
                                Cancel Order
                            </span>

                        </button>

                    )}

                    {currentStatus === 'cancelled' && (

                        <button
                            onClick={handleConfirm}
                            disabled={actionLoading !== null}
                            className="w-full bg-[#FF6B00] text-white h-10 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                        >

                            {actionLoading === 'confirm' && (
                                <SubtleSpinner size={13} />
                            )}

                            <span>
                                Confirm Order
                            </span>

                        </button>

                    )}

                </div>

            </div>

            {/* CUSTOMER DETAILS MODAL */}
            <AnimatePresence>

                {showCustomerDetails && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.96
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                y: 10,
                                scale: 0.96
                            }}
                            transition={{
                                duration: 0.2
                            }}
                            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl"
                        >

                            <div className="flex items-center justify-between mb-5">

                                <h2 className="text-lg font-bold text-[#1E1E1E]">
                                    Customer Details
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowCustomerDetails(false)
                                    }
                                    className="text-sm text-gray-400 hover:text-gray-600"
                                >
                                    Close
                                </button>

                            </div>

                            <div className="space-y-4 text-sm">
                                {/* 
                                <div>
                                    <p className="text-gray-400">
                                        User ID
                                    </p>

                                    <p className="font-medium break-all">
                                        {order.user.userId}
                                    </p>
                                </div> */}

                                <div>
                                    <p className="text-gray-400">
                                        Name
                                    </p>

                                    <p className="font-medium">
                                        {order.user.name}
                                    </p>
                                </div>

                                {'username' in order.user && (
                                    <div>
                                        <p className="text-gray-400">
                                            Username
                                        </p>

                                        <p className="font-medium">
                                            {(order.user as any).username}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-gray-400">
                                        Email
                                    </p>

                                    <p className="font-medium break-all">
                                        {order.user.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-400">
                                        Phone
                                    </p>

                                    <p className="font-medium">
                                        {order.user.phone}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-gray-100">

                                    <p className="text-gray-400 mb-2">
                                        Delivery Address
                                    </p>

                                    <div className="space-y-1">

                                        <p className="font-medium">
                                            {order.deliveryDetails.addressLine1}
                                        </p>

                                        {!!order.deliveryDetails.addressLine2 && (
                                            <p className="font-medium">
                                                {order.deliveryDetails.addressLine2}
                                            </p>
                                        )}

                                        <p className="font-medium">
                                            {order.deliveryDetails.city}
                                        </p>

                                        <p className="font-medium">
                                            {order.deliveryDetails.state}
                                        </p>

                                        <p className="font-medium">
                                            {order.deliveryDetails.zipCode}
                                        </p>

                                        <p className="font-medium">
                                            {order.deliveryDetails.country}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>
        </>
    )
}