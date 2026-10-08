import React from 'react';
import { ArrowRight, BookOpen, Compass, Search, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalArticles: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  searchQuery,
  onSearchChange,
  totalArticles,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Subtle architectural background grid */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker label - clean text with separator, no pill badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-6">
          <span>Editorial Publication</span>
          <span aria-hidden="true">·</span>
          <span>Demystifying Technology</span>
          <span aria-hidden="true">·</span>
          <span>10 In-Depth Guides</span>
        </div>

        {/* Required Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Understanding AI Today.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300">
            Preparing for Tomorrow.
          </span>
        </h1>

        {/* Required Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Explore how artificial intelligence is transforming the way we learn, work, create, communicate, and live.
        </p>

        {/* Short introduction to the website */}
        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI Future Hub is an independent educational knowledge base dedicated to translating complex algorithmic breakthroughs into clear, grounded, and human-friendly insights for students, professionals, and curious citizens.
        </p>

        {/* CTA Button and Interactive Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          {/* Required Prominent "Explore Articles" button */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Explore Articles</span>
            <ArrowRight className="w-4 h-4 text-slate-700" />
          </button>

          {/* Quick search input */}
          <div className="w-full sm:flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${totalArticles} comprehensive articles...`}
              className="w-full pl-10 pr-4 py-3.5 bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700 focus:border-indigo-400 rounded-xl text-sm text-white placeholder-slate-400 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Core editorial topics overview - clean typography without pill badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="text-slate-300 font-medium">Covering Key Disciplines:</span>
          <span>Everyday Applications</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Classroom & Education</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Workplace Evolution</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Clinical Healthcare</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Cyber Defense</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Ethics & Governance</span>
        </div>
      </div>
    </section>
  );
};
