'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PropertyLeafletMap.css';

interface PropertyLeafletMapProps {
  center: [number, number];
  radiusMeters?: number;
  title?: string;
  subtitle?: string;
}

function escapeHtml(value?: string) {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resetLeafletContainer(element: HTMLDivElement) {
  const container = element as HTMLDivElement & { _leaflet_id?: number };
  if (container._leaflet_id) {
    container._leaflet_id = undefined;
  }
}

export default function PropertyLeafletMap({
  center,
  radiusMeters = 320,
  title,
  subtitle,
}: PropertyLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lat = Number(center[0]);
  const lng = Number(center[1]);
  const radius = Number.isFinite(radiusMeters) && radiusMeters > 0 ? radiusMeters : 320;

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    let map: LeafletMap | undefined;
    let cancelled = false;
    let rafId = 0;

    const setup = async () => {
      const leaflet = await import('leaflet');
      const L = leaflet.default ?? leaflet;
      if (cancelled || containerRef.current !== element) return;

      resetLeafletContainer(element);
      if (cancelled) return;

      map = L.map(element, {
        center: [lat, lng],
        zoom: 14,
        scrollWheelZoom: false,
        attributionControl: true,
        zoomAnimation: false,
        fadeAnimation: false,
        markerZoomAnimation: false,
      });

      if (cancelled) {
        map.remove();
        map = undefined;
        return;
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const area = L.circle([lat, lng], {
        radius,
        color: '#1055C9',
        weight: 2,
        fillColor: '#1055C9',
        fillOpacity: 0.18,
        opacity: 0.85,
        className: 'property-map-area',
      }).addTo(map);

      if (title || subtitle) {
        area.bindPopup(
          `<div>${title ? `<h3>${escapeHtml(title)}</h3>` : ''}${
            subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''
          }</div>`
        );
      }

      try {
        map.fitBounds(area.getBounds(), {
          padding: [40, 40],
          maxZoom: 16,
        });
      } catch {
        // Map may already be tearing down in React Strict Mode.
      }

      rafId = window.requestAnimationFrame(() => {
        if (cancelled || !map) return;
        try {
          map.invalidateSize();
          map.fitBounds(area.getBounds(), {
            padding: [40, 40],
            maxZoom: 16,
          });
        } catch {
          // Ignore leftover Leaflet reads after unmount.
        }
      });
    };

    void setup();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      const currentMap = map;
      map = undefined;
      try {
        currentMap?.stop();
        currentMap?.remove();
      } catch {
        // Leaflet can throw _leaflet_pos if a zoom frame runs after remove.
      }
    };
  }, [lat, lng, radius, title, subtitle]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
        موقعیت این ملک روی نقشه مشخص نیست.
      </div>
    );
  }

  return (
    <div className="property-leaflet-map h-[320px] w-full overflow-hidden rounded-lg border">
      <div ref={containerRef} style={{ height: 320, width: '100%' }} />
    </div>
  );
}
