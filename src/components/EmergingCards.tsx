import React, { useState, useEffect } from 'react';
import type { GuestInfo, AdminSettings } from '../types/wedding';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Compass,
  Calendar,
  Clock,
  Heart,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  Info
} from 'lucide-react';

interface EmergingCardsProps {
  guestInfo: GuestInfo;
  adminSettings: AdminSettings;
  onExploreParallaxEvents: () => void;
}

export const EmergingCards: React.FC<EmergingCardsProps> = ({
  guestInfo,
  adminSettings,
  onExploreParallaxEvents,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [blessingSent, setBlessingSent] = useState<boolean>(false);
  const [blessingCount, setBlessingCount] = useState<number>(142);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live countdown to wedding date
  useEffect(() => {
    const targetDate = new Date(adminSettings.weddingDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [adminSettings.weddingDate]);

  // Handle card switch with sound
  const handleSelectCard = (index: number) => {
    soundManager.playCardSlide(1 + index * 0.15);
    setActiveCardIndex(index);
  };

  // Handle send blessings celebration
  const handleSendBlessings = () => {
    if (blessingSent) return;
    setBlessingSent(true);
    setBlessingCount((c) => c + 1);
    soundManager.playWaxSealCrack();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#5eead4', '#f5d06b', '#ffffff', '#0d9488'],
    });
  };

  // Generate .ics calendar download
  const handleDownloadCalendar = () => {
    soundManager.playChime(600);
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Celestial Union//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Wedding Celebration: ${adminSettings.coupleNames.bride} & ${adminSettings.coupleNames.groom}`,
      `DESCRIPTION:Join us for the celestial wedding union and grand festivities.\\nInvited: ${guestInfo.name}\\nDetails: Mehandi Raat & Royal Lunch.`,
      `LOCATION:${adminSettings.venueName}, ${adminSettings.venueAddress}`,
      'DTSTART:20261128T130000Z',
      'DTEND:20261128T180000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'celestial-wedding-invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in relative z-20">
      
      {/* Three Cards Tab Bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
        {[
          { id: 0, title: 'I. Destination', subtitle: 'Location & Travel', icon: MapPin },
          { id: 1, title: 'II. Date & Venue', subtitle: 'Timings & Schedule', icon: Calendar },
          { id: 2, title: 'III. Warm Wishes', subtitle: 'Guest Allocation', icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCardIndex === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectCard(tab.id)}
              className={`group relative px-4 sm:px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                isActive
                  ? 'bg-slate-900/90 border-2 border-celestial-400 text-celestial-200 shadow-celestial-glow scale-105'
                  : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-celestial-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-celestial-400/20 text-fantasyGold-300 border border-celestial-400/40'
                    : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block font-serif text-sm font-bold tracking-wide">
                  {tab.title}
                </span>
                <span className="block text-[11px] text-slate-400 font-light">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Card Display Container */}
      <div className="relative w-full min-h-[580px] sm:min-h-[520px] transition-all duration-500">

        {/* ========================================================================= */}
        {/* CARD 1: DESTINATION AND LOCATION */}
        {/* ========================================================================= */}
        <div
          className={`transition-all duration-500 transform ${
            activeCardIndex === 0
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto block'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none hidden'
          }`}
        >
          <div className="relative rounded-3xl border-2 border-celestial-300/40 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Header Art Showcase */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden border-b border-celestial-400/30">
              <img
                src="/assets/destination-palace.jpg"
                alt="Destination Palace Gazebo"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-fantasyGold-400/50 backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-fantasyGold-300" />
                <span className="text-xs font-serif font-semibold text-fantasyGold-200 tracking-wider uppercase">
                  Destination Showcase
                </span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 text-celestial-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{adminSettings.destinationCity}, {adminSettings.destinationState}</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-gold-gradient font-bold drop-shadow">
                  {adminSettings.venueName}
                </h3>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Location overview */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-celestial-900/50 border border-celestial-400/30 text-celestial-300 shrink-0 mt-1">
                      <Compass className="w-5 h-5 text-fantasyGold-300" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-slate-100 text-base">
                        The City of Azure Lakes & Royal Heritage
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                        Nestled amidst the tranquil waters of Pichola Island and enveloped by timeless marble terraces, the celebration will take place across private floating pavilions and water-gardens decorated with white water lilies.
                      </p>
                    </div>
                  </div>

                  {/* Address Badge */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-celestial-400 shrink-0" />
                    <span>{adminSettings.venueAddress}</span>
                  </div>
                </div>

                {/* Travel guide card */}
                <div className="p-4 rounded-2xl bg-celestial-950/60 border border-celestial-400/25 space-y-3">
                  <h5 className="font-serif text-xs font-bold text-celestial-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-fantasyGold-300" />
                    Travel & Arrival Assistance
                  </h5>
                  <ul className="text-[11px] text-slate-300 space-y-2">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-celestial-400" />
                      <span><strong>Airport:</strong> Maharana Pratap (UDR) — 40 mins</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-celestial-400" />
                      <span><strong>Railway:</strong> Udaipur City Station — 15 mins</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-celestial-400" />
                      <span><strong>Boat Jetty:</strong> Private Royal Ferry Transfer</span>
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-celestial-800/60 text-[11px] text-fantasyGold-300">
                    Complimentary valet & lake ferry provided upon arrival.
                  </div>
                </div>

              </div>

              {/* Navigation button to next card */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Card 1 of 3 • Destination & Venue
                </span>
                <button
                  onClick={() => handleSelectCard(1)}
                  className="px-4 py-2 rounded-xl bg-celestial-900/60 hover:bg-celestial-800/80 border border-celestial-400/40 text-celestial-200 text-xs font-serif font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Next: Date, Time & Venue Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: DATE, TIME & VENUE DETAILS */}
        {/* ========================================================================= */}
        <div
          className={`transition-all duration-500 transform ${
            activeCardIndex === 1
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto block'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none hidden'
          }`}
        >
          <div className="relative rounded-3xl border-2 border-celestial-300/40 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-8">
            
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-celestial-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Title */}
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-celestial-950/80 border border-celestial-400/30 text-xs font-serif text-celestial-300 mb-2">
                  <Clock className="w-3.5 h-3.5 text-fantasyGold-300" />
                  <span>Auspicious Timings & Muhurat</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-gold-gradient font-bold">
                  The Auspicious Date & Timings
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
                  Save the auspicious dates for the celestial wedding union ceremonies.
                </p>
              </div>

              {/* Main Date Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-celestial-950/80 via-slate-900/90 to-celestial-950/80 border border-celestial-400/40 shadow-inner text-center relative overflow-hidden">
                <div className="font-serif text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
                  {adminSettings.weddingDateFormatted}
                </div>
                <div className="text-xs sm:text-sm text-fantasyGold-300 font-medium mt-1">
                  Sunset Sacred Vows at 05:30 PM • Auspicious Twilight Union
                </div>

                {/* Countdown Timer */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                  <div className="bg-slate-950/80 border border-celestial-500/30 p-2.5 rounded-xl">
                    <span className="block font-serif text-lg sm:text-2xl font-bold text-celestial-300">
                      {countdown.days}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Days</span>
                  </div>
                  <div className="bg-slate-950/80 border border-celestial-500/30 p-2.5 rounded-xl">
                    <span className="block font-serif text-lg sm:text-2xl font-bold text-celestial-300">
                      {countdown.hours}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Hours</span>
                  </div>
                  <div className="bg-slate-950/80 border border-celestial-500/30 p-2.5 rounded-xl">
                    <span className="block font-serif text-lg sm:text-2xl font-bold text-celestial-300">
                      {countdown.minutes}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Mins</span>
                  </div>
                  <div className="bg-slate-950/80 border border-celestial-500/30 p-2.5 rounded-xl">
                    <span className="block font-serif text-lg sm:text-2xl font-bold text-fantasyGold-300">
                      {countdown.seconds}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Secs</span>
                  </div>
                </div>
              </div>

              {/* Schedule Highlights Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-celestial-300 font-serif font-bold text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-celestial-400" />
                    <span>The Sacred Wedding Vows</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong>Venue:</strong> The Royal Water Gazebo of Horizons</p>
                    <p><strong>Assembly & Baraat:</strong> 04:30 PM</p>
                    <p><strong>Ceremony & Vows:</strong> 05:30 PM (Sunset)</p>
                    <p><strong>Grand Dinner Banquet:</strong> 07:45 PM</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-fantasyGold-300 font-serif font-bold text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-fantasyGold-400" />
                    <span>The Grand Royal Lunch Reception</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong>Venue:</strong> The Grand Imperial Banquet Hall & Lakeside Lawn</p>
                    <p><strong>Date:</strong> Sunday, November 29, 2026</p>
                    <p><strong>Lunch Service:</strong> 12:30 PM – 04:30 PM</p>
                    <p><strong>Dawat-e-Walima:</strong> Curated 7-course royal feast</p>
                  </div>
                </div>

              </div>

              {/* Calendar Download Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCalendar}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fantasyGold-400 to-celestial-400 hover:from-fantasyGold-300 hover:to-celestial-300 text-slate-950 font-serif font-bold text-xs flex items-center gap-2 shadow-gold-glow transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download .ICS Calendar Invite</span>
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+${encodeURIComponent(
                    adminSettings.coupleNames.bride + ' & ' + adminSettings.coupleNames.groom
                  )}&dates=20261128T120000Z/20261128T180000Z&details=Celestial+Wedding+Celebration&location=${encodeURIComponent(
                    adminSettings.venueName + ', ' + adminSettings.venueAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-serif font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-celestial-300" />
                  <span>Add to Google Calendar</span>
                </a>
              </div>

              {/* Navigation button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleSelectCard(0)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-serif transition cursor-pointer"
                >
                  ← Destination
                </button>
                <button
                  onClick={() => handleSelectCard(2)}
                  className="px-4 py-2 rounded-xl bg-celestial-900/60 hover:bg-celestial-800/80 border border-celestial-400/40 text-celestial-200 text-xs font-serif font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Next: Warm Wishes & Your Attendance</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: WARM WISHES & AMOUNT OF PEOPLE INVITED AS PER SET BY ADMIN */}
        {/* ========================================================================= */}
        <div
          className={`transition-all duration-500 transform ${
            activeCardIndex === 2
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto block'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none hidden'
          }`}
        >
          <div className="relative rounded-3xl border-2 border-celestial-300/40 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-8">
            
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-fantasyGold-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Header Title */}
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-celestial-950/80 border border-celestial-400/30 text-xs font-serif text-celestial-300 mb-2">
                  <Heart className="w-3.5 h-3.5 text-fantasyGold-300 fill-fantasyGold-300" />
                  <span>Warm Family Wishes & Guest Privilege</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-gold-gradient font-bold">
                  Warm Wishes & Honoured Guests
                </h3>
              </div>

              {/* Heartfelt Wishes Message */}
              <div className="p-5 sm:p-6 rounded-2xl bg-celestial-950/40 border border-celestial-400/30 text-center space-y-3 relative">
                <p className="font-serif italic text-sm sm:text-base text-slate-200 leading-relaxed">
                  "{adminSettings.warmWishesMessage}"
                </p>
                <div className="pt-2 text-xs font-serif font-semibold text-fantasyGold-300">
                  With warmest blessings from: {adminSettings.familyNames}
                </div>
              </div>

              {/* Personalized Guest Attendance & Admin Quotas Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">Personalized Invitation For</span>
                    <h4 className="font-serif text-lg font-bold text-gold-gradient">
                      {guestInfo.name || 'Honoured Guest'}
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">Total Invitation Allocation</span>
                    <div className="font-serif font-bold text-celestial-300 text-sm">
                      Host Set Limit: Max {adminSettings.totalInvitedCap} Guests
                    </div>
                  </div>
                </div>

                {/* Event Breakdown Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Mehandi Raat Breakdown */}
                  <div className="p-3.5 rounded-xl bg-celestial-950/60 border border-celestial-400/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-celestial-200">
                        Mehandi Raat Attendance
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-celestial-900 border border-celestial-400/30 text-celestial-300 font-medium">
                        Admin Max: {adminSettings.maxMehandiInvited}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-celestial-400" />
                        <span className="text-slate-300">Males: <strong>{guestInfo.mehandiMales}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-celestial-400" />
                        <span className="text-slate-300">Females: <strong>{guestInfo.mehandiFemales}</strong></span>
                      </div>
                      <div className="text-fantasyGold-300 font-semibold font-serif">
                        Total: {guestInfo.mehandiMales + guestInfo.mehandiFemales}
                      </div>
                    </div>
                  </div>

                  {/* Royal Lunch Breakdown */}
                  <div className="p-3.5 rounded-xl bg-fantasyGold-950/30 border border-fantasyGold-400/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-fantasyGold-200">
                        Grand Royal Lunch Attendance
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-fantasyGold-950 border border-fantasyGold-400/30 text-fantasyGold-300 font-medium">
                        Admin Max: {adminSettings.maxLunchInvited}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-fantasyGold-400" />
                        <span className="text-slate-300">Males: <strong>{guestInfo.lunchMales}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-fantasyGold-400" />
                        <span className="text-slate-300">Females: <strong>{guestInfo.lunchFemales}</strong></span>
                      </div>
                      <div className="text-fantasyGold-300 font-semibold font-serif">
                        Total: {guestInfo.lunchMales + guestInfo.lunchFemales}
                      </div>
                    </div>
                  </div>

                </div>

                {guestInfo.specialNotes && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-celestial-400 font-semibold">Special Request: </span>
                    {guestInfo.specialNotes}
                  </div>
                )}
              </div>

              {/* Interactive Blessings button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={handleSendBlessings}
                  disabled={blessingSent}
                  className={`px-5 py-2.5 rounded-xl font-serif text-xs font-bold flex items-center gap-2 transition duration-300 cursor-pointer ${
                    blessingSent
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 text-rose-200 border border-rose-400/40 shadow-sm'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${blessingSent ? 'fill-emerald-300' : 'fill-rose-300'}`} />
                  <span>{blessingSent ? 'Blessings Received with Love!' : 'Send Warm Wishes & Blessings'}</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-[10px] text-slate-300">
                    {blessingCount}
                  </span>
                </button>

                {/* The Portal Button to the Parallax Page of Events */}
                <button
                  onClick={onExploreParallaxEvents}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-celestial-400 via-emerald-400 to-fantasyGold-400 hover:from-celestial-300 hover:to-fantasyGold-300 text-slate-950 font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-celestial-glow transition duration-300 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>Unveil Parallax Page of Events</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
