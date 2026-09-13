import React, { useState } from 'react';
import { soundManager } from '../services/soundEffects';
import type { GuestInfo, AdminSettings } from '../types/wedding';
import { Volume2, VolumeX, Music, Settings, UserCheck, Layers, Mail } from 'lucide-react';

interface HeaderNavProps {
  guestInfo: GuestInfo;
  adminSettings: AdminSettings;
  activeView: 'envelope' | 'events';
  onViewChange: (view: 'envelope' | 'events') => void;
  onOpenGuestModal: () => void;
  onOpenAdminPanel: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  guestInfo,
  adminSettings,
  activeView,
  onViewChange,
  onOpenGuestModal,
  onOpenAdminPanel,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(soundManager.isMusicPlaying());

  const handleToggleSound = () => {
    const nextMute = !isMuted;
    soundManager.setMuted(nextMute);
    setIsMuted(nextMute);
    if (nextMute) {
      setIsMusicPlaying(false);
    } else {
      soundManager.playChime(660);
    }
  };

  const handleToggleMusic = () => {
    if (isMuted) {
      soundManager.setMuted(false);
      setIsMuted(false);
    }
    const playing = soundManager.toggleBgm();
    setIsMusicPlaying(playing);
    if (!playing) {
      soundManager.playChime(440);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-twilight-950/70 backdrop-blur-md border-b border-celestial-400/20 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Branding & Couple Monogram */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-fantasyGold-400/60 bg-celestial-950/80 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <img
              src="/assets/wax-seal-crest.jpg"
              alt="Crest"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <span className="font-decorative text-xs sm:text-sm font-bold text-gold-gradient tracking-wide block">
              {adminSettings.coupleNames.bride} & {adminSettings.coupleNames.groom}
            </span>
            <span className="text-[10px] text-celestial-300/80 hidden sm:block font-light">
              Royal Wedding Invitation
            </span>
          </div>
        </div>

        {/* Center: View Switcher (Envelope vs Events) */}
        <div className="flex items-center p-1 rounded-full bg-slate-900/80 border border-celestial-500/30 shadow-inner">
          <button
            onClick={() => {
              soundManager.playChime(520);
              onViewChange('envelope');
            }}
            className={`px-3 py-1 rounded-full text-xs font-serif font-semibold flex items-center gap-1.5 transition ${
              activeView === 'envelope'
                ? 'bg-gradient-to-r from-celestial-500 to-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Invitation</span>
          </button>
          <button
            onClick={() => {
              soundManager.playChime(580);
              onViewChange('events');
            }}
            className={`px-3 py-1 rounded-full text-xs font-serif font-semibold flex items-center gap-1.5 transition ${
              activeView === 'events'
                ? 'bg-gradient-to-r from-celestial-500 to-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Events Page</span>
          </button>
        </div>

        {/* Right: Guest Checkin, Ambient Music, Sound, Admin Panel */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Guest Personalize Button */}
          <button
            onClick={() => {
              soundManager.playChime(500);
              onOpenGuestModal();
            }}
            title="Edit Guest Name & RSVP"
            className="px-2.5 py-1.5 rounded-xl bg-celestial-950/60 hover:bg-celestial-900/80 border border-celestial-400/30 text-celestial-200 hover:text-celestial-100 text-xs font-serif flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-fantasyGold-300" />
            <span className="hidden md:inline">
              {guestInfo.submitted ? guestInfo.name : 'Personalize'}
            </span>
          </button>

          {/* Ambient BGM Toggle */}
          <button
            onClick={handleToggleMusic}
            title={isMusicPlaying ? 'Stop Ambient Harp Music' : 'Play Ambient Harp Music'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isMusicPlaying
                ? 'bg-celestial-500/20 border-celestial-400 text-celestial-200 shadow-celestial-glow animate-pulse'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Mute/Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-celestial-300" />}
          </button>

          {/* Host Admin Drawer Trigger */}
          <button
            onClick={() => {
              soundManager.playChime(600);
              onOpenAdminPanel();
            }}
            title="Host Admin Panel (Configure Wedding Details & Quotas)"
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-fantasyGold-400/40 text-fantasyGold-300 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
