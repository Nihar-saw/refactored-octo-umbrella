import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  PieChart as PieChartIcon, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  MemoryStick,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { runFIFO, runLRU, runOptimal, type PageState } from '../services/pageReplacement';
import { addXP } from '../services/gamification';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import confetti from 'canvas-confetti';
import GlassCard from '../components/ui/GlassCard';
import ComplexityAnalyzer from '../components/ComplexityAnalyzer';

ChartJS.register(ArcElement, Tooltip, Legend);

const PageReplacementSimulator: React.FC = () => {
  const [pages, setPages] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3]);
  const [capacity, setCapacity] = useState(3);
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'LRU' | 'OPTIMAL'>('FIFO');
  const [results, setResults] = useState<PageState[] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRun = () => {
    setIsSimulating(true);
    let res;
    if (algorithm === 'FIFO') res = runFIFO(pages, capacity);
    else if (algorithm === 'LRU') res = runLRU(pages, capacity);
    else res = runOptimal(pages, capacity);

    setTimeout(() => {
      setResults(res);
      setCurrentStep(res.length - 1);
      setIsSimulating(false);
      addXP(50);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d4ff', '#00e676', '#ffd600']
      });
    }, 800);
  };

  const getStats = () => {
    if (!results) return { faults: 0, hits: 0, ratio: 0 };
    const faults = results.filter(r => r.isFault).length;
    const hits = results.length - faults;
    return { faults, hits, ratio: (hits / results.length) * 100 };
  };

  const stats = getStats();

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 text-accent-secondary mb-2">
            <MemoryStick size={24} />
            <span className="text-sm font-bold uppercase tracking-widest">Active Mission: Stage 02</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Memory <span className="text-gradient">Management</span> Mission</h1>
          <p className="text-text-secondary mt-2 max-w-2xl font-medium">
            Balance speed and efficiency by managing virtual memory. Your goal is to maximize the hit ratio and minimize expensive page faults.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRun}
            disabled={isSimulating}
            className="px-6 py-3 bg-linear-to-r from-accent-secondary to-accent-success rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale text-bg-primary"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <><Play size={18} className="fill-current" /> Execute Simulation</>
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Configuration Card */}
          <GlassCard className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowRightLeft size={20} className="text-accent-secondary" />
              <h3 className="font-bold">Configuration Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Page Reference String</label>
                <input 
                  type="text" 
                  value={pages.join(', ')} 
                  onChange={(e) => setPages(e.target.value.split(',').map(v => parseInt(v.trim()) || 0))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-accent-secondary outline-none transition-all"
                  placeholder="e.g. 7, 0, 1, 2, 0, 3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Frame Capacity</label>
                <input 
                  type="number" 
                  value={capacity} 
                  onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-accent-secondary outline-none transition-all text-center"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px bg-slate-100" />
              <div className="flex gap-2">
                {(['FIFO', 'LRU', 'OPTIMAL'] as const).map(algo => (
                  <button
                    key={algo}
                    onClick={() => setAlgorithm(algo)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      algorithm === algo 
                        ? 'bg-accent-secondary/10 border-accent-secondary/30 text-accent-secondary' 
                        : 'border-slate-200 text-text-muted hover:border-white/20'
                    }`}
                  >
                    {algo} Strategy
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Visualization Card */}
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <GlassCard>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-secondary/10 rounded-lg text-accent-secondary">
                        <Info size={18} />
                      </div>
                      <h3 className="font-bold">Execution Steps</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-xl border border-slate-200">
                      <button 
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30"
                        disabled={currentStep === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-xs font-bold min-w-[100px] text-center">
                        Step <span className="text-accent-secondary">{currentStep + 1}</span> of {results.length}
                      </span>
                      <button 
                        onClick={() => setCurrentStep(Math.min(results.length - 1, currentStep + 1))} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30"
                        disabled={currentStep === results.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                    {results.slice(0, currentStep + 1).map((state, i) => (
                      <motion.div 
                        key={i} 
                        layout 
                        className={`flex flex-col gap-2 shrink-0 p-3 rounded-xl border transition-all ${
                          state.isFault 
                            ? 'bg-accent-danger/5 border-accent-danger/20' 
                            : 'bg-accent-success/5 border-accent-success/10'
                        } ${i === currentStep ? 'ring-2 ring-accent-secondary/50' : ''}`}
                      >
                        <div className="flex flex-col items-center pb-2 border-b border-slate-200">
                          <span className="text-[10px] font-black uppercase text-text-muted mb-1">Page</span>
                          <span className="text-lg font-black text-text-primary">{state.page}</span>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 py-1">
                          {state.frames.map((f, fi) => (
                            <div 
                              key={fi} 
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${
                                f === state.page 
                                  ? 'bg-accent-secondary text-bg-primary border-transparent scale-110 shadow-lg shadow-accent-secondary/20' 
                                  : f === null 
                                    ? 'bg-black/20 border-slate-200 text-text-muted/30' 
                                    : 'bg-slate-100 border-slate-200 text-white'
                              }`}
                            >
                              {f !== null ? f : '-'}
                            </div>
                          ))}
                        </div>
                        
                        <div className={`text-[9px] font-black text-center mt-1 py-1 rounded tracking-widest ${
                          state.isFault ? 'text-accent-danger' : 'text-accent-success'
                        }`}>
                          {state.isFault ? 'FAULT' : 'HIT'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats & Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="flex flex-col items-center">
            <div className="w-full flex items-center gap-3 mb-8">
              <PieChartIcon size={20} className="text-accent-secondary" />
              <h3 className="font-bold">Performance Map</h3>
            </div>
            
            {results ? (
              <div className="w-full space-y-8">
                <div className="h-[220px] relative">
                  <Pie 
                    data={{
                      labels: ['Hits', 'Faults'],
                      datasets: [{
                        data: [stats.hits, stats.faults],
                        backgroundColor: ['rgba(0, 230, 118, 0.6)', 'rgba(255, 23, 68, 0.6)'],
                        borderColor: ['rgba(0, 230, 118, 1)', 'rgba(255, 23, 68, 1)'],
                        borderWidth: 1.5,
                        hoverOffset: 15
                      }]
                    }}
                    options={{ 
                      plugins: { 
                        legend: { 
                          position: 'bottom', 
                          labels: { 
                            color: '#b0b3c1', 
                            font: { size: 10, weight: 'bold' },
                            padding: 20
                          } 
                        } 
                      },
                      maintainAspectRatio: false
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/20 border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-text-muted uppercase mb-1">Hit Ratio</div>
                    <div className="text-2xl font-black text-accent-success">{stats.ratio.toFixed(1)}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/20 border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-text-muted uppercase mb-1">Total Faults</div>
                    <div className="text-2xl font-black text-accent-danger">{stats.faults}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-text-muted text-center border-2 border-dashed border-slate-200 rounded-2xl px-6 w-full opacity-40">
                <TrendingUp size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Execute mission for dataset analytics</p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="bg-accent-warning/5 border-accent-warning/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 size={18} className="text-accent-warning" />
              <h4 className="font-bold text-sm">Strategy Breakdown</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-medium mb-3">
              {algorithm === 'FIFO' 
                ? 'FIFO (First-In, First-Out) is the most intuitive strategy. However, it can suffer from "Belady\'s Anomaly," where adding more frames can actually increase page faults.'
                : algorithm === 'LRU'
                ? 'LRU (Least Recently Used) is a far more efficient, heuristic-driven approach. It predicts future needs based on past behavior, though it requires more processing overhead.'
                : 'Optimal algorithm replaces the page that will not be used for the longest period in the future. It provides the minimum possible number of page faults.'}
            </p>
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-accent-warning">
                <AlertCircle size={14} />
                <span className="text-[10px] font-black uppercase">Optimization Tip</span>
              </div>
              <p className="text-[10px] text-text-muted mt-1 italic font-medium">
                Aim for a Hit Ratio above 70% to maintain system fluiditiy.
              </p>
            </div>
          </GlassCard>

          {/* Complexity Analyzer */}
          <ComplexityAnalyzer algorithm={algorithm} triggered={results !== null} />
        </div>
      </div>
    </div>
  );
};

export default PageReplacementSimulator;
