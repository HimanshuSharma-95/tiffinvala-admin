// 'use client'

// import {
//     useEffect,
//     useState
// } from 'react'

// import {
//     useParams,
//     useRouter
// } from 'next/navigation'

// import Image from 'next/image'

// import {
//     ArrowLeft
// } from 'lucide-react'

// import {
//     toast
// } from 'sonner'

// import {
//     DriverOrder
// } from '@/types/driver/route'

// import {
//     markOrderDelivered
// } from '@/services/driver/driverService'

// import DeliverOrderCard
//     from '@/components/driver/DeliverOrderCard'

// import SubtleSpinner
//     from '@/components/general/SubtleSpinner'

// export default function DeliverOrderPage() {

//     const params = useParams()

//     const router = useRouter()

//     const orderId =
//         params.orderId as string

//     const [
//         order,
//         setOrder
//     ] = useState<DriverOrder | null>(null)

//     const [
//         image,
//         setImage
//     ] = useState<File | null>(null)

//     const [
//         preview,
//         setPreview
//     ] = useState<string | null>(null)

//     const [
//         loading,
//         setLoading
//     ] = useState(false)

//     useEffect(() => {

//         const search =
//             new URLSearchParams(
//                 window.location.search
//             )

//         const data =
//             search.get('data')

//         if (!data) return

//         try {

//             const parsed =
//                 JSON.parse(
//                     decodeURIComponent(data)
//                 )

//             setOrder(parsed)

//             if (
//                 parsed?.deliveryProofImage
//             ) {

//                 setPreview(
//                     parsed.deliveryProofImage
//                 )
//             }

//         } catch {

//             toast.error(
//                 'Failed to load order'
//             )
//         }

//     }, [])

//     const handleImage = (
//         e: React.ChangeEvent<HTMLInputElement>
//     ) => {

//         const file =
//             e.target.files?.[0]

//         if (!file) return

//         setImage(file)

//         setPreview(
//             URL.createObjectURL(file)
//         )
//     }

//     const handleUpload = async () => {

//         if (!image) {

//             toast.error(
//                 'Capture image first'
//             )

//             return
//         }

//         try {

//             setLoading(true)

//             const res =
//                 await markOrderDelivered(
//                     orderId,
//                     image
//                 )

//             toast.success(
//                 'Order delivered'
//             )

//             setOrder(prev =>
//                 prev
//                     ? {
//                         ...prev,
//                         isorderdelivered: true,
//                         deliveredAt:
//                             res.data.data.deliveredAt,
//                         deliveryProofImage:
//                             res.data.data.deliveryProofImage
//                     }
//                     : null
//             )

//         } catch {

//             toast.error(
//                 'Upload failed'
//             )

//         } finally {

//             setLoading(false)
//         }
//     }

//     return (

//         <div className="min-h-screen bg-[#FAFAFA] p-4">

//             <div className="max-w-2xl mx-auto space-y-4">

//                 {/* BACK */}

//                 <div className="flex items-center mb-2">

//                     <button
//                         onClick={() =>
//                             router.back()
//                         }
//                         className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-all shadow-sm"
//                     >

//                         <ArrowLeft size={18} />

//                     </button>

//                 </div>

//                 {/* ORDER */}

//                 {
//                     order && (

//                         <DeliverOrderCard
//                             order={order}
//                             onDeliver={() => { }}
//                         />
//                     )
//                 }

//                 {/* DELIVERY PROOF */}

//                 <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">

//                     <h2 className="text-lg font-bold text-[#1E2A3A] mb-4">

//                         Delivery Proof

//                     </h2>

//                     {/* CAPTURE */}

//                     <label className="w-full h-44 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer bg-gray-50 active:scale-[0.99] transition-all">

//                         <span className="text-sm font-semibold text-gray-700">

//                             Capture Delivery Image

//                         </span>

//                         <span className="text-xs text-gray-400 mt-1">

//                             Camera opens directly

//                         </span>

//                         <input
//                             type="file"
//                             accept="image/*"
//                             capture="environment"
//                             onChange={handleImage}
//                             className="hidden"
//                         />

//                     </label>
//                     {/* PREVIEW */}

//                     {
//                         preview && (

//                             <div className="mt-5">

//                                 <Image
//                                     src={preview}
//                                     alt="Proof"
//                                     width={600}
//                                     height={600}
//                                     className="w-full rounded-3xl object-cover border border-gray-100"
//                                 />

//                                 {/* ACTIONS */}

//                                 <div className="flex gap-3 mt-4">

//                                     {/* RETAKE */}

//                                     <label className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer active:scale-[0.99] transition-all">

//                                         Retake

