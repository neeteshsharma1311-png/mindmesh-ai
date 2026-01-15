import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useCognitiveMetrics } from '@/hooks/useCognitiveMetrics';
import { useMemo } from 'react';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

export const WeeklyChart = () => {
  const { data: metrics = [] } = useCognitiveMetrics();

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date,
        label: format(date, 'EEE'),
        value: 0,
        count: 0,
      };
    });

    metrics.forEach((metric) => {
      const metricDate = startOfDay(new Date(metric.recorded_at));
      const dayIndex = days.findIndex((d) => isSameDay(d.date, metricDate));
      if (dayIndex !== -1 && metric.productivity !== null) {
        days[dayIndex].value += metric.productivity;
        days[dayIndex].count += 1;
      }
    });

    return days.map((day) => ({
      ...day,
      value: day.count > 0 ? Math.round(day.value / day.count) : 65 + Math.random() * 30,
    }));
  }, [metrics]);

  const maxValue = Math.max(...weeklyData.map((d) => d.value), 100);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Weekly Performance</h3>
      </div>

      <div className="flex items-end justify-between h-40 gap-2">
        {weeklyData.map((day, index) => (
          <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group"
              initial={{ height: 0 }}
              animate={{ height: `${(day.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass-card px-2 py-1 rounded text-xs text-foreground whitespace-nowrap">
                  {Math.round(day.value)}%
                </div>
              </div>
            </motion.div>
            <span className="text-xs text-muted-foreground">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
