import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProductivitySession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  focus_score: number | null;
  category: string;
  created_at: string;
}

export const useProductivitySessions = (days = 30) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['productivity-sessions', user?.id, days],
    queryFn: async (): Promise<ProductivitySession[]> => {
      if (!user) return [];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('productivity_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as ProductivitySession[];
    },
    enabled: !!user,
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (category: string = 'general') => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('productivity_sessions')
        .insert([{
          user_id: user.id,
          start_time: new Date().toISOString(),
          category,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-sessions'] });
    },
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, focusScore }: { sessionId: string; focusScore: number }) => {
      const endTime = new Date();
      
      // Get session start time
      const { data: session } = await supabase
        .from('productivity_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (!session) throw new Error('Session not found');

      const startTime = new Date(session.start_time);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      const { data, error } = await supabase
        .from('productivity_sessions')
        .update({
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          focus_score: focusScore,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-sessions'] });
    },
  });
};

export const useHeatmapData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['heatmap-data', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('productivity_sessions')
        .select('start_time, duration_minutes, focus_score')
        .eq('user_id', user.id)
        .gte('start_time', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Group by hour of day and day of week
      const heatmap: Record<string, { total: number; count: number }> = {};
      
      (data || []).forEach((session) => {
        const date = new Date(session.start_time);
        const hour = date.getHours();
        const day = date.getDay();
        const key = `${day}-${hour}`;
        
        if (!heatmap[key]) heatmap[key] = { total: 0, count: 0 };
        heatmap[key].total += session.focus_score || 50;
        heatmap[key].count += 1;
      });

      return Object.entries(heatmap).map(([key, value]) => {
        const [day, hour] = key.split('-').map(Number);
        return {
          day,
          hour,
          value: Math.round(value.total / value.count),
        };
      });
    },
    enabled: !!user,
  });
};
