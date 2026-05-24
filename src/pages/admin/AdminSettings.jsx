import React, { useEffect, useState } from "react";

import { storeSettingsApi } from "@/api/storeSettingsApi";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { Save, RefreshCw } from "lucide-react";

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

const DEFAULT_SETTINGS = {
  store_name: "Rivaazé",
  tagline: "Timeless Elegance, Crafted for You",
  logo_url:
    "https://raw.githubusercontent.com/shashank-1112/images/8779686a25f689be3ef63da813eba218637a1da4/favicon.png",
  address: "",
  whatsapp: "",
  email: "",
  instagram: "",
  facebook: "",
  default_making_charges: {},
};

const cardClass = "rounded-2xl border-border/80 bg-card shadow-sm";
const cardHeaderClass = "border-b border-border/60 px-5 py-4";
const cardTitleClass = "font-heading text-xl font-semibold";
const cardContentClass = "px-5 py-5";
const fieldClass = "space-y-1.5";
const inputClass = "h-11";

function normalizeSettings(settings) {
  return {
    store_name:
      settings?.store_name ?? settings?.storeName ?? DEFAULT_SETTINGS.store_name,

    tagline:
      settings?.tagline ?? DEFAULT_SETTINGS.tagline,

    logo_url:
      settings?.logo_url ?? settings?.logoUrl ?? DEFAULT_SETTINGS.logo_url,

    address:
      settings?.address ?? DEFAULT_SETTINGS.address,

    whatsapp:
      settings?.whatsapp ?? DEFAULT_SETTINGS.whatsapp,

    email:
      settings?.email ?? DEFAULT_SETTINGS.email,

    instagram:
      settings?.instagram ?? DEFAULT_SETTINGS.instagram,

    facebook:
      settings?.facebook ?? DEFAULT_SETTINGS.facebook,

    default_making_charges:
      settings?.default_making_charges ??
      settings?.defaultMakingCharges ??
      DEFAULT_SETTINGS.default_making_charges,
  };
}

function toBackendSettings(form) {
  return {
    storeName: form.store_name || "Rivaazé",
    tagline: form.tagline || "",
    logoUrl: form.logo_url || "",
    address: form.address || "",
    whatsapp: form.whatsapp || "",
    email: form.email || "",
    instagram: form.instagram || "",
    facebook: form.facebook || "",
    defaultMakingCharges: Object.fromEntries(
      Object.entries(form.default_making_charges || {}).map(([key, value]) => [
        key,
        Number(value || 0),
      ])
    ),
  };
}

export default function AdminSettings() {
  const { toast } = useToast();

  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);

    try {
      const settings = await storeSettingsApi.getAdminSettings();
      setForm(normalizeSettings(settings));
    } catch (error) {
      toast({
        title: "Failed to load settings",
        description: error.message,
        variant: "destructive",
      });

      setForm(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCharge = (category, value) => {
    setForm((prev) => ({
      ...prev,
      default_making_charges: {
        ...prev.default_making_charges,
        [category]: value === "" ? "" : Number(value || 0),
      },
    }));
  };

  const validate = () => {
    if (!form.store_name.trim()) {
      toast({
        title: "Store name required",
        description: "Please enter your store name.",
        variant: "destructive",
      });

      return false;
    }

    if (form.email && !form.email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      const saved = await storeSettingsApi.updateAdminSettings(
        toBackendSettings(form)
      );

      setForm(normalizeSettings(saved));

      toast({
        title: "Settings saved",
        description: "Store settings were updated successfully.",
      });
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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Settings</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure your store details, contact information, and default
            pricing rules.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadSettings}
          disabled={isLoading || isSaving}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-5">
        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Store Information</CardTitle>
          </CardHeader>

          <CardContent className={`${cardContentClass} space-y-5`}>
            <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
              <div className={fieldClass}>
                <Label>Store Name</Label>

                <Input
                  value={form.store_name}
                  onChange={(event) => update("store_name", event.target.value)}
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>

              <div className={fieldClass}>
                <Label>Tagline</Label>

                <Input
                  value={form.tagline}
                  onChange={(event) => update("tagline", event.target.value)}
                  placeholder="Timeless Elegance, Crafted for You"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <Label>Logo URL</Label>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {form.logo_url ? (
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                    <img
                      src={form.logo_url}
                      alt="Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-border bg-card text-xs text-muted-foreground">
                    No logo
                  </div>
                )}

                <div className="min-w-[240px] flex-1">
                  <Input
                    value={form.logo_url}
                    onChange={(event) => update("logo_url", event.target.value)}
                    placeholder="https://example.com/logo.png"
                    className={inputClass}
                    disabled={isLoading}
                  />

                  <p className="mt-2 text-xs text-muted-foreground">
                    Use a hosted image URL. Do not store base64 images in DB for
                    production.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Contact Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-x-5 gap-y-4 px-5 py-5 md:grid-cols-2">
            <div className={`${fieldClass} md:col-span-2`}>
              <Label>Address</Label>

              <Textarea
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                rows={3}
                className="min-h-24"
                disabled={isLoading}
              />
            </div>

            <div className={fieldClass}>
              <Label>WhatsApp Number</Label>

              <Input
                value={form.whatsapp}
                onChange={(event) => update("whatsapp", event.target.value)}
                placeholder="919876543210"
                className={inputClass}
                disabled={isLoading}
              />

              <p className="text-xs text-muted-foreground">
                Use country code without + sign.
              </p>
            </div>

            <div className={fieldClass}>
              <Label>Email</Label>

              <Input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="contact@example.com"
                className={inputClass}
                disabled={isLoading}
              />
            </div>

            <div className={fieldClass}>
              <Label>Instagram URL</Label>

              <Input
                value={form.instagram}
                onChange={(event) => update("instagram", event.target.value)}
                placeholder="https://instagram.com/..."
                className={inputClass}
                disabled={isLoading}
              />
            </div>

            <div className={fieldClass}>
              <Label>Facebook URL</Label>

              <Input
                value={form.facebook}
                onChange={(event) => update("facebook", event.target.value)}
                placeholder="https://facebook.com/..."
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <div>
              <CardTitle className={cardTitleClass}>
                Default Making Charges
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                These values auto-fill while creating new products.
              </p>
            </div>
          </CardHeader>

          <CardContent className={cardContentClass}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="rounded-xl border border-border/70 bg-background/60 p-3"
                >
                  <Label className="text-xs">{category}</Label>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">₹</span>

                    <Input
                      type="number"
                      step="1"
                      value={form.default_making_charges[category] ?? ""}
                      onChange={(event) =>
                        updateCharge(category, event.target.value)
                      }
                      placeholder="0"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl justify-end gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="h-11 gap-2 bg-primary px-6"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}