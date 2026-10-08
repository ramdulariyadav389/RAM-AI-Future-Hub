import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Check, 
  Clock, 
  Calendar, 
  User, 
  ChevronRight, 
  Type, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  relatedArticles: Article[];
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  onSelectArticle,
  relatedArticles,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const currentProgress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy share link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-relaxed';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-indigo-600 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Reading Header Bar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Normal font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded transition-colors text-sm ${
                fontSize === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Large font size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded transition-colors text-base ${
                fontSize === 'xlarge' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Extra large font size"
            >
              A++
            </button>
          </div>

          {/* Bookmark Toggle */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-slate-300'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Save article'}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Share / Copy Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Share article link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Article Hero Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-4">
          <span className="text-indigo-600 font-bold uppercase tracking-wider text-xs">
            {article.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>{article.publishDate}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>Approx. {article.wordCount} words</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
          {article.subtitle}
        </p>

        {/* Author Bio Header */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">{article.author.name}</div>
              <div className="text-xs text-slate-500">{article.author.role}</div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Verified Editorial Piece
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="aspect-[21/9] sm:aspect-[16/8] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content Grid: Table of Contents (sticky desktop) + Reading Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contents
              </div>
              <nav className="space-y-2 text-xs">
                <a
                  href="#introduction"
                  className="block text-slate-600 hover:text-indigo-600 py-1 transition-colors font-medium"
                >
                  Introduction
                </a>
                {article.sections.map((sec, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx}`}
                    className="block text-slate-600 hover:text-indigo-600 py-1 transition-colors leading-snug"
                  >
                    {idx + 1}. {sec.heading}
                  </a>
                ))}
                <a
                  href="#conclusion"
                  className="block text-slate-600 hover:text-indigo-600 py-1 transition-colors font-medium"
                >
                  Conclusion & Key Takeaways
                </a>
              </nav>

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
                Reading time: {article.readTime}
              </div>
            </div>
          </aside>

          {/* Main Reading Body */}
          <main className="lg:col-span-9 font-serif-reading text-slate-800">
            {/* Introduction */}
            <section id="introduction" className="space-y-5 mb-10">
              {article.introduction.map((p, idx) => (
                <p
                  key={idx}
                  className={`${getFontSizeClass()} ${
                    idx === 0 ? 'text-slate-900 font-medium' : 'text-slate-700'
                  }`}
                >
                  {p}
                </p>
              ))}
            </section>

            {/* Sections */}
            {article.sections.map((section, idx) => (
              <section key={idx} id={`section-${idx}`} className="my-10 pt-4 border-t border-slate-100">
                <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                  {section.heading}
                </h2>
                
                {section.subheading && (
                  <h3 className="font-sans text-sm sm:text-base font-semibold text-indigo-700 mb-5">
                    {section.subheading}
                  </h3>
                )}

                <div className="space-y-5">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={`${getFontSizeClass()} text-slate-700`}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Optional Callout */}
                {section.callout && (
                  <div className="my-6 p-5 bg-indigo-50/70 border-l-4 border-indigo-600 rounded-r-xl font-sans">
                    <h4 className="text-sm font-bold text-indigo-900 mb-1">{section.callout.title}</h4>
                    <p className="text-xs sm:text-sm text-indigo-800">{section.callout.text}</p>
                  </div>
                )}

                {/* Practical Example Box */}
                {section.exampleBox && (
                  <div className="my-8 p-6 bg-slate-900 text-white rounded-2xl shadow-sm font-sans">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{section.exampleBox.title}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4 font-normal">
                      {section.exampleBox.description}
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                      {section.exampleBox.points.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}

            {/* Conclusion */}
            <section id="conclusion" className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Conclusion
              </h2>
              <div className="space-y-4 mb-8">
                {article.conclusion.map((p, idx) => (
                  <p key={idx} className={`${getFontSizeClass()} text-slate-700`}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="p-6 sm:p-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl font-sans">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base mb-4">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                  <span>Key Takeaways</span>
                </div>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-amber-950 font-medium">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Author Footer Bio Card */}
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 font-sans flex flex-col sm:flex-row items-center gap-5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="text-center sm:text-left">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                  About the Author
                </div>
                <h3 className="text-lg font-bold text-slate-900">{article.author.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {article.author.role}. Elena writes extensively about human-centered technology, artificial intelligence ethics, and the changing landscape of digital society.
                </p>
              </div>
            </div>

            {/* Tags (Unboxed inline text with separators) */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500 font-sans">
              <span className="font-semibold text-slate-700">Tagged Topics:</span>
              {article.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>{tag}</span>
                  {idx < article.tags.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Recommended Next Reads</h3>
                <p className="text-xs sm:text-sm text-slate-500">Continue exploring artificial intelligence and technology</p>
              </div>
              <button
                onClick={onBack}
                className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View all articles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-2">
                      <span className="text-indigo-600 font-semibold uppercase">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.readTime}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
