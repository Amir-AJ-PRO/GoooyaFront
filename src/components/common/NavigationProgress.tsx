'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SAFETY_TIMEOUT_MS = 8000;

function getRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return '';
}

function getRequestHeaders(input: RequestInfo | URL, init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  if (typeof Request !== 'undefined' && input instanceof Request) {
    input.headers.forEach((value, key) => {
      if (!headers.has(key)) headers.set(key, value);
    });
  }
  return headers;
}

function isPrefetchRequest(input: RequestInfo | URL, init?: RequestInit): boolean {
  const headers = getRequestHeaders(input, init);
  return (
    headers.get('Next-Router-Prefetch') === '1' ||
    headers.get('next-router-prefetch') === '1'
  );
}

function isPathChangingRscFetch(input: RequestInfo | URL, init?: RequestInit): boolean {
  const url = getRequestUrl(input);
  if (!url.includes('_rsc=') || isPrefetchRequest(input, init)) return false;

  try {
    const requestUrl = new URL(url, window.location.href);
    return requestUrl.pathname !== window.location.pathname;
  } catch {
    return false;
  }
}

type NavigationKind = 'none' | 'query' | 'route';

function getAnchorNavigationKind(anchor: HTMLAnchorElement, event: MouseEvent): NavigationKind {
  if (event.button !== 0) return 'none';
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return 'none';
  if (anchor.target && anchor.target !== '_self') return 'none';
  if (anchor.hasAttribute('download')) return 'none';

  const href = anchor.getAttribute('href');
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return 'none';
  }

  try {
    const nextUrl = new URL(href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return 'none';
    if (nextUrl.pathname !== window.location.pathname) return 'route';
    if (nextUrl.search !== window.location.search) return 'query';
    return 'none';
  } catch {
    return 'none';
  }
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [barVisible, setBarVisible] = useState(false);
  const safetyTimer = useRef<number>();
  const isFirstRoute = useRef(true);

  const stop = useCallback(() => {
    window.clearTimeout(safetyTimer.current);
    setBarVisible(false);
  }, []);

  const start = useCallback(() => {
    setBarVisible(true);
    window.clearTimeout(safetyTimer.current);
    safetyTimer.current = window.setTimeout(stop, SAFETY_TIMEOUT_MS);
  }, [stop]);

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    stop();
  }, [pathname, search, stop]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const kind = getAnchorNavigationKind(anchor, event);
      if (kind === 'none') return;
      start();
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = (...args: Parameters<typeof fetch>) => {
      if (isPathChangingRscFetch(args[0], args[1])) start();
      return originalFetch(...args);
    };

    const onPopState = () => start();

    window.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      window.fetch = originalFetch;
      window.clearTimeout(safetyTimer.current);
    };
  }, [start]);

  if (!barVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-1 overflow-hidden bg-[#1055CB]/10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-full w-1/3 animate-navigation-progress rounded-full bg-[#1055CB]" />
    </div>
  );
}
