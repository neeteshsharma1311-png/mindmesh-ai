import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain, 
  Target, 
  Activity, 
  Heart, 
  BarChart3, 
  Settings,
  Code,
  X
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Cognitive Metrics', icon: Brain, path: '/dashboard/metrics' },
  { name: 'Goals', icon: Target, path: '/dashboard/goals' },
  { name: 'Activity', icon: Activity, path: '/dashboard/activity' },
  { name: 'Wellness', icon: Heart, path: '/dashboard/wellness' },
  { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
];

const adminItems = [
  { name: 'Developer Console', icon: Code, path: '/dashboard/admin' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path || 
      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-primary/20 text-primary border border-primary/30'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
        <span className="font-medium">{item.name}</span>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="ml-auto w-2 h-2 rounded-full bg-primary"
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className={`fixed lg:relative left-0 top-0 h-full w-[280px] glass-card z-50 lg:z-auto flex flex-col
          lg:translate-x-0 transition-transform`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border lg:hidden">
          <span className="font-display text-lg font-bold gradient-text">Navigation</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </p>
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div>
            <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System
            </p>
            {adminItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-border">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI Twin Active</p>
                <p className="text-xs text-success">Learning in progress</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
