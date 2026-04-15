import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Table, 
  Zap, 
  ArrowRightLeft,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { 
  complexityData, 
  getCategoryAlgorithms, 
  complexityWeights,
  type AlgorithmCategory,
  type ComplexityType 
} from '../services/complexity';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GlassCard from './ui/GlassCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComplexityBenchmarkProps {
  category: AlgorithmCategory;
  selectedAlgorithm: string;
  triggered: boolean;
}

const COMPLEXITY_LEVEL_COLORS: Record<number, { main: string; bg: string }> = {
  1: { main: '#00e676', bg: 'rgba(0, 230, 118, 0.1)' }, // O(1)
  2: { main: '#00e676', bg: 'rgba(0, 230, 118, 0.1)' }, // O(log n)
  3: { main: '#ffd600', bg: 'rgba(255, 214, 0, 0.1)' }, // O(n)
  4: { main: '#ff9100', bg: 'rgba(255, 145, 0, 0.1)' }, // O(n log n)
  5: { main: '#ff1744', bg: 'rgba(255, 23, 68, 0.1)' }, // O(n^2)
};

const ComplexityBenchmark: React.FC<ComplexityBenchmarkProps> = ({ 
  category, 
  selectedAlgorithm, 
  triggered 
}) => {
  const [viewType, setViewType] = useState<'time' | 'space'>('time');
  const [showLearning, setShowLearning] = useState(true);

  const algorithms = useMemo(() => getCategoryAlgorithms(category), [category]);
  const activeAlgo = complexityData[selectedAlgorithm] || algorithms[0];

  const chartData = {
    labels: algorithms.map(a => {
      if (a.name.includes('Non-Preemptive')) return 'SJF (NP)';
      if (a.name.includes('Preemptive')) return 'SJF (P)';
      return a.name.split(' ')[0];
    }),
    datasets: [
      {
        label: viewType === 'time' ? 'Time Complexity Weight' : 'Space complexity Scale',
        data: algorithms.map(a => complexityWeights[viewType === 'time' ? (a.type as ComplexityType) : (a.spaceType as ComplexityType)] || 0),
        backgroundColor: algorithms.map(a => {
          const type = viewType === 'time' ? (a.type as ComplexityType) : (a.spaceType as ComplexityType);
          const weight = complexityWeights[type];
          const isSelected = a.name === activeAlgo.name || selectedAlgorithm === Object.keys(complexityData).find(key => complexityData[key].name === a.name);
          return isSelected 
            ? COMPLEXITY_LEVEL_COLORS[weight]?.main 
            : `${COMPLEXITY_LEVEL_COLORS[weight]?.main}44`;
        }),
        borderRadius: 8,
        borderWidth: algorithms.map(a => {
           const isSelected = a.name === activeAlgo.name || selectedAlgorithm === Object.keys(complexityData).find(key => complexityData[key].name === a.name);
           return isSelected ? 2 : 0;
        }),
        borderColor: '#ffffff',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1b2e',
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const algo = algorithms[context.dataIndex];
            const type = viewType === 'time' ? algo.type : algo.spaceType;
            return ` Complexity: ${type}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          stepSize: 1,
          color: '#6b6f8a',
          font: { size: 10, weight: 'bold' as const },
          callback: (value: any) => {
            const labels: any = { 1: 'O(1)', 2: 'O(log n)', 3: 'O(n)', 4: 'O(n log n)', 5: 'O(n²)' };
            return labels[value] || '';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b6f8a', font: { size: 10, weight: 'bold' as const } }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const
    }
  };

  if (!triggered) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 mt-12"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
          <BarChart3 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-text-primary">Time Complexity Analysis</h2>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Performance Benchmarking & Efficiency Mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Graph Card */}
        <div className="xl:col-span-7">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} className="text-accent-secondary" />
                <h3 className="font-bold text-sm">Efficiency Comparison</h3>
              </div>
              <div className="flex bg-black/20 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewType('time')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                    viewType === 'time' ? 'bg-accent-primary text-bg-primary' : 'text-text-muted hover:text-white'
                  }`}
                >
                  TIME
                </button>
                <button
                  onClick={() => setViewType('space')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                    viewType === 'space' ? 'bg-accent-secondary text-bg-primary' : 'text-text-muted hover:text-white'
                  }`}
                >
                  SPACE
                </button>
              </div>
            </div>

            <div className="h-[280px]">
              <Bar data={chartData} options={chartOptions} key={`${category}-${viewType}-${triggered}`} />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {Object.entries(COMPLEXITY_LEVEL_COLORS).map(([lvl, colors]) => (
                <div key={lvl} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.main }} />
                  <span className="text-[10px] font-bold text-text-muted">
                    {lvl === '1' || lvl === '2' ? 'Low Complexity' : lvl === '5' ? 'High Complexity' : 'Medium Complexity'}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Info Card */}
        <div className="xl:col-span-5 space-y-6">
          <GlassCard className="bg-linear-to-br from-accent-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <Table size={18} className="text-accent-primary" />
              <h3 className="font-bold text-sm">Algorithm Metadata</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/20 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Selector</span>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-black ${
                    complexityWeights[activeAlgo.type] >= 4 ? 'bg-accent-danger/20 text-accent-danger' : 'bg-accent-success/20 text-accent-success'
                  }`}>
                    {activeAlgo.type}
                  </div>
                </div>
                <div className="text-xl font-black text-text-primary">{activeAlgo.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Worst Case</span>
                  <span className="text-sm font-black text-text-primary font-mono">{activeAlgo.time.worst}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Average Case</span>
                  <span className="text-sm font-black text-text-primary font-mono">{activeAlgo.time.average}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Best Case</span>
                  <span className="text-sm font-black text-text-primary font-mono">{activeAlgo.time.best}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Space Complexity</span>
                  <span className="text-sm font-black text-accent-secondary font-mono">{activeAlgo.space}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <div 
            className="group cursor-pointer"
            onClick={() => setShowLearning(!showLearning)}
          >
            <GlassCard className="bg-accent-secondary/5 border-accent-secondary/20 transition-all hover:bg-accent-secondary/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-accent-secondary" />
                  <h4 className="font-bold text-xs uppercase tracking-widest text-text-muted">Learning Insight</h4>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-text-muted transition-transform duration-300 ${showLearning ? 'rotate-180' : ''}`} 
                />
              </div>
              <AnimatePresence>
                {showLearning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {activeAlgo.reason}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-3">
                      <ArrowRightLeft size={14} className="text-accent-secondary" />
                      <span className="text-[10px] font-bold text-text-muted italic">
                        Compared to other algorithms in this category, {activeAlgo.name} occupies a 
                        {complexityWeights[activeAlgo.type] >= 4 ? ' higher ' : ' lower '} 
                        complexity tier.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ComplexityBenchmark;
