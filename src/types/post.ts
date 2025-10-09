export interface Post {
  id: string;
  slug: string;
  filename: string;     // 마크다운 파일명
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
  icon?: string;        // 아이콘 (이모지)
  description?: string; // 설명
  count: number;
  subcategories?: Category[];
}

