import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Settings, 
  BarChart3,
  Users,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import { useState } from 'react';

const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [propertyVideo, setPropertyVideo] = useState<File | null>(null);
  
  // New property form state
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
    area: '',
    rooms: '',
    bathrooms: '',
    address: '',
    city: '',
    region: '',
    hasParking: false,
    hasElevator: false,
    hasStorage: false,
    floor: '',
    buildYear: ''
  });
  
  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    licenseNumber: user?.licenseNumber || '',
    address: '',
    city: '',
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
  const properties = [
    {
      id: 1,
      title: 'آپارتمان 120 متری در نیاوران',
      price: '15,000,000,000',
      location: 'نیاوران، تهران',
      type: 'آپارتمان',
      rooms: 3,
      area: 120,
      status: 'فعال',
      views: 45,
      likes: 12,
      createdAt: '2024-01-15',
      images: ['/src/assets/property-1.jpg', '/src/assets/property-2.jpg']
    },
    {
      id: 2,
      title: 'ویلا 200 متری در شمال',
      price: '25,000,000,000',
      location: 'رامسر، مازندران',
      type: 'ویلا',
      rooms: 4,
      area: 200,
      status: 'در انتظار تایید',
      views: 23,
      likes: 8,
      createdAt: '2024-01-10',
      images: ['/src/assets/property-2.jpg', '/src/assets/property-3.jpg']
    }
  ];

  const stats = {
    totalProperties: 15,
    activeProperties: 12,
    pendingProperties: 3,
    totalViews: 1250,
    totalLikes: 340,
    monthlyRevenue: '45,000,000'
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPropertyImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setPropertyImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPropertyVideo(file);
  };

  const handlePublishProperty = () => {
    // Validation
    if (!newProperty.title || !newProperty.price || !newProperty.type || !newProperty.area) {
      toast({
        title: "اطلاعات ناقص",
        description: "لطفا تمام فیلدهای ضروری را پر کنید",
        variant: "destructive"
      });
      return;
    }

    if (propertyImages.length === 0) {
      toast({
        title: "عکس ضروری است",
        description: "لطفا حداقل یک عکس از ملک آپلود کنید",
        variant: "destructive"
      });
      return;
    }

    // در پروژه واقعی اینجا به API ارسال میشه
    const formData = {
      ...newProperty,
      images: propertyImages,
      video: propertyVideo
    };
    
    console.log('Publishing property:', formData);
    
    toast({
      title: "ملک منتشر شد",
      description: "ملک شما با موفقیت منتشر شد و در حال بررسی است"
    });

    // Reset form
    setNewProperty({
      title: '',
      description: '',
      price: '',
      type: '',
      area: '',
      rooms: '',
      bathrooms: '',
      address: '',
      city: '',
      region: '',
      hasParking: false,
      hasElevator: false,
      hasStorage: false,
      floor: '',
      buildYear: ''
    });
    setPropertyImages([]);
    setPropertyVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Building className="h-6 w-6" />
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت املاک</h1>
                <p className="text-gray-600">خوش آمدید {user?.name || 'مشاور املاک'}</p>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="properties">مدیریت املاک</TabsTrigger>
            <TabsTrigger value="upload">آپلود فایل</TabsTrigger>
            <TabsTrigger value="analytics">آمار و گزارش</TabsTrigger>
            <TabsTrigger value="clients">مشتریان</TabsTrigger>
            <TabsTrigger value="settings">تنظیمات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">کل املاک</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProperties}</div>
                  <p className="text-xs text-muted-foreground">ملک ثبت شده</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">املاک فعال</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProperties}</div>
                  <p className="text-xs text-muted-foreground">در حال نمایش</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">بازدید کل</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">بازدید این ماه</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">درآمد ماهانه</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.monthlyRevenue}</div>
                  <p className="text-xs text-muted-foreground">تومان</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Properties */}
            <Card>
              <CardHeader>
                <CardTitle>املاک اخیر</CardTitle>
                <CardDescription>آخرین املاک اضافه شده</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={property.status === 'فعال' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{property.views} بازدید</span>
                          <span className="text-sm text-gray-500">{property.likes} علاقه</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{property.price} تومان</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Management Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">مدیریت املاک</h2>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                افزودن ملک جدید
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>لیست املاک</CardTitle>
                <CardDescription>مدیریت و ویرایش املاک ثبت شده</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={property.status === 'فعال' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{property.type}</span>
                          <span className="text-sm text-gray-500">{property.rooms} خواب</span>
                          <span className="text-sm text-gray-500">{property.area} متر</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{property.price} تومان</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card dir="rtl">
              <CardHeader className="text-right">
                <CardTitle className="text-right">افزودن ملک جدید</CardTitle>
                <CardDescription className="text-right">اطلاعات کامل ملک خود را وارد کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">اطلاعات پایه</h3>
                    
                    <div>
                      <Label htmlFor="title" className="text-right block mb-2">عنوان ملک *</Label>
                      <Input
                        id="title"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                        placeholder="مثال: آپارتمان 120 متری در نیاوران"
                        className="text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="type" className="text-right block mb-2">نوع ملک *</Label>
                        <Select value={newProperty.type} onValueChange={(value) => setNewProperty({...newProperty, type: value})}>
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">آپارتمان</SelectItem>
                            <SelectItem value="villa">ویلا</SelectItem>
                            <SelectItem value="townhouse">تاون‌هاوس</SelectItem>
                            <SelectItem value="land">زمین</SelectItem>
                            <SelectItem value="commercial">تجاری</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="price" className="text-right block mb-2">قیمت (تومان) *</Label>
                        <Input
                          id="price"
                          value={newProperty.price}
                          onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                          placeholder="مثال: 5000000000"
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="area" className="text-right block mb-2">متراژ (متر مربع) *</Label>
                        <Input
                          id="area"
                          value={newProperty.area}
                          onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                          placeholder="مثال: 120"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="rooms" className="text-right block mb-2">تعداد اتاق</Label>
                        <Input
                          id="rooms"
                          value={newProperty.rooms}
                          onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})}
                          placeholder="مثال: 3"
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bathrooms" className="text-right block mb-2">تعداد سرویس</Label>
                        <Input
                          id="bathrooms"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                          placeholder="مثال: 2"
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="floor" className="text-right block mb-2">طبقه</Label>
                        <Input
                          id="floor"
                          value={newProperty.floor}
                          onChange={(e) => setNewProperty({...newProperty, floor: e.target.value})}
                          placeholder="مثال: 5"
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="buildYear" className="text-right block mb-2">سال ساخت</Label>
                        <Input
                          id="buildYear"
                          value={newProperty.buildYear}
                          onChange={(e) => setNewProperty({...newProperty, buildYear: e.target.value})}
                          placeholder="مثال: 1402"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-right block mb-2">توضیحات کامل</Label>
                      <Textarea
                        id="description"
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                        placeholder="توضیحات کامل درباره ملک، امکانات، موقعیت و..."
                        className="text-right min-h-[120px]"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">موقعیت مکانی</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-right block mb-2">شهر</Label>
                        <Input
                          id="city"
                          value={newProperty.city}
                          onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                          placeholder="مثال: تهران"
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="region" className="text-right block mb-2">منطقه/محله</Label>
                        <Input
                          id="region"
                          value={newProperty.region}
                          onChange={(e) => setNewProperty({...newProperty, region: e.target.value})}
                          placeholder="مثال: نیاوران"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-right block mb-2">آدرس کامل</Label>
                      <Textarea
                        id="address"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                        placeholder="آدرس دقیق ملک"
                        className="text-right min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">امکانات</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                        <Checkbox 
                          checked={newProperty.hasParking}
                          onCheckedChange={(checked) => setNewProperty({...newProperty, hasParking: checked as boolean})}
                        />
                        <span className="text-sm">پارکینگ</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                        <Checkbox 
                          checked={newProperty.hasElevator}
                          onCheckedChange={(checked) => setNewProperty({...newProperty, hasElevator: checked as boolean})}
                        />
                        <span className="text-sm">آسانسور</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                        <Checkbox 
                          checked={newProperty.hasStorage}
                          onCheckedChange={(checked) => setNewProperty({...newProperty, hasStorage: checked as boolean})}
                        />
                        <span className="text-sm">انباری</span>
                      </label>
                    </div>
                  </div>

                  {/* Images Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">تصاویر ملک *</h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-3">تصاویر ملک را انتخاب کنید</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button asChild type="button" variant="outline">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          انتخاب تصاویر
                        </label>
                      </Button>
                    </div>

                    {propertyImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {propertyImages.map((file, index) => (
                          <div key={index} className="relative border rounded-lg p-2">
                            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-xs truncate text-right">{file.name}</p>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 left-1 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">ویدیو (اختیاری)</h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Video className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-3">ویدیوی معرفی ملک</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button asChild type="button" variant="outline">
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          انتخاب ویدیو
                        </label>
                      </Button>
                    </div>

                    {propertyVideo && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-red-500" />
                          <span className="text-sm">{propertyVideo.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPropertyVideo(null)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Publish Button */}
                  <div className="flex justify-start gap-3 pt-4">
                    <Button type="button" onClick={handlePublishProperty} size="lg" className="w-full md:w-auto">
                      <Upload className="h-4 w-4 mr-2" />
                      انتشار ملک
                    </Button>
                    <Button type="button" variant="outline" size="lg">
                      انصراف
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>آمار و گزارش‌ها</CardTitle>
                <CardDescription>تحلیل عملکرد و آمار املاک</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">بازدیدهای این ماه</h3>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalViews}</div>
                    <p className="text-sm text-gray-600">+12% نسبت به ماه قبل</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">علاقه‌مندی‌ها</h3>
                    <div className="text-3xl font-bold text-green-600">{stats.totalLikes}</div>
                    <p className="text-sm text-gray-600">+8% نسبت به ماه قبل</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">نرخ تبدیل</h3>
                    <div className="text-3xl font-bold text-purple-600">3.2%</div>
                    <p className="text-sm text-gray-600">+0.5% نسبت به ماه قبل</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مدیریت مشتریان</CardTitle>
                <CardDescription>لیست مشتریان و ارتباطات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>سیستم مدیریت مشتریان به زودی اضافه خواهد شد</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card dir="rtl">
              <CardHeader className="text-right">
                <CardTitle className="text-right">تنظیمات پروفایل مشاور املاک</CardTitle>
                <CardDescription className="text-right">اطلاعات شخصی و حرفه‌ای خود را تکمیل کنید</CardDescription>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-right block mb-2">نام شرکت / دفتر املاک</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        placeholder="نام شرکت یا دفتر املاک"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber" className="text-right block mb-2">شماره پروانه کسب</Label>
                      <Input
                        id="licenseNumber"
                        value={profileData.licenseNumber}
                        onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                        placeholder="شماره پروانه"
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-right block mb-2">آدرس دفتر</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="آدرس کامل دفتر املاک خود را وارد کنید"
                      className="text-right min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-right block mb-2">شهر</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      placeholder="شهر محل فعالیت"
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-right block mb-2">درباره من و خدمات</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="توضیحات کوتاهی درباره خود، تخصص‌ها و خدمات خود بنویسید..."
                      className="text-right min-h-[120px]"
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
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;
