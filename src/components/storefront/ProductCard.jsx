import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMetalRates } from '@/hooks/useMetalRates';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({ product }) {
  const { calculatePrice } = useMetalRates();
  const [imageLoaded, setImageLoaded] = useState(false);
  const price = calculatePrice(product);
  const primaryImage = product.images?.[0];
  const inStock = product.stock_quantity > 0;

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted mb-3">
        {!imageLoaded && <div className="absolute inset-0 gold-shimmer" />}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="font-heading text-2xl text-muted-foreground/30">
              {product.name?.[0]}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-foreground/80 text-background text-[10px] font-body font-medium tracking-wide">
            {product.metal_type}
          </Badge>
          {!inStock && (
            <Badge variant="destructive" className="text-[10px] font-body">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-heading text-lg font-medium leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.purity} {product.metal_type} · {product.net_weight}g
        </p>
        <p className="font-body text-base font-semibold">
          ₹{price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}