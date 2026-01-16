import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  anxiety_level: number;
  stress_level: number;
  energy_level: number;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
}

export const useMoodEntries = (limit = 30) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mood-entries', user?.id, limit],
    queryFn: async (): Promise<MoodEntry[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });
};

export const useAddMoodEntry = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entry: {
      mood_score: number;
      anxiety_level: number;
      stress_level: number;
      energy_level: number;
      notes?: string;
      tags?: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mood_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] });
    },
  });
};

export const useMoodStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mood-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score, anxiety_level, stress_level, energy_level, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) return { avgMood: 0, avgAnxiety: 0, avgStress: 0, avgEnergy: 0, trend: 'stable' };

      const avgMood = data.reduce((sum, e) => sum + e.mood_score, 0) / data.length;
      const avgAnxiety = data.reduce((sum, e) => sum + e.anxiety_level, 0) / data.length;
      const avgStress = data.reduce((sum, e) => sum + e.stress_level, 0) / data.length;
      const avgEnergy = data.reduce((sum, e) => sum + e.energy_level, 0) / data.length;

      // Calculate trend
      const recentData = data.slice(-7);
      const olderData = data.slice(0, Math.max(data.length - 7, 1));
      const recentAvg = recentData.reduce((sum, e) => sum + e.mood_score, 0) / recentData.length;
      const olderAvg = olderData.reduce((sum, e) => sum + e.mood_score, 0) / olderData.length;
      const trend = recentAvg > olderAvg + 0.5 ? 'improving' : recentAvg < olderAvg - 0.5 ? 'declining' : 'stable';

      return { avgMood, avgAnxiety, avgStress, avgEnergy, trend, entries: data };
    },
    enabled: !!user,
  });
};
