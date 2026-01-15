import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, Play } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Powered by Advanced AI
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                <span className="text-foreground">Your</span>
                <br />
                <span className="gradient-text cyber-glow-text">Cognitive</span>
                <br />
                <span className="text-foreground">Twin</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                MindMesh AI is your digital brain — continuously optimizing your 
                productivity, learning, goals, and mental wellness through 
                advanced artificial intelligence.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a href="/auth" className="btn-cyber flex items-center gap-2 text-lg">
                <span className="relative z-10">Start Free</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </a>
              <a href="/dashboard" className="btn-glass flex items-center gap-2 text-lg group">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-border"
            >
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '98%', label: 'Accuracy Rate' },
                { value: '24/7', label: 'AI Support' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-display font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Brain Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            {/* Central Brain */}
            <div className="relative">
              {/* Outer glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsla(185, 100%, 50%, 0.2) 0%, transparent 70%)',
                  width: '500px',
                  height: '500px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Animated rings */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
                  style={{
                    width: `${200 + ring * 80}px`,
                    height: `${200 + ring * 80}px`,
                  }}
                  animate={{
                    rotate: ring % 2 === 0 ? 360 : -360,
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20 + ring * 5,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}

              {/* Central brain icon */}
              <motion.div
                className="relative glass-card w-48 h-48 rounded-full flex items-center justify-center cyber-glow"
                animate={{
                  boxShadow: [
                    '0 0 30px hsla(185, 100%, 50%, 0.3)',
                    '0 0 50px hsla(185, 100%, 50%, 0.5)',
                    '0 0 30px hsla(185, 100%, 50%, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Brain className="w-24 h-24 text-primary" />
                
                {/* Orbiting particles */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-primary"
                    style={{
                      boxShadow: '0 0 10px hsla(185, 100%, 50%, 0.8)',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    initial={{
                      x: Math.cos((i * 60 * Math.PI) / 180) * 100,
                      y: Math.sin((i * 60 * Math.PI) / 180) * 100,
                    }}
                  />
                ))}
              </motion.div>

              {/* Floating info cards */}
              {[
                { label: 'Focus Score', value: '94%', x: -180, y: -80 },
                { label: 'Productivity', value: '+32%', x: 180, y: -40 },
                { label: 'Goals Met', value: '12/15', x: -160, y: 100 },
                { label: 'Wellness', value: 'Good', x: 160, y: 120 },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  className="absolute glass-card px-4 py-2 rounded-lg"
                  style={{ left: `calc(50% + ${card.x}px)`, top: `calc(50% + ${card.y}px)` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                  <div className="text-lg font-display font-bold text-primary">{card.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
