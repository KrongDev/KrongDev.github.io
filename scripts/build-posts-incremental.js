import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../_posts');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const POSTS_META_FILE = path.join(OUTPUT_DIR, 'posts-meta.json');
const CATEGORIES_FILE = path.join(OUTPUT_DIR, 'categories.json');

// 카테고리 설정
const CATEGORY_CONFIG = [
  { id: 'CS', name: 'Computer Science', icon: '💻', description: '컴퓨터 과학 기초' },
  { id: 'Language', name: 'Programming Language', icon: '📝', description: '프로그래밍 언어' },
  { id: 'Framework', name: 'Framework', icon: '🚀', description: '프레임워크 & 라이브러리' },
  { id: 'Database', name: 'Database', icon: '🗄️', description: '데이터베이스' },
  { id: 'Platform', name: 'Platform', icon: '☁️', description: '플랫폼 & 인프라' },
  { id: 'Life', name: 'Life', icon: '🌱', description: '개발 일상' },
];

/**
 * Git diff를 사용하여 변경된 파일 감지
 */
function getChangedFiles() {
  try {
    // HEAD와 이전 커밋 비교 (CI 환경)
    let diffCommand = 'git diff --name-status HEAD~1 HEAD -- _posts/';
    
    // 로컬 개발 환경에서는 staged 파일 확인
    if (!process.env.CI) {
      // staged와 unstaged 파일 모두 확인
      const stagedFiles = execSync('git diff --cached --name-status -- _posts/', { encoding: 'utf-8' }).trim();
      const unstagedFiles = execSync('git diff --name-status -- _posts/', { encoding: 'utf-8' }).trim();
      
      if (!stagedFiles && !unstagedFiles) {
        console.log('⚠️  No changes detected in _posts/. Running full build...');
        return null;
      }
      
      const allChanges = [stagedFiles, unstagedFiles].filter(Boolean).join('\n');
      return parseGitDiff(allChanges);
    }
    
    const diff = execSync(diffCommand, { encoding: 'utf-8' }).trim();
    
    if (!diff) {
      console.log('⚠️  No changes detected in _posts/. Running full build...');
      return null;
    }
    
    return parseGitDiff(diff);
  } catch (error) {
    console.log('⚠️  Git diff failed. Running full build...');
    console.log('   Error:', error.message);
    return null;
  }
}

/**
 * Git diff 결과 파싱
 */
function parseGitDiff(diff) {
  const lines = diff.split('\n').filter(Boolean);
  const changes = {
    added: [],
    modified: [],
    deleted: [],
  };
  
  lines.forEach(line => {
    const [status, filePath] = line.split('\t');
    const filename = path.basename(filePath);
    
    if (!filename.endsWith('.md')) return;
    
    if (status === 'A') {
      changes.added.push(filename);
    } else if (status === 'M') {
      changes.modified.push(filename);
    } else if (status === 'D') {
      changes.deleted.push(filename);
    }
  });
  
  return changes;
}

/**
 * 단일 파일에서 메타데이터 추출
 */
