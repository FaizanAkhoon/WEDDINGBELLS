import React, { useState } from 'react';
import type { GuestInfo, AdminSettings } from '../types/wedding';
import { soundManager } from '../services/soundEffects';
import { Sparkles, Users, ShieldCheck, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';

interface GuestIntakeModalProps {
  isOpen: boolean;
  adminSettings: AdminSettings;
  initialGuestInfo: GuestInfo;
  onSave: (info: GuestInfo) => void;
  onClose?: () => void;
}

export const GuestIntakeModal: React.FC<GuestIntakeModalProps> = ({
  isOpen,
  adminSettings,
  initialGuestInfo,
  onSave,
}) => {
  const [name, setName] = useState(initialGuestInfo.name);
  const [mehandiMales, setMehandiMales] = useState(initialGuestInfo.mehandiMales);
  const [mehandiFemales, setMehandiFemales] = useState(initialGuestInfo.mehandiFemales);
  const [lunchMales, setLunchMales] = useState(initialGuestInfo.lunchMales);
  const [lunchFemales, setLunchFemales] = useState(initialGuestInfo.lunchFemales);
  const [notes, setNotes] = useState(initialGuestInfo.specialNotes || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalMehandi = mehandiMales + mehandiFemales;
  const totalLunch = lunchMales + lunchFemales;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name or family title to personalize your royal invitation.');
      soundManager.playChime(350);
      return;
    }

    if (totalMehandi > adminSettings.maxMehandiInvited) {
      setErrorMsg(
        `The host has reserved invitations for up to ${adminSettings.maxMehandiInvited} guests for Mehandi Raat. Currently selected: ${totalMehandi}.`
      );
      soundManager.playChime(350);
      return;
    }

    if (totalLunch > adminSettings.maxLunchInvited) {
      setErrorMsg(
        `The host has reserved invitations for up to ${adminSettings.maxLunchInvited} guests for Royal Lunch. Currently selected: ${totalLunch}.`
      );
      soundManager.playChime(350);
      return;
    }

    setErrorMsg(null);
    soundManager.playWaxSealCrack();

    onSave({
      name: name.trim(),
      mehandiMales,
      mehandiFemales,
      lunchMales,
      lunchFemales,
      submitted: true,
      specialNotes: notes.trim(),
    });
  };

  const loadPreset = (presetType: 'family' | 'couple' | 'solo') => {
    soundManager.playChime(660);
    if (presetType === 'family') {
      setName('The Hashmi Family');
      setMehandiMales(2);
      setMehandiFemales(2);
      setLunchMales(3);
      setLunchFemales(3);
    } else if (presetType === 'couple') {
      setName('Dr. Farhan & Sarah');
      setMehandiMales(1);
      setMehandiFemales(1);
      setLunchMales(1);
      setLunchFemales(1);
    } else {
      setName('Ayaan Raza');
      setMehandiMales(1);
      setMehandiFemales(0);
      setLunchMales(1);
      setLunchFemales(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-twilight-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Decorative Outer Aura */}
      <div className="relative w-full max-w-xl my-auto">
        {/* Background glow orb */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-celestial-400/40 via-fantasyGold-400/40 to-celestial-500/40 rounded-2xl blur-xl opacity-70 animate-pulse-glow" />

        {/* Modal Container */}
        <div className="relative bg-slate-950/95 border-2 border-celestial-300/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
          
          {/* Subtle floral watermark & corners */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-celestial-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fantasyGold-400/15 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="inline-flex items-center justify-center p-2 mb-2 rounded-full bg-celestial-950/70 border border-celestial-400/30 text-celestial-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-fantasyGold-300 animate-spin-very-slow" />
            </div>
            <h2 className="font-decorative text-2xl sm:text-3xl text-gold-gradient font-bold tracking-wide">
              Royal Guest Personalization
            </h2>
            <p className="text-xs sm:text-sm text-celestial-200/80 font-light mt-1 max-w-md mx-auto">
              Please declare your attending party to unveil your personalized letter envelope and celebration itinerary.
            </p>

            {/* Quick Test Presets */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400">Quick Fill:</span>
              <button
                type="button"
                onClick={() => loadPreset('family')}
                className="px-2.5 py-1 rounded-full bg-celestial-900/40 border border-celestial-500/30 hover:border-celestial-300 hover:bg-celestial-800/50 text-celestial-200 transition"
              >
                Family (4 & 6)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('couple')}
                className="px-2.5 py-1 rounded-full bg-celestial-900/40 border border-celestial-500/30 hover:border-celestial-300 hover:bg-celestial-800/50 text-celestial-200 transition"
              >
                Couple (2)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('solo')}
                className="px-2.5 py-1 rounded-full bg-celestial-900/40 border border-celestial-500/30 hover:border-celestial-300 hover:bg-celestial-800/50 text-celestial-200 transition"
              >
                Solo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guest Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-celestial-200 font-semibold mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-fantasyGold-300" />
                Guest / Family Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mr. Tariq Khan & Family"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-celestial-500/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-fantasyGold-400 focus:ring-1 focus:ring-fantasyGold-400 transition text-sm shadow-inner"
              />
            </div>

            {/* Event 1: Mehandi Raat Breakdown */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-celestial-950/50 border border-celestial-400/25 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-celestial-400 shadow-[0_0_8px_#2dd4bf]" />
                  <span className="font-serif text-sm font-semibold text-celestial-100">
                    Mehandi Raat (Night Event)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-celestial-900/70 border border-celestial-400/30 text-celestial-200">
                  Host Quota: Max {adminSettings.maxMehandiInvited}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Mehandi Males */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300 block mb-1.5">Males</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMehandiMales(Math.max(0, mehandiMales - 1))}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-celestial-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      -
                    </button>
                    <span className="font-semibold text-base text-fantasyGold-300">{mehandiMales}</span>
                    <button
                      type="button"
                      onClick={() => setMehandiMales(mehandiMales + 1)}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-celestial-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Mehandi Females */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300 block mb-1.5">Females</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMehandiFemales(Math.max(0, mehandiFemales - 1))}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-celestial-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      -
                    </button>
                    <span className="font-semibold text-base text-fantasyGold-300">{mehandiFemales}</span>
                    <button
                      type="button"
                      onClick={() => setMehandiFemales(mehandiFemales + 1)}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-celestial-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className={`text-[11px] ${totalMehandi > adminSettings.maxMehandiInvited ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                  Attending Mehandi: {totalMehandi} guest{totalMehandi === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Event 2: Royal Lunch Breakdown */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-celestial-950/50 border border-celestial-400/25 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-fantasyGold-400 shadow-[0_0_8px_#edd219]" />
                  <span className="font-serif text-sm font-semibold text-fantasyGold-100">
                    Grand Royal Lunch (Day Event)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-fantasyGold-950/70 border border-fantasyGold-400/30 text-fantasyGold-200">
                  Host Quota: Max {adminSettings.maxLunchInvited}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Lunch Males */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300 block mb-1.5">Males</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setLunchMales(Math.max(0, lunchMales - 1))}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-fantasyGold-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      -
                    </button>
                    <span className="font-semibold text-base text-fantasyGold-300">{lunchMales}</span>
                    <button
                      type="button"
                      onClick={() => setLunchMales(lunchMales + 1)}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-fantasyGold-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Lunch Females */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300 block mb-1.5">Females</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setLunchFemales(Math.max(0, lunchFemales - 1))}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-fantasyGold-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      -
                    </button>
                    <span className="font-semibold text-base text-fantasyGold-300">{lunchFemales}</span>
                    <button
                      type="button"
                      onClick={() => setLunchFemales(lunchFemales + 1)}
                      className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-fantasyGold-300 text-base font-bold flex items-center justify-center transition border border-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className={`text-[11px] ${totalLunch > adminSettings.maxLunchInvited ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                  Attending Lunch: {totalLunch} guest{totalLunch === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Optional Special Dietary / Blessing Note */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-celestial-400" />
                Special Dietary or Congratulatory Note (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Vegetarian preference, or congratulations to couple"
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-celestial-400"
              />
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit / Confirm Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-slate-950 bg-gradient-to-r from-fantasyGold-300 via-fantasyGold-400 to-celestial-300 hover:from-fantasyGold-200 hover:to-celestial-200 transition duration-300 shadow-gold-glow flex items-center justify-center gap-2 group cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Confirm & Illuminate Envelope</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-celestial-400" />
              Host Invitation Verification
            </span>
            <span className="text-fantasyGold-300 font-serif">
              {adminSettings.coupleNames.bride} & {adminSettings.coupleNames.groom}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
