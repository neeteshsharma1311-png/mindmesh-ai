import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Battery, 
  Target,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';

const metrics = [
  { label: 'Focus Score', value: 94, max: 100, icon: Brain, color: 'primary' },
  { label: 'Energy Level', value: 78, max: 100, icon: Battery, color: 'success' },
  { label: 'Productivity', value: 86, max: 100, icon: TrendingUp, color: 'warning' },
  { label: 'Goals Progress', value: 72, max: 100, icon: Target, color: 'secondary' },
];

const recentActivities = [
  { time: '9:00 AM', task: 'Deep Work Session', duration: '2h', status: 'completed' },
  { time: '11:30 AM', task: 'Learning: React Patterns', duration: '45m', status: 'completed' },
  { time: '1:00 PM', task: 'Goal Review', duration: '15m', status: 'in-progress' },
  { time: '2:00 PM', task: 'Creative Writing', duration: '1h', status: 'upcoming' },
];

const weeklyData = [65, 78, 82, 75, 90, 88, 94];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DashboardPreview = () => {
  return (
    <section id="analytics" className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Smart Dashboard</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Real-time</span>{' '}
            <span className="gradient-text">Cognitive Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize your mental performance with beautiful, actionable analytics.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-30" />

          <div className="relative glass-card p-6 md:p-8 rounded-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  Good afternoon, Alex
                </h3>
                <p className="text-muted-foreground">
                  Your cognitive performance is <span className="text-primary">above average</span> today
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">January 15, 2026</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="metric-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className="w-6 h-6 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="progress-ring w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(metric.value / metric.max) * 251.2} 251.2`}
                        initial={{ strokeDashoffset: 251.2 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-foreground">
                        {metric.value}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Trend */}
              <div className="glass-card p-6 rounded-xl">
                <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Performance
                </h4>
                <div className="flex items-end justify-between h-40 gap-2">
                  {weeklyData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-primary/80 rounded-t-lg"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        style={{ maxHeight: `${value}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{days[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="glass-card p-6 rounded-xl">
                <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Today's Schedule
                </h4>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                    >
                      <span className="text-sm text-muted-foreground w-20">
                        {activity.time}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.task}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {activity.duration}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        activity.status === 'completed' 
                          ? 'bg-success/20 text-success' 
                          : activity.status === 'in-progress'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
