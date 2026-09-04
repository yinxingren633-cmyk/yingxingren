import React, { useState } from 'react';

// Inline Lucide-style SVG Icons to guarantee zero bundler resolution issues and exact pixel perfection
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

interface LiquidGlassHeroProps {
  tags?: string[];
}

export const LiquidGlassHero: React.FC<LiquidGlassHeroProps> = ({ tags = [] }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tutorialsSection = document.getElementById('tutorials');
    if (tutorialsSection) {
      tutorialsSection.scrollIntoView({ behavior: 'smooth' });
    }
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = searchValue;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col justify-between">
      {/* 1. 背景视频 (z-0) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4"
      />

      {/* 2. 顶部渐变遮罩 (z-1) */}
      <div
        className="absolute inset-x-0 top-0 h-[687px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* 3. 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-between px-20 pt-6 pb-4 max-md:px-6 max-md:pt-5">
        {/* Left: Wordmark */}
        <a href="/" className="group flex items-center gap-2">
          <span className="font-display text-[40px] max-md:text-[32px] text-black leading-none select-none">
            invisible
          </span>
        </a>

        {/* Center: Nav links (Hidden on mobile via max-md:hidden) */}
        <div className="absolute left-1/2 -translate-x-1/2 max-md:hidden flex items-center gap-8">
          <a
            href="/tags/Clash%20配置教程"
            className="text-[15px] font-medium text-wandor-text hover:text-black transition-colors"
          >
            Clash 专栏
          </a>
          <a
            href="/tags/美区%20Apple%20ID%20注册"
            className="text-[15px] font-medium text-wandor-text hover:text-black transition-colors"
          >
            美区 Apple ID
          </a>
          <a
            href="/tags/网络加速节点优化"
            className="text-[15px] font-medium text-wandor-text hover:text-black transition-colors"
          >
            节点优化
          </a>
          <a
            href="/faq"
            className="text-[15px] font-medium text-wandor-text hover:text-black transition-colors"
          >
            常见问题 (FAQ)
          </a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* GitHub Link Icon Button */}
          <a
            href="https://github.com/yinxingren633-cmyk/yingxingren"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="p-1 text-wandor-text hover:text-black transition-colors flex items-center justify-center"
            title="View on GitHub"
          >
            <GithubIcon className="w-6 h-6" />
          </a>

          {/* 开始阅读 / Read Blog Button */}
          <a
            href="#tutorials"
            className="bg-wandor-dark text-[#fafafa] border-none cursor-pointer font-sans text-[15px] font-medium uppercase tracking-[0.04em] px-5 py-3.5 rounded-full transition-all hover:bg-[#333] active:scale-95 flex items-center gap-1.5 shadow-md"
          >
            <span>开始阅读 / Read Blog</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* 4. Hero Body & Liquid Glass Search / Prompt Card */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-24 text-center my-auto">
        {/* Brand Logo directly above headline */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="隐形人 Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://api.iconify.design/lucide:shield-check.svg';
            }}
          />
        </div>

        {/* Headline */}
        <h1 className="font-sans text-[clamp(40px,6vw,68px)] font-medium text-wandor-text leading-[1.05] tracking-[-0.04em] max-w-[820px] mb-5">
          隐形人 (Invisibles) — 极速·隐秘·自由
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-xl font-medium text-wandor-muted leading-relaxed max-w-[550px] mb-10">
          探索 2026 最新网络架构、Clash 避坑指南、美区 Apple ID 注册与低延迟节点优化干货。
        </p>

        {/* Liquid Glass Prompt Card */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-[701px] max-md:w-[calc(100vw-48px)] min-h-[208px] bg-white/[0.06] border-[3px] border-white rounded-[44px] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] overflow-hidden backdrop-blur-[20px] text-left"
        >
          {/* Prompt text */}
          <p className="absolute left-[29px] top-[57px] -translate-y-1/2 w-[609px] max-md:w-[calc(100%-58px)] font-sans text-xl max-md:text-[17px] font-medium text-wandor-prompt leading-relaxed break-words pointer-events-none select-none">
            {searchValue ? '' : '搜索教程：如何快速配置 Clash Verge 规则？如何免信用卡注册美区 Apple ID 并下载 Shadowrocket？...'}
          </p>

          <textarea
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            rows={2}
            className="absolute left-[29px] top-[24px] w-[609px] max-md:w-[calc(100%-58px)] bg-transparent border-none outline-none resize-none font-sans text-xl max-md:text-[17px] font-medium text-wandor-prompt leading-relaxed"
          />

          {/* Upload/Search Icon Button */}
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            className="absolute left-[21px] top-[137px] w-11 h-11 bg-transparent border border-white/70 rounded-full cursor-pointer flex items-center justify-center backdrop-blur-[14px] transition-transform hover:scale-105 active:scale-95"
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5 text-wandor-text" />
          </button>

          {/* 搜索文章 CTA button inside card */}
          <button
            type="submit"
            className="absolute bottom-[21px] right-[21px] w-[156px] h-14 bg-black border-none rounded-[44px] shadow-[0_0_2px_0_rgba(0,0,0,0.05)] cursor-pointer flex items-center justify-center font-sans text-base font-medium text-[#fafafa] uppercase tracking-[0.02em] transition-all hover:bg-[#333] active:scale-95"
          >
            搜索文章
          </button>
        </form>

        {/* 热门长尾关键词标签胶囊 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8 max-w-2xl">
            <span className="text-xs font-semibold text-wandor-muted">🔥 热门专题：</span>
            {tags.slice(0, 6).map((tag) => (
              <a
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="px-3.5 py-1 rounded-full bg-white/70 border border-black/10 hover:border-black/30 text-wandor-text text-xs font-medium backdrop-blur-md transition-all hover:bg-white shadow-sm"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10"></div>
    </div>
  );
};

export default LiquidGlassHero;