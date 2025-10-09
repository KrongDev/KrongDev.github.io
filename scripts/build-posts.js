import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../_posts');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_POSTS_DIR = path.join(__dirname, '../public/_posts');
const POSTS_META_FILE = path.join(OUTPUT_DIR, 'posts-meta.json');
const CATEGORIES_FILE = path.join(OUTPUT_DIR, 'categories.json');

// 카테고리 설정 (순서와 이름 정의)
const CATEGORY_CONFIG = [
  { id: 'CS', name: 'Computer Science', icon: '💻', description: '컴퓨터 과학 기초' },
  { id: 'Language', name: 'Programming Language', icon: '📝', description: '프로그래밍 언어' },
  { id: 'Framework', name: 'Framework', icon: '🚀', description: '프레임워크 & 라이브러리' },
  { id: 'Database', name: 'Database', icon: '🗄️', description: '데이터베이스' },
  { id: 'Platform', name: 'Platform', icon: '☁️', description: '플랫폼 & 인프라' },
  { id: 'Life', name: 'Life', icon: '🌱', description: '개발 일상' },
];

function buildPosts() {
  console.log('📝 Building posts...');

  // _posts 폴더가 없으면 생성
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('✅ Created _posts directory');
  }

  // output 폴더들 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTPUT_POSTS_DIR)) {
    fs.mkdirSync(OUTPUT_POSTS_DIR, { recursive: true });
  }

  // _posts 폴더의 모든 .md 파일 읽기
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  if (files.length === 0) {
    console.log('⚠️  No markdown files found in _posts/');
    // 빈 데이터 출력
    fs.writeFileSync(POSTS_META_FILE, JSON.stringify([], null, 2));
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created empty meta files');
    return;
  }

  // 각 파일 파싱하여 메타데이터 추출
  const postsMeta = files.map(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Front Matter와 본문 분리
    const { data, content } = matter(fileContent);

    // 파일명에서 slug 추출
    const slug = filename.replace('.md', '');

    // 마크다운 파일을 public/_posts/로 복사
    const outputFilePath = path.join(OUTPUT_POSTS_DIR, filename);
    fs.copyFileSync(filePath, outputFilePath);

    // excerpt가 없으면 본문에서 추출
    let excerpt = data.excerpt || '';
    if (!excerpt) {
      // 마크다운 문법 제거하고 처음 200자 추출
      const plainText = content
        .replace(/^---[\s\S]*?---/, '') // frontmatter 제거
        .replace(/#{1,6}\s/g, '') // 제목
        .replace(/\*\*?/g, '') // bold, italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // 코드
        .replace(/\n+/g, ' ') // 개행
        .trim();
      excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }

    // 메타데이터만 반환 (본문 제외)
    return {
      id: slug,
      slug,
      filename,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'uncategorized',
      subcategory: data.subcategory || null,
      tags: data.tags || [],
      excerpt,
      author: data.author || 'Anonymous',
    };
  });

  // 날짜순 정렬 (최신순)
  postsMeta.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 메타데이터 JSON 저장
  fs.writeFileSync(POSTS_META_FILE, JSON.stringify(postsMeta, null, 2));

  console.log(`✅ Built ${postsMeta.length} post(s)`);
  console.log(`📁 Posts metadata: ${POSTS_META_FILE}`);
  console.log(`📁 Markdown files copied to: ${OUTPUT_POSTS_DIR}`);

  // 카테고리 정보 생성
  buildCategories(postsMeta);
}

function buildCategories(postsMeta) {
  console.log('\n📊 Building categories...');

  // 카테고리별 통계 수집
  const categoryStats = new Map();
  const subcategoryStats = new Map();

  postsMeta.forEach(post => {
    // 메인 카테고리
    const catCount = categoryStats.get(post.category) || 0;
    categoryStats.set(post.category, catCount + 1);

    // 서브 카테고리
    if (post.subcategory) {
      const key = `${post.category}:${post.subcategory}`;
      const subCount = subcategoryStats.get(key) || 0;
      subcategoryStats.set(key, subCount + 1);
    }
  });

  // 카테고리 데이터 구성
  const categories = CATEGORY_CONFIG.map(config => {
    const count = categoryStats.get(config.id) || 0;
    
    // 해당 카테고리의 서브카테고리들 수집
    const subcategories = [];
    subcategoryStats.forEach((count, key) => {
      const [catId, subId] = key.split(':');
      if (catId === config.id) {
        subcategories.push({
          id: subId,
          name: formatCategoryName(subId),
          count,
        });
      }
    });

    // 서브카테고리를 이름순 정렬
    subcategories.sort((a, b) => a.name.localeCompare(b.name));

    return {
      ...config,
      count,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    };
  });

  // 포스트가 없는 카테고리는 표시만 (count: 0)
  const categoriesWithPosts = categories.filter(cat => cat.count > 0 || true);

  // 카테고리 JSON 저장
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categoriesWithPosts, null, 2));

  console.log(`✅ Built categories`);
  console.log(`📁 Categories: ${CATEGORIES_FILE}`);
  
  // 카테고리 통계 출력
  categories.forEach(cat => {
    if (cat.count > 0) {
      console.log(`   ${cat.icon} ${cat.name}: ${cat.count} posts`);
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          console.log(`      └─ ${sub.name}: ${sub.count} posts`);
        });
      }
    }
  });
}

/**
 * 카테고리 ID를 보기 좋은 이름으로 변환
 */
function formatCategoryName(id) {
  const nameMap = {
    'Java': 'Java',
    'Python': 'Python',
    'JavaScript': 'JavaScript',
    'TypeScript': 'TypeScript',
    'Go': 'Go',
    'Rust': 'Rust',
    'React': 'React',
    'Vue': 'Vue',
    'Angular': 'Angular',
    'Spring': 'Spring',
    'Django': 'Django',
    'Express': 'Express',
    'MySQL': 'MySQL',
    'PostgreSQL': 'PostgreSQL',
    'MongoDB': 'MongoDB',
    'Redis': 'Redis',
    'Docker': 'Docker',
    'Kubernetes': 'Kubernetes',
    'AWS': 'AWS',
    'GCP': 'GCP',
    'Azure': 'Azure',
  };

  return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

// 실행
try {
  buildPosts();
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

