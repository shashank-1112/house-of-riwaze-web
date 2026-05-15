import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-2xl font-semibold mb-3 text-primary">
              {settings.store_name}
            </h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              {settings.tagline || 'Timeless elegance, crafted with love. Every piece tells a story of tradition and artistry.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-4 opacity-90">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { label: 'All Collections', path: '/products' },
                // { label: "Today's Rates", path: '/rates' },
                { label: 'Gold Jewellery', path: '/products?metal=Gold' },
                { label: 'Diamond Jewellery', path: '/products?metal=Diamond' },
                { label: 'Silver Jewellery', path: '/products?metal=Silver' },
              ].map(link => (
                <Link key={link.path} to={link.path} className="block text-sm opacity-50 hover:opacity-90 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-4 opacity-90">Categories</h4>
            <div className="space-y-2.5">
              {['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Pendants'].map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} className="block text-sm opacity-50 hover:opacity-90 transition-opacity">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-4 opacity-90">Contact Us</h4>
            <div className="space-y-3">
              {settings.address && (
                <div className="flex items-start gap-2.5 text-sm opacity-60">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm opacity-60 hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 text-sm opacity-60 hover:opacity-90 transition-opacity"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-xs opacity-40">
          © {new Date().getFullYear()} {settings.store_name}. All rights reserved. BIS Hallmarked Jewellery.
        </div>
      </div>
    </footer>
  );
}