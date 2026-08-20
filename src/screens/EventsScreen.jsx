import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { religiousEvents } from '../data/events';
import { Calendar, Clock, MapPin, Bell, Flame, Check, Sparkles } from 'lucide-react';

export const EventsScreen = () => {
  const { addToast } = useYatra();
  const [reminders, setReminders] = useState([]);

  const toggleReminder = (id, title) => {
    if (reminders.includes(id)) {
      setReminders(reminders.filter((r) => r !== id));
      addToast('Reminder Removed', `Notification cleared for "${title}".`, 'info');
    } else {
      setReminders([...reminders, id]);
      addToast('🔔 Aarti Reminder Scheduled', `We will ring a chime 30 mins before ${title} starts.`, 'success');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
          Sacred Daily Schedules & Mahotsav
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold font-display text-navy-900 mt-1">
          Religious Events & Live Aartis
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Real-time prayer timings, evening Maha Aartis, and saint discourses updated directly from temple trusts.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {religiousEvents.map((evt) => {
          const isSet = reminders.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-navy-900">
                    {evt.category}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {evt.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-navy-900 font-display mb-1">{evt.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0" />
                    <span>{evt.location}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-yatra-blue" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => toggleReminder(evt.id, evt.title)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSet
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-yatra-light text-navy-900 hover:text-yatra-blue'
                  }`}
                >
                  {isSet ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Reminder Scheduled
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" /> Set Aarti Reminder Chime
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
