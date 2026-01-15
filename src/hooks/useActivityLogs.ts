import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  category: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const useActivityLogs = (limit = 20) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['activity-logs', user?.id, limit],
    queryFn: async (): Promise<ActivityLog[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as ActivityLog[];
    },
    enabled: !!user,
  });
};

export const useLogActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (log: { action: string; category?: string; metadata?: Record<string, unknown> }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          action: log.action,
          category: log.category || 'general',
          metadata: log.metadata || {},
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });
};
