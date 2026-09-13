import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GuestInfo, AdminSettings, WeddingEvent } from './types/wedding';
import { initialAdminSettings, weddingEvents } from './data/weddingData';
import { CelestialLineArtCouples } from './components/CelestialLineArtCouples';
import {
  MapPin, Calendar, Clock, Sparkles, Heart, Sun,
  Music, Utensils, X, ChevronRight, Palette,
  CheckCircle2, ArrowRight, Compass, Users, Phone,
} from 'lucide-react';

/* ─── ICON MAP ────────────────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Sun:      <Sun className="w-4 h-4" />,
  Music:    <Music className="w-4 h-4" />,
  Heart:    <Heart className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
};

/* ─── SVG DECORATIONS ─────────────────────────────────────────────── */
const LotusMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 60 40" className={className} fill="none">
    <path d="M30 36 C30 36 14 28 14 16 C14 10 22 6 30 14 C38 6 46 10 46 16 C46 28 30 36 30 36Z"
      stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M30 36 C30 36 20 22 20 12 C20 8 24 6 28 9" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <path d="M30 36 C30 36 40 22 40 12 C40 8 36 6 32 9" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

const CelestialCrest: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="currentColor">
    <path d="M20 2 L21.5 11 L30 8 L24 15 L32 18 L23 20 L28 28 L20 23 L12 28 L17 20 L8 18 L16 15 L10 8 L18.5 11 Z"
      opacity="0.9"/>
    <circle cx="20" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
  </svg>
);

const DiamondDivider: React.FC<{ className?: string; color?: string }> = ({ className = '', color = 'rgba(160,130,60,0.6)' }) => (
  <div className={`ornament-divider ${className}`}>
    <div className="line" />
    <div className="ornament-diamond" style={{ background: color }} />
    <div className="ornament-diamond" style={{ background: color, width: 4, height: 4 }} />
    <div className="ornament-diamond" style={{ background: color }} />
    <div className="line" />
  </div>
);

/* ─── COUNTER WIDGET ──────────────────────────────────────────────── */
const Counter: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}> = ({ label, value, onChange, max = 10 }) => (
  <div className="flex items-center justify-between py-2">
    <span className="font-cormorant text-sm text-amber-900/80">{label}</span>
    <div className="flex items-center gap-3">
      <button type="button" className="counter-btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <span className="w-6 text-center font-cinzel font-bold text-sm text-amber-800">{value}</span>
      <button type="button" className="counter-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   GUEST FORM
   ═══════════════════════════════════════════════════════════════════ */
interface GuestFormProps { admin: AdminSettings; onSubmit: (g: GuestInfo) => void; }

const GuestForm: React.FC<GuestFormProps> = ({ admin, onSubmit }) => {
  const [name, setName]   = useState('');
  const [mm, setMm]       = useState(1);
  const [mf, setMf]       = useState(1);
  const [lm, setLm]       = useState(1);
  const [lf, setLf]       = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name or family name.'); return; }
    if (mm + mf > admin.maxMehandiInvited) {
      setError(`Mehandi Raat is limited to ${admin.maxMehandiInvited} guests from your party.`); return;
    }
    if (lm + lf > admin.maxLunchInvited) {
      setError(`Lunch Reception is limited to ${admin.maxLunchInvited} guests from your party.`); return;
    }
    setError('');
    onSubmit({ name: name.trim(), mehandiMales: mm, mehandiFemales: mf, lunchMales: lm, lunchFemales: lf, submitted: true });
  };

  return (
    <div className="form-backdrop" role="dialog" aria-modal="true" aria-label="Guest Information Form">
      <div className="form-card">
        {/* Header */}
        <div className="px-7 pt-8 pb-4 text-center">
          <LotusMark className="w-12 h-8 text-amber-600/50 mx-auto mb-2" />
          <p className="font-cinzel text-[10px] tracking-[0.3em] text-amber-700/70 uppercase mb-1">
            {admin.tagline}
          </p>
          <h2 className="font-greatvibes text-3xl text-amber-800 leading-tight">
            {admin.coupleNames.bride} & {admin.coupleNames.groom}
          </h2>
          <DiamondDivider className="mt-3 mb-1" />
          <p className="font-cormorant italic text-amber-900/60 text-sm mt-2">
            Kindly share your attending details so we may<br/>personalise your invitation
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.15em] text-amber-800/80 uppercase mb-1.5">
              Guest / Family Name
            </label>
            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. The Khan Family"
              className="parchment-input"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Mehandi */}
          <div className="rounded-xl border border-amber-200/50 bg-amber-50/40 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-amber-800">
                Mehandi Raat
              </span>
              <span className="ml-auto font-cormorant text-[11px] text-amber-600/60">
                Up to {admin.maxMehandiInvited} guests
              </span>
            </div>
            <div className="divide-y divide-amber-200/30">
              <Counter label="Gentlemen" value={mm} onChange={setMm} max={admin.maxMehandiInvited} />
              <Counter label="Ladies"    value={mf} onChange={setMf} max={admin.maxMehandiInvited} />
            </div>
            <p className="text-right font-cinzel text-[10px] text-amber-700/60 mt-1">
              Total: {mm + mf}
            </p>
          </div>

          {/* Lunch */}
          <div className="rounded-xl border border-teal-200/50 bg-teal-50/30 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-teal-800">
                Royal Lunch Reception
              </span>
              <span className="ml-auto font-cormorant text-[11px] text-teal-600/60">
                Up to {admin.maxLunchInvited} guests
              </span>
            </div>
            <div className="divide-y divide-teal-200/30">
              <Counter label="Gentlemen" value={lm} onChange={setLm} max={admin.maxLunchInvited} />
              <Counter label="Ladies"    value={lf} onChange={setLf} max={admin.maxLunchInvited} />
            </div>
            <p className="text-right font-cinzel text-[10px] text-teal-700/60 mt-1">
              Total: {lm + lf}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700 font-cormorant">
              {error}
            </div>
          )}

          <button type="submit" className="gold-btn mt-1">
            <span>Seal My Invitation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DESTINATION CARD PANEL
   ═══════════════════════════════════════════════════════════════════ */
