import React, { useState } from 'react';
import { Sliders, Languages, Eye, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { ThresholdConfig } from '../components/settings/ThresholdConfig';
import { HonestyTag } from '../components/common/HonestyTag';
import { useAgniDry } from '../context/AgniDryContext';

export const SettingsPage: React.FC = () => {
  const { isDemoMode, setIsDemoMode } = useAgniDry();

  const [language, setLanguage] = useState<'EN' | 'HI' | 'KN'>('EN');
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [audioAlerts, setAudioAlerts] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              System Settings & Artisan Preferences
            </h2>
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calibrate drying parameters, device hardware options, and accessibility preferences.
          </p>
        </div>
      </div>

      {/* Threshold Configuration Component */}
      <ThresholdConfig />

      {/* Artisan Accessibility & Preferences */}
      <div className="artisan-card p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 bg-emerald-600 text-white rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Artisan Usability & Accessibility</h3>
            <p className="text-xs text-slate-500">Low-barrier interface controls for rural artisan comfort</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Language Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-600" />
                Display Language (भाषा)
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Support for multilingual voice and text assistance for regional artisans.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'EN'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('HI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'HI'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setLanguage('KN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'KN'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
            </div>
          </div>

          {/* Large Font Readout Mode */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-800">High-Visibility Large Sensor Readout</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Increases numerical font scale for easy reading across the workshop floor.
              </p>
            </div>
            <button
              onClick={() => setLargeFont(!largeFont)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                largeFont ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  largeFont ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Audio Beep / Voice Alert */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-600" />
                Buzzer / Audio Chime on Target Dry Weight
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical on-board piezo buzzer sounds when target 36% stick moisture reduction completes.
              </p>
            </div>
            <button
              onClick={() => setAudioAlerts(!audioAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                audioAlerts ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  audioAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Demo Mode Master Toggle */}
          <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                SIH Presentation Demo Toolbar
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Displays the 14-step presentation sequence bar at the top of the screen.
              </p>
            </div>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isDemoMode ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isDemoMode ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
