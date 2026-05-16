import React from 'react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const { settings } = useStoreSettings();
  if (!settings.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=Hi, I'd like to enquire about your jewellery collection.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-3.5 shadow-lg transition-all hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}