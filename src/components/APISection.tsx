import { motion } from 'framer-motion';
import { Code, Terminal, Copy, Check, Lock, Zap, Globe } from 'lucide-react';
import { useState } from 'react';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/cognitive/analyze',
    description: 'Analyze cognitive patterns and learning style',
  },
  {
    method: 'GET',
    path: '/api/v1/twin/predict',
    description: 'Get AI twin predictions for decisions',
  },
  {
    method: 'POST',
    path: '/api/v1/habits/optimize',
    description: 'Optimize habit formation with RL',
  },
  {
    method: 'GET',
    path: '/api/v1/goals/plan',
    description: 'Generate goal breakdown and milestones',
  },
  {
    method: 'POST',
    path: '/api/v1/wellness/check',
    description: 'Mental health and burnout analysis',
  },
];

const codeExample = `import { MindMeshAI } from '@mindmesh/sdk';

const client = new MindMeshAI({
  apiKey: process.env.MINDMESH_API_KEY,
});

// Analyze cognitive patterns
const analysis = await client.cognitive.analyze({
  userId: 'user_123',
  dataPoints: ['focus', 'memory', 'stress'],
  timeRange: '7d',
});

console.log(analysis.insights);
// → { focusScore: 94, memoryRetention: 0.87, ... }`;

export const APISection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="relative py-24 px-6">
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
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">API Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Build with</span>{' '}
            <span className="gradient-text">MindMesh API</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate cognitive AI capabilities into your applications with our comprehensive REST API.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    example.ts
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Block */}
              <pre className="p-6 overflow-x-auto text-sm">
                <code className="text-foreground/90 font-mono">
                  {codeExample.split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      {line.includes('import') && (
                        <span>
                          <span className="text-cyber-pink">import</span>
                          {line.replace('import', '').replace('from', '')}
                          <span className="text-cyber-pink"> from</span>
                          {line.split('from')[1]}
                        </span>
                      )}
                      {line.includes('const') && !line.includes('import') && (
                        <span>
                          <span className="text-cyber-pink">const</span>
                          {line.replace('const', '')}
                        </span>
                      )}
                      {line.includes('await') && (
                        <span>
                          <span className="text-cyber-pink">await</span>
                          {line.replace('await', '')}
                        </span>
                      )}
                      {line.includes('//') && (
                        <span className="text-muted-foreground">{line}</span>
                      )}
                      {!line.includes('import') && !line.includes('const') && !line.includes('await') && !line.includes('//') && (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Lock, label: 'Secure', desc: 'End-to-end encryption' },
                { icon: Zap, label: 'Fast', desc: '<100ms latency' },
                { icon: Globe, label: 'Global', desc: 'Edge deployment' },
              ].map((feature) => (
                <div key={feature.label} className="glass-card p-4 rounded-xl text-center">
                  <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-semibold text-foreground">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Endpoints List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="font-display font-semibold text-xl text-foreground mb-6">
              Available Endpoints
            </h3>
            
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-colors cursor-pointer"
              >
                <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                  endpoint.method === 'GET' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-warning/20 text-warning'
                }`}>
                  {endpoint.method}
                </span>
                <div className="flex-1">
                  <code className="text-sm font-mono text-primary group-hover:text-foreground transition-colors">
                    {endpoint.path}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    {endpoint.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="pt-6">
              <a href="#docs" className="btn-cyber inline-flex items-center gap-2">
                <span className="relative z-10">View Full Documentation</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
