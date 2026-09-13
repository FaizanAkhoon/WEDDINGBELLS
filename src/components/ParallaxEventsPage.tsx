import React, { useState, useEffect } from 'react';
import { weddingEvents } from '../data/weddingData';
import type { AdminSettings, GuestInfo } from '../types/wedding';
import { soundManager } from '../services/soundEffects';
import {
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Sun,
  Music,
  Heart,
  Utensils,
  Palette,
  CheckCircle2
} from 'lucide-react';

interface ParallaxEventsPageProps {
  adminSettings: AdminSettings;
  guestInfo: GuestInfo;
  onBackToEnvelope: () => void;
}

export const ParallaxEventsPage: React.FC<ParallaxEventsPageProps> = ({
  adminSettings,
  guestInfo,
  onBackToEnvelope,
}) => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-fantasyGold-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-celestial-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-fantasyGold-300" />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-twilight-950 text-slate-100 overflow-x-hidden pt-20 pb-28">
      
      {/* Parallax Multi-Layer Backgrounds */}
      {/* Layer 0: Distant anime sky backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-300 ease-out opacity-45"
        style={{
          backgroundImage: `url('/assets/bg-mint-lilies.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate3d(${mousePos.x * 0.4}px, ${-scrollY * 0.15 + mousePos.y * 0.4}px, 0) scale(1.08)`,
        }}
      />

      {/* Layer 1: Dreamy twilight atmosphere gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-twilight-950/80 via-twilight-950/90 to-twilight-950" />

      {/* Layer 2: Floating lanterns & stars subtle parallax */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: `url('/assets/night-lanterns.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          transform: `translate3d(${-mousePos.x * 0.6}px, ${-scrollY * 0.08 - mousePos.y * 0.6}px, 0)`,
        }}
      />

      {/* Sticky Top Navigation Bar */}
      <div className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-celestial-400/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playChime(480);
            onBackToEnvelope();
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-celestial-950/60 hover:bg-celestial-900/80 border border-celestial-400/30 text-celestial-200 text-xs font-serif transition group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Envelope & Cards</span>
        </button>

        <div className="text-center hidden sm:block">
          <span className="font-decorative text-sm text-gold-gradient font-bold">
            {adminSettings.coupleNames.bride} & {adminSettings.coupleNames.groom}
          </span>
          <span className="block text-[10px] text-celestial-300/80 font-light">
            Celebration Itinerary & Events
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-light">Honoured Guest</span>
          <span className="text-xs font-serif font-bold text-fantasyGold-300">
            {guestInfo.name || 'Esteemed Guest'}
          </span>
        </div>
      </div>

      {/* Hero Section of Events Page */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-6 mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-celestial-950/80 border border-celestial-400/40 text-xs font-serif text-celestial-300 shadow-celestial-glow">
          <Sparkles className="w-3.5 h-3.5 text-fantasyGold-300 animate-spin-very-slow" />
          <span>The Celestial Wedding Journey</span>
        </div>

        <h1 className="font-decorative text-3xl sm:text-5xl lg:text-6xl text-gold-gradient font-bold tracking-tight">
          Page of Royal Events
        </h1>

        <p className="text-sm sm:text-base text-celestial-100/90 max-w-2xl mx-auto font-light leading-relaxed">
          {adminSettings.tagline}. We invite you to be an integral part of each ceremonial gathering, feast, and starlight soiree.
        </p>

        {/* Quick event jump tabs */}
        <div className="pt-4 flex items-center justify-center gap-2 flex-wrap">
          {weddingEvents.map((evt, idx) => (
            <a
              key={evt.id}
              href={`#event-${evt.id}`}
              onClick={() => soundManager.playChime(500 + idx * 80)}
              className="px-3 py-1.5 rounded-full text-xs font-serif bg-slate-900/80 border border-slate-700/80 hover:border-celestial-400 hover:text-celestial-200 text-slate-300 transition"
            >
              {evt.title}
            </a>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <ChevronDown className="w-5 h-5 text-celestial-400 animate-bounce" />
        </div>
      </div>

      {/* Timeline of Events */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-16">
        {weddingEvents.map((event, index) => {
          return (
            <div
              key={event.id}
              id={`event-${event.id}`}
              className="scroll-mt-24 group relative"
            >
              {/* Outer decorative card container */}
              <div className="relative rounded-3xl border-2 border-celestial-400/30 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden hover:border-fantasyGold-400/50 transition-all duration-500">
                
                {/* Visual Backdrop Banner for each event */}
                <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-celestial-500/20">
                  <img
                    src={event.bgImage}
                    alt={event.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Event Index Badge */}
                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-950/80 border border-fantasyGold-400/50 backdrop-blur-md flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-fantasyGold-300">
                      Day {index + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-xs text-celestial-200">{event.date}</span>
                  </div>

                  {/* Icon Circle */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-950/80 border border-celestial-400/50 flex items-center justify-center shadow-lg backdrop-blur-md">
                    {getEventIcon(event.icon)}
                  </div>

                  {/* Event Title Header Overlay */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-xs font-serif text-fantasyGold-300 uppercase tracking-widest font-semibold block">
                      {event.subTitle}
                    </span>
                    <h2 className="font-decorative text-2xl sm:text-3xl font-bold text-slate-100 drop-shadow">
                      {event.title}
                    </h2>
                  </div>
                </div>

                {/* Event Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Key Time and Location Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Clock className="w-4 h-4 text-celestial-400 shrink-0" />
                      <span><strong>Timings:</strong> {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <MapPin className="w-4 h-4 text-fantasyGold-400 shrink-0" />
                      <span className="truncate"><strong>Venue:</strong> {event.venue}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {event.description}
                  </p>

                  {/* Ceremony Highlights */}
                  <div>
                    <h4 className="font-serif text-xs font-bold text-celestial-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fantasyGold-300" />
                      Gathering Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-xl bg-celestial-950/40 border border-celestial-400/20 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-celestial-400 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dress Code & Color Palette */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                        <Palette className="w-3.5 h-3.5 text-celestial-300" />
                        Suggested Dress Code
                      </span>
                      <span className="font-serif text-sm font-semibold text-fantasyGold-200 block mt-0.5">
                        {event.dressCode}
                      </span>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 hidden sm:inline">Palette:</span>
                      {event.colorPalette.map((col, idx) => (
                        <div
                          key={idx}
                          title={`${col.name} (${col.hex})`}
                          className="group relative cursor-pointer"
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-white/30 shadow-md transform hover:scale-125 transition-transform"
                            style={{ backgroundColor: col.hex }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special guest attendance notice for Mehandi and Lunch */}
                  {event.id === 'mehandi' && (
                    <div className="p-3 rounded-xl bg-celestial-950/60 border border-celestial-400/30 text-xs text-celestial-200 flex items-center justify-between">
                      <span>Your Mehandi Reservation: <strong>{guestInfo.mehandiMales} Males, {guestInfo.mehandiFemales} Females</strong></span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-celestial-900 border border-celestial-400/40 text-celestial-300">
                        Reserved
                      </span>
                    </div>
                  )}

                  {event.id === 'lunch' && (
                    <div className="p-3 rounded-xl bg-fantasyGold-950/40 border border-fantasyGold-400/30 text-xs text-fantasyGold-200 flex items-center justify-between">
                      <span>Your Royal Lunch Reservation: <strong>{guestInfo.lunchMales} Males, {guestInfo.lunchFemales} Females</strong></span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-fantasyGold-950 border border-fantasyGold-400/30 text-fantasyGold-300">
                        Reserved
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Ceremonial Blessing */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center mt-20 space-y-4">
        <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fantasyGold-400 to-transparent" />
        <h3 className="font-decorative text-2xl text-gold-gradient font-bold">
          We Await Your Gracious Presence
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto">
          RSVP & Queries: {adminSettings.contactRsvp}
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              soundManager.playChime(600);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-full bg-slate-900/90 border border-celestial-400/30 hover:border-celestial-400 text-celestial-200 text-xs font-serif transition cursor-pointer"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>

    </div>
  );
};
