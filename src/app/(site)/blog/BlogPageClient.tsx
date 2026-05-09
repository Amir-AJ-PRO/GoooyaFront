'use client';

import { useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, BookOpen, Calendar, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogListParams } from '@/types/blog';

export default function BlogPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const searchParams: BlogListParams = {
    page,
    page_size: pageSize,
    ...(categoryFilter && categoryFilter !== 'all' && { category: categoryFilter }),
    ...(authorFilter && { author: authorFilter }),
  };

  const { data: blogData, isLoading, error } = useBlogPosts(searchParams);

  const filteredPosts = blogData?.results.filter(post =>
    !searchTerm ||
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری مقالات</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">مقالات</h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال بارگذاری...
                </span>
              ) : blogData ? (
                <span>{blogData.count} مقاله موجود</span>
              ) : (
                <span>مطالعه آخرین مقالات و راهنماهای املاک</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="bg-white rounded-xl shadow-md border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* جستجو */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در مقالات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* دسته‌بندی */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه دسته‌ها</SelectItem>
              <SelectItem value="real-estate">املاک</SelectItem>
              <SelectItem value="market">بازار</SelectItem>
            </SelectContent>
          </Select>

          {/* نویسنده */}
          <Input
            placeholder="نام نویسنده..."
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />

          {/* تعداد در صفحه */}
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="تعداد در صفحه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 مقاله</SelectItem>
              <SelectItem value="24">24 مقاله</SelectItem>
              <SelectItem value="36">36 مقاله</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* لیست مقالات */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">مقاله‌ای یافت نشد</h2>
          <p className="text-muted-foreground">
            {blogData?.results.length === 0
              ? 'هنوز مقاله‌ای منتشر نشده است'
              : 'با فیلترهای انتخاب شده مقاله‌ای یافت نشد'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Grid مقالات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPosts.map((post, index) => (
              <div key={index}>
                <Link href={`/blog/${post.slug}`}>


                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">

                    <div className="relative h-48">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">
                          {post.category.name}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                     
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.pub_date).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.blogtags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comment_count}</span>
                        </div>
                      </div>


                      <Button variant="outline" size="sm" className="w-full mt-3">
                        مطالعه مقاله
                      </Button>

                    </CardContent>

                  </Card>
                </Link>
              </div>

            ))}
          </div>

          {/* Pagination */}
          {blogData && blogData.total_pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                قبلی
              </Button>

              <span className="flex items-center px-4 py-2 text-sm">
                صفحه {page} از {blogData.total_pages}
              </span>

              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page >= blogData.total_pages}
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
