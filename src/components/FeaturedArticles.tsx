import React from 'react';
import { Article } from '../types';
import { ArrowRight, Bookmark, Sparkles } from 'lucide-react';

interface FeaturedArticlesProps {
  articles: Article[];
  onReadArticle: (article: Article) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (articleId: string) => void;
}

export const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  articles,
  onReadArticle,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  // Select 3 featured articles (e.g. articles marked featured or top 3)
  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const primaryArticle = featured[0];
  const secondaryArticles = featured.slice(1, 3);

  if (!primaryArticle) return null;

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Curated Editorial Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore the Future of AI
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm sm:text-base">
              Hand-picked longform explorations breaking down fundamental shifts in culture, cognitive tools, and the next decade of technology.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            3 In-Depth Featured Guides
          </div>
        </div>

        {/* Featured Grid: 1 Primary Large Feature + 2 Secondary Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Primary Big Feature (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <img
                src={primaryArticle.coverImage}
                alt={primaryArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => onToggleBookmark(primaryArticle.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-colors ${
                  bookmarkedIds.includes(primaryArticle.id)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/80 text-slate-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                }`}
                aria-label="Bookmark featured article"
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(primaryArticle.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                  <span className="text-indigo-600 font-bold uppercase tracking-wider text-[11px]">
                    {primaryArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{primaryArticle.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{primaryArticle.publishDate}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  {primaryArticle.title}
                </h3>
                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {primaryArticle.summary}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={primaryArticle.author.avatar}
                    alt={primaryArticle.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-slate-900">
                      {primaryArticle.author.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {primaryArticle.author.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onReadArticle(primaryArticle)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2 Secondary Features (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryArticles.map((article) => {
              const isSaved = bookmarkedIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between flex-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 font-semibold uppercase tracking-wider text-[11px]">
                          {article.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTime}</span>
                      </div>
                      <button
                        onClick={() => onToggleBookmark(article.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'
                        }`}
                        aria-label="Bookmark article"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        {article.author.name}
                      </span>
                    </div>

                    <button
                      onClick={() => onReadArticle(article)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/btn py-1 px-2.5 rounded-lg hover:bg-indigo-50 cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
