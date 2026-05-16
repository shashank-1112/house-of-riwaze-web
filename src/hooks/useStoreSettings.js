import { useQuery } from "@tanstack/react-query";
import { storeSettingsApi } from "@/api/storeSettingsApi";

const DEFAULT_SETTINGS = {
  store_name: "House of Riwaze",
  tagline: "Timeless Elegance, Crafted for You",
  whatsapp: "9146567388",
  email: "ssp@gmail.com",
  address: "",
  instagram: "",
  facebook: "",
  default_making_charges: {},
  logo_url:
    "https://raw.githubusercontent.com/shashank-1112/images/8779686a25f689be3ef63da813eba218637a1da4/favicon.png",
};

function normalizeSettings(settings) {
  if (!settings) {
    return DEFAULT_SETTINGS;
  }

  return {
    store_name:
      settings.store_name ??
      settings.storeName ??
      DEFAULT_SETTINGS.store_name,

    tagline:
      settings.tagline ??
      DEFAULT_SETTINGS.tagline,

    logo_url:
      settings.logo_url ??
      settings.logoUrl ??
      DEFAULT_SETTINGS.logo_url,

    address:
      settings.address ??
      DEFAULT_SETTINGS.address,

    whatsapp:
      settings.whatsapp ??
      DEFAULT_SETTINGS.whatsapp,

    email:
      settings.email ??
      DEFAULT_SETTINGS.email,

    instagram:
      settings.instagram ??
      DEFAULT_SETTINGS.instagram,

    facebook:
      settings.facebook ??
      DEFAULT_SETTINGS.facebook,

    default_making_charges:
      settings.default_making_charges ??
      settings.defaultMakingCharges ??
      DEFAULT_SETTINGS.default_making_charges,

    updated_at:
      settings.updated_at ??
      settings.updatedAt ??
      null,
  };
}

export function useStoreSettings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["store-settings"],
    queryFn: storeSettingsApi.getPublicSettings,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const settings = normalizeSettings(data);

  return {
    settings,
    isLoading,
    error,
    refetch,
  };
}