const DestinationPanel: React.FC<{ admin: AdminSettings; onClose: () => void }> = ({ admin, onClose }) => (
  <div className="sheet-backdrop" onClick={onClose}>
    <div className="detail-sheet" onClick={e => e.stopPropagation()}>
      {/* Close — sticky so stays visible when sheet scrolls */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0', marginBottom: '-8px', pointerEvents: 'none' }}>
        <button onClick={onClose} id="close-destination"
          style={{ pointerEvents: 'all' }}
          className="w-8 h-8 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 flex items-center justify-center text-amber-700 transition cursor-pointer shadow-sm">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-amber-100 border border-amber-300/40 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Compass className="w-6 h-6 text-teal-700" />
        </div>
        <p className="font-cinzel text-[10px] tracking-[0.25em] text-amber-600/80 uppercase">Destination</p>
        <h3 className="font-greatvibes text-3xl text-amber-800 mt-0.5 leading-tight">
          The City of Lakes
        </h3>
        <p className="font-cinzel text-[11px] text-amber-700/60 mt-0.5 tracking-wide">{admin.destinationCity}, {admin.destinationState}</p>
        <DiamondDivider className="mt-3 mb-1" />
      </div>

      <div className="px-6 pb-7 space-y-3 relative z-10">
        {/* Venue */}
        <div className="info-chip">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <p className="font-cinzel text-[9px] tracking-wider text-amber-600/70 uppercase leading-none mb-0.5">Venue</p>
            <p className="font-cormorant text-sm text-amber-900 leading-snug">{admin.venueName}</p>
          </div>
        </div>
        <a 
          href="https://maps.app.goo.gl/FufFFt72pZtGEZfx7" 
          target="_blank" 
          rel="noopener noreferrer"
          className="info-chip hover:bg-amber-100/50 hover:border-amber-300/60 transition group cursor-pointer block !flex"
        >
          <MapPin className="w-4 h-4 text-amber-500 shrink-0 opacity-60 group-hover:text-amber-600 transition" />
          <div className="flex-1">
            <p className="font-cormorant text-sm text-amber-800/80 group-hover:text-amber-900 transition">{admin.venueAddress}</p>
            <p className="font-cinzel text-[8px] tracking-wider text-amber-600/60 uppercase mt-0.5 group-hover:text-amber-700/80 transition">Open in Maps ↗</p>
          </div>
        </a>

        {/* Description */}
        <p className="font-cormorant italic text-sm text-amber-900/70 leading-relaxed px-1 pt-1">
          Nestled in the lush valleys of Kashmir, enveloped by fragrant pine forests and framed by the snow-capped Himalayan peaks at golden hour — a pristine venue where time pauses and magic unfolds.
        </p>

        <DiamondDivider className="my-1" />

        {/* Travel */}
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-amber-700/70 mb-2 flex items-center gap-1.5">
            <Compass className="w-3 h-3" /> Travel Connections
          </p>
          {[
            'Airport: Srinagar (SXR) — 1.5 hr drive',
            'Railway: Anantnag Station — 10 min drive',
            'Complimentary shuttle service on arrival',
            'Guest accommodation arranged on request',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-amber-200/30 last:border-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
              <p className="font-cormorant text-sm text-amber-900/80">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   CEREMONY CARD PANEL
   ═══════════════════════════════════════════════════════════════════ */
const CeremonyPanel: React.FC<{ admin: AdminSettings; guest: GuestInfo; onClose: () => void }> = ({ admin, guest, onClose }) => (
  <div className="sheet-backdrop" onClick={onClose}>
    <div className="detail-sheet" onClick={e => e.stopPropagation()}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0', marginBottom: '-8px', pointerEvents: 'none' }}>
        <button onClick={onClose} id="close-ceremony"
          style={{ pointerEvents: 'all' }}
          className="w-8 h-8 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 flex items-center justify-center text-amber-700 transition cursor-pointer shadow-sm">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 border border-amber-300/40 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Calendar className="w-6 h-6 text-amber-700" />
        </div>
        <p className="font-cinzel text-[10px] tracking-[0.25em] text-amber-600/80 uppercase">Sacred Union</p>
        <h3 className="font-greatvibes text-3xl text-amber-800 mt-0.5 leading-tight">
          Date & Ceremony
        </h3>
        <DiamondDivider className="mt-3 mb-1" />
      </div>

      <div className="px-6 pb-7 space-y-3 relative z-10">
        {/* Date */}
        <div className="text-center py-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-rose-50/50 border border-amber-200/40">
          <p className="font-cinzel text-xs tracking-[0.2em] text-amber-600/70 uppercase mb-1">The Auspicious Day</p>
          <p className="font-cormorant text-xl font-semibold text-amber-900">{admin.weddingDateFormatted}</p>
          <p className="font-cormorant italic text-sm text-amber-700/70 mt-0.5">Sunset Sacred Ceremony · 05:30 PM</p>
        </div>

        {/* Chips */}
        <div className="grid grid-cols-2 gap-2">
          <div className="info-chip">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <p className="font-cinzel text-[9px] tracking-wide text-amber-600/60 uppercase">Time</p>
              <p className="font-cormorant text-sm text-amber-900">05:30 PM</p>
            </div>
          </div>
          <div className="info-chip">
            <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
            <div>
              <p className="font-cinzel text-[9px] tracking-wide text-amber-600/60 uppercase">Venue</p>
              <p className="font-cormorant text-sm text-amber-900 truncate">Lake Pavilion</p>
            </div>
          </div>
        </div>

        {/* Warm wishes */}
        <div className="rounded-xl bg-gradient-to-br from-amber-50/60 to-teal-50/40 border border-amber-200/40 px-4 py-4">
          <p className="font-cinzel text-[9px] tracking-[0.2em] text-amber-600/70 uppercase mb-2 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-rose-400" /> With Warm Wishes
          </p>
          <p className="font-cormorant italic text-sm text-amber-900/80 leading-relaxed">
            "{admin.warmWishesMessage}"
          </p>
          <p className="font-cinzel text-[10px] text-amber-700/60 mt-3 text-right">{admin.familyNames}</p>
        </div>

        <DiamondDivider className="my-1" />

        {/* Guest allocation */}
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-amber-700/70 mb-2 flex items-center gap-1.5">
            <Users className="w-3 h-3" /> Your Reserved Seats
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-amber-200/40 bg-amber-50/40 p-3 text-center">
              <p className="font-cinzel text-[9px] tracking-wide text-amber-600/70 uppercase">Mehandi Raat</p>
              <p className="font-cormorant text-lg font-semibold text-amber-800 mt-0.5">
                {guest.mehandiMales}M · {guest.mehandiFemales}F
              </p>
              <p className="font-cinzel text-[9px] text-amber-500/70 mt-0.5">Confirmed ✓</p>
            </div>
            <div className="rounded-xl border border-teal-200/40 bg-teal-50/30 p-3 text-center">
              <p className="font-cinzel text-[9px] tracking-wide text-teal-600/70 uppercase">Lunch Reception</p>
              <p className="font-cormorant text-lg font-semibold text-teal-800 mt-0.5">
                {guest.lunchMales}M · {guest.lunchFemales}F
              </p>
              <p className="font-cinzel text-[9px] text-teal-500/70 mt-0.5">Confirmed ✓</p>
            </div>
          </div>
        </div>

        {/* RSVP */}
        <div className="info-chip text-xs">
          <Phone className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="font-cinzel text-[9px] tracking-wide text-amber-600/60 uppercase">RSVP & Enquiries</p>
            <p className="font-cormorant text-sm text-amber-900">{admin.contactRsvp}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SINGLE EVENT DETAIL PANEL
   ═══════════════════════════════════════════════════════════════════ */
const SingleEventPanel: React.FC<{ event: WeddingEvent; guest: GuestInfo; onClose: () => void }> = ({ event, guest, onClose }) => (
  <div className="sheet-backdrop" onClick={onClose}>
    <div className="detail-sheet" onClick={e => e.stopPropagation()}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0', marginBottom: '-8px', pointerEvents: 'none' }}>
        <button onClick={onClose}
          style={{ pointerEvents: 'all' }}
          className="w-8 h-8 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 flex items-center justify-center text-amber-700 transition cursor-pointer shadow-sm">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-amber-100 border border-amber-300/40 flex items-center justify-center mx-auto mb-3 shadow-md text-amber-600">
          {ICON_MAP[event.icon] ?? ICON_MAP.Sparkles}
        </div>
        <p className="font-cinzel text-[10px] tracking-[0.25em] text-amber-600/80 uppercase">{event.subTitle}</p>
        <h3 className="font-greatvibes text-3xl text-amber-800 mt-0.5">{event.title}</h3>
        <DiamondDivider className="mt-3 mb-1" />
      </div>

      <div className="px-6 pb-7 space-y-3 relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <div className="info-chip">
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="font-cormorant text-xs text-amber-900 leading-snug">{event.date}</p>
          </div>
          <div className="info-chip">
            <Clock className="w-4 h-4 text-teal-500 shrink-0" />
            <p className="font-cormorant text-xs text-amber-900">{event.time}</p>
          </div>
        </div>
        <div className="info-chip">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="font-cormorant text-sm text-amber-900">{event.venue}</p>
        </div>

        <p className="font-cormorant italic text-sm text-amber-900/75 leading-relaxed px-1">{event.description}</p>

        <DiamondDivider className="my-1" />

        {/* Highlights */}
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-amber-700/70 mb-2 flex items-center gap-1.5">
            <CelestialCrest className="w-3 h-3" /> Highlights
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {event.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-amber-50/50 rounded-lg px-2.5 py-2 border border-amber-200/30">
                <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0" />
                <p className="font-cormorant text-xs text-amber-900/80">{h}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dress code & palette */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-amber-200/30">
          <div>
            <p className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-amber-600/70 flex items-center gap-1 mb-0.5">
              <Palette className="w-3 h-3" /> Dress Code
            </p>
            <p className="font-cormorant text-sm font-semibold text-amber-800">{event.dressCode}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {event.colorPalette.map((c, i) => (
              <div key={i} title={c.name} className="colour-dot" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>

        {/* Reservation notice */}
        {event.id === 'mehandi' && (
          <div className="info-chip bg-amber-50/60 border-amber-200/50 justify-between">
            <p className="font-cormorant text-sm text-amber-900">Your party: <strong>{guest.mehandiMales}M + {guest.mehandiFemales}F</strong></p>
            <span className="font-cinzel text-[9px] bg-teal-100 text-teal-700 px-2 py-1 rounded-full ml-auto">Reserved ✓</span>
          </div>
        )}
        {event.id === 'lunch' && (
          <div className="info-chip bg-teal-50/50 border-teal-200/40 justify-between">
            <p className="font-cormorant text-sm text-amber-900">Your party: <strong>{guest.lunchMales}M + {guest.lunchFemales}F</strong></p>
            <span className="font-cinzel text-[9px] bg-teal-100 text-teal-700 px-2 py-1 rounded-full ml-auto">Reserved ✓</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   EVENTS ITINERARY PANEL
   ═══════════════════════════════════════════════════════════════════ */
const ItineraryPanel: React.FC<{ guest: GuestInfo; admin: AdminSettings; onClose: () => void }> = ({ guest, admin, onClose }) => {
  const [activeEvent, setActiveEvent] = useState<WeddingEvent | null>(null);

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="detail-sheet" onClick={e => e.stopPropagation()}>
          <div style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0', marginBottom: '-8px', pointerEvents: 'none' }}>
            <button onClick={onClose} id="close-itinerary"
              style={{ pointerEvents: 'all' }}
              className="w-8 h-8 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 flex items-center justify-center text-amber-700 transition cursor-pointer shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-7 pb-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 border border-amber-300/40 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <p className="font-cinzel text-[10px] tracking-[0.25em] text-amber-600/80 uppercase">Full Schedule</p>
            <h3 className="font-greatvibes text-3xl text-amber-800 mt-0.5">Celebration Itinerary</h3>
            <p className="font-cormorant italic text-xs text-amber-700/60 mt-1">Tap any event to view full details</p>
            <DiamondDivider className="mt-3 mb-1" />
          </div>

          <div className="px-5 pb-6 space-y-2 relative z-10">
            {weddingEvents.map((ev, idx) => (
              <button
                key={ev.id}
                id={`event-row-${ev.id}`}
                className="event-row w-full text-left"
                onClick={() => setActiveEvent(ev)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-teal-100 border border-amber-200/40 flex items-center justify-center shrink-0 text-amber-700">
                  {ICON_MAP[ev.icon] ?? ICON_MAP.Sparkles}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-[9px] tracking-wider text-amber-500/80 uppercase">Day {idx + 1}</p>
                  <p className="font-cormorant font-semibold text-sm text-amber-900 truncate">{ev.title}</p>
                  <p className="font-cormorant text-xs text-amber-700/60 truncate">{ev.date}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            ))}

            <DiamondDivider className="pt-2" />
            <div className="info-chip mt-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="font-cormorant text-xs text-amber-800">{admin.contactRsvp}</p>
            </div>
          </div>
        </div>
      </div>

      {activeEvent && (
        <SingleEventPanel event={activeEvent} guest={guest} onClose={() => setActiveEvent(null)} />
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
type CardIdx = 0 | 1 | 2;

const App: React.FC = () => {
  const [admin]                     = useState<AdminSettings>(initialAdminSettings);
  
  const [guest, setGuest] = useState<GuestInfo | null>(() => {
    const params = new URLSearchParams(window.location.search);
    // Show the form ONLY if accessed via admin link
    if (params.get('admin') === 'true') {
      return null;
    }
    // Normal guests bypass the form automatically
    const nameParam = params.get('name');
    return {
      name: nameParam ? nameParam : 'Honoured Guest',
      mehandiMales: 1, mehandiFemales: 1,
      lunchMales: 1, lunchFemales: 1,
      submitted: false,
    };
  });

  const [isOpen, setIsOpen]         = useState(false);
  const [openCard, setOpenCard]     = useState<CardIdx | null>(null);
  const envelopeRef                 = useRef<HTMLDivElement>(null);

  // Prevent body scroll when a panel is open
  useEffect(() => {
    document.body.style.overflow = (openCard !== null) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openCard]);

  const handleGuestSubmit = useCallback((g: GuestInfo) => {
    // Guard against duplicate submissions (React StrictMode dev behaviour)
    setGuest(prev => {
      if (prev) return prev; // already set, ignore duplicate call
      return g;
    });
  }, []);

  const openEnvelope = useCallback(() => {
    if (!guest || isOpen) return;
    setIsOpen(true);
  }, [guest, isOpen]);

  /* Card definitions */
  const CARDS = [
    {
      id: 'destination',
      label: 'Destination',
      sublabel: 'Udaipur, Rajasthan',
      icon: <Compass className="w-5 h-5 text-teal-700" />,
      hints: [admin.destinationCity, admin.venueName.split('&')[0].trim(), 'Travel details →'],
      color: 'from-teal-100 to-cyan-50',
    },
    {
      id: 'ceremony',
      label: 'Ceremony',
      sublabel: 'Date & Warm Wishes',
      icon: <Calendar className="w-5 h-5 text-amber-700" />,
      hints: ['Nov 28, 2026', 'Sunset · 05:30 PM', 'Your seats →'],
      color: 'from-amber-100 to-yellow-50',
    },
    {
      id: 'events',
      label: 'Events',
      sublabel: `${weddingEvents.length} Celebrations`,
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      hints: ['Mehandi Raat', 'Sangeet · Nikah', 'Dawat-e-Walima'],
      color: 'from-rose-100 to-pink-50',
    },
  ] as const;

  const hint = !guest
    ? 'Enter your details to receive your personalised invitation'
    : !isOpen
    ? 'Tap the wax seal to unveil your invitation'
    : 'Tap a card to unfold the details';

  return (
    <div className="page-bg relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="mist-layer" />

      {/* ── WHITE LINE-ART BRIDE (LEFT) & GROOM (RIGHT) WITH CIRCUIT OF LIGHT REVEAL ── */}
      <CelestialLineArtCouples />

      {/* Ambient colour orbs */}
      <div className="glow-orb w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] -top-[10%] -right-[8%]"
        style={{ background: 'radial-gradient(circle, rgba(13,110,100,0.28) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[35vw] h-[35vw] max-w-[260px] max-h-[260px] -bottom-[12%] -left-[6%]"
        style={{ background: 'radial-gradient(circle, rgba(180,130,20,0.18) 0%, transparent 70%)' }} />

      {/* ── HEADER TITLE ── */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 px-4 anim-fade-up">
        {/* Soft backdrop so names stay legible over the arch line art */}
        <div style={{
          position: 'absolute', inset: '-12px -24px',
          background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(2,22,26,0.55) 0%, transparent 75%)',
          borderRadius: '40%',
          pointerEvents: 'none',
        }} />
        <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.35em] text-teal-300/70 uppercase mb-2">
          {admin.tagline}
        </p>
        <h1 className="font-greatvibes leading-none" style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.7))' }}>
          <span className="block gold-text" style={{ fontSize: 'clamp(32px, 9vw, 58px)' }}>
            {admin.coupleNames.bride}
          </span>
          <span className="block font-cinzel text-amber-400/60 tracking-[0.5em] my-0.5" style={{ fontSize: 'clamp(9px, 2vw, 13px)' }}>
            &amp;
          </span>
          <span className="block gold-text" style={{ fontSize: 'clamp(32px, 9vw, 58px)' }}>
            {admin.coupleNames.groom}
          </span>
        </h1>
        <p className="font-cormorant italic text-amber-300/40 text-xs mt-3 tracking-[0.3em]">✦ &nbsp; ✦ &nbsp; ✦</p>
      </div>

      {/* ── ENVELOPE STAGE ── */}
      <div className={`relative z-10 anim-fade-up delay-200 anim-float transition-all duration-700 ${isOpen ? 'mt-52 sm:mt-32' : 'mt-40 sm:mt-6'}`}>
        <div
          ref={envelopeRef}
          className="envelope-stage"
          role="button"
          aria-label="Wedding envelope — tap the seal to open"
          tabIndex={0}
          onClick={openEnvelope}
          onKeyDown={e => e.key === 'Enter' && openEnvelope()}
        >
          {/* Paper base */}
          <div className="env-base">
            {/* 1. Inner Liner / Backwall (z-index: 1) */}
            <div className="env-inner-liner" />

            {/* 2. Top Flap (z-index: 15 when sealed, z-index: 2 when open) */}
            <div className={`env-flap-wrapper ${isOpen ? 'flap-open' : ''}`}>
              <div className="env-flap-front" />
              <div className="env-flap-back" />
            </div>

            {/* 3. CARDS POCKET (z-index: 5) — sits inside pocket, emerging upwards */}
            <div className={`cards-pocket ${isOpen ? 'peeking' : 'tucked'}`}>
              {CARDS.map((card, i) => (
                <div
                  key={card.id}
                  id={`card-${card.id}`}
                  className="inv-card"
                  role="button"
                  aria-label={`${card.label} — tap to open details`}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={e => {
                    e.stopPropagation();
                    if (isOpen) setOpenCard(i as CardIdx);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && isOpen) setOpenCard(i as CardIdx);
                  }}
                >
                  <div className="inv-card-content">
                    {/* Coloured icon area */}
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} border border-amber-200/50 flex items-center justify-center mb-1.5 shadow-sm`}>
                      {card.icon}
                    </div>
                    {/* Label */}
                    <p className="font-cinzel text-[9px] sm:text-[10px] font-bold text-amber-900 leading-tight tracking-wide">
                      {card.label}
                    </p>
                    <p className="font-cormorant text-[8px] sm:text-[9px] italic text-amber-700/60 leading-tight mt-0.5">
                      {card.sublabel}
                    </p>
                    {/* Hint lines */}
                    <div className="w-full mt-2 space-y-0.5 px-0.5">
                      {card.hints.map((h, hi) => (
                        <p key={hi} className="font-cormorant text-[7px] sm:text-[8px] text-amber-800/55 leading-tight truncate text-left">
                          {h}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Envelope Front Folds (z-index: 10 & 11) — sitting IN FRONT of cards */}
            <div className="env-left-fold" />
            <div className="env-right-fold" />
            <div className="env-bottom-fold" />

            {/* Calligraphy address line — shown when sealed */}
            {!isOpen && (
              <div className="absolute inset-0 z-[12] flex flex-col items-center justify-end pb-[12%] pointer-events-none">
                <p className="font-greatvibes text-amber-800/55" style={{ fontSize: 'clamp(14px, 4vw, 22px)' }}>
                  Cordially Invited
                </p>
                <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] text-amber-700/40 uppercase mt-1 truncate max-w-[70%]">
                  {guest?.name ?? 'Honoured Guest'}
                </p>
              </div>
            )}

            {/* 5. WAX SEAL (z-index: 20) */}
            <div
              id="wax-seal"
              className={`wax-seal ${isOpen ? 'seal-broken' : ''}`}
              role="button"
              aria-label="Tap to break the seal and open your invitation"
              tabIndex={isOpen ? -1 : 0}
              onClick={e => { e.stopPropagation(); openEnvelope(); }}
              onKeyDown={e => e.key === 'Enter' && openEnvelope()}
            >
              <img src="/wax-seal.png" alt="Wax Seal" className="wax-seal-img" />
            </div>
          </div>
        </div>
      </div>

      {/* ── HINT TEXT ── */}
      <p className="relative z-10 font-cormorant italic text-teal-200/50 text-sm text-center mt-5 px-4 anim-fade-up delay-300">
        {hint}
      </p>

      {/* ══════════════ OVERLAYS ══════════════ */}

      {/* Guest form */}
      {!guest && <GuestForm admin={admin} onSubmit={handleGuestSubmit} />}

      {/* Card 0: Destination */}
      {openCard === 0 && guest && (
        <DestinationPanel admin={admin} onClose={() => setOpenCard(null)} />
      )}

      {/* Card 1: Ceremony / Date / Warm Wishes */}
      {openCard === 1 && guest && (
        <CeremonyPanel admin={admin} guest={guest} onClose={() => setOpenCard(null)} />
      )}

      {/* Card 2: Events itinerary */}
      {openCard === 2 && guest && (
        <ItineraryPanel guest={guest} admin={admin} onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
};

export default App;
