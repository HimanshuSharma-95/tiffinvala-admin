'use client'

import {
    useRef,
    useState
} from 'react'

import { X } from 'lucide-react'

import {
    GoogleMap,
    Marker,
    useJsApiLoader
} from '@react-google-maps/api'

import { Order } from '@/types/admin/route'

interface Props {
    order: Order | null
    onClose: () => void
}

export default function SingleOrderMapModal({
    order,
    onClose
}: Props) {

    const { isLoaded } =
        useJsApiLoader({
            googleMapsApiKey:
                process.env
                    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
        })

    const [
        position,
        setPosition
    ] = useState({
        x: 0,
        y: 0
    })

    const [
        dragging,
        setDragging
    ] = useState(false)

    const dragOffset = useRef({
        x: 0,
        y: 0
    })

    if (!order) return null

    return (

        <div className="fixed inset-0 z-50 bg-black/40 overflow-hidden">

            <div
                className="absolute bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
                style={{
                    left: `calc(50% - 24rem + ${position.x}px)`,
                    top: `calc(50% - 320px + ${position.y}px)`
                }}
            >

                {/* HEADER */}

                <div
                    onMouseDown={(e) => {

                        setDragging(true)

                        dragOffset.current = {
                            x:
                                e.clientX -
                                position.x,

                            y:
                                e.clientY -
                                position.y
                        }

                        const handleMouseMove =
                            (
                                moveEvent: MouseEvent
                            ) => {

                                setPosition({
                                    x:
                                        moveEvent.clientX -
                                        dragOffset.current.x,

                                    y:
                                        moveEvent.clientY -
                                        dragOffset.current.y
                                })
                            }

                        const handleMouseUp = () => {

                            setDragging(false)

                            window.removeEventListener(
                                'mousemove',
                                handleMouseMove
                            )

                            window.removeEventListener(
                                'mouseup',
                                handleMouseUp
                            )
                        }

                        window.addEventListener(
                            'mousemove',
                            handleMouseMove
                        )

                        window.addEventListener(
                            'mouseup',
                            handleMouseUp
                        )
                    }}
                    className={`px-5 py-4 border-b bg-white flex items-start justify-between gap-4 select-none

                    ${dragging
                            ? 'cursor-grabbing'
                            : 'cursor-grab'
                        }`}
                >

                    <div>

                        <h2 className="text-lg font-bold text-[#1E2A3A]">

                            {order.user.full_name}

                        </h2>

                        <p className="text-xs text-gray-400 mt-1">

                            {order.deliveryDetails.addressLine1}

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                    >

                        <X size={18} />

                    </button>

                </div>

                {/* MAP */}

                <div className="h-100 w-full">

                    {
                        isLoaded && (

                            <GoogleMap
                                mapContainerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                zoom={15}
                                center={{
                                    lat: Number(
                                        order.deliveryDetails
                                            .location.lat
                                    ),

                                    lng: Number(
                                        order.deliveryDetails
                                            .location.lng
                                    )
                                }}
                            >

                                <Marker
                                    position={{
                                        lat: Number(
                                            order.deliveryDetails
                                                .location.lat
                                        ),

                                        lng: Number(
                                            order.deliveryDetails
                                                .location.lng
                                        )
                                    }}
                                />

                            </GoogleMap>

                        )
                    }

                </div>

            </div>

        </div>

    )
}