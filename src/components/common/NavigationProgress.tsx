'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-1 overflow-hidden bg-[#1055CB]/10">
      <div className="h-full w-1/3 animate-navigation-progress rounded-full bg-[#1055CB]" />
    </div>
  );
}
