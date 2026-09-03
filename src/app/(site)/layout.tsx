import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AiWidget from '@/components/aiwidget/AiWidget';
import NavigationProgress from '@/components/common/NavigationProgress';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" bg-[#E0E0E0]">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Header />
      <main className="flex-1 ">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-0 right-0 z-50">
        <AiWidget />
      </div>
    </div>
  );
}
