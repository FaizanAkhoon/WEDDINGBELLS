import React, { useState } from 'react';
import type { AdminSettings } from '../types/wedding';
import { soundManager } from '../services/soundEffects';
import { Settings, X, Save, RotateCcw, Shield } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (newSettings: AdminSettings) => void;
  onResetGuest: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adminSettings,
  onUpdateAdminSettings,
  onResetGuest,
}) => {
  const [formData, setFormData] = useState<AdminSettings>(adminSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof AdminSettings, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCoupleChange = (field: 'bride' | 'groom', value: string) => {
    setFormData((prev) => ({
      ...prev,
      coupleNames: {
        ...prev.coupleNames,
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChime(750);
    onUpdateAdminSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-twilight-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-950 border-l border-celestial-400/30 h-full overflow-y-auto p-6 text-slate-100 flex flex-col justify-between shadow-2xl">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-celestial-900/50 border border-celestial-400/30 text-celestial-300">
                <Settings className="w-5 h-5 animate-spin-very-slow" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gold-gradient">Host Admin Panel</h3>
                <p className="text-xs text-slate-400">Configure Invitation Quotas & Event Details</p>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playChime(400);
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form id="admin-form" onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Couple Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Bride Name</label>
                <input
                  type="text"
                  value={formData.coupleNames.bride}
                  onChange={(e) => handleCoupleChange('bride', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Groom Name</label>
                <input
                  type="text"
                  value={formData.coupleNames.groom}
                  onChange={(e) => handleCoupleChange('groom', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Quotas Section */}
            <div className="p-3 bg-celestial-950/40 border border-celestial-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-celestial-300 font-semibold font-serif">
                <Shield className="w-3.5 h-3.5" />
                <span>Guest Invitation Quotas</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Max Mehandi Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxMehandiInvited}
                    onChange={(e) => handleChange('maxMehandiInvited', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-fantasyGold-300 font-bold focus:border-celestial-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Max Lunch Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.maxLunchInvited}
                    onChange={(e) => handleChange('maxLunchInvited', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-fantasyGold-300 font-bold focus:border-celestial-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Wedding Date & Venue */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Formatted Wedding Date</label>
              <input
                type="text"
                value={formData.weddingDateFormatted}
                onChange={(e) => handleChange('weddingDateFormatted', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Venue Name</label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => handleChange('venueName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Venue Address & City</label>
              <input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => handleChange('venueAddress', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
              />
            </div>

            {/* Warm Wishes Message */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Warm Wishes & Invitation Text</label>
              <textarea
                rows={3}
                value={formData.warmWishesMessage}
                onChange={(e) => handleChange('warmWishesMessage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Family Names */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Host Families</label>
              <input
                type="text"
                value={formData.familyNames}
                onChange={(e) => handleChange('familyNames', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-celestial-400 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2 mt-6">
          {savedSuccess && (
            <div className="p-2 text-center bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs">
              ✓ Admin Settings Updated Successfully!
            </div>
          )}

          <button
            type="submit"
            form="admin-form"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-celestial-500 to-emerald-600 hover:from-celestial-400 hover:to-emerald-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime(500);
              onResetGuest();
              onClose();
            }}
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center gap-2 transition text-xs border border-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-open Guest Check-in Form</span>
          </button>
        </div>

      </div>
    </div>
  );
};
