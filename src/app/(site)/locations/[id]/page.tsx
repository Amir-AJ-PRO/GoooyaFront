import { notFound } from 'next/navigation';
import LocationDetailClient from './LocationDetailClient';
import { getLocationById } from '@/services/locationService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const locationId = Number(id);

  if (!locationId || Number.isNaN(locationId)) {
    notFound();
  }

  try {
    const location = await getLocationById(locationId);
    return <LocationDetailClient location={location} />;
  } catch {
    notFound();
  }
}


