'use client';

import { useState } from 'react';
import { useBlogPost, useBlogComments, useCreateComment } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Calendar, User, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CreateCommentPayload } from '@/types/blog';

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [commentForm, setCommentForm] = useState<CreateCommentPayload>({
    name: '',
    email: '',
    body: ''
  });

  const { data: post, isLoading: postLoading, error: postError } = useBlogPost(slug);
  const { data: commentsData, isLoading: commentsLoading } = useBlogComments(slug);
  const createCommentMutation = useCreateComment();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.name || !commentForm.email || !commentForm.body) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        slug,
        comment: commentForm
      });
      
      toast({
        title: "موفق",
        description: "نظر شما ثبت شد و پس از تایید نمایش داده خواهد شد"
      });
      
      setCommentForm({ name: '', email: '', body: '' });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ثبت نظر",
        variant: "destructive"
      });
    }
  };

  if (postLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">مقاله یافت نشد</h2>
        <p className="text-muted-foreground mb-4">مقاله مورد نظر وجود ندارد یا حذف شده است</p>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            بازگشت به مقالات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary">مقالات</Link>
        <span>/</span>
        <span>{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* محتوای اصلی */}
        <div className="lg:col-span-3">
          {/* هدر مقاله */}
          <div className="mb-8">
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category.name}</Badge>
              {post.blogtags.map((tag) => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.pub_date).toLocaleDateString('fa-IR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comment_count} نظر</span>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground">{post.description}</p>
          </div>

          {/* محتوای مقاله */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.body || '' }}
          />

          <Separator className="my-8" />

          {/* فرم نظر */}
          <Card>
            <CardHeader>
              <CardTitle>ثبت نظر</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نام</label>
                    <Input
                      value={commentForm.name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="نام شما"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ایمیل</label>
                    <Input
                      type="email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ایمیل شما"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">نظر</label>
                  <Textarea
                    value={commentForm.body}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="نظر خود را بنویسید..."
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={createCommentMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {createCommentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  ثبت نظر
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* نظرات */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">نظرات ({commentsData?.count || 0})</h3>
            
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : commentsData?.results.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                هنوز نظری ثبت نشده است. اولین نفر باشید!
              </p>
            ) : (
              <div className="space-y-6">
                {commentsData?.results.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{comment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(comment.created).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                        {comment.is_answered && (
                          <Badge variant="secondary">پاسخ داده شده</Badge>
                        )}
                      </div>
                      
                      <p className="mb-4">{comment.body}</p>
                      
                      {comment.replycomment.length > 0 && (
                        <div className="border-r-4 border-primary/20 pr-4 space-y-3">
                          {comment.replycomment.map((reply) => (
                            <div key={reply.id} className="bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default" className="text-xs">پاسخ ادمین</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.created).toLocaleDateString('fa-IR')}
                                </span>
                              </div>
                              <p className="text-sm">{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* اطلاعات مقاله */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">اطلاعات مقاله</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">دسته‌بندی:</span>
                  <p className="text-sm text-muted-foreground">{post.category.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">نویسنده:</span>
                  <p className="text-sm text-muted-foreground">{post.author}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">تاریخ انتشار:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.pub_date).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                {post.updated && (
                  <div>
                    <span className="text-sm font-medium">آخرین بروزرسانی:</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.updated).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* تگ‌ها */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">برچسب‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.blogtags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* بازگشت */}
            <Link href="/blog">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                بازگشت به مقالات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
