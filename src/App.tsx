/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Article } from './types';
import { ARTICLES } from './data/articles';
import { getBookmarkedIds, toggleBookmarkId } from './utils/storage';
import { updatePageMetadata, PAGE_SEO_CONFIG } from './utils/seo';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedArticles } from './components/FeaturedArticles';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleDetail } from './components/ArticleDetail';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookmarksModal } from './components/BookmarksModal';

interface AppProps {
  initialPath?: string;
  initialArticle?: Article;
}

export default function App({ initialPath, initialArticle }: AppProps = {}) {
  // Compute initial states from initial props (supports both SSG pre-rendering and SSR)
  const computeInitialState = (): { page: ActivePage; article: Article | null } => {
    if (initialArticle) {
      return { page: 'article-detail', article: initialArticle };
    }
    if (initialPath) {
      if (initialPath.startsWith('/articles/')) {
        const slug = initialPath.replace('/articles/', '').replace(/\/$/, '');
        const matched = ARTICLES.find((a) => a.slug === slug);
        if (matched) return { page: 'article-detail', article: matched };
        return { page: '404', article: null };
      }
      if (initialPath === '/articles') return { page: 'articles', article: null };
      if (initialPath === '/about') return { page: 'about', article: null };
      if (initialPath === '/contact') return { page: 'contact', article: null };
      if (initialPath === '/404') return { page: '404', article: null };
    }
    return { page: 'home', article: null };
  };

  const initial = computeInitialState();
  const [activePage, setActivePage] = useState<ActivePage>(initial.page);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(initial.article);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarksModalOpen, setBookmarksModalOpen] = useState(false);

  // Initialize bookmarks from localStorage on client
  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
  }, []);

  // Parse path or hash to resolve active route on client
  const resolveRouteFromLocation = () => {
    if (typeof window === 'undefined') return;

    // Check pathname first (HTML5 clean URL), fallback to hash
    const pathname = window.location.pathname;
    const hash = window.location.hash.replace('#', '');

    // Check article route: /articles/:slug or #article-:slug
    let articleSlug = '';
    if (pathname.startsWith('/articles/')) {
      articleSlug = pathname.replace('/articles/', '').replace(/\/$/, '');
    } else if (hash.startsWith('article-')) {
      articleSlug = hash.replace('article-', '');
    }

    if (articleSlug) {
      const matched = ARTICLES.find((a) => a.slug === articleSlug);
      if (matched) {
        setSelectedArticle(matched);
        setActivePage('article-detail');
        updatePageMetadata(matched.seo, matched.faqAeo, matched.coverImage, matched);
        return;
      } else {
        setSelectedArticle(null);
        setActivePage('404');
        updatePageMetadata(PAGE_SEO_CONFIG['404']);
        return;
      }
    }

    // Check /articles or #articles
    if (pathname === '/articles' || hash === 'articles') {
      setSelectedArticle(null);
      setActivePage('articles');
      updatePageMetadata(PAGE_SEO_CONFIG.articles);
      return;
    }

    // Check /about or #about
    if (pathname === '/about' || hash === 'about') {
      setSelectedArticle(null);
      setActivePage('about');
      updatePageMetadata(PAGE_SEO_CONFIG.about);
      return;
    }

    // Check /contact or #contact
    if (pathname === '/contact' || hash === 'contact') {
      setSelectedArticle(null);
      setActivePage('contact');
      updatePageMetadata(PAGE_SEO_CONFIG.contact);
      return;
    }

    // Check /404 or #404
    if (pathname === '/404' || hash === '404') {
      setSelectedArticle(null);
      setActivePage('404');
      updatePageMetadata(PAGE_SEO_CONFIG['404']);
      return;
    }

    // Home route: '/' or empty or unrecognized root
    if (pathname === '/' || pathname === '' || hash === 'home' || hash === '') {
      setSelectedArticle(null);
      setActivePage('home');
      updatePageMetadata(PAGE_SEO_CONFIG.home);
      return;
    }

    // Default fallback for unknown routes: 404
    setSelectedArticle(null);
    setActivePage('404');
    updatePageMetadata(PAGE_SEO_CONFIG['404']);
  };

  // Listen to popstate (browser back/forward) and hashchange
  useEffect(() => {
    resolveRouteFromLocation();

    const handlePopState = () => {
      resolveRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleOpenSearchFocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBookmark = (articleId: string) => {
    const updated = toggleBookmarkId(articleId);
    setBookmarkedIds(updated);
  };

  // Good URL routing handler: updates history.pushState with clean URL & syncs metadata
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setSelectedArticle(null);

    let path = '/';
    if (page === 'articles') path = '/articles';
    else if (page === 'about') path = '/about';
    else if (page === 'contact') path = '/contact';
    else if (page === '404') path = '/404';

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    if (PAGE_SEO_CONFIG[page]) {
      updatePageMetadata(PAGE_SEO_CONFIG[page]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to individual article with unique URL: /articles/:slug
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setActivePage('article-detail');

    const path = article.seo.canonicalPath;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    updatePageMetadata(article.seo, article.faqAeo, article.coverImage, article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedArticle(null);
    setActivePage('articles');
    window.history.pushState(null, '', '/articles');
    updatePageMetadata(PAGE_SEO_CONFIG.articles);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearchFocus = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    }
    setActivePage('articles');
    window.history.pushState(null, '', '/articles');
    updatePageMetadata(PAGE_SEO_CONFIG.articles);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  // Get related articles (excluding the current one)
  const relatedArticles = selectedArticle
    ? ARTICLES.filter((a) => a.id !== selectedArticle.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        bookmarksCount={bookmarkedIds.length}
        onOpenBookmarks={() => setBookmarksModalOpen(true)}
        onOpenSearchFocus={handleOpenSearchFocus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedArticle ? (
          /* Individual Full Article View (Unique URL: /articles/:slug) */
          <ArticleDetail
            article={selectedArticle}
            onBack={handleBackFromDetail}
            onSelectArticle={handleSelectArticle}
            relatedArticles={relatedArticles}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : activePage === 'articles' ? (
          /* Dedicated Articles Directory Page (/articles) */
          <div className="bg-slate-50 min-h-screen">
            <header className="bg-white border-b border-slate-200/80 py-12 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4" aria-label="Breadcrumb">
                  <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="hover:text-indigo-600 transition-colors">Home</a>
                  <span aria-hidden="true">/</span>
                  <span className="text-slate-900 font-semibold" aria-current="page">Articles</span>
                </nav>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Artificial Intelligence Blog Articles
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
                  Browse our complete knowledge repository of 10 in-depth technology guides exploring everyday algorithms, education, workplace careers, clinical medicine, generative synthesis, cybersecurity, and societal ethics.
                </p>
              </div>
            </header>

            <ArticlesSection
              articles={ARTICLES}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onReadArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        ) : activePage === 'about' ? (
          /* Dedicated About Page (/about) */
          <div className="bg-white min-h-screen">
            <header className="bg-slate-900 text-white py-12 sm:py-16">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4" aria-label="Breadcrumb">
                  <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="hover:text-indigo-400 transition-colors">Home</a>
                  <span aria-hidden="true">/</span>
                  <span className="text-white font-semibold" aria-current="page">About</span>
                </nav>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  About AI Future Hub: Responsible AI Literacy Guide
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
                  Learn about AI Future Hub’s mission to promote responsible AI literacy, demystify machine learning, and deliver ethical, evidence-based tech analysis.
                </p>
              </div>
            </header>

            <AboutSection onExploreArticles={() => handleNavigate('articles')} />
          </div>
        ) : activePage === 'contact' ? (
          /* Dedicated Contact Page (/contact) */
          <div className="bg-white min-h-screen">
            <header className="bg-slate-900 text-white py-12 sm:py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4" aria-label="Breadcrumb">
                  <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="hover:text-indigo-400 transition-colors">Home</a>
                  <span aria-hidden="true">/</span>
                  <span className="text-white font-semibold" aria-current="page">Contact</span>
                </nav>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Contact AI Future Hub | Editorial & Reader Inquiries
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
                  Contact the AI Future Hub editorial desk for inquiries, article feedback, topic suggestions, and technology education collaborations.
                </p>
              </div>
            </header>

            <ContactSection />
          </div>
        ) : activePage === '404' ? (
          /* 404 Page Not Found */
          <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-20">
            <div className="max-w-lg w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 font-mono text-2xl font-bold">
                404
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                Page Not Found
              </h1>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                The article or educational resource you requested does not exist or may have been relocated.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Return to Home
                </a>
                <a
                  href="/articles"
                  onClick={(e) => { e.preventDefault(); handleNavigate('articles'); }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Browse Articles
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Homepage: Complete Magazine Experience */
          <>
            <Hero
              onExploreClick={() => handleNavigate('articles')}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                if (q.trim()) {
                  const el = document.getElementById('articles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              totalArticles={ARTICLES.length}
            />
            <FeaturedArticles
              articles={ARTICLES}
              onReadArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
            <ArticlesSection
              articles={ARTICLES}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onReadArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
            <AboutSection onExploreArticles={() => handleNavigate('articles')} />
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate('articles');
        }}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={bookmarksModalOpen}
        onClose={() => setBookmarksModalOpen(false)}
        articles={ARTICLES}
        bookmarkedIds={bookmarkedIds}
        onSelectArticle={handleSelectArticle}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}
