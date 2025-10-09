import type { Post, Category } from '../types/post';
import matter from 'gray-matter';
import { marked } from 'marked';

// marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface PostMeta {
  id: string;
  slug: string;
  filename: string;
  title: string;
  date: string;
  category: string;
  subcategory?: string | null;
  tags: string[];
  excerpt: string;
  author: string;
}

let cachedPosts: Post[] | null = null;
let cachedPostsMeta: PostMeta[] | null = null;

/**
 * 포스트 메타데이터 로드
 */
async function loadPostsMeta(): Promise<PostMeta[]> {
  if (cachedPostsMeta) {
    return cachedPostsMeta;
  }

  try {
    const response = await fetch('/data/posts-meta.json');
    if (!response.ok) {
      throw new Error('Failed to load posts metadata');
    }
    cachedPostsMeta = await response.json();
    return cachedPostsMeta as PostMeta[];
  } catch (error) {
    console.error('Error loading posts metadata:', error);
    return [];
  }
}

/**
 * 마크다운 파일 로드 및 파싱
 */
async function loadMarkdownPost(filename: string): Promise<{ content: string; rawContent: string }> {
  try {
    const response = await fetch(`/_posts/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${filename}`);
    }
    const markdownText = await response.text();
    
    // Front Matter 제거
    const { content } = matter(markdownText);
    
    // 마크다운을 HTML로 변환
    const htmlContent = await marked(content);
    
    return {
      content: typeof htmlContent === 'string' ? htmlContent : '',
      rawContent: content,
    };
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    return {
      content: '',
      rawContent: '',
    };
  }
}

/**
 * 모든 글 데이터 로드 (메타데이터만, 가벼움)
 */
export async function loadPosts(): Promise<Post[]> {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const postsMeta = await loadPostsMeta();
    
    // 메타데이터를 Post 형식으로 변환 (content는 비어있음)
    cachedPosts = postsMeta.map(meta => ({
      ...meta,
      content: '', // 목록에서는 content 불필요
      rawContent: '', // 목록에서는 rawContent 불필요
    }));
    
    return cachedPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

/**
 * ID로 글 찾기 (전체 내용 포함)
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const postsMeta = await loadPostsMeta();
    const meta = postsMeta.find(post => post.id === id);
    
    if (!meta) {
      return null;
    }
    
    // 마크다운 파일 로드
    const { content, rawContent } = await loadMarkdownPost(meta.filename);
    
    return {
      ...meta,
      content,
      rawContent,
    };
  } catch (error) {
    console.error(`Error loading post ${id}:`, error);
    return null;
  }
}

/**
 * 카테고리별 글 필터링
 */
export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  const posts = await loadPosts();
  return posts.filter(post => 
    post.category === categoryId || post.subcategory === categoryId
  );
}

/**
 * 태그로 글 필터링
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await loadPosts();
  return posts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * 검색 (제목, 본문, 태그)
 */
export async function searchPosts(query: string): Promise<Post[]> {
  if (!query.trim()) {
    return loadPosts();
  }

  const posts = await loadPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.rawContent.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 카테고리 목록 로드 (categories.json 사용)
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/data/categories.json');
    if (!response.ok) {
      throw new Error('Failed to load categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

/**
 * 모든 태그 목록 (사용 빈도순)
 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await loadPosts();
  const tagCount = new Map<string, number>();

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}


