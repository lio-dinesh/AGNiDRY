import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Flame,
  BatteryCharging,
  WifiOff,
  SunMedium,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAgniDry, DemoScenarioType } from '../../context/AgniDryContext';
import { HonestyTag } from './HonestyTag';
import { SIH_14_STEP_STORY } from '../../mock/demoEngine';

export const DemoControllerBar: React.FC = () => {
  const {
    isDemoMode,
    setIsDemoMode,
    activeScenario,
    selectScenario,
    demoStepIndex,
    currentDemoStep,
    isDemoPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    startDemoTour,
    pauseDemoTour,
    nextDemoStep,
    prevDemoStep,
    goToDemoStep,
    resetDemo,
    device,
    toggleDeviceOnline
  } = useAgniDry();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!isDemoMode) {
    return (
      <div className="bg-amber-100/70 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Standard View
        </span>
        <button
          onClick={() => setIsDemoMode(true)}
          className="text-amber-800 font-semibold underline hover:text-amber-950"
        >
          Enable SIH Presentation Demo Mode
        </button>
      </div>
    );
  }

  const phaseColors: Record<string, string> = {
    PROBLEM: 'bg-rose-100 text-rose-800 border-rose-300',
    INPUT: 'bg-blue-100 text-blue-800 border-blue-300',
    MONITORING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    CONTROL: 'bg-purple-100 text-purple-800 border-purple-300',
    DRYING: 'bg-amber-100 text-amber-800 border-amber-300',
    COMPLETION: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PACKAGING: 'bg-teal-100 text-teal-800 border-teal-300',
    TRACEABILITY: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    BENEFIT: 'bg-lime-100 text-lime-800 border-lime-300',
  };

  return (
    <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white shadow-md border-b border-amber-700/40 sticky top-0 z-50">
      {/* Top compact strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand / Demo Flag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shadow-sm font-bold flex items-center gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH DEMO ENGINE</span>
          </div>
          <HonestyTag type="DEMO DATA" className="text-[10px] hidden sm:inline-flex" />
        </div>

        {/* Center: Step Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
          <span
            className={`px-2 py-0.5 rounded-full font-bold border text-[11px] uppercase tracking-wider ${
              phaseColors[currentDemoStep?.storyPhase || 'PROBLEM']
            }`}
          >
            {currentDemoStep?.storyPhase}
          </span>
          <span className="font-semibold text-amber-200">
            Step {demoStepIndex + 1} of {SIH_14_STEP_STORY.length}:
          </span>
          <span className="truncate max-w-xs md:max-w-md text-amber-50 font-medium">
            {currentDemoStep?.title}
          </span>
        </div>

        {/* Right: Quick Controls & Drawer Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={isDemoPlaying ? pauseDemoTour : startDemoTour}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all ${
              isDemoPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
            title={isDemoPlaying ? 'Pause Automated Tour' : 'Play Automated 14-Step Presentation'}
          >
            {isDemoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isDemoPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={prevDemoStep}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={nextDemoStep}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetDemo}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-amber-300 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse Demo Bar' : 'Expand Demo Controls'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Scenario Tray */}
      {isExpanded && (
        <div className="bg-slate-950/90 border-t border-amber-900/50 px-4 sm:px-6 py-3 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Story Step Description */}
            <div className="flex-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>What Happens at this Step:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {currentDemoStep?.description}
              </p>
            </div>

            {/* Scenario Shortcuts & Speed */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-slate-400 font-medium">Scenarios:</span>
              
              <button
                onClick={() => selectScenario('FULL_STORY_TOUR')}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                  activeScenario === 'FULL_STORY_TOUR'
                    ? 'bg-amber-600 border-amber-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                14-Step SIH Story
              </button>

              <button
                onClick={() => selectScenario('TEMP_SURGE')}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeScenario === 'TEMP_SURGE'
                    ? 'bg-rose-700 border-rose-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Flame className="w-3 h-3 text-rose-400" />
                Temp Surge
              </button>

              <button
                onClick={() => selectScenario('LOW_BATTERY')}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeScenario === 'LOW_BATTERY'
                    ? 'bg-amber-700 border-amber-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <BatteryCharging className="w-3 h-3 text-amber-400" />
                Low Battery
              </button>

              <button
                onClick={() => selectScenario('OFFLINE_MODE')}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1 ${
                  device.status === 'OFFLINE'
                    ? 'bg-red-800 border-red-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <WifiOff className="w-3 h-3 text-red-400" />
                Simulate Offline
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5 ml-2">
                <span className="text-[10px] text-slate-400 px-1">Speed:</span>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      playbackSpeed === s ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Progress dots */}
          <div className="mt-3 flex items-center gap-1 overflow-x-auto pt-1">
            {SIH_14_STEP_STORY.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => goToDemoStep(idx)}
                className={`flex-1 min-w-[20px] h-1.5 rounded-full transition-all ${
                  idx === demoStepIndex
                    ? 'bg-amber-400 scale-y-125'
                    : idx < demoStepIndex
                    ? 'bg-amber-600/70'
                    : 'bg-slate-800'
                }`}
                title={`Step ${idx + 1}: ${step.title}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
