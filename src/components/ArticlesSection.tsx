import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { CATEGORIES } from '../data/articles';
import { ArticleCard } from './ArticleCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, BookOpen } from 'lucide-react';

interface ArticlesSectionProps {
  articles: Article[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onReadArticle: (article: Article) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (articleId: string) => void;
  onlyBookmarked?: boolean;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onReadArticle,
  bookmarkedIds,
  onToggleBookmark,
  onlyBookmarked = false,
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'readTime' | 'title'>('latest');

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Bookmark filter if active
      if (onlyBookmarked && !bookmarkedIds.includes(art.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = art.title.toLowerCase().includes(q);
        const subMatch = art.subtitle.toLowerCase().includes(q);
        const summaryMatch = art.summary.toLowerCase().includes(q);
        const authorMatch = art.author.name.toLowerCase().includes(q);
        const categoryMatch = art.category.toLowerCase().includes(q);
        const tagMatch = art.tags.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !subMatch && !summaryMatch && !authorMatch && !categoryMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'readTime') {
        return parseInt(a.readTime) - parseInt(b.readTime);
      }
      // 'latest' default (by id order or date)
      return parseInt(b.id.replace('art-', '')) - parseInt(a.id.replace('art-', ''));
    });
  }, [articles, searchQuery, selectedCategory, sortBy, onlyBookmarked, bookmarkedIds]);

  const handleResetFilters = () => {
    onSearchChange('');
    onSelectCategory('All');
  };

  return (
    <section id="articles-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1.5">
              Knowledge Repository
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All Articles & Guides
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Complete, longform educational analyses written by technology researchers and domain practitioners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-900">{filteredArticles.length}</strong> of{' '}
              {articles.length} articles
            </span>
          </div>
        </div>

        {/* Search, Filter Bar and Controls */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles by title, topic, author, or keyword..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 py-2.5 px-3 rounded-xl focus:border-indigo-500 outline-none font-medium"
              >
                <option value="latest">Sort: Latest</option>
                <option value="readTime">Sort: Reading Time</option>
                <option value="title">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Filter Controls (Segmented buttons - allowed by constitution for interactive filters) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className="text-slate-400 text-xs font-medium mr-1.5 shrink-0 hidden sm:inline">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-semibold'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid or Empty State */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadArticle={onReadArticle}
                isBookmarked={bookmarkedIds.includes(article.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching articles found</h3>
            <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try modifying your keywords or resetting category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
