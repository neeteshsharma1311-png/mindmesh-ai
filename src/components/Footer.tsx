import { motion } from 'framer-motion';
import { Brain, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'API', 'Documentation', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Community', 'Help Center', 'Partners', 'Status', 'Security'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses', 'GDPR'],
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Brain className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                MindMesh AI
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Your cognitive twin for enhanced productivity, learning, and mental wellness.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Developer Info */}
        <div className="glass-card p-6 rounded-xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">
                Built by Neetesh
              </h4>
              <p className="text-sm text-muted-foreground">
                Full-Stack AI Developer | Building the future of cognitive enhancement
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#portfolio" className="btn-glass text-sm">
                Portfolio
              </a>
              <a href="#resume" className="btn-glass text-sm">
                Resume
              </a>
              <a href="#contact" className="btn-cyber text-sm">
                <span className="relative z-10">Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2026 MindMesh AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive" /> for cognitive enhancement
          </p>
        </div>
      </div>
    </footer>
  );
};
