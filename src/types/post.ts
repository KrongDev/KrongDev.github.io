export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  subcategory?: string | null;
  tags: string[];
  excerpt: string;
  author: string;
  content: string;      // HTML
  rawContent: string;   // 원본 마크다운 (검색용)
}

export interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: Category[];
}

