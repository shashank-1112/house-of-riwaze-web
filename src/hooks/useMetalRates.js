import { useCallback, useEffect, useState } from "react";
import { metalRatesApi } from "@/api/metalRatesApi";

const FALLBACK_RATES = {
  gold_24k_per_gram: 7450,
  gold_22k_per_gram: 6825,
  gold_18k_per_gram: 5588,
  silver_999_per_gram: 92,
  platinum_per_gram: 3150,

  gold_24k: 7450,
  gold_22k: 6825,
  gold_18k: 5588,
  silver: 92,
  platinum: 3150,

  mcx_gold_per_gram: null,
  mcx_silver_per_gram: null,
  ibja_gold_per_gram: null,

  currency: "INR",
  unit: "g",
  source: "fallback",
  is_fallback: true,
  last_updated: new Date().toISOString(),
};

function normalizeRates(data) {
  const gold24 =
    data?.gold_24k_per_gram ??
    data?.gold24kPerGram ??
    FALLBACK_RATES.gold_24k_per_gram;

  const gold22 =
    data?.gold_22k_per_gram ??
    data?.gold22kPerGram ??
    FALLBACK_RATES.gold_22k_per_gram;

  const gold18 =
    data?.gold_18k_per_gram ??
    data?.gold18kPerGram ??
    FALLBACK_RATES.gold_18k_per_gram;

  const silver =
    data?.silver_999_per_gram ??
    data?.silver999PerGram ??
    FALLBACK_RATES.silver_999_per_gram;

  const platinum =
    data?.platinum_per_gram ??
    data?.platinumPerGram ??
    FALLBACK_RATES.platinum_per_gram;

  return {
    gold_24k_per_gram: Number(gold24 || 0),
    gold_22k_per_gram: Number(gold22 || 0),
    gold_18k_per_gram: Number(gold18 || 0),
    silver_999_per_gram: Number(silver || 0),
    platinum_per_gram: Number(platinum || 0),

    // Compatibility keys for old components
    gold_24k: Number(gold24 || 0),
    gold_22k: Number(gold22 || 0),
    gold_18k: Number(gold18 || 0),
    silver: Number(silver || 0),
    platinum: Number(platinum || 0),

    mcx_gold_per_gram: data?.mcx_gold_per_gram ?? data?.mcxGoldPerGram ?? null,
    mcx_silver_per_gram:
      data?.mcx_silver_per_gram ?? data?.mcxSilverPerGram ?? null,
    ibja_gold_per_gram:
      data?.ibja_gold_per_gram ?? data?.ibjaGoldPerGram ?? null,

    currency: data?.currency || "INR",
    unit: data?.unit || "g",
    source: data?.source || "backend",

    is_fallback: data?.is_fallback ?? data?.isFallback ?? false,
    last_updated:
      data?.last_updated ?? data?.lastUpdated ?? new Date().toISOString(),
  };
}

function getProductValue(product, snakeKey, camelKey, fallback = "") {
  return product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
}

function getProductNumber(product, snakeKey, camelKey, fallback = 0) {
  const value = product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getRateForProduct(product, rates) {
  const metalType = String(
    getProductValue(product, "metal_type", "metalType", "")
  ).toLowerCase();

  const purity = String(product?.purity || "").toLowerCase();

  if (metalType.includes("silver")) {
    return Number(rates.silver_999_per_gram || 0);
  }

  if (metalType.includes("platinum")) {
    return Number(rates.platinum_per_gram || 0);
  }

  if (purity.includes("24")) {
    return Number(rates.gold_24k_per_gram || 0);
  }

  if (purity.includes("18")) {
    return Number(rates.gold_18k_per_gram || 0);
  }

  return Number(rates.gold_22k_per_gram || 0);
}

function getStoneCost(product) {
  const stones = product?.stone_details || product?.stoneDetails || [];

  return stones.reduce((sum, stone) => {
    return sum + Number(stone.cost || 0);
  }, 0);
}

export function useMetalRates() {
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await metalRatesApi.getLatestRates();
      setRates(normalizeRates(data));
    } catch (err) {
      setRates(FALLBACK_RATES);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshLiveRates = useCallback(async () => {
    setIsRefreshingLive(true);
    setError(null);

    try {
      const data = await metalRatesApi.refreshLiveRates();
      const normalized = normalizeRates(data);

      setRates(normalized);

      return normalized;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsRefreshingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedRates();
  }, [fetchSavedRates]);

  const calculatePrice = useCallback(
    (product) => {
      const priceOverride =
        product?.price_override ?? product?.priceOverride ?? null;

      if (
        priceOverride !== null &&
        priceOverride !== undefined &&
        priceOverride !== "" &&
        Number(priceOverride) > 0
      ) {
        return Math.round(Number(priceOverride));
      }

      const netWeight = getProductNumber(product, "net_weight", "netWeight", 0);

      const makingCharges = getProductNumber(
        product,
        "making_charges",
        "makingCharges",
        0
      );

      const makingChargesType = getProductValue(
        product,
        "making_charges_type",
        "makingChargesType",
        "per_gram"
      );

      const metalRate = getRateForProduct(product, rates);

      const metalCost = netWeight * metalRate;

      const makingCost =
        makingChargesType === "flat"
          ? makingCharges
          : netWeight * makingCharges;

      const stoneCost = getStoneCost(product);

      return Math.round(metalCost + makingCost + stoneCost);
    },
    [rates]
  );

  return {
    rates,
    isLoading,
    isRefreshingLive,
    error,
    refetch: fetchSavedRates,
    refreshLiveRates,
    calculatePrice,
  };
}