import type { Post, Category } from '../types/post';
import { marked } from 'marked';

// marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * 브라우저 호환 Front Matter 파서
 * gray-matter 대신 순수 JavaScript로 구현
 */
function parseFrontMatter(markdown: string): { content: string; data: Record<string, any> } {
  // Front Matter가 있는지 확인
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontMatterRegex);
  
  if (!match) {
    // Front Matter가 없으면 전체를 content로 반환
    return {
      content: markdown,
      data: {}
    };
  }
  
  const frontMatterText = match[1];
  const content = match[2];
  
  // Front Matter 파싱 (YAML 형식)
  const data: Record<string, any> = {};
  const lines = frontMatterText.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmedLine.substring(0, colonIndex).trim();
    let valueStr = trimmedLine.substring(colonIndex + 1).trim();
    let value: any = valueStr;
    
    // 따옴표 제거
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || 
        (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      value = valueStr.slice(1, -1);
    }
    // 배열 처리 [item1, item2, ...]
    else if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      const arrayContent = valueStr.slice(1, -1);
      value = arrayContent
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(item => item.length > 0);
    }
    
    data[key] = value;
  }
  
  return { content, data };
}

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
  console.log(`[loadMarkdownPost] Loading: ${filename}`);
  
  try {
    const url = `/_posts/${filename}`;
    console.log(`[loadMarkdownPost] Fetching: ${url}`);
    
    const response = await fetch(url);
    console.log(`[loadMarkdownPost] Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load ${filename}`);
    }
    
    const markdownText = await response.text();
    console.log(`[loadMarkdownPost] Loaded ${markdownText.length} characters`);
    
    // Front Matter 제거 (브라우저 호환 파서 사용)
    const { content } = parseFrontMatter(markdownText);
    console.log(`[loadMarkdownPost] After parseFrontMatter: ${content.length} characters`);
    
    // 마크다운을 HTML로 변환
    const htmlContent = await marked(content);
    console.log(`[loadMarkdownPost] After marked: ${typeof htmlContent}, length: ${typeof htmlContent === 'string' ? htmlContent.length : 'N/A'}`);
    
    const result = {
      content: typeof htmlContent === 'string' ? htmlContent : '',
      rawContent: content,
    };
    
    console.log(`[loadMarkdownPost] Success! Content length: ${result.content.length}`);
    return result;
  } catch (error) {
    console.error(`[loadMarkdownPost] ERROR loading ${filename}:`, error);
    if (error instanceof Error) {
      console.error(`[loadMarkdownPost] Error message: ${error.message}`);
      console.error(`[loadMarkdownPost] Error stack:`, error.stack);
    }
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
  console.log(`[getPostById] Loading post: ${id}`);
  
  try {
    const postsMeta = await loadPostsMeta();
    console.log(`[getPostById] Loaded ${postsMeta.length} posts metadata`);
    
    const meta = postsMeta.find(post => post.id === id);
    console.log(`[getPostById] Found meta:`, meta);
    
    if (!meta) {
      console.warn(`[getPostById] Post not found: ${id}`);
      return null;
    }
    
    console.log(`[getPostById] Loading markdown: ${meta.filename}`);
    // 마크다운 파일 로드
    const { content, rawContent } = await loadMarkdownPost(meta.filename);
    console.log(`[getPostById] Markdown loaded. Content: ${content.length} chars, Raw: ${rawContent.length} chars`);
    
    const result = {
      ...meta,
      content,
      rawContent,
    };
    
    console.log(`[getPostById] Success! Returning post with content length: ${result.content.length}`);
    return result;
  } catch (error) {
    console.error(`[getPostById] ERROR loading post ${id}:`, error);
    if (error instanceof Error) {
      console.error(`[getPostById] Error details:`, error.message, error.stack);
    }
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


