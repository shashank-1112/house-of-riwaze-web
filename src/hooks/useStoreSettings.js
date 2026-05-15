import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useStoreSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
    initialData: [],
  });

  const settings = data?.[0] || {
    store_name: 'House of Riwaze',
    tagline: 'Timeless Elegance, Crafted for You',
    whatsapp: '9146567388',
    email: 'ssp@gmail.com',
    address: '',
    instagram: '',
    facebook: '',
    default_making_charges: {},
    logo_url: 'https://raw.githubusercontent.com/shashank-1112/images/8779686a25f689be3ef63da813eba218637a1da4/favicon.png'
  };

  return { settings, isLoading };
}