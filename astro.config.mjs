import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // 1. 网站实际完整 URL (生成 Sitemap 和 Canonical URL 的必需项)
  site: process.env.SITE_URL || 'https://yinxingren.homes',

  // 2. 纯静态模式 (SSG)
  output: 'static',

  // 3. 集成插件
  integrations: [
    react(),
    // Tailwind CSS 集成
    tailwind({
      // 应用基础样式
      applyBaseStyles: true,
    }),

    // Sitemap 自动生成集成
    sitemap({
      // 过滤不需要包含在 Sitemap 中的页面
      filter: (page) => !page.includes('/404') && !page.includes('/draft/'),

      // 调整 sitemap 生成参数
      serialize(item) {
        // 首页高优先级
        if (item.url === 'https://yinxingren.homes/' || item.url === 'https://yinxingren.homes') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } 
        // 博客文章页配置
        else if (item.url.includes('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } 
        // 标签索引页配置
        else if (item.url.includes('/tags/')) {
          item.changefreq = 'weekly';
          item.priority = 0.5;
        }
        return item;
      },
    }),
  ],

  // 4. Markdown 渲染优化
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },

  // 5. Vite 依赖优化
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
