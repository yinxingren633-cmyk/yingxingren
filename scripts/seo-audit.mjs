import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const REPORT_PATH = path.join(PUBLIC_DIR, 'seo-keywords-report.json');
const SITEMAP_PATH = path.resolve(process.cwd(), 'dist/sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt');

function parseFrontmatterAndHeadings(content) {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  const metadata = {};

  if (frontmatterMatch) {
    const rawYaml = frontmatterMatch[1];
    const lines = rawYaml.split('\n');

    let currentArrayKey = null;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- ') && currentArrayKey) {
        const val = trimmed.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '');
        metadata[currentArrayKey].push(val);
        continue;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let val = line.slice(colonIndex + 1).trim();

        if (val === '' || val === '[]') {
          metadata[key] = [];
          currentArrayKey = key;
        } else if (val.startsWith('[') && val.endsWith(']')) {
          const items = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
          metadata[key] = items.filter(Boolean);
          currentArrayKey = null;
        } else {
          val = val.replace(/^['"]|['"]$/g, '');
          metadata[key] = val;
          currentArrayKey = null;
        }
      }
    }
  }

  // Extract Headings H1, H2, H3 from body content
  const bodyContent = frontmatterMatch ? content.slice(frontmatterMatch[0].length) : content;
  const headings = [];
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(bodyContent)) !== null) {
    headings.push({
      level: `H${match[1].length}`,
      text: match[2].trim(),
    });
  }

  return { metadata, headings };
}

function inferSearchIntent(title, tags, keywords) {
  const text = `${title} ${tags.join(' ')} ${keywords.join(' ')}`.toLowerCase();
  if (text.includes('教程') || text.includes('配置') || text.includes('指南') || text.includes('注册') || text.includes('设置')) {
    return 'Informational / How-To (技术操作教程)';
  }
  if (text.includes('测评') || text.includes('对比') || text.includes('选型') || text.includes('实测')) {
    return 'Commercial Investigation (方案选型评估)';
  }
  if (text.includes('下载') || text.includes('客户端') || text.includes('订阅')) {
    return 'Transactional / Navigational (工具资源获取)';
  }
  return 'Informational (长尾技术解答)';
}

async function runSeoAudit() {
  console.log('\n🔍 ========================================================');
  console.log('   🚀 隐形人网络技术博客 (yinxingren.homes) SEO 关键词审计报告');
  console.log('========================================================\n');

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ 未找到博客内容目录: ${BLOG_DIR}`);
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  const auditResults = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const slug = file.replace(/\.(md|mdx)$/, '');

    const { metadata, headings } = parseFrontmatterAndHeadings(rawContent);

    const title = metadata.title || slug;
    const rawTags = Array.isArray(metadata.tags) ? metadata.tags : [];
    let rawKeywords = [];
    if (Array.isArray(metadata.keywords)) {
      rawKeywords = metadata.keywords;
    } else if (typeof metadata.keywords === 'string') {
      rawKeywords = metadata.keywords.split(',').map((k) => k.trim());
    }

    const allKeywords = [...new Set([...rawKeywords, ...rawTags])];
    const searchIntent = inferSearchIntent(title, rawTags, rawKeywords);

    auditResults.push({
      slug,
      url: `/blog/${slug}/`,
      title,
      description: metadata.description || '',
      pubDate: metadata.pubDate || '',
      author: metadata.author || '',
      tags: rawTags,
      targetKeywords: rawKeywords,
      combinedKeywords: allKeywords,
      searchIntent,
      headingsSummary: {
        totalHeadings: headings.length,
        h1Count: headings.filter((h) => h.level === 'H1').length,
        h2Count: headings.filter((h) => h.level === 'H2').length,
        h3Count: headings.filter((h) => h.level === 'H3').length,
      },
      headings,
    });
  }

  // Save to public/seo-keywords-report.json
  const reportPayload = {
    auditTime: new Date().toISOString(),
    siteHost: 'https://yinxingren.homes',
    totalArticles: auditResults.length,
    articles: auditResults,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reportPayload, null, 2), 'utf-8');
  console.log(`✅ 已成功输出全量 JSON 报告至: ${REPORT_PATH}\n`);

  // Print Clean Markdown Table in Console
  console.log('| Article Slug | Page Title | Primary Target Keywords | Inferred Search Intent |');
  console.log('| :--- | :--- | :--- | :--- |');

  for (const item of auditResults) {
    const kwDisplay = item.combinedKeywords.slice(0, 4).join(', ') + (item.combinedKeywords.length > 4 ? '...' : '');
    console.log(`| \`${item.slug}\` | ${item.title} | ${kwDisplay} | ${item.searchIntent} |`);
  }

  // Verify Sitemap and Robots.txt
  console.log('\n--------------------------------------------------------');
  console.log('📡 正在验证搜索引擎爬虫 (Bing/Google/IndexNow) 收录配置...');
  console.log('--------------------------------------------------------');

  // Verify robots.txt
  if (fs.existsSync(ROBOTS_PATH)) {
    const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
    const hasSitemapDirective = robotsContent.includes('Sitemap: https://yinxingren.homes/sitemap-index.xml') || robotsContent.includes('Sitemap: https://yinxingren.homes/sitemap.xml');
    const allowsBing = robotsContent.includes('User-agent: *') || robotsContent.includes('bingbot');
    console.log(`[robots.txt] ✅ 文件存在，Sitemap 声明: ${hasSitemapDirective ? '正确配置' : '需优化'}，允许爬取规则: ${allowsBing ? '允许' : '需检查'}`);
  } else {
    console.log('[robots.txt] ⚠️ 未在 public/ 目录下发现 robots.txt');
  }

  // Verify Sitemap
  if (fs.existsSync(SITEMAP_PATH)) {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    let coveredCount = 0;
    for (const item of auditResults) {
      if (sitemapContent.includes(item.url) || sitemapContent.includes(`/blog/${item.slug}`)) {
        coveredCount++;
      }
    }
    console.log(`[sitemap.xml] ✅ 站点地图覆盖率: ${coveredCount}/${auditResults.length} 篇博文已精准收录`);
  } else {
    console.log('[sitemap.xml] ℹ️ 当前处于开发阶段，运行 npm run build 后将自动生成 dist/sitemap.xml');
  }

  // Verify IndexNow Key File
  const indexNowKey = 'b8cefbf031ce42089560d53d606e71ee';
  const indexNowFile = path.join(PUBLIC_DIR, `${indexNowKey}.txt`);
  if (fs.existsSync(indexNowFile)) {
    const keyContent = fs.readFileSync(indexNowFile, 'utf-8').trim();
    console.log(`[IndexNow] ✅ 验证密钥静态文件存在且匹配: public/${indexNowKey}.txt (${keyContent === indexNowKey ? '有效' : '不一致'})`);
  } else {
    console.log(`[IndexNow] ⚠️ 密钥文件缺失: public/${indexNowKey}.txt`);
  }

  console.log('\n🎉 SEO 审计与关键词提炼执行完毕！\n');
}

runSeoAudit();
