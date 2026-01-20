import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Brain, Zap, Battery, Target, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WeeklyDigestProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DigestData {
  userName: string;
  weekEnding: string;
  summary: {
    avgFocus: number;
    avgProductivity: number;
    avgEnergy: number;
    avgStress: number;
    avgMood: string;
    totalFocusTime: number;
    totalSessions: number;
    avgSessionFocus: number;
    goalsCompleted: number;
    moodCheckIns: number;
  };
  insights: string;
}

export const WeeklyDigest = ({ isOpen, onClose }: WeeklyDigestProps) => {
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<DigestData | null>(null);
  const { user } = useAuth();

  const generateDigest = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-digest', {
        body: { userId: user.id },
      });

      if (error) throw error;
      setDigest(data);
      toast.success('Weekly digest generated! ✨');
    } catch (error) {
      console.error('Failed to generate digest:', error);
      toast.error('Failed to generate digest');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 rounded-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="font-display font-bold text-xl text-foreground">Weekly Digest</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {!digest ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Generate Your Weekly Insights
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get AI-powered analysis of your cognitive performance, mood patterns, and personalized recommendations.
              </p>
              <button
                onClick={generateDigest}
                disabled={loading}
                className="btn-cyber flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    <span className="relative z-10">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Generate Digest</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Welcome */}
              <div className="text-center border-b border-border pb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Hello, {digest.userName}! 👋
                </h3>
                <p className="text-sm text-muted-foreground">
                  Week ending {digest.weekEnding}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={Brain}
                  label="Avg Focus"
                  value={`${digest.summary.avgFocus}%`}
                  color="text-primary"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Productivity"
                  value={`${digest.summary.avgProductivity}%`}
                  color="text-emerald-500"
                />
                <StatCard
                  icon={Battery}
                  label="Energy"
                  value={`${digest.summary.avgEnergy}%`}
                  color="text-blue-500"
                />
                <StatCard
                  icon={Zap}
                  label="Stress"
                  value={`${digest.summary.avgStress}%`}
                  color="text-orange-500"
                />
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{digest.summary.avgMood}</p>
                  <p className="text-xs text-muted-foreground">Avg Mood</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{digest.summary.totalFocusTime}</p>
                  <p className="text-xs text-muted-foreground">Focus Minutes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{digest.summary.goalsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Goals Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{digest.summary.moodCheckIns}</p>
                  <p className="text-xs text-muted-foreground">Mood Check-ins</p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">AI-Powered Insights</h4>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {digest.insights}
                </div>
              </div>

              {/* Regenerate Button */}
              <div className="flex justify-center">
                <button
                  onClick={generateDigest}
                  disabled={loading}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Regenerate Insights
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="glass-card p-4 rounded-xl text-center">
    <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);
