"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, X, ImageIcon, Trash2, Settings2 } from "lucide-react";

// import {
//     getSingleProduct, updateProduct, updateProductImage,
//     removeProductImage, getCategories, addCategory, removeCategory
// } from '@/services/menuService'

import {
  getSingleProduct,
  updateProduct,
  updateProductImage,
  removeProductImage,
  getCategories,
  addCategory,
  removeCategory,
  deleteProduct,
} from "@/services/menuService";

import { compressImage } from "@/utils/compressImage";

import { Category, Product } from "@/types/menu";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);

  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [initialForm, setInitialForm] = useState<any>(null);
  const hasFetched = useRef(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    food_class: "",
    product_type: "",
    variants: [{ size: "", price: "" }],
  });

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getSingleProduct(id),
        getCategories(),
      ]);
      const p: Product = prodRes.data;
      setProduct(p);
      const formData = {
        name: p.name,
        description: p.description,
        category: p.category,
        food_class: p.food_class,
        product_type: p.product_type,
        variants: p.variants.map((v) => ({
          size: v.size,
          price: String(v.price),
        })),
      };
      setForm(formData);
      setInitialForm(formData);
      setCategories(catRes.data.categories || []);
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmed = window.confirm("Delete this item permanently?");

    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteProduct(id);

      toast.success("Item deleted!");

      router.push("/admin/menu-edit/all-items");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const isFormChanged = () => {
    if (!initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;
  //     setNewImage(file);
  //     setPreviewUrl(URL.createObjectURL(file));
  //   };

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
      const res = await updateProductImage(id, newImage);
      setProduct((prev) => (prev ? { ...prev, image: res.data.image } : prev));
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
      await removeProductImage(id);
      setProduct((prev) => (prev ? { ...prev, image: "" } : prev));
      toast.success("Image removed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setRemovingImage(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCategoryLoading(true);

    try {
      const createdCategory = await addCategory(newCategoryName.trim());

      setCategories((prev) => [...prev, createdCategory.data]);

      setNewCategoryName("");

      toast.success("Category added!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    setCategoryLoading(true);

    try {
      const removedCategory = categories.find((c) => c._id === id);

      await removeCategory(id);

      setCategories((prev) => prev.filter((c) => c._id !== id));

      if (removedCategory && form.category === removedCategory.name) {
        setForm((p) => ({
          ...p,
          category: "",
          food_class: "",
          product_type: "",
        }));
      }

      toast.success("Category removed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const addVariant = () =>
    setForm((p) => ({
      ...p,
      variants: [...p.variants, { size: "", price: "" }],
    }));

  const removeVariant = (i: number) => {
    if (form.variants.length === 1) return;
    setForm((p) => ({
      ...p,
      variants: p.variants.filter((_, idx) => idx !== i),
    }));
  };

  const updateVariant = (i: number, field: "size" | "price", value: string) => {
    setForm((p) => ({
      ...p,
      variants: p.variants.map((v, idx) =>
        idx === i ? { ...v, [field]: value } : v,
      ),
    }));
  };

  const handleCategorySelect = (cat: string) => {
    setForm((p) => ({
      ...p,
      category: cat,
      food_class: cat,
      product_type: cat,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast.error("Name and category are required");
      return;
    }
    if (form.variants.some((v) => !v.size || !v.price)) {
      toast.error("Fill all variant fields");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description.trim() || " ",
        category: form.category,
        food_class: form.food_class,
        product_type: form.product_type,
        variants: form.variants.map((v) => ({
          size: v.size,
          price: Number(v.price),
        })),
      });
      setInitialForm({ ...form });
      toast.success("Product updated!");
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
        <h1 className="text-lg font-bold text-[#1E2A3A]">Edit Item</h1>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-5">
        {/* Image Section */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-medium">IMAGE</label>

          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-100 relative">
              <img
                src={previewUrl || product?.image?.trim() || "/defaultfood.png"}
                alt={form.name || "Food Image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/defaultfood.png";
                }}
              />

              {/* Remove image button */}
              {product?.image?.trim() && !previewUrl && (
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
              placeholder="Dal Makhani"
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
              rows={3}
              placeholder="Describe the item..."
              className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 font-medium">
                CATEGORY *
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="flex items-center gap-1 text-xs text-[#1E2A3A] font-medium"
              >
                <Settings2 size={12} /> Manage
              </button>
            </div>

            {showCategoryManager && (
              <div className="bg-gray-50 rounded-2xl p-3 mb-3 space-y-3">
                <p className="text-xs font-semibold text-[#1E2A3A]">
                  Manage Categories
                </p>
                <div className="flex gap-2">
                  <input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 bg-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-200"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddCategory())
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={categoryLoading || !newCategoryName.trim()}
                    className="px-3 bg-[#F97316] text-white rounded-xl text-xs font-semibold disabled:opacity-60"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1"
                    >
                      <span className="text-xs text-gray-600 capitalize">
                        {category?.name?.replace(/_/g, " ")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category._id)}
                        disabled={categoryLoading}
                        className="text-red-400 disabled:opacity-30"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleCategorySelect(category.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors
    ${
      form.category === category.name
        ? "bg-[#F97316] text-white border-[#F97316]"
        : "bg-white text-gray-500 border-gray-200"
    }`}
                >
                  {category?.name?.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 font-medium">
                VARIANTS *
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs text-[#F97316] font-semibold flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  {/* <input value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)}
                                        placeholder="Size (e.g. 16oz)"
                                        className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-sm outline-none" /> */}

                  <select
                    value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-sm outline-none"
                  >
                    <option value="">Select Size</option>

                    <option value="default">default</option>

                    <option value="8oz">8oz</option>

                    <option value="16oz">16oz</option>

                    <option value="32oz">32oz</option>
                  </select>

                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    placeholder="Price"
                    className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-sm outline-none"
                  />
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-red-400 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live in areas */}
          {product?.areas && product.areas.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 font-medium">
                LIVE IN AREAS
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.areas.map((area) => (
                  <span
                    key={area}
                    className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium capitalize"
                  >
                    {area.replace("_", " ")}
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
            onClick={handleDeleteProduct}
            disabled={deleting}
            className="w-full py-3 rounded-xl font-semibold bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
