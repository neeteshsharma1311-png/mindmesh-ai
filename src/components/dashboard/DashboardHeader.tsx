import { motion } from 'framer-motion';
import { Brain, LogOut, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardHeader = ({ onMenuToggle }: DashboardHeaderProps) => {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="glass-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-primary" />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-xl font-bold gradient-text">MindMesh AI</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-foreground font-medium">{getGreeting()}, {displayName}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold"
          >
            {displayName.charAt(0).toUpperCase()}
          </button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl overflow-hidden z-50"
            >
              <div className="p-2">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </a>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};
