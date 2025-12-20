import type { Metadata } from "next";
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Clock } from 'lucide-react';
import SupportChatClient from '@/components/support/SupportChatClient';

export const metadata: Metadata = {
  title: "پشتیبانی - گویا",
  description: "چت پشتیبانی گویا. سوالات و مشکلات خود را مطرح کنید تا در اسرع وقت پاسخ داده شود.",
  keywords: ["پشتیبانی", "چت", "تماس با ما", "خدمات مشتریان"],
};

/**
 * Support Page - Server Component
 * صفحه پشتیبانی (چت واحد) - Client Component برای UI چت
 */
export default function Support() {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">پشتیبانی</h1>
            <p className="text-lg opacity-90">
              ما همیشه در کنار شما هستیم. سوالات و مشکلات خود را در چت پشتیبانی مطرح کنید
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">تماس تلفنی</h3>
                <p className="text-sm text-muted-foreground" dir="ltr">021-12345678</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">ایمیل</h3>
                <p className="text-sm text-muted-foreground" dir="ltr">support@gooya.ir</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">ساعات کاری</h3>
                <p className="text-sm text-muted-foreground">۲۴ ساعته (شبانه‌روزی)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Section - Client Component */}
      <SupportChatClient />
    </div>
  );
}
