import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Play, 
  CheckCircle2, 
  XCircle,
  Activity,
  Layers,
  Fingerprint,
  Database
} from 'lucide-react';
import { checkSafety, calculateNeed, type DeadlockState, type SafetyResult } from '../services/deadlock';
import { addXP } from '../services/gamification';
import confetti from 'canvas-confetti';
import GlassCard from '../components/ui/GlassCard';
import ComplexityAnalyzer from '../components/ComplexityAnalyzer';

const DeadlockSimulator: React.FC = () => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  
  const [processes, setProcesses] = useState<string[]>(['P0', 'P1', 'P2', 'P3', 'P4']);
  const [resourceTypes, setResourceTypes] = useState<string[]>(['A', 'B', 'C']);
  
  const [allocation, setAllocation] = useState<number[][]>([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ]);
  
  const [max, setMax] = useState<number[][]>([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ]);
  
  const [available, setAvailable] = useState<number[]>([3, 3, 2]);
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setProcesses(Array.from({ length: numProcesses }, (_, i) => `P${i}`));
    setResourceTypes(Array.from({ length: numResources }, (_, i) => String.fromCharCode(65 + i)));
    
    setAllocation(prev => {
      const next = Array.from({ length: numProcesses }, () => new Array(numResources).fill(0));
      for (let i = 0; i < Math.min(prev.length, numProcesses); i++) {
        for (let j = 0; j < Math.min(prev[i].length, numResources); j++) {
          next[i][j] = prev[i][j];
        }
      }
      return next;
    });
    
    setMax(prev => {
      const next = Array.from({ length: numProcesses }, () => new Array(numResources).fill(0));
      for (let i = 0; i < Math.min(prev.length, numProcesses); i++) {
        for (let j = 0; j < Math.min(prev[i].length, numResources); j++) {
          next[i][j] = prev[i][j];
        }
      }
      return next;
    });
    
    setAvailable(prev => {
      const next = new Array(numResources).fill(0);
      for (let j = 0; j < Math.min(prev.length, numResources); j++) {
        next[j] = prev[j];
      }
      return next;
    });
  }, [numProcesses, numResources]);

  const handleRun = () => {
    setIsSimulating(true);
    const state: DeadlockState = { processes, resourceTypes, allocation, max, available };
    const res = checkSafety(state);
    
    setTimeout(() => {
      setResult(res);
      setIsSimulating(false);
      
      if (res.isSafe) {
        addXP(400);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7c4dff', '#00d4ff', '#00e676']
        });
      }
    }, 800);
  };

  const updateMatrix = (matrix: 'allocation' | 'max', i: number, j: number, val: number) => {
    const setter = matrix === 'allocation' ? setAllocation : setMax;
    setter(prev => {
      const next = [...prev];
      next[i] = [...next[i]];
      next[i][j] = Math.max(0, val);
      return next;
    });
  };

  const updateAvailable = (j: number, val: number) => {
    setAvailable(prev => {
      const next = [...prev];
      next[j] = Math.max(0, val);
      return next;
    });
  };

  const need = calculateNeed(allocation, max);

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 text-accent-secondary mb-2">
            <ShieldAlert size={24} />
            <span className="text-sm font-bold uppercase tracking-widest">Active Mission: Stage 03</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Deadlock <span className="text-gradient">Control</span> Center</h1>
          <p className="text-text-secondary mt-2 max-w-2xl font-medium">
            Implement the Banker's Algorithm to navigate resource allocation safely. Predict and prevent system-wide gridlocks before they occur.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRun}
            disabled={isSimulating}
            className="px-8 py-3 bg-linear-to-r from-accent-primary to-accent-secondary rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-accent-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing Security...
              </span>
            ) : (
              <><Play size={18} className="fill-current" /> Initialize Safety Protocol</>
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-9 space-y-8">
          {/* Main Configuration Card */}
          <GlassCard className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block">System Processes</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setNumProcesses(Math.max(1, numProcesses - 1))} className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold transition-colors border border-slate-200">-</button>
                    <span className="text-lg font-black min-w-[20px] text-center">{numProcesses}</span>
                    <button onClick={() => setNumProcesses(Math.min(8, numProcesses + 1))} className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold transition-colors border border-slate-200">+</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Resource Classes</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setNumResources(Math.max(1, numResources - 1))} className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold transition-colors border border-slate-200">-</button>
                    <span className="text-lg font-black min-w-[20px] text-center">{numResources}</span>
                    <button onClick={() => setNumResources(Math.min(5, numResources + 1))} className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold transition-colors border border-slate-200">+</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Global Pool</span>
                  <span className="text-xs font-bold text-accent-secondary">Available Resources</span>
                </div>
                <div className="flex gap-2">
                  {resourceTypes.map((r, j) => (
                    <div key={`av-${j}`} className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-text-muted mb-1">{r}</span>
                      <input 
                        type="number" 
                        value={available[j]} 
                        onChange={(e) => updateAvailable(j, parseInt(e.target.value) || 0)}
                        className="w-10 bg-slate-100 border border-slate-200 rounded-lg py-1 text-center text-sm font-black focus:border-accent-secondary outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Matrix View */}
            <div className="p-8 overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                    <th className="px-4">Process Vector</th>
                    <th className="px-4 text-center bg-accent-primary/10 rounded-t-xl py-2">Allocation Matrix</th>
                    <th className="px-4 text-center bg-accent-secondary/10 rounded-t-xl py-2">Max Need Matrix</th>
                    <th className="px-4 text-center bg-slate-100 rounded-t-xl py-2">Calculated Remaining</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {processes.map((p, i) => (
                    <tr key={p} className="group">
                      <td className="px-4 font-black text-accent-secondary text-lg">
                        <div className="flex items-center gap-2">
                          <Fingerprint size={16} className="opacity-40" />
                          {p}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 bg-accent-primary/5 group-hover:bg-accent-primary/10 transition-colors border-y border-accent-primary/10 first:rounded-l-2xl last:rounded-r-2xl">
                        <div className="flex items-center justify-center gap-2">
                          {resourceTypes.map((_, j) => (
                            <input 
                              key={`a-${i}-${j}`}
                              type="number" 
                              value={allocation[i]?.[j] || 0}
                              onChange={(e) => updateMatrix('allocation', i, j, parseInt(e.target.value) || 0)}
                              className="w-10 h-10 bg-black/20 border border-slate-200 rounded-lg text-center font-bold text-sm focus:border-accent-primary outline-none transition-all"
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 bg-accent-secondary/5 group-hover:bg-accent-secondary/10 transition-colors border-y border-accent-secondary/10">
                        <div className="flex items-center justify-center gap-2">
                          {resourceTypes.map((_, j) => (
                            <input 
                              key={`m-${i}-${j}`}
                              type="number" 
                              value={max[i]?.[j] || 0}
                              onChange={(e) => updateMatrix('max', i, j, parseInt(e.target.value) || 0)}
                              className="w-10 h-10 bg-black/20 border border-slate-200 rounded-lg text-center font-bold text-sm focus:border-accent-secondary outline-none transition-all"
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 bg-slate-100 group-hover:bg-white/10 transition-colors border-y border-slate-200 rounded-r-2xl border-r">
                        <div className="flex items-center justify-center gap-2">
                          {resourceTypes.map((_, j) => (
                            <motion.div 
                              key={`${i}-${j}-${need[i]?.[j]}`}
                              animate={{ scale: [1, 1.1, 1] }}
                              className="w-10 h-10 flex items-center justify-center font-black text-text-muted text-sm"
                            >
                              {need[i]?.[j]}
                            </motion.div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Results Analysis */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "glass p-8 border-l-4 transition-all overflow-hidden relative",
                  result.isSafe ? "border-accent-success bg-accent-success/5 shadow-[0_0_50px_rgba(0,230,118,0.1)]" : "border-accent-danger bg-accent-danger/5"
                )}
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[4] rotate-12 pointer-events-none">
                  {result.isSafe ? <CheckCircle2 size={120} /> : <XCircle size={120} />}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl",
                    result.isSafe ? "bg-accent-success text-bg-primary" : "bg-accent-danger text-white"
                  )}>
                    {result.isSafe ? <CheckCircle2 size={32} strokeWidth={3} /> : <XCircle size={32} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2 tracking-tight">
                      {result.isSafe ? 'SAFETY VERIFIED' : 'SYSTEM UNSTABLE'}
                    </h3>
                    <p className="text-text-secondary font-medium text-lg max-w-2xl">
                      {result.isSafe 
                        ? `Deployment sequence identified: ${result.sequence.join(' → ')}` 
                        : 'System has entered an UNSAFE state. Deadlock imminent if allocation persists.'}
                    </p>
                  </div>
                  {result.isSafe && (
                    <div className="flex-1 flex justify-end">
                      <div className="bg-slate-100 border border-slate-200 px-6 py-4 rounded-2xl">
                        <span className="text-[10px] font-black text-text-muted uppercase block mb-1">Efficiency Rating</span>
                        <span className="text-2xl font-black text-accent-success">OPTIMAL</span>
                      </div>
                    </div>
                  )}
                </div>

                {result.isSafe && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {result.steps.map((step, i) => (
                      <GlassCard key={i} delay={i * 0.1} className="relative !bg-black/20 border-slate-200 hover:border-accent-success/30 transition-all group/step">
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-xs font-black border border-accent-success/30">
                          {i+1}
                        </div>
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                          <Activity size={16} className="text-accent-success" />
                          <span className="font-black text-lg">{step.processId}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-text-muted uppercase">Initial Pool</span>
                            <span className="text-xs font-bold font-mono">[{step.work.join(', ')}]</span>
                          </div>
                          <div className="flex items-center justify-between text-accent-success/60">
                            <span className="text-[9px] font-bold uppercase">Released</span>
                            <span className="text-xs font-bold font-mono">+{step.allocation.join(', ')}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-accent-success">
                            <span className="text-[9px] font-black uppercase">Final Work</span>
                            <span className="text-xs font-black font-mono">[{step.newWork.join(', ')}]</span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-8">
          <GlassCard className="bg-accent-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <Layers size={20} className="text-accent-primary" />
              <h3 className="font-bold">Mission Intel</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
              The Banker's algorithm is the gold standard for resource allocation and deadlock avoidance. It simulates all possible future states to ensure the system never enters a "point of no return."
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-black/20 rounded-xl border border-slate-200">
                <div className="text-[10px] font-black text-accent-primary uppercase mb-2">Safety Invariants</div>
                <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
                  A state is <span className="text-accent-success font-black small-caps tracking-wider">SAFE</span> if there exists a sequence of all processes where requests can be satisfied using current resources + resources released by previously finished threads.
                </p>
              </div>
              <div className="p-4 bg-black/20 rounded-xl border border-slate-200">
                <div className="text-[10px] font-black text-accent-secondary uppercase mb-2">Algorithm Logic</div>
                <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
                  1. Find <code className="text-accent-secondary">P_i</code> where <code className="text-accent-secondary">Finish[i] = false</code> and <code className="text-accent-secondary">Need_i ≤ Work</code>.<br/>
                  2. <code className="text-accent-secondary">Work = Work + Allocation_i</code>.<br/>
                  3. <code className="text-accent-secondary">Finish[i] = true</code>.
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="bg-bg-tertiary">
            <h4 className="flex items-center gap-3 font-bold mb-4">
              <Database size={18} className="text-accent-warning" /> 
              Learning Objectives
            </h4>
            <ul className="space-y-4">
              {[
                'Matrix manipulation for state tracking',
                'Simulated resource release workflows',
                'Predictive system analytics'
              ].map((goal, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-warning" />
                  <span className="text-xs font-semibold text-text-secondary leading-tight">{goal}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Complexity Analyzer */}
          <ComplexityAnalyzer algorithm="Bankers" triggered={result !== null} />
        </div>
      </div>
    </div>
  );
};

// Helper for class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default DeadlockSimulator;
