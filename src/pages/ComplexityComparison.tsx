import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, TrendingUp, BarChart } from 'lucide-react';
import ComplexityBenchmark from '../components/ComplexityBenchmark';
import GlassCard from '../components/ui/GlassCard';

const ComplexityComparison: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      {/* Header Section */}
      <section className="relative py-8 border-b border-slate-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest border border-accent-primary/20">
            <Sparkles size={12} /> Analytical Laboratory
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            Algorithm <span className="text-gradient">Complexity</span> Lab
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            A comprehensive benchmarking environment to compare the theoretical performance 
            of Operating System algorithms across all modules.
          </p>
        </div>
      </section>

      {/* Global Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Most Efficient', value: 'FCFS / FIFO', icon: Zap, color: 'text-accent-success', bg: 'bg-accent-success/10' },
          { label: 'Highest Overhead', value: 'Bankers / Optimal', icon: TrendingUp, color: 'text-accent-danger', bg: 'bg-accent-danger/10' },
          { label: 'Best Balance', value: 'SJF / LRU', icon: Brain, color: 'text-accent-secondary', bg: 'bg-accent-secondary/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-lg font-black text-text-primary">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Compartive Sections */}
      <div className="space-y-24">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full bg-accent-primary" />
            <h2 className="text-2xl font-black text-text-primary">CPU Scheduling Efficiency</h2>
          </div>
          <ComplexityBenchmark 
            category="SCHEDULING" 
            selectedAlgorithm="FCFS" 
            triggered={true} 
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full bg-accent-secondary" />
            <h2 className="text-2xl font-black text-text-primary">Memory Management Curves</h2>
          </div>
          <ComplexityBenchmark 
            category="PAGE_REPLACEMENT" 
            selectedAlgorithm="FIFO" 
            triggered={true} 
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full bg-accent-danger" />
            <h2 className="text-2xl font-black text-text-primary">Resource Allocation Analysis</h2>
          </div>
          <ComplexityBenchmark 
            category="DEADLOCK" 
            selectedAlgorithm="Bankers" 
            triggered={true} 
          />
        </section>
      </div>

      {/* Holistic Conclusion */}
      <GlassCard className="bg-linear-to-r from-accent-primary/10 to-accent-secondary/10 border-accent-primary/20 p-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto text-accent-primary mb-2">
            <BarChart size={32} />
          </div>
          <h3 className="text-2xl font-black text-text-primary">Unified Efficiency Report</h3>
          <p className="text-text-secondary font-medium leading-relaxed">
            The data visualization above confirms that algorithm selection is a trade-off between 
            implementation simplicity and execution performance. While linear algorithms like FCFS and FIFO 
            offer the lowest overhead, they often lack the predictive power or optimization capabilities 
            of more complex O(n log n) or O(n²) strategies.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ComplexityComparison;
