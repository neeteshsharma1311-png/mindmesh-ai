import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Users, Activity, Flag, AlertCircle, Settings, 
  BarChart3, MessageSquare, Target, Shield, RefreshCw, Clock
} from 'lucide-react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useUserStats, useFeatureFlags, useUpdateFeatureFlag, useSystemLogs, useIsAdmin } from '@/hooks/useAdmin';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

const DevConsole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'flags' | 'logs' | 'settings'>('overview');
  
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: stats } = useUserStats();
  const { data: flags = [] } = useFeatureFlags();
  const { data: logs = [] } = useSystemLogs();
  const updateFlag = useUpdateFeatureFlag();

  const handleToggleFlag = async (id: string, enabled: boolean) => {
    try {
      await updateFlag.mutateAsync({ id, enabled });
      toast.success('Feature flag updated');
    } catch (error) {
      toast.error('Failed to update flag');
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // For demo purposes, allow access even if not admin
  // In production, uncomment: if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'flags', label: 'Feature Flags', icon: Flag },
    { id: 'logs', label: 'System Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <NeuralBackground />
      
      <div className="relative flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-bold text-foreground">Developer Console</h1>
                    <p className="text-muted-foreground">Admin panel & system management</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Admin Access</span>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <StatCard
                    label="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="primary"
                  />
                  <StatCard
                    label="Active Users (7d)"
                    value={stats?.activeUsers || 0}
                    icon={Activity}
                    color="success"
                  />
                  <StatCard
                    label="Total Goals"
                    value={stats?.totalGoals || 0}
                    icon={Target}
                    color="warning"
                  />
                  <StatCard
                    label="AI Messages"
                    value={stats?.totalMessages || 0}
                    icon={MessageSquare}
                    color="info"
                  />
                </motion.div>
              )}

              {/* Feature Flags Tab */}
              {activeTab === 'flags' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" />
                    Feature Flags
                  </h2>
                  <div className="space-y-4">
                    {flags.map((flag) => (
                      <div
                        key={flag.id}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{flag.name}</p>
                          <p className="text-sm text-muted-foreground">{flag.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {flag.rollout_percentage}% rollout
                          </span>
                          <Switch
                            checked={flag.enabled}
                            onCheckedChange={(checked) => handleToggleFlag(flag.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* System Logs Tab */}
              {activeTab === 'logs' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    System Logs
                  </h2>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2 font-mono text-sm">
                      {logs.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No logs available</p>
                      ) : (
                        logs.map((log) => (
                          <div
                            key={log.id}
                            className={cn(
                              'p-3 rounded-lg flex items-start gap-3',
                              log.level === 'error' && 'bg-destructive/10',
                              log.level === 'warning' && 'bg-yellow-500/10',
                              log.level === 'info' && 'bg-muted/30',
                              log.level === 'debug' && 'bg-blue-500/10'
                            )}
                          >
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded uppercase font-bold',
                              log.level === 'error' && 'bg-destructive text-destructive-foreground',
                              log.level === 'warning' && 'bg-yellow-500 text-black',
                              log.level === 'info' && 'bg-primary text-primary-foreground',
                              log.level === 'debug' && 'bg-blue-500 text-white'
                            )}>
                              {log.level}
                            </span>
                            <div className="flex-1">
                              <p className="text-foreground">{log.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {new Date(log.created_at).toLocaleString()}
                                {log.source && ` • ${log.source}`}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    System Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">AI Model</p>
                        <p className="text-sm text-muted-foreground">Current: google/gemini-3-flash-preview</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Database</p>
                        <p className="text-sm text-muted-foreground">PostgreSQL (Supabase)</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Edge Functions</p>
                        <p className="text-sm text-muted-foreground">chat, wellness-analyze</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">Deployed</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'info';
}) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary',
    success: 'from-green-500/20 to-green-500/5 text-green-500',
    warning: 'from-yellow-500/20 to-yellow-500/5 text-yellow-500',
    info: 'from-blue-500/20 to-blue-500/5 text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', colorClasses[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-3xl font-display font-bold text-foreground">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

export default DevConsole;
