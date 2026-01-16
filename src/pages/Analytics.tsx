import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, TrendingUp } from 'lucide-react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProductivityHeatmap } from '@/components/dashboard/ProductivityHeatmap';
import { MentalHealthRadar } from '@/components/dashboard/MentalHealthRadar';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { ChatButton } from '@/components/chat/ChatButton';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <NeuralBackground />
      
      <div className="relative flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
                  <p className="text-muted-foreground">Detailed insights into your cognitive performance</p>
                </div>
              </motion.div>

              {/* Top Row - Heatmap & Mental Health */}
              <div className="grid lg:grid-cols-2 gap-6">
                <ProductivityHeatmap />
                <MentalHealthRadar />
              </div>

              {/* Charts Section */}
              <AnalyticsCharts />
            </div>
          </main>
        </div>
      </div>

      <ChatButton isOpen={chatOpen} onClick={() => setChatOpen(!chatOpen)} />
      <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Analytics;
