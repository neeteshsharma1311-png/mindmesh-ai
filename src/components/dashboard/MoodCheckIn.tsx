import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Smile, Frown, Meh, SmilePlus, Angry, 
  Heart, Sparkles, Send, Tag 
} from 'lucide-react';
import { useAddMoodEntry, useMoodEntries } from '@/hooks/useMoodTracking';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';

interface MoodCheckInProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS = [
  { value: 1, icon: Angry, label: 'Terrible', color: 'text-red-500', bg: 'bg-red-500/20' },
  { value: 2, icon: Frown, label: 'Bad', color: 'text-orange-500', bg: 'bg-orange-500/20' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-lime-500', bg: 'bg-lime-500/20' },
  { value: 5, icon: SmilePlus, label: 'Great', color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
];

const COMMON_TAGS = [
  'Work', 'Exercise', 'Sleep', 'Social', 'Meditation', 
  'Coffee', 'Outdoors', 'Reading', 'Family', 'Creative'
];

export const MoodCheckIn = ({ isOpen, onClose }: MoodCheckInProps) => {
  const [step, setStep] = useState<'mood' | 'details' | 'history'>('mood');
  const [moodScore, setMoodScore] = useState<number>(3);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const addMoodEntry = useAddMoodEntry();
  const { data: moodEntries = [] } = useMoodEntries(14);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    try {
      await addMoodEntry.mutateAsync({
        mood_score: moodScore,
        anxiety_level: anxietyLevel,
        stress_level: stressLevel,
        energy_level: energyLevel,
        notes: notes || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      toast.success('Mood logged successfully! 💚');
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to log mood');
    }
  };

  const resetForm = () => {
    setStep('mood');
    setMoodScore(3);
    setAnxietyLevel(3);
    setStressLevel(3);
    setEnergyLevel(5);
    setNotes('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const chartData = moodEntries
    .slice(0, 14)
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.created_at), 'MMM d'),
      mood: entry.mood_score,
      anxiety: entry.anxiety_level,
      stress: entry.stress_level,
      energy: entry.energy_level,
    }));

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
          className="glass-card p-6 rounded-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="font-display font-bold text-xl text-foreground">Mood Check-In</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {['mood', 'details', 'history'].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s === 'mood' ? '😊 Mood' : s === 'details' ? '📝 Details' : '📈 History'}
              </button>
            ))}
          </div>

          {/* Mood Selection Step */}
          {step === 'mood' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">How are you feeling?</h3>
                <p className="text-sm text-muted-foreground">Select your current mood</p>
              </div>

              <div className="flex justify-center gap-3">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMoodScore(mood.value)}
                    className={`p-4 rounded-xl transition-all ${
                      moodScore === mood.value
                        ? `${mood.bg} ring-2 ring-offset-2 ring-offset-background ring-current ${mood.color}`
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <mood.icon className={`w-8 h-8 ${moodScore === mood.value ? mood.color : 'text-muted-foreground'}`} />
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <span className={`text-lg font-medium ${MOODS[moodScore - 1].color}`}>
                  {MOODS[moodScore - 1].label}
                </span>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full btn-cyber"
              >
                <span className="relative z-10">Continue</span>
              </button>
            </motion.div>
          )}

          {/* Details Step */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Sliders */}
              <div className="space-y-4">
                <SliderInput
                  label="Anxiety Level"
                  value={anxietyLevel}
                  onChange={setAnxietyLevel}
                  color="text-orange-500"
                />
                <SliderInput
                  label="Stress Level"
                  value={stressLevel}
                  onChange={setStressLevel}
                  color="text-red-500"
                />
                <SliderInput
                  label="Energy Level"
                  value={energyLevel}
                  onChange={setEnergyLevel}
                  color="text-emerald-500"
                  max={10}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Tag className="w-4 h-4" />
                  What influenced your mood?
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? What's on your mind?"
                  className="w-full h-24 px-4 py-3 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={addMoodEntry.isPending}
                className="w-full btn-cyber flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 relative z-10" />
                <span className="relative z-10">
                  {addMoodEntry.isPending ? 'Saving...' : 'Log Mood'}
                </span>
              </button>
            </motion.div>
          )}

          {/* History Step */}
          {step === 'history' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Mood Journey</h3>
                <p className="text-sm text-muted-foreground">Last 14 days</p>
              </div>

              {chartData.length > 0 ? (
                <div className="space-y-6">
                  {/* Mood Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#moodGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Multi-metric Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="anxiety" stroke="#f97316" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-center gap-4 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" />Stress</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" />Anxiety</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" />Energy</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No mood entries yet. Start tracking!</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
  max?: number;
}

const SliderInput = ({ label, value, onChange, color, max = 10 }: SliderInputProps) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}/{max}</span>
    </div>
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
    />
  </div>
);
