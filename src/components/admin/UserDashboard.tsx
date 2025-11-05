import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  Heart, 
  Eye, 
  MessageSquare, 
  Settings, 
  Bell, 
  Calendar,
  MapPin,
  DollarSign,
  Home,
  User
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    bio: ''
  });

  const handleProfileUpdate = () => {
    // در پروژه واقعی این اطلاعات به API ارسال میشه
    console.log('Profile update:', profileData);
    toast({
      title: "پروفایل به‌روزرسانی شد",
      description: "اطلاعات شما با موفقیت ذخیره شد"
    });
  };

  // Mock data - in real app, this would come from API
  const favoriteProperties = [
    {
      id: 1,
      title: 'آپارتمان 120 متری در نیاوران',
      price: '15,000,000,000',
      location: 'نیاوران، تهران',
      image: '/src/assets/property-1.jpg',
      type: 'آپارتمان',
      rooms: 3,
      area: 120
    },
    {
      id: 2,
      title: 'ویلا 200 متری در شمال',
      price: '25,000,000,000',
      location: 'رامسر، مازندران',
      image: '/src/assets/property-2.jpg',
      type: 'ویلا',
      rooms: 4,
      area: 200
    }
  ];

  const recentViews = [
    {
      id: 1,
      title: 'آپارتمان 80 متری در ونک',
      price: '8,500,000,000',
      location: 'ونک، تهران',
      viewedAt: '2 ساعت پیش'
    },
    {
      id: 2,
      title: 'خانه 150 متری در اقدسیه',
      price: '18,000,000,000',
      location: 'اقدسیه، تهران',
      viewedAt: '1 روز پیش'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'قیمت ملک مورد علاقه شما کاهش یافت',
      message: 'آپارتمان 120 متری در نیاوران',
      time: '2 ساعت پیش',
      type: 'price_drop'
    },
    {
      id: 2,
      title: 'ملک جدیدی مطابق با جستجوی شما',
      message: '3 آپارتمان جدید در منطقه مورد نظر شما',
      time: '1 روز پیش',
      type: 'new_property'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">سلام {user?.name || 'کاربر'}</h1>
                <p className="text-gray-600">خوش آمدید به پنل کاربری شما</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={logout}>
                خروج
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                تنظیمات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="profile">پروفایل</TabsTrigger>
            <TabsTrigger value="favorites">علاقه‌مندی‌ها</TabsTrigger>
            <TabsTrigger value="history">تاریخچه</TabsTrigger>
            <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">علاقه‌مندی‌ها</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favoriteProperties.length}</div>
                  <p className="text-xs text-muted-foreground">ملک مورد علاقه</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">بازدیدهای اخیر</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentViews.length}</div>
                  <p className="text-xs text-muted-foreground">ملک بازدید شده</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">پیام‌ها</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">پیام خوانده نشده</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">اعلان‌ها</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <p className="text-xs text-muted-foreground">اعلان جدید</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>دسترسی سریع</CardTitle>
                <CardDescription>عملیات پرکاربرد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Home className="h-6 w-6" />
                    <span>جستجوی ملک</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <MapPin className="h-6 w-6" />
                    <span>نقشه املاک</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>قرار ملاقات</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <MessageSquare className="h-6 w-6" />
                    <span>تماس با ما</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card dir="rtl">
              <CardHeader className="text-right">
                <CardTitle className="text-right">اطلاعات شخصی</CardTitle>
                <CardDescription className="text-right">اطلاعات خود را تکمیل و به‌روزرسانی کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-right block mb-2">نام *</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        placeholder="نام خود را وارد کنید"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-right block mb-2">نام خانوادگی *</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        placeholder="نام خانوادگی خود را وارد کنید"
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-right block mb-2">ایمیل</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="example@email.com"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-right block mb-2">شماره تلفن *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        readOnly
                        disabled
                        className="text-right bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        شماره تلفن قابل تغییر نیست
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-right block mb-2">آدرس</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="آدرس کامل خود را وارد کنید"
                      className="text-right min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-right block mb-2">شهر</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        placeholder="شهر محل سکونت"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-right block mb-2">کد پستی</Label>
                      <Input
                        id="postalCode"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                        placeholder="کد پستی ۱۰ رقمی"
                        className="text-right"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-right block mb-2">درباره من</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="توضیحات کوتاهی درباره خود بنویسید..."
                      className="text-right min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-start gap-3">
                    <Button type="button" onClick={handleProfileUpdate}>
                      ذخیره تغییرات
                    </Button>
                    <Button type="button" variant="outline">
                      انصراف
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملک‌های مورد علاقه</CardTitle>
                <CardDescription>لیست ملک‌هایی که به آن‌ها علاقه نشان داده‌اید</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteProperties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{property.type}</Badge>
                          <span className="text-sm text-gray-500">{property.rooms} خواب</span>
                          <span className="text-sm text-gray-500">{property.area} متر</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{property.price} تومان</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Eye className="h-4 w-4 ml-2" />
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تاریخچه بازدیدها</CardTitle>
                <CardDescription>ملک‌هایی که اخیراً مشاهده کرده‌اید</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentViews.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{property.viewedAt}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{property.price} تومان</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Eye className="h-4 w-4 ml-2" />
                          مشاهده مجدد
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اعلان‌ها</CardTitle>
                <CardDescription>آخرین اطلاع‌رسانی‌ها و اعلان‌ها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
