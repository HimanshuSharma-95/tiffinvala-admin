// 'use client'

// import {
//     useEffect,
//     useRef,
//     useState
// } from 'react'

// import {
//     X
// } from 'lucide-react'

// import {
//     GoogleMap,
//     Marker,
//     Polyline,
//     useJsApiLoader
// } from '@react-google-maps/api'

// interface Props {
//     orders: any[]
//     onClose: () => void
// }

// export default function RouteMapModal({
//     orders,
//     onClose
// }: Props) {

//     const { isLoaded } =
//         useJsApiLoader({
//             googleMapsApiKey:
//                 process.env
//                     .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
//         })

//     const [
//         position,
//         setPosition
//     ] = useState({
//         x: 0,
//         y: 0
//     })

//     const [
//         dragging,
//         setDragging
//     ] = useState(false)

//     const dragOffset = useRef({
//         x: 0,
//         y: 0
//     })

//     const handleMouseDown =
//         (
//             e: React.MouseEvent
//         ) => {

//             setDragging(true)

//             dragOffset.current = {
//                 x:
//                     e.clientX -
//                     position.x,

//                 y:
//                     e.clientY -
//                     position.y
//             }
//         }

//     const handleMouseMove =
//         (
//             e: MouseEvent
//         ) => {

//             if (!dragging) return

//             setPosition({
//                 x:
//                     e.clientX -
//                     dragOffset.current.x,

//                 y:
//                     e.clientY -
//                     dragOffset.current.y
//             })
//         }

//     const handleMouseUp =
//         () => {

//             setDragging(false)
//         }

//     useEffect(() => {

//         window.addEventListener(
//             'mousemove',
//             handleMouseMove
//         )

//         window.addEventListener(
//             'mouseup',
//             handleMouseUp
//         )

//         return () => {

//             window.removeEventListener(
//                 'mousemove',
//                 handleMouseMove
//             )

//             window.removeEventListener(
//                 'mouseup',
//                 handleMouseUp
//             )
//         }

//     }, [dragging])

//     const routeCoordinates =
//         orders.map(order => ({
//             lat:
//                 order.deliveryDetails
//                     .location.lat,

//             lng:
//                 order.deliveryDetails
//                     .location.lng
//         }))

//     const center =
//         routeCoordinates[0]

//     return (

//         <div className="fixed inset-0 z-999 bg-black/40 overflow-hidden">

//             <div
//                 style={{
//                     transform: `translate(${position.x}px, ${position.y}px)`
//                 }}
//                 className="absolute top-10 left-1/2 -translate-x-1/2 bg-white rounded-3xl overflow-hidden shadow-2xl w-[82vw] max-w-3xl"
//             >

//                 {/* HEADER */}

//                 <div
//                     onMouseDown={handleMouseDown}
//                     className="h-14 px-5 border-b flex items-center justify-between bg-white cursor-move"
//                 >

//                     <div>

//                         <h2 className="text-sm font-bold text-[#1E2A3A]">

//                             Delivery Route

//                         </h2>

//                         <p className="text-xs text-gray-400 mt-1">

//                             Route in delivery sequence

//                         </p>

//                     </div>

//                     <button
//                         onClick={onClose}
//                         className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
//                     >

//                         <X size={18} />

//                     </button>

//                 </div>

//                 {/* MAP */}

//                 <div className="h-150 w-full">

//                     {
//                         isLoaded &&
//                         center && (

//                             <GoogleMap
//                                 mapContainerStyle={{
//                                     width: '100%',
//                                     height: '100%'
//                                 }}
//                                 zoom={11}
//                                 center={center}
//                             >

//                                 {/* ROUTE */}

//                                 {/* <Polyline
//                                     path={
//                                         routeCoordinates
//                                     }
//                                     options={{
//                                         strokeColor:
//                                             '#F97316',

//                                         strokeOpacity:
//                                             1,

//                                         strokeWeight:
//                                             4
//                                     }}
//                                 /> */}

//                                 {/* MARKERS */}

//                                 {
//                                     orders.map(
//                                         (
//                                             order,
//                                             index
//                                         ) => (

//                                             <Marker
//                                                 key={
//                                                     order.orderId
//                                                 }
//                                                 position={{
//                                                     lat:
//                                                         order.deliveryDetails
//                                                             .location.lat,

//                                                     lng:
//                                                         order.deliveryDetails
//                                                             .location.lng
//                                                 }}
//                                                 label={{
//                                                     text:
//                                                         String(
//                                                             index + 1
//                                                         ),

//                                                     color:
//                                                         'white',

//                                                     fontWeight:
//                                                         'bold'
//                                                 }}
//                                             />

//                                         )
//                                     )
//                                 }

//                             </GoogleMap>

//                         )
//                     }

//                 </div>

//             </div>

//         </div>

//     )
// }











