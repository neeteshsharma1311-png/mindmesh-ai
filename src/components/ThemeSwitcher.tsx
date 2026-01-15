import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';

const themes = [
  { id: 'default', name: 'Cyber Dark', class: '' },
  { id: 'cyber', name: 'Cyber', class: 'theme-cyber' },
  { id: 'neon', name: 'Neon', class: 'theme-neon' },
  { id: 'glass', name: 'Glass', class: 'theme-glass' },
  { id: 'ocean', name: 'Ocean', class: 'theme-ocean' },
];

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  const handleThemeChange = (themeId: string, themeClass: string) => {
    // Remove all theme classes
    document.documentElement.classList.remove(...themes.map(t => t.class).filter(Boolean));
    
    // Add new theme class
    if (themeClass) {
      document.documentElement.classList.add(themeClass);
    }
    
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card p-3 rounded-full cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 glass-card p-2 rounded-xl min-w-[160px]"
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id, theme.class)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors"
              >
                <span>{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
