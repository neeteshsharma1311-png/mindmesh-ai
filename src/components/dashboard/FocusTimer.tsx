import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Coffee, Brain, Settings, X, Check } from 'lucide-react';
import { useStartSession, useEndSession } from '@/hooks/useProductivitySessions';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimer = ({ isOpen, onClose }: FocusTimerProps) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customTimes, setCustomTimes] = useState(DEFAULT_TIMES);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startSession = useStartSession();
  const endSession = useEndSession();
  const { t } = useLanguage();

  const totalTime = customTimes[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(mode === 'focus' ? 'Focus session complete!' : 'Break is over!', {
        body: mode === 'focus' ? 'Time for a break!' : 'Ready to focus again?',
        icon: '/favicon.ico',
      });
    }
  }, [mode]);

  const handleStart = async () => {
    setIsRunning(true);
    if (mode === 'focus' && !currentSessionId) {
      try {
        const session = await startSession.mutateAsync('pomodoro');
        setCurrentSessionId(session.id);
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customTimes[mode]);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(customTimes[newMode]);
  };

  const handleSessionComplete = useCallback(async () => {
    playNotification();
    setIsRunning(false);

    if (mode === 'focus') {
      if (currentSessionId) {
        try {
          const focusScore = Math.min(100, 70 + Math.random() * 30);
          await endSession.mutateAsync({ sessionId: currentSessionId, focusScore: Math.round(focusScore) });
          toast.success('Focus session completed! Great work! 🎉');
        } catch (error) {
          console.error('Failed to end session:', error);
        }
        setCurrentSessionId(null);
      }
      
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      
      if (newCount % 4 === 0) {
        handleModeChange('longBreak');
        toast.info('Time for a long break! You\'ve earned it.');
      } else {
        handleModeChange('shortBreak');
        toast.info('Time for a short break!');
      }
    } else {
      handleModeChange('focus');
      toast.info('Break over! Ready to focus?');
    }
  }, [mode, currentSessionId, sessionsCompleted, playNotification, endSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleSessionComplete]);

  const modeConfig = {
    focus: { label: 'Focus', icon: Brain, color: 'from-primary to-primary/60' },
    shortBreak: { label: 'Short Break', icon: Coffee, color: 'from-emerald-500 to-emerald-500/60' },
    longBreak: { label: 'Long Break', icon: Timer, color: 'from-blue-500 to-blue-500/60' },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 rounded-2xl w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Timer className="w-6 h-6 text-primary" />
              <h2 className="font-display font-bold text-xl text-foreground">Focus Timer</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8">
            {(Object.keys(modeConfig) as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {modeConfig[m].label}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={mode === 'focus' ? 'text-primary' : mode === 'shortBreak' ? 'text-emerald-500' : 'text-blue-500'} stopColor="currentColor" />
                  <stop offset="100%" className={mode === 'focus' ? 'text-primary/60' : mode === 'shortBreak' ? 'text-emerald-500/60' : 'text-blue-500/60'} stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-display text-6xl font-bold text-foreground"
              >
                {formatTime(timeLeft)}
              </motion.span>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                {React.createElement(modeConfig[mode].icon, { className: 'w-4 h-4' })}
                <span className="text-sm">{modeConfig[mode].label}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={isRunning ? handlePause : handleStart}
              className={`p-4 rounded-full transition-all ${
                isRunning
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isRunning ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </button>
            <button
              onClick={() => {
                if (isRunning && mode === 'focus') {
                  handleSessionComplete();
                }
              }}
              disabled={!isRunning || mode !== 'focus'}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <Check className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Session Counter */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sessions completed today: <span className="font-bold text-primary">{sessionsCompleted}</span>
            </p>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border overflow-hidden"
              >
                <h3 className="font-semibold text-foreground mb-4">Timer Settings</h3>
                <div className="space-y-3">
                  {(Object.keys(DEFAULT_TIMES) as TimerMode[]).map((key) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{modeConfig[key].label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={customTimes[key] / 60}
                          onChange={(e) => {
                            const mins = Math.max(1, Math.min(60, Number(e.target.value)));
                            setCustomTimes((prev) => ({ ...prev, [key]: mins * 60 }));
                            if (mode === key && !isRunning) {
                              setTimeLeft(mins * 60);
                            }
                          }}
                          className="w-16 px-2 py-1 rounded bg-muted text-foreground text-center text-sm"
                          min="1"
                          max="60"
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden audio element for notification sound */}
          <audio ref={audioRef} preload="auto">
            <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRkAO7/x9lxvHx1vr+DJiCkABFKy/f9xVwoLddjuzIgbAAldr/3/aFkPFnvU6L+ECQAJY6jw9VNeHjR/1N+/fgYAEHCp7+lJWyBGhM/StWoAAh14s+/hQ1YhUIrKx6BgAAN5fLjv2TlSIlSOxr6VVQAE" type="audio/wav" />
          </audio>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import React from 'react';
