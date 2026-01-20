import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Battery, Target, Plus, TrendingUp, Home, Timer, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NeuralBackground } from '@/components/NeuralBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { GoalCard } from '@/components/dashboard/GoalCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { AddGoalModal } from '@/components/dashboard/AddGoalModal';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ChatButton } from '@/components/chat/ChatButton';
import { VoiceChat } from '@/components/VoiceChat';
import { FocusTimer } from '@/components/dashboard/FocusTimer';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { WeeklyDigest } from '@/components/dashboard/WeeklyDigest';
import { MobileNav } from '@/components/MobileNav';
import { useLatestMetrics } from '@/hooks/useCognitiveMetrics';
import { useGoals } from '@/hooks/useGoals';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);
  const [focusTimerOpen, setFocusTimerOpen] = useState(false);
  const [moodCheckInOpen, setMoodCheckInOpen] = useState(false);
  const [weeklyDigestOpen, setWeeklyDigestOpen] = useState(false);
  
  const { data: metrics } = useLatestMetrics();
  const { data: goals = [] } = useGoals();
  const { data: profile } = useProfile();
  const { t } = useLanguage();

  const activeGoals = goals.filter((g) => g.status === 'active');

  return (
    <div className="min-h-screen bg-background relative">
      <NeuralBackground />
      
      <div className="relative flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <DashboardHeader 
            onMenuToggle={() => setSidebarOpen(true)} 
            onVoiceClick={() => setVoiceChatOpen(true)}
          />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                      {t('dashboard.welcome')}, {profile?.full_name || profile?.username || 'User'}
                    </h1>
                    <p className="text-muted-foreground">
                      {t('dashboard.performance')}{' '}
                      <span className="text-primary font-medium">
                        {metrics?.productivity && metrics.productivity > 70 
                          ? t('dashboard.excellent') 
                          : t('dashboard.improving')}
                      </span>{' '}
                      {t('common.today')}.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFocusTimerOpen(true)}
                      className="btn-cyber flex items-center gap-2 shrink-0"
                    >
                      <Timer className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Focus Timer</span>
                    </button>
                    <button
                      onClick={() => setMoodCheckInOpen(true)}
                      className="glass-card px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-medium">Mood Check-In</span>
                    </button>
                    <button
                      onClick={() => setWeeklyDigestOpen(true)}
                      className="glass-card px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Weekly Digest</span>
                    </button>
                    <button onClick={() => setShowAddGoal(true)} className="btn-cyber flex items-center gap-2 shrink-0">
                      <Plus className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{t('dashboard.newGoal')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label={t('dashboard.focusScore')} value={metrics?.focus_score ?? 75} icon={Brain} trend={5} color="primary" />
                <MetricCard label={t('dashboard.energy')} value={metrics?.energy_level ?? 80} icon={Battery} trend={-2} color="success" />
                <MetricCard label={t('dashboard.productivity')} value={metrics?.productivity ?? 70} icon={TrendingUp} trend={8} color="warning" />
                <MetricCard label={t('dashboard.stress')} value={metrics?.stress_level ?? 30} icon={Zap} trend={-10} color="destructive" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {t('dashboard.goals')} ({activeGoals.length})
                    </h2>
                  </div>

                  {activeGoals.length === 0 ? (
                    <div className="glass-card p-8 rounded-xl text-center">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-foreground mb-2">{t('dashboard.noGoals')}</h3>
                      <p className="text-muted-foreground mb-4">Set your first goal to start tracking</p>
                      <button onClick={() => setShowAddGoal(true)} className="btn-cyber">
                        <span className="relative z-10">{t('dashboard.createGoal')}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {activeGoals.slice(0, 4).map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <ActivityFeed />
                </div>
              </div>

              <WeeklyChart />
            </div>
          </main>
        </div>
      </div>

      <AddGoalModal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} />
      
      {/* AI Chat */}
      <ChatButton isOpen={chatOpen} onClick={() => setChatOpen(!chatOpen)} />
      <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Voice Chat */}
      <VoiceChat isOpen={voiceChatOpen} onClose={() => setVoiceChatOpen(false)} />
      
      {/* Focus Timer */}
      <FocusTimer isOpen={focusTimerOpen} onClose={() => setFocusTimerOpen(false)} />
      
      {/* Mood Check-In */}
      <MoodCheckIn isOpen={moodCheckInOpen} onClose={() => setMoodCheckInOpen(false)} />
      
      {/* Weekly Digest */}
      <WeeklyDigest isOpen={weeklyDigestOpen} onClose={() => setWeeklyDigestOpen(false)} />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Floating Home Button */}
      <Link
        to="/"
        className="fixed bottom-24 left-6 p-3 rounded-full glass-card hover:bg-primary/10 transition-colors z-40 md:hidden"
      >
        <Home className="w-5 h-5 text-primary" />
      </Link>
      
      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Dashboard;
