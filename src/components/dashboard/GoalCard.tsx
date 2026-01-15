import { motion } from 'framer-motion';
import { Target, Calendar, CheckCircle2, Circle, Trash2, MoreVertical } from 'lucide-react';
import { Goal, useMilestones, useToggleMilestone, useDeleteGoal } from '@/hooks/useGoals';
import { useState } from 'react';
import { toast } from 'sonner';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { data: milestones = [] } = useMilestones(goal.id);
  const toggleMilestone = useToggleMilestone();
  const deleteGoal = useDeleteGoal();

  const completedMilestones = milestones.filter(m => m.is_completed).length;
  const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high':
        return 'text-destructive bg-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'text-success bg-success/20';
      case 'paused':
        return 'text-warning bg-warning/20';
      case 'archived':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-primary bg-primary/20';
    }
  };

  const handleToggleMilestone = (milestoneId: string, currentState: boolean) => {
    toggleMilestone.mutate(
      { id: milestoneId, is_completed: !currentState, goal_id: goal.id },
      {
        onSuccess: () => {
          toast.success(currentState ? 'Milestone unchecked' : 'Milestone completed!');
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate(goal.id, {
        onSuccess: () => {
          toast.success('Goal deleted');
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{goal.description}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-full mt-1 glass-card rounded-lg overflow-hidden z-10">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {goal.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
          {goal.priority}
        </span>
        {goal.target_date && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(goal.target_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Milestones ({completedMilestones}/{milestones.length})
          </p>
          {milestones.slice(0, 3).map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => handleToggleMilestone(milestone.id, milestone.is_completed)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              {milestone.is_completed ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${milestone.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {milestone.title}
              </span>
            </button>
          ))}
          {milestones.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{milestones.length - 3} more milestones
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};
