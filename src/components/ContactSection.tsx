import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Clock, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@example.com).';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please choose a subject.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please write your message.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate swift server response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Question',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="contact-section" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Context & Editorial Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                Get in Touch
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Contact AI Future Hub
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Have a question about one of our articles, want to propose a technology topic for exploration, or seeking editorial collaboration? We welcome thoughtful inquiries from readers, educators, and researchers.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Editorial Desk
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    editorial@aifuturehub.org
                  </div>
                  <div className="text-xs text-slate-500">
                    For article corrections, citations, and contributor submissions
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Response Window
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Within 24-48 business hours
                  </div>
                  <div className="text-xs text-slate-500">
                    Our editorial staff reviews reader letters weekly
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    San Francisco, California & Remote Global Editorial
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 p-7 sm:p-9 rounded-2xl border border-slate-200/90 shadow-xs">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You, {formData.name}!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your message regarding <strong className="text-slate-800">"{formData.subject}"</strong> has been received by the AI Future Hub editorial desk. A member of our team will follow up at <span className="text-indigo-600 font-medium">{formData.email}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="e.g. alex@example.com"
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject / Topic <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: '' });
                    }}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 outline-none transition-colors ${
                      errors.subject ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  >
                    <option value="General Question">General Reader Inquiry</option>
                    <option value="Article Feedback or Correction">Article Feedback or Correction</option>
                    <option value="Topic Suggestion">Topic Suggestion for Future Article</option>
                    <option value="Educational Licensing">Educational / Classroom Use</option>
                    <option value="Press & Media Inquiry">Press & Media Inquiry</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Share your thoughts, inquiry, or suggested angle in detail..."
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors resize-y ${
                      errors.message ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
