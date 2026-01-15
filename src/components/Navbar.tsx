import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Zap, BarChart3, Target, Heart, Code, Mic } from 'lucide-react';

const navItems = [
  { name: 'Cognitive Engine', icon: Brain, href: '#cognitive' },
  { name: 'AI Twin', icon: Zap, href: '#twin' },
  { name: 'Analytics', icon: BarChart3, href: '#analytics' },
  { name: 'Goals', icon: Target, href: '#goals' },
  { name: 'Wellness', icon: Heart, href: '#wellness' },
  { name: 'API', icon: Code, href: '#api' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary" />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              MindMesh AI
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#demo" className="btn-glass text-sm">
              Live Demo
            </a>
            <a href="#start" className="btn-cyber text-sm">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-2 glass-card rounded-xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
                <div className="pt-4 border-t border-border space-y-2">
                  <a href="#demo" className="block w-full btn-glass text-center">
                    Live Demo
                  </a>
                  <a href="#start" className="block w-full btn-cyber text-center">
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
