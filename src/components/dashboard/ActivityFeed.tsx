import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { useActivityLogs, ActivityLog } from '@/hooks/useActivityLogs';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = () => {
  const { data: logs = [], isLoading } = useActivityLogs(10);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth':
        return 'bg-primary/20 text-primary';
      case 'goal':
        return 'bg-success/20 text-success';
      case 'metric':
        return 'bg-warning/20 text-warning';
      case 'wellness':
        return 'bg-cyber-pink/20 text-cyber-pink';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
      </div>

      {logs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                {log.category}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{log.action}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
