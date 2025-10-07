import type { Post, Category } from '../types/post';

let cachedPosts: Post[] | null = null;

/**
 * 모든 글 데이터 로드
 */
export async function loadPosts(): Promise<Post[]> {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const response = await fetch('/data/posts.json');
    if (!response.ok) {
      throw new Error('Failed to load posts');
    }
    cachedPosts = await response.json();
    return cachedPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

/**
 * ID로 글 찾기
 */
export async function getPostById(id: string): Promise<Post | null> {
  const posts = await loadPosts();
  return posts.find(post => post.id === id) || null;
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
 * 카테고리 목록 생성 (계층 구조)
 */
export async function getCategories(): Promise<Category[]> {
  const posts = await loadPosts();

  if (posts.length === 0) {
    return [];
  }

  // 카테고리별 그룹화
  const categoryMap = new Map<string, Set<string>>();

  posts.forEach(post => {
    if (!categoryMap.has(post.category)) {
      categoryMap.set(post.category, new Set());
    }
    if (post.subcategory) {
      categoryMap.get(post.category)!.add(post.subcategory);
    }
  });

  // Category 배열 생성
  const categories: Category[] = [];

  categoryMap.forEach((subcats, catId) => {
    const categoryPosts = posts.filter(p => p.category === catId);
    
    const subcategories = Array.from(subcats).map(subId => ({
      id: subId,
      name: formatCategoryName(subId),
      count: posts.filter(p => p.subcategory === subId).length,
    }));

    categories.push({
      id: catId,
      name: formatCategoryName(catId),
      count: categoryPosts.length,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    });
  });

  return categories;
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

/**
 * 카테고리 ID를 보기 좋은 이름으로 변환
 */
function formatCategoryName(id: string): string {
  const nameMap: Record<string, string> = {
    'react': 'React',
    'typescript': 'TypeScript',
    'nodejs': 'Node.js',
    'javascript': 'JavaScript',
    'dev': 'Development',
    'frontend': 'Frontend',
    'backend': 'Backend',
    'design': 'Design',
    'ui': 'UI/UX',
    'figma': 'Figma',
    'life': 'Life',
    'uncategorized': 'Uncategorized',
  };

  return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

