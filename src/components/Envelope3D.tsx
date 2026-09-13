import React, { useState } from 'react';
import type { GuestInfo, AdminSettings } from '../types/wedding';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, Unlock } from 'lucide-react';

interface Envelope3DProps {
  guestInfo: GuestInfo;
  adminSettings: AdminSettings;
  isOpen: boolean;
  onOpenEnvelope: () => void;
  onRequestGuestDetails: () => void;
}

export const Envelope3D: React.FC<Envelope3DProps> = ({
  guestInfo,
  adminSettings,
  isOpen,
  onOpenEnvelope,
  onRequestGuestDetails,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);

  const handleWaxSealClick = () => {
    // If guest has not filled in their intake details yet, prompt the modal!
    if (!guestInfo.submitted) {
      soundManager.playChime(440);
      onRequestGuestDetails();
      return;
    }

    if (isOpen) return;

    setIsBreaking(true);
    soundManager.playWaxSealCrack();

    // Trigger celestial particle explosion
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2dd4bf', '#f5d06b', '#ffffff', '#0f766e', '#fae39d'],
    });

    setTimeout(() => {
      onOpenEnvelope();
      setIsBreaking(false);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto py-8 perspective-1000 flex flex-col items-center select-none">
      
      {/* Top hint or status pill */}
      <div className="mb-6 text-center animate-fade-in">
        {!guestInfo.submitted ? (
          <button
            onClick={onRequestGuestDetails}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-celestial-950/80 border border-celestial-400/40 text-celestial-200 hover:border-fantasyGold-400 hover:text-fantasyGold-200 text-xs font-serif shadow-celestial-glow transition duration-300 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-fantasyGold-300" />
            <span>Click to Personalize Guest Intake & Unlock</span>
          </button>
        ) : !isOpen ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-celestial-950/80 border border-fantasyGold-400/50 text-fantasyGold-200 text-xs font-serif shadow-gold-glow animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5 text-fantasyGold-300" />
            <span>Sealed for {guestInfo.name} • Tap the Golden Wax Seal to Open</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-celestial-400/30 text-celestial-300 text-xs font-serif">
            <Unlock className="w-3.5 h-3.5 text-celestial-300" />
            <span>Envelope Unfolded • 3 Royal Cards Emerge Below</span>
          </div>
        )}
      </div>

      {/* The 3D Envelope Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-[340px] sm:w-[420px] h-[240px] sm:h-[280px] rounded-2xl preserve-3d transition-all duration-700 ${
          isOpen ? 'translate-y-8 scale-95 opacity-90' : isHovered ? 'scale-105 shadow-gold-glow' : 'shadow-2xl'
        }`}
      >
        {/* Envelope Backplate & Lining */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#0e272a] via-[#091b1d] to-[#041012] border-2 border-celestial-400/40 shadow-2xl overflow-hidden">
          
          {/* Inner Silk Lining Pattern (Water Lilies watermark) */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Subtle gold filigree border inlay */}
          <div className="absolute inset-2 rounded-xl border border-fantasyGold-400/25 pointer-events-none" />
        </div>

        {/* 3 Peek Cards inside envelope pocket */}
        <div
          className={`absolute inset-x-6 top-3 transition-all duration-1000 ease-out z-10 ${
            isOpen ? '-translate-y-36 sm:-translate-y-44 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="w-full h-16 rounded-t-xl bg-gradient-to-r from-celestial-100 to-white border-t-2 border-x-2 border-fantasyGold-400/60 shadow-md flex items-center justify-center">
            <div className="text-center">
              <span className="font-decorative text-[11px] font-bold text-slate-800 tracking-wider">
                A CELESTIAL ROYAL UNION
              </span>
              <div className="w-16 h-0.5 mx-auto bg-fantasyGold-400/60 mt-0.5" />
            </div>
          </div>
        </div>

        {/* Left and Right Envelope Fold Flaps */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Left fold triangle */}
          <div
            className="absolute top-0 left-0 w-0 h-0 border-solid"
            style={{
              borderTopWidth: '140px',
              borderBottomWidth: '140px',
              borderLeftWidth: '180px',
              borderRightWidth: '0px',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: '#0a2327',
              borderRightColor: 'transparent',
              filter: 'drop-shadow(3px 0 6px rgba(0,0,0,0.5))',
            }}
          />

          {/* Right fold triangle */}
          <div
            className="absolute top-0 right-0 w-0 h-0 border-solid"
            style={{
              borderTopWidth: '140px',
              borderBottomWidth: '140px',
              borderLeftWidth: '0px',
              borderRightWidth: '180px',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: '#092125',
              filter: 'drop-shadow(-3px 0 6px rgba(0,0,0,0.5))',
            }}
          />

          {/* Bottom fold triangle */}
          <div
            className="absolute bottom-0 inset-x-0 w-0 h-0 mx-auto border-solid"
            style={{
              borderTopWidth: '0px',
              borderBottomWidth: '145px',
              borderLeftWidth: '210px',
              borderRightWidth: '210px',
              borderTopColor: 'transparent',
              borderBottomColor: '#07181c',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              filter: 'drop-shadow(0 -3px 8px rgba(0,0,0,0.6))',
            }}
          />
        </div>

        {/* Envelope Front Details & Calligraphy Address */}
        <div className="absolute inset-x-0 bottom-6 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <span className="font-handwriting text-fantasyGold-300 text-xl sm:text-2xl drop-shadow-md">
            Cordially Invited
          </span>
          <h3 className="font-serif text-slate-100 text-sm sm:text-base font-bold tracking-wider mt-0.5 max-w-xs truncate">
            {guestInfo.submitted ? guestInfo.name : 'Esteemed Honoured Guest'}
          </h3>
          <span className="text-[10px] sm:text-xs text-celestial-300/80 uppercase tracking-widest font-light mt-1">
            {adminSettings.coupleNames.bride} & {adminSettings.coupleNames.groom}
          </span>
        </div>

        {/* Top Triangular Flap (Folds open backwards in 3D) */}
        <div
          className={`absolute top-0 inset-x-0 mx-auto w-0 h-0 origin-top preserve-3d transition-transform duration-700 ease-in-out border-solid cursor-pointer ${
            isOpen ? '-rotate-x-180 z-0' : 'rotate-x-0 z-40'
          }`}
          style={{
            borderTopWidth: '145px',
            borderBottomWidth: '0px',
            borderLeftWidth: '210px',
            borderRightWidth: '210px',
            borderTopColor: isOpen ? '#041012' : '#0d2d32',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
          }}
          onClick={handleWaxSealClick}
        >
          <div className="absolute -top-[142px] -left-[200px] w-0 h-0 border-solid pointer-events-none opacity-40"
            style={{
              borderTopWidth: '140px',
              borderBottomWidth: '0px',
              borderLeftWidth: '200px',
              borderRightWidth: '200px',
              borderTopColor: '#f5d06b',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          />
        </div>

        {/* The Golden & Mint Wax Seal Crest Emblem */}
        {!isOpen && (
          <div
            onClick={handleWaxSealClick}
            className={`absolute top-[105px] sm:top-[125px] left-1/2 -translate-x-1/2 z-50 cursor-pointer transition-all duration-300 ${
              isBreaking ? 'scale-125 opacity-0' : isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-fantasyGold-400 via-celestial-300 to-fantasyGold-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300 animate-pulse-glow" />

              <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-fantasyGold-300 shadow-2xl overflow-hidden bg-gradient-to-br from-[#0c3137] via-[#051a1e] to-[#020b0d] flex items-center justify-center">
                <img
                  src="/assets/wax-seal-crest.jpg"
                  alt="Royal Wax Seal"
                  className="w-full h-full object-cover transform group-hover:rotate-12 transition-transform duration-500"
                />
              </div>

              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-950/90 border border-fantasyGold-400/40 text-[10px] text-fantasyGold-200 font-serif opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {guestInfo.submitted ? 'Break Seal & Open' : 'Fill Guest Info'}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
