import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../_posts');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'posts.json');

// marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
});

function buildPosts() {
  console.log('📝 Building posts...');

  // _posts 폴더가 없으면 생성
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('✅ Created _posts directory');
  }

  // output 폴더가 없으면 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // _posts 폴더의 모든 .md 파일 읽기
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  if (files.length === 0) {
    console.log('⚠️  No markdown files found in _posts/');
    // 빈 배열 출력
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created empty posts.json');
    return;
  }

  // 각 파일 파싱
  const posts = files.map(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Front Matter와 본문 분리
    const { data, content } = matter(fileContent);

    // 파일명에서 slug 추출 (URL 사용)
    const slug = filename.replace('.md', '');

    // 마크다운을 HTML로 변환
    const htmlContent = marked(content);

    // excerpt가 없으면 본문에서 추출
    let excerpt = data.excerpt || '';
    if (!excerpt) {
      // HTML 태그 제거하고 처음 150자 추출
      const plainText = content.replace(/[#*`\[\]()]/g, '').trim();
      excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    }

    return {
      id: slug,
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'uncategorized',
      subcategory: data.subcategory || null,
      tags: data.tags || [],
      excerpt,
      author: data.author || 'Anonymous',
      content: htmlContent,
      rawContent: content,
    };
  });

  // 날짜순 정렬 (최신순)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // JSON 파일로 저장
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));

  console.log(`✅ Built ${posts.length} post(s)`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  
  // 카테고리 통계 출력
  const categoryCount = {};
  posts.forEach(post => {
    categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
  });
  console.log('📊 Categories:', categoryCount);
}

// 실행
try {
  buildPosts();
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

