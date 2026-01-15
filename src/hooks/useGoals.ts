import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export const useGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useMilestones = (goalId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['milestones', goalId],
    queryFn: async (): Promise<Milestone[]> => {
      if (!user || !goalId) return [];
      
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!goalId,
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: { title: string; description?: string; priority?: string; target_date?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          ...goal,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useAddMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestone: { goal_id: string; title: string; due_date?: string }) => {
      const { data, error } = await supabase
        .from('milestones')
        .insert(milestone)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.goal_id] });
    },
  });
};

export const useToggleMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_completed, goal_id }: { id: string; is_completed: boolean; goal_id: string }) => {
      const { data, error } = await supabase
        .from('milestones')
        .update({ 
          is_completed,
          completed_at: is_completed ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, goal_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', result.goal_id] });
    },
  });
};
