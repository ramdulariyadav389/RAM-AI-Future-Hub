import React, { useState } from 'react';
import { ActivePage } from '../types';
import { ArrowUp, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }
    setSubscribeError('');
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredTopics = [
    'Everyday Life',
    'Education',
    'Workplace & Career',
    'Healthcare & Medicine',
    'Generative AI',
    'Cybersecurity',
    'Ethics & Society',
    'Future Trends & Science',
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors"
              title="AI Future Hub Homepage"
              aria-label="Return to AI Future Hub homepage"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-sm tracking-tighter">
                AI
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                AI Future Hub
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent educational resource dedicated to making artificial intelligence clear, practical, and accessible for everyone. Understanding AI today, preparing for tomorrow.
            </p>
            <div className="text-xs text-slate-500 pt-2">
              10 In-Depth Guides · 100% Free Open Educational Content
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm" aria-label="Footer navigation links">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Navigate to AI Future Hub home page"
                  aria-label="AI Future Hub Homepage"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/articles"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('articles');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Browse all 10 technology articles"
                  aria-label="All 10 Artificial Intelligence Articles"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Learn about AI Future Hub mission and editorial standards"
                  aria-label="About AI Future Hub Mission"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Contact our editorial desk"
                  aria-label="Contact AI Future Hub Editorial Desk"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Topics (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Disciplines
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-400" aria-label="Browse articles by core discipline">
              {featuredTopics.map((topic) => (
                <a
                  key={topic}
                  href="/articles"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(topic);
                    onNavigate('articles');
                  }}
                  className="text-left hover:text-indigo-400 transition-colors py-0.5 truncate cursor-pointer block"
                  aria-label={`Explore artificial intelligence articles in ${topic}`}
                  title={`View articles about ${topic}`}
                >
                  {topic}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Box (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive concise monthly updates on breakthrough AI research, educational guides, and ethical analysis.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Thank you for joining our readership.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (subscribeError) setSubscribeError('');
                    }}
                    placeholder="Enter your email..."
                    aria-label="Email address for monthly technology dispatch"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    aria-label="Subscribe to monthly technology research dispatch"
                  >
                    Subscribe to Dispatch
                  </button>
                </div>
                {subscribeError && (
                  <p className="text-[11px] text-rose-400">{subscribeError}</p>
                )}
                <span className="block text-[11px] text-slate-500">
                  No marketing spam. Unsubscribe at any time.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-400 font-semibold">AI Future Hub</strong>. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Built for public technological literacy</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
