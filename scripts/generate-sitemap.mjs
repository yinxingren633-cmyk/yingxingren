import fs from 'node:fs';
import path from 'node:path';

const HOST = 'https://yinxingren.homes';
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function getHtmlPages(dir, baseDir = dir) {
  let pages = [];
  if (!fs.existsSync(dir)) return pages;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      pages = pages.concat(getHtmlPages(fullPath, baseDir));
    } else if (item === 'index.html' || item.endsWith('.html')) {
      let relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      if (relPath === 'index.html') {
        relPath = '';
      } else if (relPath.endsWith('/index.html')) {
        relPath = relPath.substring(0, relPath.length - 10);
      } else if (relPath.endsWith('.html')) {
        relPath = relPath.substring(0, relPath.length - 5);
      }

      // 过滤掉非公开内容及 404 页面
      if (relPath !== '404' && !relPath.startsWith('api/')) {
        pages.push(relPath);
      }
    }
  }
  return [...new Set(pages)];
}

function generateSitemap() {
  console.log('[Sitemap] 🗺️ 正在为 yinxingren.homes 自动构建高质量全量站点地图...');
  const relPages = getHtmlPages(DIST_DIR);
  const now = new Date().toISOString().split('T')[0];

  const urlElements = relPages
    .map((page) => {
      const url = `${HOST}/${page}${page ? '/' : ''}`;
      let priority = '0.7';
      if (page === '') priority = '1.0';
      else if (page.startsWith('blog')) priority = '0.9';
      else if (page.startsWith('tags')) priority = '0.8';
      else if (page.startsWith('faq')) priority = '0.8';

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemap0Content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${HOST}/sitemap-0.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${HOST}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  // 写入 dist/ 目录供生产部署
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), sitemap0Content, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), sitemapIndexContent, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap0Content, 'utf8');

  // 同时同步写入 public/ 方便开发预览
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-0.xml'), sitemap0Content, 'utf8');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapIndexContent, 'utf8');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap0Content, 'utf8');
  }

  console.log(`[Sitemap] ✅ 成功生成 sitemap-index.xml, sitemap-0.xml 和 sitemap.xml，覆盖 ${relPages.length} 个页面 URL！`);
}

generateSitemap();
