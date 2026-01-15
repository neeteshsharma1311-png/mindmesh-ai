import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CognitiveMetric {
  id: string;
  user_id: string;
  focus_score: number | null;
  energy_level: number | null;
  productivity: number | null;
  stress_level: number | null;
  recorded_at: string;
}

export const useCognitiveMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cognitive-metrics', user?.id],
    queryFn: async (): Promise<CognitiveMetric[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cognitive_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useLatestMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['latest-metrics', user?.id],
    queryFn: async (): Promise<CognitiveMetric | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('cognitive_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!user,
  });
};

export const useAddMetrics = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (metrics: Omit<CognitiveMetric, 'id' | 'user_id' | 'recorded_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cognitive_metrics')
        .insert({
          user_id: user.id,
          ...metrics,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cognitive-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['latest-metrics'] });
    },
  });
};
