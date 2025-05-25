export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface Author {
  name: string;
  postCount: number;
} 