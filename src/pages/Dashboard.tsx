import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Battery, Target, Plus, TrendingUp } from 'lucide-react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { GoalCard } from '@/components/dashboard/GoalCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { AddGoalModal } from '@/components/dashboard/AddGoalModal';
import { useLatestMetrics } from '@/hooks/useCognitiveMetrics';
import { useGoals } from '@/hooks/useGoals';
import { useProfile } from '@/hooks/useProfile';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  const { data: metrics } = useLatestMetrics();
  const { data: goals = [] } = useGoals();
  const { data: profile } = useProfile();

  const activeGoals = goals.filter((g) => g.status === 'active');

  return (
    <div className="min-h-screen bg-background relative">
      <NeuralBackground />
      
      <div className="relative flex">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                      Welcome back, {profile?.full_name || profile?.username || 'User'}
                    </h1>
                    <p className="text-muted-foreground">
                      Your cognitive performance is{' '}
                      <span className="text-primary font-medium">
                        {metrics?.productivity && metrics.productivity > 70 ? 'excellent' : 'improving'}
                      </span>{' '}
                      today. Keep up the great work!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    className="btn-cyber flex items-center gap-2 shrink-0"
                  >
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">New Goal</span>
                  </button>
                </div>
              </motion.div>

              {/* Metrics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Focus Score"
                  value={metrics?.focus_score ?? 75}
                  icon={Brain}
                  trend={5}
                  color="primary"
                />
                <MetricCard
                  label="Energy Level"
                  value={metrics?.energy_level ?? 80}
                  icon={Battery}
                  trend={-2}
                  color="success"
                />
                <MetricCard
                  label="Productivity"
                  value={metrics?.productivity ?? 70}
                  icon={TrendingUp}
                  trend={8}
                  color="warning"
                />
                <MetricCard
                  label="Stress Level"
                  value={metrics?.stress_level ?? 30}
                  icon={Zap}
                  trend={-10}
                  color="destructive"
                />
              </div>

              {/* Goals and Activity */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Goals */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Active Goals ({activeGoals.length})
                    </h2>
                  </div>

                  {activeGoals.length === 0 ? (
                    <div className="glass-card p-8 rounded-xl text-center">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-foreground mb-2">No active goals</h3>
                      <p className="text-muted-foreground mb-4">
                        Set your first goal to start tracking your progress
                      </p>
                      <button
                        onClick={() => setShowAddGoal(true)}
                        className="btn-cyber"
                      >
                        <span className="relative z-10">Create Goal</span>
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

                {/* Activity Feed */}
                <div className="space-y-4">
                  <ActivityFeed />
                </div>
              </div>

              {/* Weekly Chart */}
              <WeeklyChart />
            </div>
          </main>
        </div>
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} />
    </div>
  );
};

export default Dashboard;
