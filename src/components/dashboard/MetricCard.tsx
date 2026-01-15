import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color?: string;
}

export const MetricCard = ({ label, value, icon: Icon, trend, color = 'primary' }: MetricCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'from-emerald-500 to-teal-500';
      case 'warning':
        return 'from-amber-500 to-orange-500';
      case 'destructive':
        return 'from-rose-500 to-red-500';
      case 'secondary':
        return 'from-violet-500 to-purple-500';
      default:
        return 'from-cyan-500 to-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl group hover:border-primary/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses()} p-0.5`}>
          <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress Ring */}
        <div className="relative w-20 h-20 mx-auto mb-4">
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
              strokeDasharray={`${(value / 100) * 251.2} 251.2`}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (value / 100) * 251.2 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-foreground">
              {value}
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  );
};
