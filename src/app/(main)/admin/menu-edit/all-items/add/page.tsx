"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { compressImage } from "@/utils/compressImage";

import { ArrowLeft, Plus, X, ImageIcon, Settings2 } from "lucide-react";

import {
  createProduct,
  getCategories,
  addCategory,
  removeCategory,
  updateProductImage,
} from "@/services/menuService";
import { Category } from "@/types/menu";

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [productId, setProductId] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

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

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data.categories || []);

      console.log("Fetched categories:", res.data.categories || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  // CATEGORY MANAGEMENT
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

  // const handleRemoveCategory = async (cat: string) => {
  //     setCategoryLoading(true)

  //     try {
  //         await removeCategory(cat)

  //         setCategories(prev =>
  //             prev.filter(c => c !== cat)
  //         )

  //         if (form.category === cat) {
  //             setForm(p => ({
  //                 ...p,
  //                 category: '',
  //                 food_class: '',
  //                 product_type: ''
  //             }))
  //         }

  //         toast.success('Category removed!')
  //     } catch (error: any) {
  //         toast.error(
  //             error.response?.data?.message ||
  //             'Failed to remove category'
  //         )
  //     } finally {
  //         setCategoryLoading(false)
  //     }
  // }

  // IMAGE

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

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];

  //     if (!file) return;

  //     setImage(file);

  //     setPreviewUrl(URL.createObjectURL(file));
  //   };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        quality: 0.5,
      });

      setImage(compressedFile);

      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error(error);

      toast.error("Failed to process image");
    }
  };

  // VARIANTS
  const addVariant = () => {
    setForm((p) => ({
      ...p,
      variants: [...p.variants, { size: "", price: "" }],
    }));
  };

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

  // CATEGORY SELECT
  const handleCategorySelect = (cat: string) => {
    setForm((p) => ({
      ...p,
      category: cat,
      food_class: cat,
      product_type: cat,
    }));
  };

  // VALIDATION
  const isFormValid = () => {
    return (
      form.name &&
      form.category &&
      form.variants.every((v) => v.size && v.price)
    );
  };

  // CREATE PRODUCT
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Fill all required fields");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description.trim() || " ",
      category: form.category,
      food_class: form.food_class,
      product_type: form.product_type,
      variants: form.variants.map((v) => ({
        size: v.size,
        price: Number(v.price),
      })),
    };

    setSaving(true);

    try {
      const res = await createProduct(payload);

      setProductId(res.data._id);

      toast.success("Product created! Now upload image.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  // UPLOAD IMAGE
  const handleUploadImage = async () => {
    if (!productId) {
      toast.error("Create product first");
      return;
    }

    if (!image) {
      toast.error("Choose image first");
      return;
    }

    setUploadingImage(true);

    try {
      await updateProductImage(productId, image);

      toast.success("Image uploaded!");

      router.back();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

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

        <h1 className="text-lg font-bold text-[#1E2A3A]">Add Product</h1>
      </div>

      {/* FORM */}
      <form onSubmit={handleCreate} className="max-w-md mx-auto px-4 space-y-5">
        {/* NAME */}
        <div>
          <label className="text-xs text-gray-500 font-medium">NAME *</label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: e.target.value,
              }))
            }
            placeholder="Dal Makhani"
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
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="Describe the item..."
            className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
          />
        </div>

        {/* CATEGORY */}
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
              <Settings2 size={12} />
              Manage
            </button>
          </div>

          {/* CATEGORY MANAGER */}
          {showCategoryManager && (
            <div className="bg-gray-50 rounded-2xl p-3 mb-3 space-y-3">
              <p className="text-xs font-semibold text-[#1E2A3A]">
                Manage Categories
              </p>

              {/* ADD CATEGORY */}
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

              {/* CATEGORY LIST */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1"
                  >
                    <span className="text-xs text-gray-600 capitalize">
                      {category.name.replace(/_/g, " ")}
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

          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`px-3 py-1.5 rounded-full text-xs border capitalize transition-colors
        ${
          form.category === category.name
            ? "bg-[#F97316] text-white border-[#F97316]"
            : "bg-white text-gray-500 border-gray-200"
        }`}
              >
                {category.name.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* VARIANTS */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-gray-500 font-medium">
              VARIANTS *
            </label>

            <button
              type="button"
              onClick={addVariant}
              className="text-xs text-[#F97316] flex items-center gap-1 font-semibold"
            >
              <Plus size={12} />
              Add
            </button>
          </div>

          {form.variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              {/* <input
                                value={v.size}
                                onChange={e =>
                                    updateVariant(
                                        i,
                                        'size',
                                        e.target.value
                                    )
                                }
                                placeholder="Size"
                                className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-sm outline-none"
                            /> */}

              <select
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-sm outline-none"
              >
                <option value="">Select Size</option>

                <option value="8oz">default</option>
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

        {/* CREATE PRODUCT */}
        <button
          type="submit"
          disabled={saving || !isFormValid()}
          className={`w-full py-3 rounded-xl font-semibold transition-colors
                    ${
                      saving || !isFormValid()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#F97316] text-white"
                    }`}
        >
          {saving ? "Creating..." : "Create Product"}
        </button>

        {/* IMAGE SECTION */}
        {productId && (
          <div className="space-y-3 border-t border-gray-200 pt-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Upload Product Image
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Product created successfully. Now upload image.
              </p>
            </div>

            {/* IMAGE PREVIEW */}
            <div className="flex justify-center">
              <div className="w-48 h-48 p-2 bg-gray-100 rounded-2xl">
                <img
                  src={previewUrl || "/defaultfood.png"}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/defaultfood.png";
                  }}
                />
              </div>
            </div>

            {/* IMAGE BUTTONS */}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-xl py-2.5 text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                <ImageIcon size={15} />

                {image ? image.name.slice(0, 20) : "Choose Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                  className="w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={!image || uploadingImage}
              className={`w-full py-3 rounded-xl font-semibold transition-colors
                            ${
                              !image || uploadingImage
                                ? "bg-gray-200 text-gray-400"
                                : "bg-[#1E2A3A] text-white"
                            }`}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
