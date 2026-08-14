"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  UtensilsCrossed,
  PackagePlus,
} from "lucide-react";
import {
  getAreaProducts,
  makeProductLiveInArea,
  removeProductFromArea,
  getAreaCombos,
  makeComboLiveInArea,
  removeComboFromArea,
} from "@/services/menuService";
import SubtleSpinner from "@/components/general/SubtleSpinner";

interface AreaProduct {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  variants: { size: string; price: number }[];
  isAvailable: boolean;
  isLiveInArea: boolean;
}

interface AreaCategoryGroup {
  category: string;
  items: AreaProduct[];
}

interface AreaCombo {
  _id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  size: string;
  isLiveInArea: boolean;
}

type View = "home" | "items" | "combos";

const AREA_LABELS: Record<string, string> = {
  seattle: "Seattle",
  "bay-area": "Bay Area",
};

const AREA_API_KEYS: Record<string, string> = {
  seattle: "seattle",
  "bay-area": "bay_area",
};

export default function AreaMenuPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const areaKey = AREA_API_KEYS[slug] || slug;
  const areaLabel = AREA_LABELS[slug] || slug;

  const [view, setView] = useState<View>("home");
  const [groups, setGroups] = useState<AreaCategoryGroup[]>([]);
  const [comboGroups, setComboGroups] = useState<AreaCombo[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAreaProducts(areaKey);
      setGroups(res.data.products);
    } catch {
      toast.error("Failed to load area products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCombos = async () => {
    setLoading(true);

    try {
      const res = await getAreaCombos(areaKey);

      setComboGroups(res.data || []);
    } catch {
      toast.error("Failed to load combos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (product: AreaProduct) => {
    setTogglingId(product._id);
    try {
      if (product.isLiveInArea) {
        await removeProductFromArea(product._id, areaKey);
      } else {
        await makeProductLiveInArea(product._id, areaKey);
      }
      // update local state instantly
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item._id === product._id
              ? { ...item, isLiveInArea: !item.isLiveInArea }
              : item,
          ),
        })),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const handleComboToggle = async (combo: AreaCombo) => {
    setTogglingId(combo._id);

    try {
      if (combo.isLiveInArea) {
        await removeComboFromArea(combo._id, areaKey);
      } else {
        await makeComboLiveInArea(combo._id, areaKey);
      }

      setComboGroups((prev) =>
        prev.map((item) =>
          item._id === combo._id
            ? {
                ...item,
                isLiveInArea: !item.isLiveInArea,
              }
            : item,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  // ── HOME
  if (view === "home")
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-[#1E2A3A]">{areaLabel} Menu</h1>
        </div>

        <div className="max-w-md mx-auto px-4 mt-2 space-y-3">
          <button
            onClick={() => {
              setView("items");
              if (!hasFetched.current) {
                hasFetched.current = true;
                fetchProducts();
              }
            }}
            className="w-full bg-gray-100 rounded-2xl px-4 py-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                <UtensilsCrossed size={18} className="text-orange-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#1E2A3A]">Items</p>
                <p className="text-xs text-gray-400">
                  Manage items for {areaLabel}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          <button
            onClick={() => {
              setView("combos");

              fetchCombos();
            }}
            className="w-full bg-gray-100 rounded-2xl px-4 py-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                <PackagePlus size={18} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#1E2A3A]">Combos</p>
                <p className="text-xs text-gray-400">
                  Manage combos for {areaLabel}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    );

  // ── ITEMS VIEW
  if (view === "items")
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => setView("home")}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1E2A3A]">
              {areaLabel} Items
            </h1>
            <p className="text-xs text-gray-400">
              Toggle to activate in this area
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-4 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse mb-3" />
                <div
                  className="
    flex gap-3 overflow-x-auto pb-2
    md:grid md:grid-cols-6 md:overflow-visible
"
                >
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div
                      key={j}
                      className="h-28 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 space-y-6">
            {groups.map((group) => (
              <div key={group.category}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[#1E2A3A] capitalize">
                    {group.category.replace(/_/g, " ")}
                    <span className="text-gray-400 font-normal ml-1">
                      ({group.items.length})
                    </span>
                  </h2>
                  <span className="text-xs text-green-500 font-medium">
                    {group.items.filter((i) => i.isLiveInArea).length} live
                  </span>
                </div>

                {/* 6 column grid */}
                <div
                  className="
    flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory
    md:grid md:grid-cols-6 md:overflow-visible
"
                >
                  {group.items.map((product) => (
                    <AreaProductCard
                      key={product._id}
                      product={product}
                      toggling={togglingId === product._id}
                      onToggle={() => handleToggle(product)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

  if (view === "combos")
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => setView("home")}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-[#1E2A3A]">
              {areaLabel} Combos
            </h1>

            <p className="text-xs text-gray-400">Toggle combos for this area</p>
          </div>
        </div>

        {loading ? (
          <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex animate-pulse"
              >
                {/* IMAGE */}
                <div className="w-[35%] p-2">
                  <div className="w-full h-32 rounded-xl bg-gray-200" />
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    {/* TITLE */}
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />

                    {/* DESCRIPTION */}
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-4/5 bg-gray-200 rounded" />
                    </div>

                    {/* PRICE */}
                    <div className="flex gap-2 mt-3">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="h-9 w-full bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4">
            <div
              className="
    flex flex-col gap-3
    md:grid md:grid-cols-3
"
            >
              {comboGroups.map((combo) => (
                <AreaComboCard
                  key={combo._id}
                  combo={combo}
                  toggling={togglingId === combo._id}
                  onToggle={() => handleComboToggle(combo)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );

  // ── COMBOS VIEW (placeholder for now)
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => setView("home")}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold text-[#1E2A3A]">{areaLabel} Combos</h1>
      </div>
      <div className="flex items-center justify-center mt-20">
        <p className="text-sm text-gray-400">Combos coming soon</p>
      </div>
    </div>
  );
}

function AreaProductCard({
  product,
  toggling,
  onToggle,
}: {
  product: AreaProduct;
  toggling: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`
                min-w-42.5
                max-w-42.5
                md:min-w-0
                md:max-w-none
                rounded-xl
                overflow-hidden
                flex flex-col
                border-2
                transition-colors
                snap-start
                shrink-0
                ${
                  product.isLiveInArea
                    ? "border-green-200 bg-green-50"
                    : "border-transparent bg-gray-50"
                }
            `}
    >
      <div
        className="w-full bg-gray-200 overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={product.image?.trim() || "/defaultfood.png"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/defaultfood.png";
          }}
        />
      </div>

      <div className="p-2 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-[#1E2A3A] line-clamp-1">
          {product.name}
        </p>

        <p className="text-[10px] text-gray-400 line-clamp-2 min-h-6">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-1 mt-1">
          {product.variants?.map((v, i) => (
            <span
              key={i}
              className="text-[9px] bg-orange-50 text-[#F97316] px-1.5 py-0.5 rounded font-medium"
            >
              {v.size}: ${v.price}
            </span>
          ))}
        </div>

        <button
          onClick={onToggle}
          disabled={toggling}
          className={`
                        w-full
                        text-[10px]
                        py-1.5
                        rounded-lg
                        mt-2
                        font-semibold
                        transition-colors
                        disabled:opacity-50
                        ${
                          product.isLiveInArea
                            ? "bg-green-500 text-white"
                            : "bg-[#1E2A3A] text-white"
                        }
                    `}
        >
          {toggling ? (
            <div className="flex justify-center">
              <SubtleSpinner size={12} className="text-[#F97316]" />
            </div>
          ) : product.isLiveInArea ? (
            "Live"
          ) : (
            "Make Live"
          )}
        </button>
      </div>
    </div>
  );
}

function AreaComboCard({
  combo,
  toggling,
  onToggle,
}: {
  combo: AreaCombo;
  toggling: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`
                min-w-[320px]
                md:min-w-0
                bg-gray-100
                rounded-2xl
                overflow-hidden
                border
                transition-all
                flex
                shrink-0
                snap-start
                ${
                  combo.isLiveInArea
                    ? "border-green-300 bg-green-50"
                    : "border-gray-100"
                }
            `}
    >
      {/* LEFT IMAGE */}
      <div className="w-[35%] p-2">
        <div
          className="w-full rounded-xl overflow-hidden bg-gray-200 relative"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img
            src={combo.image?.trim() || "/defaultfood.png"}
            alt={combo.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/defaultfood.png";
            }}
          />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-2.5 flex flex-col justify-between">
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

            <span className="text-xs text-gray-400">{combo.size}</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-3">
          <button
            onClick={onToggle}
            disabled={toggling}
            className={`
                            w-full
                            text-xs
                            py-2
                            rounded-xl
                            font-semibold
                            transition-colors
                            disabled:opacity-50
                            ${
                              combo.isLiveInArea
                                ? "bg-green-500 text-white"
                                : "bg-[#1E2A3A] text-white"
                            }
                        `}
          >
            {toggling ? (
              <div className="flex justify-center">
                <SubtleSpinner size={12} className="text-white" />
              </div>
            ) : combo.isLiveInArea ? (
              "Live"
            ) : (
              "Make Live"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
