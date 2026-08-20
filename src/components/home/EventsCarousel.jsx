import React, { useState, useEffect } from 'react';
import { useYatra } from '../../context/YatraContext';
import { religiousEvents } from '../../data/events';
import {
  Flame,
  Clock,
  MapPin,
  Calendar,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const EventsCarousel = () => {
  const { setCurrentScreen, addToast } = useYatra();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reminders, setReminders] = useState([]);

  // Auto-play slideshow every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % religiousEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + religiousEvents.length) % religiousEvents.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % religiousEvents.length);
  };

  const handleToggleReminder = (e, evt) => {
    e.stopPropagation();
    if (reminders.includes(evt.id)) {
      setReminders(reminders.filter((id) => id !== evt.id));
      addToast('Aarti Reminder Removed', `Notification cleared for "${evt.title}".`, 'info');
    } else {
      setReminders([...reminders, evt.id]);
      addToast(
        '🔔 Aarti Reminder Scheduled',
        `A spiritual chime and notification will sound 30 minutes before ${evt.title}.`,
        'success'
      );
    }
  };

  const currentEvent = religiousEvents[currentIndex];

  return (
    <div
      className="relative rounded-3xl sm:rounded-mandap overflow-hidden shadow-temple border border-gold-500/30 bg-navy-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner Slideshow with Crossfade */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden">
        {religiousEvents.map((evt, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={evt.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Rich royal gold and deep indigo vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-transparent" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 p-5 sm:p-7 md:p-9 flex flex-col justify-between">
          {/* Top Bar: Event Category Badge & Counter */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/50 backdrop-blur-md text-gold-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-gold-400 animate-diya" />
              <span>Sacred Festival & Aarti Spotlight</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-navy-900/80 border border-gold-500/30 text-gold-200 text-xs font-mono font-bold backdrop-blur-sm">
                0{currentIndex + 1} / 0{religiousEvents.length}
              </span>
            </div>
          </div>

          {/* Center/Bottom Info */}
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-gold-300 font-semibold">
              <span className="px-2.5 py-0.5 rounded-md bg-gold-600/80 text-white font-bold text-[11px]">
                {currentEvent.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold-400" /> {currentEvent.time}
              </span>
              <span className="text-slate-300 hidden sm:inline">• {currentEvent.status}</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heritage text-white tracking-tight leading-tight text-gold-shine">
              {currentEvent.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed font-sans">
              {currentEvent.description}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gold-200 pt-1">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span className="font-semibold">{currentEvent.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={(e) => handleToggleReminder(e, currentEvent)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-gold-sm flex items-center gap-1.5 ${
                  reminders.includes(currentEvent.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950'
                }`}
              >
                {reminders.includes(currentEvent.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Reminder Active</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Set Aarti Reminder</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentScreen('events')}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-colors flex items-center gap-1.5"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-navy-950/80 hover:bg-gold-500 hover:text-navy-950 text-gold-300 border border-gold-500/40 backdrop-blur-md transition-all shadow-md"
          aria-label="Previous Event"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-navy-950/80 hover:bg-gold-500 hover:text-navy-950 text-gold-300 border border-gold-500/40 backdrop-blur-md transition-all shadow-md"
          aria-label="Next Event"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 right-6 z-30 flex items-center gap-1.5">
          {religiousEvents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-gold-400 shadow-glow-gold'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
