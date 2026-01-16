import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import { useHeatmapData } from '@/hooks/useProductivitySessions';
import { cn } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const ProductivityHeatmap = () => {
  const { data: heatmapData = [] } = useHeatmapData();

  const getIntensity = (day: number, hour: number) => {
    const entry = heatmapData.find((d) => d.day === day && d.hour === hour);
    return entry?.value || 0;
  };

  const getColor = (value: number) => {
    if (value === 0) return 'bg-muted/30';
    if (value < 30) return 'bg-primary/20';
    if (value < 50) return 'bg-primary/40';
    if (value < 70) return 'bg-primary/60';
    if (value < 85) return 'bg-primary/80';
    return 'bg-primary';
  };

  // Generate demo data if no real data exists
  const hasDemoData = heatmapData.length === 0;
  const getDemoIntensity = (day: number, hour: number) => {
    // Simulate typical work patterns
    if (hour >= 9 && hour <= 11) return 70 + Math.random() * 25;
    if (hour >= 14 && hour <= 16) return 60 + Math.random() * 30;
    if (hour >= 20 && hour <= 22) return 40 + Math.random() * 20;
    if (day === 0 || day === 6) return Math.random() * 30;
    return Math.random() * 40;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Productivity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hours header */}
          <div className="flex gap-1 mb-2 ml-12">
            {HOURS.filter((h) => h % 3 === 0).map((hour) => (
              <div
                key={hour}
                className="text-xs text-muted-foreground"
                style={{ width: '36px' }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="space-y-1">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">{day}</span>
                <div className="flex gap-0.5">
                  {HOURS.map((hour) => {
                    const value = hasDemoData
                      ? getDemoIntensity(dayIndex, hour)
                      : getIntensity(dayIndex, hour);
                    return (
                      <motion.div
                        key={`${day}-${hour}`}
                        className={cn(
                          'w-3 h-3 rounded-sm transition-colors cursor-pointer',
                          getColor(value)
                        )}
                        whileHover={{ scale: 1.5 }}
                        title={`${day} ${hour}:00 - Focus: ${Math.round(value)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 justify-end">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {['bg-muted/30', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary/80', 'bg-primary'].map((color, i) => (
                <div key={i} className={cn('w-3 h-3 rounded-sm', color)} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
