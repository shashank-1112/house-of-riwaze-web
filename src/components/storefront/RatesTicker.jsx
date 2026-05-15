import React from 'react';
import { useMetalRates } from '@/hooks/useMetalRates';
import { TrendingUp } from 'lucide-react';

export default function RatesTicker() {
  const { rates } = useMetalRates();

  const formatRate = (val) => `₹${val?.toLocaleString('en-IN')}`;

  return (
    <div className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs sm:text-sm overflow-x-auto gap-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium opacity-70">Today's Rates:</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span>
            <span className="opacity-60">Gold 24K:</span>{' '}
            <span className="font-semibold">{formatRate(rates.gold_24k_per_gram)}/g</span>
          </span>
          <span>
            <span className="opacity-60">Gold 22K:</span>{' '}
            <span className="font-semibold">{formatRate(rates.gold_22k_per_gram)}/g</span>
          </span>
          <span>
            <span className="opacity-60">Silver:</span>{' '}
            <span className="font-semibold">{formatRate(rates.silver_999_per_gram)}/g</span>
          </span>
        </div>
      </div>
    </div>
  );
}