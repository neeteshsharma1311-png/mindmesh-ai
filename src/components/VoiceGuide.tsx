import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceGuideProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const VoiceGuide = ({ enabled = true, onToggle }: VoiceGuideProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(enabled);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a natural male voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => 
        v.name.includes('Google UK English Male') ||
        v.name.includes('Daniel') ||
        v.name.includes('Alex') ||
        (v.lang.startsWith('en') && v.name.toLowerCase().includes('male'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (hasPlayed || !voiceEnabled) return;

    // Get time of day for greeting
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    // Initial greeting with slight delay
    const timer = setTimeout(() => {
      speak(`${greeting}. I'm Neetesh. Welcome to MindMesh AI. Your cognitive twin is ready to optimize your potential.`);
      setHasPlayed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasPlayed, voiceEnabled, speak]);

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    onToggle?.(newState);
    
    if (!newState) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <motion.button
      onClick={toggleVoice}
      className="fixed bottom-6 right-6 z-50 glass-card p-4 rounded-full cursor-pointer group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {voiceEnabled ? (
          <motion.div
            key="enabled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Volume2 className="w-6 h-6 text-primary" />
            {isPlaying && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.8], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="disabled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <VolumeX className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {voiceEnabled ? 'Voice On' : 'Voice Off'}
      </span>
    </motion.button>
  );
};
