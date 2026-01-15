import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with cognitive AI',
    icon: Sparkles,
    features: [
      'Basic cognitive analysis',
      'Daily productivity tracking',
      '5 goal templates',
      'Community support',
      '1,000 API calls/month',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For individuals serious about optimization',
    icon: Rocket,
    features: [
      'Advanced AI twin system',
      'Unlimited cognitive analysis',
      'Mental health radar',
      'Priority support',
      '50,000 API calls/month',
      'Custom learning paths',
      'Voice AI guide',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations',
    icon: Building2,
    features: [
      'Everything in Pro',
      'Unlimited API calls',
      'Custom AI models',
      'Dedicated support',
      'SSO & advanced security',
      'Admin dashboard',
      'Team analytics',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Simple,</span>{' '}
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your cognitive enhancement journey.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full">
                  <span className="text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`glass-card p-8 rounded-2xl h-full flex flex-col ${
                plan.popular ? 'border-primary/50 cyber-glow' : ''
              }`}>
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={plan.popular ? 'btn-cyber w-full' : 'btn-glass w-full'}>
                  <span className="relative z-10">{plan.cta}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
