import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  BookOpen, 
  Clock, 
  Target, 
  Heart,
  BarChart3,
  Code,
  Mic,
  Shield,
  Cpu,
  Sparkles
} from 'lucide-react';

const modules = [
  {
    icon: Brain,
    title: 'Cognitive Intelligence',
    description: 'Deep analysis of learning style, focus patterns, memory retention, and emotional signals.',
    color: 'cyber-glow',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'AI Twin System',
    description: 'A continuously learning digital twin that predicts decisions and simulates outcomes.',
    color: 'neon-purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BookOpen,
    title: 'Adaptive Learning',
    description: 'Custom study plans, adaptive explanations, and spaced revision schedules.',
    color: 'neural-blue',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Clock,
    title: 'Productivity AI',
    description: 'Auto-builds daily routines with energy-aware scheduling and burnout control.',
    color: 'success-green',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Target,
    title: 'Goal Intelligence',
    description: 'Breaks long-term goals into weekly milestones and daily microtasks.',
    color: 'warning-amber',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Heart,
    title: 'Mental Health Radar',
    description: 'Anxiety detection, mood tracking, burnout warning, and AI wellness assistant.',
    color: 'neon-pink',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: BarChart3,
    title: 'Smart Dashboard',
    description: 'Visualize cognitive metrics, productivity heatmaps, and behavior trends.',
    color: 'cyber-glow',
    gradient: 'from-cyan-500 to-emerald-500',
  },
  {
    icon: Code,
    title: 'Developer Console',
    description: 'User analytics, AI model metrics, system logs, and admin control panel.',
    color: 'neon-purple',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Mic,
    title: 'Voice AI Guide',
    description: 'Natural voice assistant with section-based guidance and toggle control.',
    color: 'neural-blue',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export const ModulesSection = () => {
  return (
    <section id="cognitive" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Core AI Modules</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Powered by</span>{' '}
            <span className="gradient-text">9 AI Engines</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each module works in harmony to create your personalized cognitive enhancement system.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-card p-6 h-full rounded-xl transition-all duration-300 hover:border-primary/50 animated-border">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient} p-0.5 mb-5`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <module.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${module.gradient} opacity-10 blur-xl`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
