import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { religiousEvents } from '../data/events';
import { Calendar, Clock, MapPin, Sparkles, Bell, ArrowRight, Flame, Check } from 'lucide-react';

export const EventsSection = () => {
  const { addToast } = useYatra();
  const [scheduledEvents, setScheduledEvents] = useState([]);

  const handleAddToSchedule = (event) => {
    if (scheduledEvents.includes(event.id)) {
      setScheduledEvents(scheduledEvents.filter((id) => id !== event.id));
      addToast('Event Removed', `"${event.title}" removed from your personal yatra schedule.`, 'info');
    } else {
      setScheduledEvents([...scheduledEvents, event.id]);
      addToast(
        '🔔 Event Added to Yatra Schedule',
        `We will notify your family group 30 minutes before ${event.title} begins.`,
        'success'
      );
    }
  };

  return (
    <section id="events" className="py-20 bg-yatra-bg border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-yatra-saffron" /> Live Temple Timings & Aartis
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
            What's Happening Around You?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Never miss sacred rituals, evening aartis, and spiritual discourses. Real-time updates directly from temple trusts.
          </p>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {religiousEvents.map((evt) => {
            const isScheduled = scheduledEvents.includes(evt.id);
            return (
              <div
                key={evt.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-float transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Event Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/20" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-navy-900 shadow-sm">
                        {evt.category}
                      </span>
                    </div>

                    {/* Live Timing Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px]">
                        <Clock className="w-3 h-3" /> {evt.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-navy-900 font-display mb-1.5 leading-snug line-clamp-1 group-hover:text-yatra-blue transition-colors">
                      {evt.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-yatra-blue" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-1">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAddToSchedule(evt)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isScheduled
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-yatra-light text-navy-900 hover:text-yatra-blue border border-slate-200'
                    }`}
                  >
                    {isScheduled ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Schedule
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-yatra-blue" /> Set Aarti Reminder
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