//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             capture="environment"
//                                             onChange={handleImage}
//                                             className="hidden"
//                                         />

//                                     </label>

//                                     {/* UPLOAD */}

//                                     <button
//                                         disabled={loading}
//                                         onClick={handleUpload}
//                                         className="flex-1 h-12 rounded-2xl bg-[#F97316] text-white text-sm font-semibold flex items-center justify-center active:scale-[0.99] transition-all"
//                                     >

//                                         {
//                                             loading
//                                                 ? (

//                                                     <SubtleSpinner
//                                                         size={16}
//                                                         className="text-white"
//                                                     />
//                                                 )
//                                                 : 'Mark Delivered'
//                                         }

//                                     </button>

//                                 </div>

//                             </div>
//                         )
//                     }

//                     {/* DASHBOARD */}

//                     <button
//                         onClick={() =>
//                             router.push(
//                                 '/driver/dashboard'
//                             )
//                         }
//                         className="w-full h-12 mt-4 rounded-2xl bg-gray-100 text-sm font-semibold text-gray-700 active:scale-[0.99] transition-all"
//                     >

//                         Back To Dashboard

//                     </button>

//                 </div>

//             </div>

//         </div>
//     )
// }

"use client";

import { compressImage } from "@/utils/compressImage";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Image from "next/image";

import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";

import { DriverOrder } from "@/types/driver/route";

import { markOrderDelivered } from "@/services/driver/driverService";

import DeliverOrderCard from "@/components/driver/DeliverOrderCard";

import SubtleSpinner from "@/components/general/SubtleSpinner";

export default function DeliverOrderPage() {
  const params = useParams();

  const router = useRouter();

  const orderId = params.orderId as string;

  const [order, setOrder] = useState<DriverOrder | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);

    const data = search.get("data");

    if (!data) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(data));

      setOrder(parsed);

      if (parsed?.deliveryProofImage) {
        setPreview(parsed.deliveryProofImage);
      }
    } catch {
      toast.error("Failed to load order");
    }
  }, []);

  // const handleImage = (
  //     e: React.ChangeEvent<HTMLInputElement>
  // ) => {

  //     const file =
  //         e.target.files?.[0]

  //     if (!file) return

  //     setImage(file)

  //     setPreview(
  //         URL.createObjectURL(file)
  //     )
  // }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        quality: 0.5,
      });

      console.log("Original:", (file.size / 1024).toFixed(1), "KB");

      console.log("Compressed:", (compressedFile.size / 1024).toFixed(1), "KB");

      setImage(compressedFile);

      setPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error(error);

      toast.error("Could not process image");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Capture image first");

      return;
    }

    try {
      setLoading(true);

      const res = await markOrderDelivered(orderId, image);

      toast.success("Order delivered");

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              isorderdelivered: true,
              deliveredAt: res.data.data.deliveredAt,
              deliveryProofImage: res.data.data.deliveryProofImage,
            }
          : null,
      );
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* BACK */}

        <div className="flex items-center mb-2">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* ORDER */}

        {order && <DeliverOrderCard order={order} onDeliver={() => {}} />}

        {/* DELIVERY PROOF */}

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#1E2A3A] mb-4">
            Delivery Proof
          </h2>

          {/* CAPTURE */}

          <label className="w-full h-44 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer bg-gray-50 active:scale-[0.99] transition-all">
            <span className="text-sm font-semibold text-gray-700">
              Capture Delivery Image
            </span>

            <span className="text-xs text-gray-400 mt-1">
              Camera opens directly
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="hidden"
            />
          </label>
          {/* PREVIEW */}

          {preview && (
            <div className="mt-5">
              <Image
                src={preview}
                alt="Proof"
                width={600}
                height={600}
                className="w-full rounded-3xl object-cover border border-gray-100"
              />

              {/* ACTIONS */}

              <div className="flex gap-3 mt-4">
                {/* RETAKE */}

                <label className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer active:scale-[0.99] transition-all">
                  Retake
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {/* UPLOAD */}

                <button
                  disabled={loading}
                  onClick={handleUpload}
                  className="flex-1 h-12 rounded-2xl bg-[#F97316] text-white text-sm font-semibold flex items-center justify-center active:scale-[0.99] transition-all"
                >
                  {loading ? (
                    <SubtleSpinner size={16} className="text-white" />
                  ) : (
                    "Mark Delivered"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* DASHBOARD */}

          <button
            onClick={() => router.push("/driver/dashboard")}
            className="w-full h-12 mt-4 rounded-2xl bg-gray-100 text-sm font-semibold text-gray-700 active:scale-[0.99] transition-all"
          >
            Back To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
