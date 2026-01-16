import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Smile, Frown, Meh, AlertTriangle, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { useMoodStats, useAddMoodEntry } from '@/hooks/useMoodTracking';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MOOD_EMOJIS = [
  { value: 1, icon: Frown, label: 'Very Low', color: 'text-destructive' },
  { value: 3, icon: Frown, label: 'Low', color: 'text-orange-500' },
  { value: 5, icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
  { value: 7, icon: Smile, label: 'Good', color: 'text-green-500' },
  { value: 10, icon: Smile, label: 'Great', color: 'text-primary' },
];

export const MentalHealthRadar = () => {
  const { data: stats } = useMoodStats();
  const addMoodEntry = useAddMoodEntry();
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [moodScore, setMoodScore] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);

  const handleLogMood = async () => {
    try {
      await addMoodEntry.mutateAsync({
        mood_score: moodScore,
        anxiety_level: anxietyLevel,
        stress_level: stressLevel,
        energy_level: 5,
      });
      toast.success('Mood logged successfully!');
      setShowQuickLog(false);
    } catch (error) {
      toast.error('Failed to log mood');
    }
  };

  const getTrendIcon = () => {
    if (stats?.trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (stats?.trend === 'declining') return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getWellnessStatus = () => {
    if (!stats) return { status: 'Unknown', color: 'text-muted-foreground' };
    const score = stats.avgMood * 10 - stats.avgAnxiety * 5 - stats.avgStress * 5 + stats.avgEnergy * 5;
    if (score > 60) return { status: 'Excellent', color: 'text-green-500' };
    if (score > 40) return { status: 'Good', color: 'text-primary' };
    if (score > 20) return { status: 'Fair', color: 'text-yellow-500' };
    return { status: 'Needs Attention', color: 'text-destructive' };
  };

  const wellness = getWellnessStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Mental Health Radar
        </h3>
        <button
          onClick={() => setShowQuickLog(!showQuickLog)}
          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
        >
          Log Mood
        </button>
      </div>

      {showQuickLog ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">How are you feeling?</label>
            <div className="flex gap-2">
              {MOOD_EMOJIS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setMoodScore(mood.value)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border transition-all',
                    moodScore === mood.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <mood.icon className={cn('w-5 h-5 mx-auto', mood.color)} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Anxiety: {anxietyLevel}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={anxietyLevel}
                onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Stress: {stressLevel}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <button
            onClick={handleLogMood}
            disabled={addMoodEntry.isPending}
            className="w-full btn-cyber py-2"
          >
            <span className="relative z-10">
              {addMoodEntry.isPending ? 'Saving...' : 'Save Entry'}
            </span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Wellness Score */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
                <p className={cn('font-display font-bold text-lg', wellness.color)}>
                  {wellness.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-sm text-muted-foreground capitalize">{stats?.trend || 'stable'}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricBox
              label="Avg Mood"
              value={stats?.avgMood?.toFixed(1) || '0'}
              max={10}
              color="text-primary"
            />
            <MetricBox
              label="Anxiety"
              value={stats?.avgAnxiety?.toFixed(1) || '0'}
              max={10}
              color="text-orange-500"
              inverse
            />
            <MetricBox
              label="Stress"
              value={stats?.avgStress?.toFixed(1) || '0'}
              max={10}
              color="text-red-500"
              inverse
            />
            <MetricBox
              label="Energy"
              value={stats?.avgEnergy?.toFixed(1) || '0'}
              max={10}
              color="text-green-500"
            />
          </div>

          {/* Alert */}
          {stats && stats.avgStress > 6 && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">High Stress Detected</p>
                <p className="text-xs text-muted-foreground">
                  Consider taking a break or using the wellness assistant.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const MetricBox = ({
  label,
  value,
  max,
  color,
  inverse = false,
}: {
  label: string;
  value: string;
  max: number;
  color: string;
  inverse?: boolean;
}) => {
  const numValue = parseFloat(value);
  const percentage = (numValue / max) * 100;
  const displayPercentage = inverse ? 100 - percentage : percentage;

  return (
    <div className="p-3 bg-muted/20 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn('font-display font-bold text-lg', color)}>{value}</p>
      <div className="h-1 bg-muted/30 rounded-full mt-2 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', inverse ? 'bg-gradient-to-r from-green-500 to-red-500' : 'bg-primary')}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
