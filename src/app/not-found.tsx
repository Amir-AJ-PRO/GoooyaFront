import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">۴۰۴</h1>
        <h2 className="text-3xl font-bold mb-2">صفحه یافت نشد</h2>
        <p className="text-muted-foreground mb-8">
          متأسفانه صفحه مورد نظر شما یافت نشد. احتمالاً این صفحه حذف شده یا آدرس آن تغییر کرده است.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 ml-2" />
              صفحه اصلی
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline">
              <Search className="h-4 w-4 ml-2" />
              جستجوی املاک
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

