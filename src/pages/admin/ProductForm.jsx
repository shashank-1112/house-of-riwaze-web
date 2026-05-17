import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { productApi } from "@/api/productApi";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { Save, ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

const CATEGORIES = [
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Chains",
  "Sets",
  "Other",
];

const METALS = ["Gold", "Silver", "Platinum", "Mixed"];

const JEWELLERY_TYPES = ["None", "Diamond Studded", "Gemstone Studded"];

const METAL_COLORS = [
  "None",
  "Yellow Gold",
  "Rose Gold",
  "Green Gold",
  "White Gold",
  "Rhodium",
];

const ACCESSORY_TYPES = ["None", "Watch"];

const PURITIES = [
  "18K",
  "22K",
  "24K",
  "925 Silver",
  "999 Silver",
  "Platinum",
  "N/A",
];

const GENDERS = ["Men", "Women", "Unisex"];

const OCCASIONS = ["Bridal", "Casual", "Festival", "Office", "Any"];

const VISIBILITIES = ["Published", "Draft", "Hidden"];

function generateSKU() {
  return (
    "ZJ-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  );
}

function createEmptyForm() {
  return {
    name: "",
    sku: generateSKU(),

    category: "Rings",
    sub_category: "",

    metal_type: "Gold",
    jewellery_type: "None",
    metal_color: "None",
    accessory_type: "None",
    purity: "22K",

    gross_weight: "",
    net_weight: "",

    making_charges_type: "per_gram",
    making_charges: "",

    stone_details: [],
    price_override: "",

    stock_quantity: 0,
    min_stock_threshold: 5,

    images: [],

    description: "",
    tags: "",

    visibility: "Published",
    gender: "Unisex",
    occasion: "Any",

    is_featured: false,

    try_on_enabled: false,
    try_on_type: "ring",
    try_on_asset: "",
    try_on_scale: 1,
    try_on_offset_x: 0,
    try_on_offset_y: 0,
    try_on_rotation: 0,
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function normalizePayload(data) {
  return {
    ...data,

    name: data.name.trim(),
    sku: data.sku.trim(),

    category: data.category || "Rings",
    sub_category: data.sub_category?.trim() || "",

    metal_type: data.metal_type || "Gold",
    jewellery_type: data.jewellery_type || "None",
    metal_color: data.metal_color || "None",
    accessory_type: data.accessory_type || "None",
    purity: data.purity || "N/A",

    gross_weight: parseFloat(data.gross_weight) || 0,
    net_weight: parseFloat(data.net_weight) || 0,

    making_charges:
      data.making_charges === "" ||
      data.making_charges === null ||
      data.making_charges === undefined
        ? 0
        : parseFloat(data.making_charges),

    price_override:
      data.price_override === "" ||
      data.price_override === null ||
      data.price_override === undefined
        ? null
        : parseFloat(data.price_override),

    stock_quantity: parseInt(data.stock_quantity, 10) || 0,
    min_stock_threshold: parseInt(data.min_stock_threshold, 10) || 0,

    stone_details: (data.stone_details || []).map((stone) => ({
      ...stone,
      stone_type: stone.stone_type?.trim() || "",
      carat: parseFloat(stone.carat) || 0,
      clarity: stone.clarity?.trim() || "",
      cut: stone.cut?.trim() || "",
      color: stone.color?.trim() || "",
      cost: parseFloat(stone.cost) || 0,
    })),

    images: Array.isArray(data.images) ? data.images : [],

    description: data.description?.trim() || "",
    tags: data.tags?.trim() || "",

    visibility: data.visibility || "Published",
    gender: data.gender || "Unisex",
    occasion: data.occasion || "Any",

    is_featured: Boolean(data.is_featured),

    try_on_enabled: Boolean(data.try_on_enabled),
    try_on_type: data.try_on_type || "ring",
    try_on_asset: data.try_on_asset || "",
    try_on_scale: Number(data.try_on_scale || 1),
    try_on_offset_x: Number(data.try_on_offset_x || 0),
    try_on_offset_y: Number(data.try_on_offset_y || 0),
    try_on_rotation: Number(data.try_on_rotation || 0),
  };
}

const cardClass = "rounded-2xl border-border/80 bg-card shadow-sm";
const cardHeaderClass = "border-b border-border/60 px-5 py-4";
const cardTitleClass = "font-heading text-xl font-semibold";
const cardGridClass = "grid gap-x-5 gap-y-4 px-5 py-5 md:grid-cols-2";
const fieldClass = "space-y-1.5";
const inputClass = "h-11";
const selectTriggerClass = "h-11";

export default function ProductForm() {
  const path = window.location.pathname;

  const editId = path.includes("/edit")
    ? path.split("/admin/inventory/")[1]?.replace("/edit", "")
    : null;

  const isEdit = Boolean(editId);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useStoreSettings();

  const [existingProduct, setExistingProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEdit);

  const [form, setForm] = useState(createEmptyForm);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !editId) return;

    const loadProduct = async () => {
      setIsLoadingProduct(true);

      try {
        const product = await productApi.getAdminProductById(editId);
        setExistingProduct(product);
      } catch (error) {
        toast({
          title: "Failed to load product",
          description: error.message,
          variant: "destructive",
        });

        setExistingProduct(null);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [isEdit, editId, toast]);

  useEffect(() => {
    if (!existingProduct) return;

    setForm({
      ...createEmptyForm(),
      ...existingProduct,

      jewellery_type:
        existingProduct.jewellery_type ||
        existingProduct.jewelleryType ||
        "None",

      metal_color:
        existingProduct.metal_color ||
        existingProduct.metalColor ||
        "None",

      accessory_type:
        existingProduct.accessory_type ||
        existingProduct.accessoryType ||
        "None",

      gross_weight: existingProduct.gross_weight ?? "",
      net_weight: existingProduct.net_weight ?? "",

      making_charges: existingProduct.making_charges ?? "",
      price_override: existingProduct.price_override ?? "",

      stock_quantity: existingProduct.stock_quantity ?? 0,
      min_stock_threshold: existingProduct.min_stock_threshold ?? 5,

      stone_details: existingProduct.stone_details || [],
      images: existingProduct.images || [],

      try_on_enabled: existingProduct.try_on_enabled ?? false,
      try_on_type: existingProduct.try_on_type || "ring",
      try_on_asset: existingProduct.try_on_asset || "",
      try_on_scale: existingProduct.try_on_scale ?? 1,
      try_on_offset_x: existingProduct.try_on_offset_x ?? 0,
      try_on_offset_y: existingProduct.try_on_offset_y ?? 0,
      try_on_rotation: existingProduct.try_on_rotation ?? 0,
    });
  }, [existingProduct]);

  useEffect(() => {
    const defaultCharges = settings?.default_making_charges?.[form.category];

    if (
      !isEdit &&
      form.category &&
      defaultCharges !== undefined &&
      defaultCharges !== null
    ) {
      setForm((prev) => ({
        ...prev,
        making_charges: defaultCharges,
      }));
    }
  }, [form.category, isEdit, settings?.default_making_charges]);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.sku.trim()) {
      toast({
        title: "Missing required fields",
        description: "Product name and SKU are required.",
        variant: "destructive",
      });

      return false;
    }

    if (!form.category || !form.metal_type || !form.purity) {
      toast({
        title: "Missing product classification",
        description: "Category, metal type and purity are required.",
        variant: "destructive",
      });

      return false;
    }

    if (form.category === "Other" && !form.sub_category.trim()) {
      toast({
        title: "Sub-category required",
        description: "Please enter a sub-category when category is Other.",
        variant: "destructive",
      });

      return false;
    }

    if (!form.visibility || !form.gender || !form.occasion) {
      toast({
        title: "Missing product visibility details",
        description: "Visibility, gender and occasion are required.",
        variant: "destructive",
      });

      return false;
    }

    const grossWeight = parseFloat(form.gross_weight);
    const netWeight = parseFloat(form.net_weight);

    const makingCharges =
      form.making_charges === "" ||
      form.making_charges === null ||
      form.making_charges === undefined
        ? 0
        : parseFloat(form.making_charges);

    const stockQuantity = parseInt(form.stock_quantity, 10);
    const minStockThreshold = parseInt(form.min_stock_threshold, 10);

    const priceOverride =
      form.price_override === "" ||
      form.price_override === null ||
      form.price_override === undefined
        ? null
        : parseFloat(form.price_override);

    if (Number.isNaN(grossWeight) || grossWeight <= 0) {
      toast({
        title: "Invalid gross weight",
        description: "Gross weight must be greater than zero.",
        variant: "destructive",
      });

      return false;
    }

    if (Number.isNaN(netWeight) || netWeight <= 0) {
      toast({
        title: "Invalid net weight",
        description: "Net metal weight must be greater than zero.",
        variant: "destructive",
      });

      return false;
    }

    if (netWeight > grossWeight) {
      toast({
        title: "Invalid weight values",
        description: "Net metal weight cannot be greater than gross weight.",
        variant: "destructive",
      });

      return false;
    }

    if (Number.isNaN(makingCharges) || makingCharges < 0) {
      toast({
        title: "Invalid making charges",
        description: "Making charges cannot be negative.",
        variant: "destructive",
      });

      return false;
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      toast({
        title: "Invalid stock quantity",
        description: "Stock quantity cannot be negative.",
        variant: "destructive",
      });

      return false;
    }

    if (Number.isNaN(minStockThreshold) || minStockThreshold < 0) {
      toast({
        title: "Invalid minimum stock",
        description: "Minimum stock threshold cannot be negative.",
        variant: "destructive",
      });

      return false;
    }

    if (
      priceOverride !== null &&
      (Number.isNaN(priceOverride) || priceOverride < 0)
    ) {
      toast({
        title: "Invalid price override",
        description: "Price override cannot be negative.",
        variant: "destructive",
      });

      return false;
    }

    const hasInvalidStone = form.stone_details.some((stone, index) => {
      const hasAnyStoneValue =
        stone.stone_type ||
        stone.carat ||
        stone.clarity ||
        stone.cut ||
        stone.color ||
        stone.cost;

      if (!hasAnyStoneValue) return false;

      const carat = parseFloat(stone.carat);
      const cost = parseFloat(stone.cost);

      if (!stone.stone_type?.trim()) {
        toast({
          title: `Stone ${index + 1}: Type required`,
          description: "Please enter the stone type or remove the stone row.",
          variant: "destructive",
        });

        return true;
      }

      if (
        stone.carat !== "" &&
        stone.carat !== null &&
        stone.carat !== undefined &&
        (Number.isNaN(carat) || carat < 0)
      ) {
        toast({
          title: `Stone ${index + 1}: Invalid carat`,
          description: "Stone carat cannot be negative.",
          variant: "destructive",
        });

        return true;
      }

      if (
        stone.cost !== "" &&
        stone.cost !== null &&
        stone.cost !== undefined &&
        (Number.isNaN(cost) || cost < 0)
      ) {
        toast({
          title: `Stone ${index + 1}: Invalid cost`,
          description: "Stone cost cannot be negative.",
          variant: "destructive",
        });

        return true;
      }

      return false;
    });

    if (hasInvalidStone) return false;

    if (form.visibility === "Published" && form.images.length === 0) {
      toast({
        title: "Product image required",
        description: "Published products should have at least one image.",
        variant: "destructive",
      });

      return false;
    }

    if (form.visibility === "Published" && !form.description.trim()) {
      toast({
        title: "Description required",
        description: "Published products should have a product description.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setUploading(true);

    try {
      const urls = await Promise.all(files.map(fileToDataUrl));

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));

      toast({
        title: "Images added",
        description: `${urls.length} image${urls.length > 1 ? "s" : ""} added.`,
      });
    } catch (error) {
      toast({
        title: "Image upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const addStone = () => {
    setForm((prev) => ({
      ...prev,
      stone_details: [
        ...prev.stone_details,
        {
          stone_type: "",
          carat: "",
          clarity: "",
          cut: "",
          color: "",
          cost: "",
        },
      ],
    }));
  };

  const updateStone = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      stone_details: prev.stone_details.map((stone, stoneIndex) =>
        stoneIndex === index
          ? {
              ...stone,
              [field]: value,
            }
          : stone
      ),
    }));
  };

  const removeStone = (index) => {
    setForm((prev) => ({
      ...prev,
      stone_details: prev.stone_details.filter(
        (_, stoneIndex) => stoneIndex !== index
      ),
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload = normalizePayload(form);

      if (isEdit) {
        await productApi.updateProduct(editId, payload);

        toast({
          title: "Product updated",
          description: `${form.name} was updated successfully.`,
        });
      } else {
        await productApi.createProduct(payload);

        toast({
          title: "Product created",
          description: `${form.name} was added to inventory.`,
        });
      }

      navigate("/admin/inventory");
    } catch (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && isLoadingProduct) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (isEdit && !existingProduct) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="font-heading text-2xl font-semibold">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The product you are trying to edit was not found.
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => navigate("/admin/inventory")}
          >
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/inventory")}
          className="h-10 w-10 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="font-heading text-3xl font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit
              ? "Update product details"
              : "Add a new product to your inventory"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Basic Information</CardTitle>
          </CardHeader>

          <CardContent className={cardGridClass}>
            <div className={`${fieldClass} md:col-span-2`}>
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. 22K Gold Temple Necklace"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Label>SKU *</Label>
              <Input
                value={form.sku}
                onChange={(event) => update("sku", event.target.value)}
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Sub-category {form.category === "Other" ? "*" : ""}</Label>
              <Input
                value={form.sub_category}
                onChange={(event) => update("sub_category", event.target.value)}
                placeholder={
                  form.category === "Other" ? "Required for Other" : "Optional"
                }
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Label>Visibility *</Label>
              <Select
                value={form.visibility}
                onValueChange={(value) => update("visibility", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {VISIBILITIES.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Gender *</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => update("gender", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Occasion *</Label>
              <Select
                value={form.occasion}
                onValueChange={(value) => update("occasion", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {OCCASIONS.map((occasion) => (
                    <SelectItem key={occasion} value={occasion}>
                      {occasion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 md:col-span-2">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(value) => update("is_featured", value)}
              />

              <div>
                <Label>Featured Product</Label>
                <p className="text-xs text-muted-foreground">
                  Featured products are shown on the homepage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

         <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Metal & Weight</CardTitle>
          </CardHeader>

          <CardContent className={cardGridClass}>
            <div className={fieldClass}>
              <Label>Metal Type *</Label>
              <Select
                value={form.metal_type}
                onValueChange={(value) => update("metal_type", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {METALS.map((metal) => (
                    <SelectItem key={metal} value={metal}>
                      {metal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Purity *</Label>
              <Select
                value={form.purity}
                onValueChange={(value) => update("purity", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {PURITIES.map((purity) => (
                    <SelectItem key={purity} value={purity}>
                      {purity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Gross Weight (grams) *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.gross_weight}
                onChange={(event) => update("gross_weight", event.target.value)}
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Label>Net Metal Weight (grams) *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.net_weight}
                onChange={(event) => update("net_weight", event.target.value)}
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Product Attributes</CardTitle>
          </CardHeader>

          <CardContent className={cardGridClass}>
            <div className={fieldClass}>
              <Label>Jewellery Type</Label>
              <Select
                value={form.jewellery_type}
                onValueChange={(value) => update("jewellery_type", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {JEWELLERY_TYPES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Metal Color</Label>
              <Select
                value={form.metal_color}
                onValueChange={(value) => update("metal_color", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {METAL_COLORS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Accessories</Label>
              <Select
                value={form.accessory_type}
                onValueChange={(value) => update("accessory_type", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {ACCESSORY_TYPES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

       

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Pricing</CardTitle>
          </CardHeader>

          <CardContent className={cardGridClass}>
            <div className={fieldClass}>
              <Label>Making Charges Type</Label>
              <Select
                value={form.making_charges_type}
                onValueChange={(value) => update("making_charges_type", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="per_gram">Per Gram (₹/g)</SelectItem>
                  <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label>Making Charges (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.making_charges}
                onChange={(event) =>
                  update("making_charges", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className={`${fieldClass} md:col-span-2`}>
              <Label>Price Override (₹)</Label>
              <Input
                type="number"
                step="1"
                value={form.price_override}
                onChange={(event) =>
                  update("price_override", event.target.value)
                }
                placeholder="Leave empty for auto-calculation from metal rate + making charges"
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className={cardTitleClass}>Stone Details</CardTitle>

              <Button
                variant="outline"
                size="sm"
                onClick={addStone}
                className="h-9 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Stone
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 px-5 py-5">
            {form.stone_details.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No stones added
                </p>
              </div>
            )}

            {form.stone_details.map((stone, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border border-border/80 bg-background/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stone {index + 1}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeStone(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className={fieldClass}>
                    <Label className="text-xs">Type</Label>
                    <Input
                      value={stone.stone_type}
                      onChange={(event) =>
                        updateStone(index, "stone_type", event.target.value)
                      }
                      placeholder="Diamond, Ruby..."
                      className={inputClass}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label className="text-xs">Carat</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={stone.carat}
                      onChange={(event) =>
                        updateStone(index, "carat", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label className="text-xs">Clarity</Label>
                    <Input
                      value={stone.clarity}
                      onChange={(event) =>
                        updateStone(index, "clarity", event.target.value)
                      }
                      placeholder="VS1, SI1..."
                      className={inputClass}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label className="text-xs">Cut</Label>
                    <Input
                      value={stone.cut}
                      onChange={(event) =>
                        updateStone(index, "cut", event.target.value)
                      }
                      placeholder="Excellent, Good..."
                      className={inputClass}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label className="text-xs">Color</Label>
                    <Input
                      value={stone.color}
                      onChange={(event) =>
                        updateStone(index, "color", event.target.value)
                      }
                      placeholder="D, E, F..."
                      className={inputClass}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label className="text-xs">Cost (₹)</Label>
                    <Input
                      type="number"
                      value={stone.cost}
                      onChange={(event) =>
                        updateStone(index, "cost", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Stock</CardTitle>
          </CardHeader>

          <CardContent className={cardGridClass}>
            <div className={fieldClass}>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={form.stock_quantity}
                onChange={(event) =>
                  update("stock_quantity", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Label>Min Stock Threshold</Label>
              <Input
                type="number"
                value={form.min_stock_threshold}
                onChange={(event) =>
                  update("min_stock_threshold", event.target.value)
                }
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Images</CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <div className="mb-4 flex flex-wrap gap-3">
              {form.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-background"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center text-[9px] text-primary-foreground">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2">
              <Button variant="outline" asChild disabled={uploading}>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Images"}
                </span>
              </Button>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <p className="mt-3 text-xs text-muted-foreground">
              Uploaded images are temporarily converted to data URLs. For
              production, use image upload storage.
            </p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>
              Description & Tags
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-5 py-5">
            <div className={fieldClass}>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Product details, care instructions..."
                className="min-h-28"
              />
            </div>

            <div className={fieldClass}>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="bridal, temple, antique"
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/inventory")}
            className="h-11 px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving || !form.name || !form.sku}
            className="h-11 gap-2 bg-primary px-6"
          >
            <Save className="h-4 w-4" />
            {isSaving
              ? "Saving..."
              : isEdit
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}