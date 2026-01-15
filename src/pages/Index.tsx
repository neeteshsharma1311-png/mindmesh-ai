import { useState } from 'react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ModulesSection } from '@/components/ModulesSection';
import { DashboardPreview } from '@/components/DashboardPreview';
import { APISection } from '@/components/APISection';
import { PricingSection } from '@/components/PricingSection';
import { Footer } from '@/components/Footer';
import { VoiceGuide } from '@/components/VoiceGuide';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const Index = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Neural Background */}
      <NeuralBackground />

      {/* Navigation */}
      <Navbar />

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Voice Guide */}
      <VoiceGuide enabled={voiceEnabled} onToggle={setVoiceEnabled} />

      {/* Main Content */}
      <main>
        <HeroSection />
        <ModulesSection />
        <DashboardPreview />
        <APISection />
        <PricingSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
