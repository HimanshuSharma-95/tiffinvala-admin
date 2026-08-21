"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, X, ImageIcon, Trash2 } from "lucide-react";
import {
  getSingleCombo,
  getCategories,
  updateCombo,
  updateComboImage,
  removeComboImage,
  deleteCombo,
} from "@/services/menuService";
import { Category, Combo } from "@/types/menu";

interface RuleForm {
  category: string[];
  quantity: number;
  label: string;
  allowCustomSelection: boolean;
}

import { compressImage } from "@/utils/compressImage";

export default function EditComboPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [combo, setCombo] = useState<Combo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [initialForm, setInitialForm] = useState<any>(null);
  const hasFetched = useRef(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    size: "16oz",
    fullyVeg: false,
  });
  const [rules, setRules] = useState<RuleForm[]>([]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // use getSingleCombo instead of getAllCombos
      const [comboRes, catRes] = await Promise.all([
        getSingleCombo(id),
        getCategories(),
      ]);

      const found: Combo = comboRes.data;
      if (found) {
        setCombo(found);
        const formData = {
          name: found.name,
          description: found.description || "",
          price: String(found.price),
          size: found.size,
          fullyVeg: false,
        };
        const rulesData = found.rules.map((r) => ({
          category: r.category,
          quantity: r.quantity,
          label: r.label || "",
          allowCustomSelection: r.allowCustomSelection ?? true,
        }));
        setForm(formData);
        setRules(rulesData);
        setInitialForm({ ...formData, rules: JSON.stringify(rulesData) });
      }

      setCategories(catRes.data.categories || []);
    } catch {
      toast.error("Failed to load combo");
    } finally {
      setLoading(false);
    }
  };

  const isFormChanged = () => {
    if (!initialForm) return false;
    return (
      JSON.stringify({ ...form, rules: JSON.stringify(rules) }) !==
      JSON.stringify(initialForm)
    );
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0]
  //     if (!file) return
  //     setNewImage(file)
  //     setPreviewUrl(URL.createObjectURL(file))
  // }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const compressedImage = await compressImage(file, {
        maxWidth: 1200,
        quality: 0.5,
      });

      setNewImage(compressedImage);

      setPreviewUrl(URL.createObjectURL(compressedImage));
    } catch (error) {
      console.error("Image compression failed:", error);

      toast.error("Failed to process image");
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;
    setUploadingImage(true);
    try {
      const res = await updateComboImage(id, newImage);
      setCombo((prev) =>
        prev ? { ...prev, image: res.data?.image || "" } : prev,
      );
      setNewImage(null);
      setPreviewUrl(null);
      toast.success("Image updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    setRemovingImage(true);
    try {
      await removeComboImage(id);
      setCombo((prev) => (prev ? { ...prev, image: "" } : prev));
      toast.success("Image removed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setRemovingImage(false);
    }
  };

  const handleDeleteCombo = async () => {
    const confirmed = window.confirm("Delete this combo permanently?");

    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteCombo(id);

      toast.success("Combo deleted!");

      router.push("/admin/menu-edit/all-combos");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete combo");
    } finally {
      setDeleting(false);
    }
  };

  const addRule = () =>
    setRules((p) => [
      ...p,
      { category: [], quantity: 1, label: "", allowCustomSelection: true },
    ]);
  const removeRule = (i: number) =>
    setRules((p) => p.filter((_, idx) => idx !== i));
  const updateRule = (i: number, field: keyof RuleForm, value: any) =>
    setRules((p) =>
      p.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );
  const toggleCategory = (ruleIndex: number, categoryName: string) => {
    const current = rules[ruleIndex].category;
    updateRule(
      ruleIndex,
      "category",
      current.includes(categoryName)
        ? current.filter((c) => c !== categoryName)
        : [...current, categoryName],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Fill required fields");
      return;
    }
    if (rules.some((r) => r.category.length === 0)) {
      toast.error("Each rule needs at least one category");
      return;
    }

    setSaving(true);
    try {
      await updateCombo(id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        size: form.size,
        rules: rules.map((r) => ({
          category: r.category,
          quantity: r.quantity,
          label: r.label,
          allowCustomSelection: r.allowCustomSelection,
        })),
        options: { fullyVeg: form.fullyVeg },
      });
      setInitialForm({ ...form, rules: JSON.stringify(rules) });
      toast.success("Combo updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#1E2A3A]">Edit Combo</h1>
          {combo && <p className="text-xs text-gray-400">{combo.name}</p>}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-5">
        {/* Image */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-medium">IMAGE</label>
          {/* <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 relative">
                        <img
                            src={previewUrl || combo?.image?.trim() || '/defaultfood.png'}
                            alt={form.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/defaultfood.png' }}
                        />
                        {combo?.image?.trim() && !previewUrl && (
                            <button type="button" onClick={handleRemoveImage} disabled={removingImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 disabled:opacity-60">
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div> */}

          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-100 relative">
              <img
                src={previewUrl || combo?.image?.trim() || "/defaultfood.png"}
                alt={form.name || "Combo Image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/defaultfood.png";
                }}
              />

              {combo?.image?.trim() && !previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={removingImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 disabled:opacity-60"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-xl py-2.5 text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
              <ImageIcon size={15} />
              {newImage
                ? newImage.name.slice(0, 20) + "..."
                : "Choose New Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {newImage && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="px-4 bg-[#F97316] text-white rounded-xl text-sm font-semibold disabled:opacity-60"
              >
                {uploadingImage ? "Uploading..." : "Upload"}
              </button>
            )}
            {newImage && (
              <button
                type="button"
                onClick={() => {
                  setNewImage(null);
                  setPreviewUrl(null);
                }}
                className="w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-200"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium">NAME *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">
              DESCRIPTION
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={2}
              className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium">
                PRICE (₹) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium">SIZE</label>
              <select
                value={form.size}
                onChange={(e) =>
                  setForm((p) => ({ ...p, size: e.target.value }))
                }
                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
              >
                <option value="16oz">16oz</option>
                <option value="32oz">32oz</option>
              </select>
            </div>
          </div>

          {/* Rules */}
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
                <Plus size={12} /> Add Rule
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
                        onClick={() => removeRule(index)}
                        className="text-red-400"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Label</label>
                    <input
                      value={rule.label}
                      onChange={(e) =>
                        updateRule(index, "label", e.target.value)
                      }
                      placeholder="e.g. Choose 2 Veg Curries"
                      className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={rule.quantity}
                      onChange={(e) =>
                        updateRule(index, "quantity", Number(e.target.value))
                      }
                      className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">
                      Categories
                      {rule.category.length > 0 && (
                        <span className="text-[#F97316] ml-1">
                          ({rule.category.join(", ")})
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => toggleCategory(index, cat.name)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize transition-colors
                                                        ${
                                                          rule.category.includes(
                                                            cat.name,
                                                          )
                                                            ? "bg-[#F97316] text-white border-[#F97316]"
                                                            : "bg-white text-gray-500 border-gray-200"
                                                        }`}
                        >
                          {cat.name.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateRule(
                          index,
                          "allowCustomSelection",
                          !rule.allowCustomSelection,
                        )
                      }
                      className={`w-10 h-5 rounded-full transition-colors ${rule.allowCustomSelection ? "bg-[#F97316]" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mx-0.5
                                                ${rule.allowCustomSelection ? "translate-x-5" : "translate-x-0"}`}
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

          {/* Fully Veg */}
          {/* <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setForm(p => ({ ...p, fullyVeg: !p.fullyVeg }))}
                            className={`w-12 h-6 rounded-full transition-colors ${form.fullyVeg ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5
                                ${form.fullyVeg ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm text-gray-500">Fully Vegetarian</span>
                    </div> */}

          {/* Areas */}
          {combo?.areas && combo.areas.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 font-medium">
                LIVE IN AREAS
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {combo.areas.map((area) => (
                  <span
                    key={area}
                    className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium capitalize"
                  >
                    {area.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !isFormChanged()}
            className={`w-full py-3 rounded-xl font-semibold transition-colors
                            ${
                              saving || !isFormChanged()
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#F97316] text-white"
                            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleDeleteCombo}
            disabled={deleting}
            className="w-full py-3 rounded-xl font-semibold bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Combo"}
          </button>
        </form>
      </div>
    </div>
  );
}
