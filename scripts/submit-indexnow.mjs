import fs from 'node:fs';
import path from 'node:path';

const HOST = 'yinxingren.homes';
// 隐形人 IndexNow 专属验证密钥
const KEY = 'b8cefbf031ce42089560d53d606e71ee';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// 确保在 public 目录下生成密钥验证文件，供 Bing 蜘蛛爬取鉴权
const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, `${KEY}.txt`), KEY, 'utf-8');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, `${KEY}.txt`), KEY, 'utf-8');
}

// 自动扫描 dist 目录下的 HTML 文件生成提交 URL 列表
function getUrls(dir, base = '') {
  let urls = [];
  if (!fs.existsSync(dir)) return urls;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      urls = urls.concat(getUrls(fullPath, `${base}/${file}`));
    } else if (file === 'index.html') {
      const pageUrl = base ? `https://${HOST}${base}/` : `https://${HOST}/`;
      urls.push(pageUrl);
    }
  }
  return urls;
}

const urlList = getUrls(distDir);

if (urlList.length === 0) {
  console.log('[IndexNow] 未检测到静态输出目录 dist，跳过主动提交。');
  process.exit(0);
}

console.log(`[IndexNow] 准备向 Bing IndexNow 提交 ${urlList.length} 个生产页面 URL...`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList,
};

try {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (response.ok || response.status === 200 || response.status === 202) {
    console.log(`[IndexNow] ✅ 成功向 IndexNow API 提交 ${urlList.length} 条 URL (HTTP ${response.status})`);
  } else {
    console.warn(`[IndexNow] ⚠️ 提交返回响应: HTTP ${response.status} ${response.statusText}`);
  }
} catch (error) {
  console.warn('[IndexNow] ⚠️ 自动化推送请求失败 (可能是本地无外网或被墙)，跳过推送:', error.message);
}
