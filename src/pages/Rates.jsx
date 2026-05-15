import React from "react";
import { useMetalRates } from "@/hooks/useMetalRates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export default function Rates() {
  const { rates, isLoading, isRefreshingLive, refreshLiveRates } =
    useMetalRates();
  const fmt = (v) => `₹${v?.toLocaleString("en-IN")}`;

  const handleRefreshRates = async () => {
    try {
      await refreshLiveRates();

      toast({
        title: "Rates refreshed",
        description: "Latest metal rates were fetched successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rateItems = [
    {
      label: "Gold 24K",
      perGram: rates.gold_24k_per_gram,
      color: "bg-primary",
    },
    {
      label: "Gold 22K",
      perGram: rates.gold_22k_per_gram,
      color: "bg-primary",
    },
    {
      label: "Gold 18K",
      perGram: rates.gold_18k_per_gram,
      color: "bg-primary",
    },
    {
      label: "Silver 999",
      perGram: rates.silver_999_per_gram,
      color: "bg-muted-foreground",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold mb-3">
          Today's Metal Rates
        </h1>
        <p className="text-muted-foreground text-sm">
          Updated{" "}
          {rates.last_updated
            ? format(new Date(rates.last_updated), "dd MMM yyyy, hh:mm a")
            : "recently"}
        </p>
        {rates.is_fallback && (
          <Badge variant="outline" className="mt-2 text-xs">
            Indicative rates — live API not configured
          </Badge>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {rateItems.map((item) => (
          <Card key={item.label} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.color}`} />
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Per Gram
                  </p>
                  <p className="text-2xl font-semibold">{fmt(item.perGram)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Per 10 Grams
                  </p>
                  <p className="text-2xl font-semibold">
                    {fmt(item.perGram * 10)}
                  </p>
                </div>
              </div>
              {item.label === "Silver 999" && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Per Kilogram
                  </p>
                  <p className="text-xl font-semibold">
                    {fmt(item.perGram * 1000)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleRefreshRates}
        disabled={isLoading || isRefreshingLive}
        className="gap-2"
      >
        <RefreshCw
          className={`w-4 h-4 ${
            isLoading || isRefreshingLive ? "animate-spin" : ""
          }`}
        />
        Refresh Live Rates
      </Button>
      
      <div className="mt-12 text-center text-xs text-muted-foreground max-w-md mx-auto">
        <p className="font-medium mb-1">Disclaimer</p>
        <p>
          Metal rates are indicative and may vary. Actual prices at the time of
          purchase may differ based on market conditions. Please contact the
          store for exact pricing.
        </p>
      </div>
    </div>
  );
}
