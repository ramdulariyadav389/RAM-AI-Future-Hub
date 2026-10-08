import React from 'react';
import { Article } from '../types';
import { ArrowRight, Bookmark, Clock, Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <article className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Bookmark quick action on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-indigo-600 shadow-sm'
          }`}
          title={isBookmarked ? 'Remove from saved' : 'Save article for later'}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Unboxed Metadata (Zero-pill discipline: quiet inline text with typographic separators) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
          <span className="text-indigo-600 font-semibold uppercase tracking-wider text-[11px]">
            {article.category}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{article.publishDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
          {article.summary}
        </p>

        {/* Author information & Read Button Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800 truncate">
                {article.author.name}
              </span>
              <span className="block text-[11px] text-slate-400 truncate">
                {article.author.role}
              </span>
            </div>
          </div>

          {/* Required "Read Article" button */}
          <button
            onClick={() => onReadArticle(article)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/btn py-1 px-2.5 rounded-lg hover:bg-indigo-50/80 cursor-pointer"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
