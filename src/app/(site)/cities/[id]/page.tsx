import { notFound } from 'next/navigation';
import CityDetailClient from './CityDetailClient';
import { getCityById } from '@/services/cityService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { id } = await params;
  const cityId = Number(id);

  if (!cityId || Number.isNaN(cityId)) {
    notFound();
  }

  try {
    const city = await getCityById(cityId);
    return <CityDetailClient city={city} />;
  } catch {
    notFound();
  }
}

