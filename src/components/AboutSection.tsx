import React from 'react';
import { Compass, ShieldCheck, Cpu, Lightbulb, Users, CheckCircle2, Award, BookOpen } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            Our Mission & Editorial Values
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About AI Future Hub
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            AI Future Hub exists to make artificial intelligence easier to understand, explore, and navigate for everyone. We translate complex algorithmic frontiers into practical knowledge, responsible guidance, and forward-looking clarity.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Demystifying Complexity</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We reject incomprehensible jargon and hyperbolic claims. Our articles deconstruct large language models, neural vision, and autonomous agents into intuitive concepts that anyone can grasp without an advanced degree in computer science.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Practical Knowledge</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Technology matters most when it improves everyday human lives. We focus on real-world utility—from small business productivity tactics to educational study habits and clinical healthcare innovations.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Responsible Technology Use</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              AI brings real societal challenges. We examine algorithmic bias, privacy vulnerabilities, data security, and civic accountability with unflinching intellectual honesty, advocating for technology that earns public trust.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Future Trends & Long-Term Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We look ahead to embodied robotics, autonomous multi-agent reasoning, and scientific supercomputing, carefully distinguishing grounded technical roadmaps from sensationalized science fiction.
            </p>
          </div>
        </div>

        {/* Editorial Standards & Fact Checking */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Editorial Integrity
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                How We Research & Write
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Independent & Peer-Informed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Primary Source Rigor</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We draw insights directly from published academic papers, engineering whitepapers, and verifiable industry deployments.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Balanced Perspective</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We balance excitement about emerging capabilities with critical analysis of limitations, costs, and ethical dilemmas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Continuous Revision</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                As artificial intelligence continues to evolve at unprecedented speed, our articles are routinely reviewed and updated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
