import { getAllCities, iranProvinces } from '@/data/iranData';

const IRAN_LAT = { min: 24, max: 41 };
const IRAN_LNG = { min: 43, max: 64 };

export function parseCoordinate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value !== 0) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const normalized = value
      .trim()
      .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
      .replace(',', '.');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed) && parsed !== 0) {
      return parsed;
    }
  }

  return null;
}

function isIranLat(value: number): boolean {
  return value >= IRAN_LAT.min && value <= IRAN_LAT.max;
}

function isIranLng(value: number): boolean {
  return value >= IRAN_LNG.min && value <= IRAN_LNG.max;
}

export function normalizeIranCoordinates(
  latitude: unknown,
  longitude: unknown
): [number, number] | null {
  const first = parseCoordinate(latitude);
  const second = parseCoordinate(longitude);
  if (first == null || second == null) {
    return null;
  }

  if (isIranLat(first) && isIranLng(second)) {
    return [first, second];
  }

  // برخی رکوردهای بک‌اند lat/lng را جابه‌جا ذخیره کرده‌اند
  if (isIranLng(first) && isIranLat(second)) {
    return [second, first];
  }

  return null;
}

export function findCityCoordinates(cityName?: string | null): [number, number] | null {
  const name = cityName?.trim();
  if (!name) {
    return null;
  }

  const cities = getAllCities();
  const exactCity = cities.find((city) => city.name === name);
  if (exactCity) {
    return exactCity.coordinates;
  }

  const fuzzyCity = cities
    .filter((city) => name.includes(city.name) && city.name.length >= 3)
    .sort((a, b) => b.name.length - a.name.length)[0];
  if (fuzzyCity) {
    return fuzzyCity.coordinates;
  }

  const province = iranProvinces.find(
    (item) => item.name === name || name.includes(item.name)
  );
  return province ? province.coordinates : null;
}

const LATITUDE_KEYS = [
  'latitude',
  'lat',
  'geo_lat',
  'geo_latitude',
  'عرض_جغرافیایی',
  'arz',
] as const;

const LONGITUDE_KEYS = [
  'longitude',
  'lng',
  'lon',
  'geo_lng',
  'geo_lon',
  'geo_longitude',
  'طول_جغرافیایی',
  'tool',
] as const;

function firstCoordinate(source: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    if (source[key] != null && source[key] !== '') {
      return source[key];
    }
  }
  return undefined;
}

export function pickIranCoordinates(source: unknown): [number, number] | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const record = source as Record<string, unknown>;
  return normalizeIranCoordinates(
    firstCoordinate(record, LATITUDE_KEYS),
    firstCoordinate(record, LONGITUDE_KEYS)
  );
}

export type MapAreaPrecision = 'property' | 'location' | 'geocoded' | 'city';

export function mapAreaRadiusMeters(precision: MapAreaPrecision): number {
  if (precision === 'city') return 1200;
  return 320;
}

export function normalizePlaceName(value?: string | null): string {
  return (value || '')
    .trim()
    .replace(/[،,]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function placeNamesMatch(a?: string | null, b?: string | null): boolean {
  const left = normalizePlaceName(a);
  const right = normalizePlaceName(b);
  if (!left || !right) return false;
  if (left === right) return true;

  const compact = (value: string) => [...new Set(value.split(' '))].join(' ');
  return compact(left) === compact(right) || compact(left) === right || compact(right) === left;
}
