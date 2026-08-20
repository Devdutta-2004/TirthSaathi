import React from 'react';
import { testimonials } from '../data/testimonials';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Devotee Stories & Trust
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
            Built Around the Pilgrim Experience
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Real experiences from devotees who traveled with greater safety, connectivity, and peace of mind across India's sacred yatras.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-yatra-blue/30 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-yatra-sky/40" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-serif mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Devotee Profile */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-yatra-blue/30 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-navy-900 font-display">{item.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Yatri" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {item.location} • <span className="text-yatra-blue font-semibold">{item.yatra}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
