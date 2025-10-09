import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://krongdev.github.io';

function generateSitemap() {
  console.log('🗺️  Building sitemap...');

  // 포스트 메타데이터 읽기
  const postsPath = path.join(__dirname, '../public/data/posts-meta.json');
  let posts = [];
  
  if (fs.existsSync(postsPath)) {
    const postsData = fs.readFileSync(postsPath, 'utf-8');
    posts = JSON.parse(postsData);
  } else {
    console.warn('⚠️  posts-meta.json not found. Run "npm run build:posts" first.');
  }

  // 현재 날짜 (ISO 8601 format)
  const now = new Date().toISOString();

  // URL 목록 생성
  const urls = [
    {
      loc: `${SITE_URL}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${SITE_URL}/#/portfolio`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.8',
    },
  ];

  // 각 블로그 포스트 추가
  posts.forEach(post => {
    urls.push({
      loc: `${SITE_URL}/#/post/${post.slug}`,
      lastmod: post.date || now,
      changefreq: 'monthly',
      priority: '0.7',
    });
  });

  // 카테고리별 URL 추가
  const categories = new Set();
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
    if (post.subcategory) {
      categories.add(post.subcategory);
    }
  });

  categories.forEach(category => {
    urls.push({
      loc: `${SITE_URL}/?category=${encodeURIComponent(category)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.6',
    });
  });

  // XML 생성
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // public 폴더에 sitemap.xml 저장
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✅ Built sitemap with ${urls.length} URL(s)`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 URLs:`);
  console.log(`   - Home: 1`);
  console.log(`   - Portfolio: 1`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Categories: ${categories.size}`);
}

generateSitemap();