function extractMetadata(filename) {
  const filePath = path.join(POSTS_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const slug = filename.replace('.md', '');
  
  let excerpt = data.excerpt || '';
  if (!excerpt) {
    const plainText = content
      .replace(/^---[\s\S]*?---/, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*?/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }
  
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
}

/**
 * 증분 빌드 실행
 */
function incrementalBuild() {
  console.log('🔄 Starting incremental build...');
  
  // output 폴더 확인
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 변경된 파일 감지
  const changes = getChangedFiles();
  
  // 변경사항이 없거나 감지 실패 시 전체 빌드
  if (!changes) {
    return fullBuild();
  }
  
  const totalChanges = changes.added.length + changes.modified.length + changes.deleted.length;
  
  if (totalChanges === 0) {
    console.log('✅ No changes detected. Skipping build.');
    return;
  }
  
  console.log(`\n📊 Detected changes:`);
  console.log(`   ✨ Added: ${changes.added.length}`);
  console.log(`   📝 Modified: ${changes.modified.length}`);
  console.log(`   🗑️  Deleted: ${changes.deleted.length}`);
  console.log('');
  
  // 기존 메타데이터 로드
  let existingMeta = [];
  if (fs.existsSync(POSTS_META_FILE)) {
    existingMeta = JSON.parse(fs.readFileSync(POSTS_META_FILE, 'utf8'));
  }
  
  // Map으로 변환 (빠른 조회)
  const metaMap = new Map(existingMeta.map(post => [post.filename, post]));
  
  // 삭제된 파일 제거
  changes.deleted.forEach(filename => {
    console.log(`   🗑️  Removing: ${filename}`);
    metaMap.delete(filename);
  });
  
  // 추가/수정된 파일 처리
  [...changes.added, ...changes.modified].forEach(filename => {
    try {
      const metadata = extractMetadata(filename);
      const action = changes.added.includes(filename) ? '✨ Adding' : '📝 Updating';
      console.log(`   ${action}: ${filename}`);
      metaMap.set(filename, metadata);
    } catch (error) {
      console.error(`   ❌ Error processing ${filename}:`, error.message);
    }
  });
  
  // 배열로 변환 및 정렬
  const postsMeta = Array.from(metaMap.values())
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 메타데이터 저장
  fs.writeFileSync(POSTS_META_FILE, JSON.stringify(postsMeta, null, 2));
  
  console.log(`\n✅ Updated posts-meta.json (${postsMeta.length} posts)`);
  
  // 카테고리 재생성
  buildCategories(postsMeta);
  
  console.log('\n🎉 Incremental build complete!');
}

/**
 * 전체 빌드 (fallback)
 */
function fullBuild() {
  console.log('🔄 Running full build...');
  
  // output 폴더 확인
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 모든 .md 파일 읽기
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('⚠️  No markdown files found in _posts/');
    fs.writeFileSync(POSTS_META_FILE, JSON.stringify([], null, 2));
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([], null, 2));
    return;
  }
  
  // 메타데이터 추출
  const postsMeta = files.map(filename => {
    try {
      return extractMetadata(filename);
    } catch (error) {
      console.error(`   ❌ Error processing ${filename}:`, error.message);
      return null;
    }
  }).filter(Boolean);
  
  // 날짜순 정렬
  postsMeta.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 메타데이터 저장
  fs.writeFileSync(POSTS_META_FILE, JSON.stringify(postsMeta, null, 2));
  
  console.log(`✅ Built ${postsMeta.length} post(s)`);
  console.log(`📁 Posts metadata: ${POSTS_META_FILE}`);
  console.log(`📁 Markdown files: ${POSTS_DIR}`);
  
  // 카테고리 생성
  buildCategories(postsMeta);
}

/**
 * 카테고리 정보 생성
 */
function buildCategories(postsMeta) {
  console.log('\n📊 Building categories...');
  
  // 카테고리별 통계 수집
  const categoryStats = new Map();
  const subcategoryStats = new Map();
  
  postsMeta.forEach(post => {
    const catCount = categoryStats.get(post.category) || 0;
    categoryStats.set(post.category, catCount + 1);
    
    if (post.subcategory) {
      const key = `${post.category}:${post.subcategory}`;
      const subCount = subcategoryStats.get(key) || 0;
      subcategoryStats.set(key, subCount + 1);
    }
  });
  
  // 카테고리 데이터 구성
  const categories = CATEGORY_CONFIG.map(config => {
    const count = categoryStats.get(config.id) || 0;
    
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
    
    subcategories.sort((a, b) => a.name.localeCompare(b.name));
    
    return {
      ...config,
      count,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    };
  });
  
  // 카테고리 JSON 저장
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  
  console.log(`✅ Built categories`);
  console.log(`📁 Categories: ${CATEGORIES_FILE}`);
  
  // 통계 출력
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
 * 카테고리 이름 포맷팅
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
  // 환경 변수로 모드 선택 가능
  if (process.env.FORCE_FULL_BUILD === 'true') {
    fullBuild();
  } else {
    incrementalBuild();
  }
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

