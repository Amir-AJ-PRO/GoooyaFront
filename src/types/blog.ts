/**
 * انواع و interfaces مربوط به بلاگ
 */

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
}

export interface BlogComment {
  id: number;
  name: string;
  email: string;
  body: string;
  is_pub: boolean;
  created: string;
  is_answered: boolean;
  replycomment: BlogReply[];
}

export interface BlogReply {
  id: number;
  body: string;
  created: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: BlogCategory;
  author: string;
  thumbnail: string;
  pub_date: string;
  updated?: string;
  description: string;
  status: boolean;
  blogtags: BlogTag[];
  comment_count: number;
  body?: string; // فقط در جزئیات
  comment?: BlogComment[]; // فقط در جزئیات
}

export interface BlogListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: BlogPost[];
}

export interface BlogListParams {
  page?: number;
  page_size?: number;
  category?: string;
  author?: string;
}

export interface CreateCommentPayload {
  name: string;
  email: string;
  body: string;
}

export interface CreateCommentResponse {
  detail: string;
  comment: BlogComment;
}