'use client'

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import {
    X
} from 'lucide-react'

import {
    GoogleMap,
    Marker,
    Polyline,
    useJsApiLoader
} from '@react-google-maps/api'

interface Props {
    orders: any[]
    onClose: () => void
}

export default function RouteMapModal({
    orders,
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

    const handleMouseDown =
        (
            e: React.MouseEvent
        ) => {

            setDragging(true)

            dragOffset.current = {
                x:
                    e.clientX -
                    position.x,

                y:
                    e.clientY -
                    position.y
            }
        }

    const handleMouseMove =
        (
            e: MouseEvent
        ) => {

            if (!dragging) return

            setPosition({
                x:
                    e.clientX -
                    dragOffset.current.x,

                y:
                    e.clientY -
                    dragOffset.current.y
            })
        }

    const handleMouseUp =
        () => {

            setDragging(false)
        }

    useEffect(() => {

        window.addEventListener(
            'mousemove',
            handleMouseMove
        )

        window.addEventListener(
            'mouseup',
            handleMouseUp
        )

        return () => {

            window.removeEventListener(
                'mousemove',
                handleMouseMove
            )

            window.removeEventListener(
                'mouseup',
                handleMouseUp
            )
        }

    }, [dragging])

    /*
    -----------------------------------------
    ORIGINAL ROUTE COORDINATES
    -----------------------------------------
    */

    const routeCoordinates =
        useMemo(
            () =>
                orders.map(order => ({
                    lat:
                        order.deliveryDetails
                            .location.lat,

                    lng:
                        order.deliveryDetails
                            .location.lng
                })),
            [orders]
        )

    /*
    -----------------------------------------
    FIX OVERLAPPING MARKERS
    -----------------------------------------
    */

    const markerPositions =
        useMemo(() => {

            const locationCount:
                Record<
                    string,
                    number
                > = {}

            return orders.map(
                (
                    order
                ) => {

                    const lat =
                        order
                            .deliveryDetails
                            .location.lat

                    const lng =
                        order
                            .deliveryDetails
                            .location.lng

                    const key =
                        `${lat}-${lng}`

                    const count =
                        locationCount[
                        key
                        ] || 0

                    locationCount[
                        key
                    ] = count + 1

                    /*
                    VERY SMALL OFFSET
                    only visible on zoom
                    */

                    const offset =
                        0.00002 *
                        count

                    return {

                        lat:
                            lat +
                            offset *
                            Math.cos(
                                count
                            ),

                        lng:
                            lng +
                            offset *
                            Math.sin(
                                count
                            )
                    }
                }
            )

        }, [orders])

    const center =
        routeCoordinates[0]

    return (

        <div className="fixed inset-0 z-999 bg-black/40 overflow-hidden">

            <div
                style={{
                    transform:
                        `translate(${position.x}px, ${position.y}px)`
                }}
                className="absolute top-10 left-1/2 -translate-x-1/2 bg-white rounded-3xl overflow-hidden shadow-2xl w-[82vw] max-w-3xl"
            >

                {/* HEADER */}

                <div
                    onMouseDown={
                        handleMouseDown
                    }
                    className="h-14 px-5 border-b flex items-center justify-between bg-white cursor-move"
                >

                    <div>

                        <h2 className="text-sm font-bold text-[#1E2A3A]">

                            Delivery Route

                        </h2>

                        <p className="text-xs text-gray-400 mt-1">

                            Route in delivery sequence

                        </p>

                    </div>

                    <button
                        onClick={
                            onClose
                        }
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    >

                        <X size={18} />

                    </button>

                </div>

                {/* MAP */}

                <div className="h-150 w-full">

                    {
                        isLoaded &&
                        center && (

                            <GoogleMap
                                mapContainerStyle={{
                                    width:
                                        '100%',

                                    height:
                                        '100%'
                                }}
                                zoom={11}
                                center={
                                    center
                                }
                            >

                                {/* ROUTE */}

                                {/* <Polyline
                                    path={
                                        routeCoordinates
                                    }
                                    options={{
                                        strokeColor:
                                            '#F97316',

                                        strokeOpacity:
                                            1,

                                        strokeWeight:
                                            4
                                    }}
                                /> */}

                                {/* MARKERS */}

                                {
                                    orders.map(
                                        (
                                            order,
                                            index
                                        ) => (

                                            <Marker
                                                key={
                                                    order.orderId
                                                }
                                                position={
                                                    markerPositions[
                                                    index
                                                    ]
                                                }
                                                label={{
                                                    text:
                                                        String(
                                                            index + 1
                                                        ),

                                                    color:
                                                        'white',

                                                    fontWeight:
                                                        'bold'
                                                }}
                                            />

                                        )
                                    )
                                }

                            </GoogleMap>

                        )
                    }

                </div>

            </div>

        </div>

    )
}