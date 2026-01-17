import { motion } from 'framer-motion';
import { Home, BarChart3, Target, Settings, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Target, label: 'Goals', path: '/dashboard' },
  { icon: MessageSquare, label: 'AI Chat', path: '/dashboard' },
  { icon: Settings, label: 'Settings', path: '/dev-console' },
];

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl" />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              whileTap={{ scale: 0.9 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/20 rounded-2xl border border-primary/30"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon with glow effect */}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors relative z-10 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 blur-md bg-primary/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`text-xs font-medium transition-colors relative z-10 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Bottom safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </motion.nav>
  );
};
