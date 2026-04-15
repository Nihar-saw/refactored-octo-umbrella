import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Info, 
  BarChart3, 
  Cpu, 
  Settings2,
  ListTodo,
  CheckCircle2,
  Clock,
  Trophy
} from 'lucide-react';
import { runFCFS, runSJF, runSRTF, runRR, runPriority, type Process, type GanttStep } from '../services/scheduling';
import { addXP } from '../services/gamification';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import confetti from 'canvas-confetti';
import GlassCard from '../components/ui/GlassCard';
import ComplexityAnalyzer from '../components/ComplexityAnalyzer';
import ComplexityBenchmark from '../components/ComplexityBenchmark';
import LearningResources from '../components/LearningResources';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SchedulingSimulator: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, remainingTime: 5 },
    { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1, remainingTime: 3 },
    { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3, remainingTime: 1 },
  ]);
  
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'Priority'>('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState<{ gantt: GanttStep[], metrics: Process[] } | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showComplexity, setShowComplexity] = useState(false);

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: 1, remainingTime: 1 }]);
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const updateProcess = (id: string, field: keyof Process, value: number) => {
    setProcesses(processes.map(p => p.id === id ? { ...p, [field]: value, remainingTime: field === 'burstTime' ? value : p.remainingTime } : p));
  };

  const handleRun = () => {
    setIsSimulating(true);
    let runResult;
    
    if (algorithm === 'FCFS') runResult = runFCFS(processes);
    else if (algorithm === 'SJF') runResult = runSJF(processes);
    else if (algorithm === 'SRTF') runResult = runSRTF(processes);
    else if (algorithm === 'Priority') runResult = runPriority(processes);
    else runResult = runRR(processes, quantum);
    
    setShowComplexity(false);
    
    setTimeout(() => {
      setResult(runResult);
      setIsSimulating(false);
      
      const fcfs = runFCFS(processes);
      const sjf = runSJF(processes);
      const srtf = runSRTF(processes);
      const rr = runRR(processes, quantum);
      const priorityRun = runPriority(processes);
      
      const avgWT = (metrics: Process[]) => metrics.length > 0 ? metrics.reduce((acc, p) => acc + (p.waitingTime || 0), 0) / metrics.length : 0;
      const avgTAT = (metrics: Process[]) => metrics.length > 0 ? metrics.reduce((acc, p) => acc + (p.turnaroundTime || 0), 0) / metrics.length : 0;

      setComparisonData({
        labels: ['FCFS', 'SJF (NP)', 'SJF (P)', 'Priority', `RR (q=${quantum})`],
        datasets: [
          {
            label: 'Avg Waiting Time',
            data: [avgWT(fcfs.metrics), avgWT(sjf.metrics), avgWT(srtf.metrics), avgWT(priorityRun.metrics), avgWT(rr.metrics)],
            backgroundColor: 'rgba(124, 77, 255, 0.6)',
            borderRadius: 6,
          },
          {
            label: 'Avg Turnaround Time',
            data: [avgTAT(fcfs.metrics), avgTAT(sjf.metrics), avgTAT(srtf.metrics), avgTAT(priorityRun.metrics), avgTAT(rr.metrics)],
            backgroundColor: 'rgba(0, 212, 255, 0.6)',
            borderRadius: 6,
          }
        ]
      });

      addXP(50);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c4dff', '#00d4ff', '#00e676']
      });
    }, 800);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 text-accent-secondary mb-2">
            <Cpu size={24} />
            <span className="text-sm font-bold uppercase tracking-widest">Active Mission: Stage 01</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">CPU <span className="text-gradient">Scheduling</span> Simulator</h1>
          <p className="text-text-secondary mt-2 max-w-2xl font-medium">
            Optimize the flow of processes through the central processor. Your goal is to minimize latency and maximize throughput.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRun}
            disabled={isSimulating}
            className="px-6 py-3 bg-linear-to-r from-accent-primary to-accent-secondary rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Calculating...
              </span>
            ) : (
              <><Play size={18} className="fill-current" /> Execute Simulation</>
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-8 space-y-8">
          <GlassCard className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-100">
              <div className="flex items-center gap-3">
                <Settings2 size={20} className="text-accent-secondary" />
                <h2 className="font-bold">System Configuration</h2>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={algorithm} 
                  onChange={(e) => setAlgorithm(e.target.value as any)}
                  className="bg-bg-tertiary border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:border-accent-secondary transition-colors"
                >
                  <option value="FCFS">FCFS (First Come First Serve)</option>
                  <option value="SJF">SJF (Non-Preemptive)</option>
                  <option value="SRTF">SJF (Preemptive)</option>
                  <option value="Priority">Priority Scheduling</option>
                  <option value="RR">Round Robin (RR)</option>
                </select>
                
                {algorithm === 'RR' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-muted uppercase">Quantum:</span>
                    <input 
                      type="number" 
                      value={quantum} 
                      onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-bg-tertiary border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-accent-secondary"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-bold text-text-muted uppercase tracking-widest text-left">
                    <th className="pb-4">Process ID</th>
                    <th className="pb-4">Arrival Time</th>
                    <th className="pb-4">Burst Time</th>
                    <th className="pb-4">Priority</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {processes.map(p => (
                    <tr key={p.id} className="group">
                      <td className="py-4 font-bold text-accent-secondary">{p.id}</td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          value={p.arrivalTime} 
                          onChange={(e) => updateProcess(p.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                          className="w-20 bg-slate-100 border border-transparent rounded-lg px-2 py-1 text-sm font-medium focus:border-white/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          value={p.burstTime} 
                          onChange={(e) => updateProcess(p.id, 'burstTime', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 bg-slate-100 border border-transparent rounded-lg px-2 py-1 text-sm font-medium focus:border-white/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          value={p.priority} 
                          onChange={(e) => updateProcess(p.id, 'priority', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-20 bg-slate-100 border border-transparent rounded-lg px-2 py-1 text-sm font-medium focus:border-white/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => removeProcess(p.id)} 
                          className="p-2 text-text-muted hover:text-accent-danger hover:bg-accent-danger/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button 
                onClick={addProcess}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-accent-secondary hover:text-accent-primary transition-colors py-2 px-4 rounded-xl border border-dashed border-accent-secondary/30 hover:border-accent-primary/50 w-full justify-center"
              >
                <Plus size={16} /> Add New Process
              </button>
            </div>
          </GlassCard>

          {/* Visualization Section */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <GlassCard className="relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8">
                    <TrendingUp size={20} className="text-accent-success" />
                    <h3 className="font-bold">Execution Timeline (Gantt)</h3>
                  </div>
                  
                  <div className="relative group">
                    <div className="flex h-14 w-full bg-black/20 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                      {result.gantt.map((step, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-center relative border-r border-black/20 transition-all group/step"
                          style={{ 
                            flex: (step.endTime - step.startTime), 
                            background: `linear-gradient(180deg, hsla(${i * 60 + 240}, 70%, 50%, 0.4), hsla(${i * 60 + 240}, 70%, 40%, 0.6))`
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black drop-shadow-md text-white">{step.processId}</span>
                            <span className="text-[10px] font-bold opacity-80 text-white/90">({step.endTime - step.startTime})</span>
                          </div>
                          
                          {/* Timestamps */}
                          {i === 0 && (
                            <span className="absolute -bottom-6 left-0 text-[10px] font-bold text-text-muted">{step.startTime}ms</span>
                          )}
                          <span className="absolute -bottom-6 right-0 text-[10px] font-bold text-text-muted">{step.endTime}ms</span>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute opacity-0 group-hover/step:opacity-100 bottom-full mb-2 bg-bg-tertiary border border-slate-200 rounded-lg p-2 text-[10px] pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-xl">
                            <p className="font-bold text-accent-secondary">{step.processId}</p>
                            <p className="text-text-muted">Duration: {step.endTime - step.startTime}ms</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-8" /> {/* Spacer for timestamps */}
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="space-y-6">
                    <div className="flex items-center gap-3">
                      <ListTodo size={20} className="text-accent-primary" />
                      <h3 className="font-bold">Process Metrics</h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-text-muted font-bold tracking-wider uppercase text-[10px]">
                          <th className="pb-2">Process</th>
                          <th className="pb-2 text-center">Wait</th>
                          <th className="pb-2 text-right">TAT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        {result.metrics.map(m => (
                          <tr key={m.id} className="hover:bg-slate-100 transition-colors">
                            <td className="py-2.5 font-bold text-text-primary">{m.id}</td>
                            <td className="py-2.5 text-center text-accent-warning">{m.waitingTime}ms</td>
                            <td className="py-2.5 text-right text-accent-secondary">{m.turnaroundTime}ms</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </GlassCard>

                  <GlassCard className="bg-accent-primary/5 border-accent-primary/20 space-y-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-accent-success" />
                      <h3 className="font-bold">System Averages</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded-2xl border border-slate-200">
                        <div className="text-[10px] font-bold text-text-muted uppercase mb-1">Avg Waiting</div>
                        <div className="text-2xl font-black text-accent-warning">
                          {(result.metrics.reduce((a, b) => a + (b.waitingTime || 0), 0) / result.metrics.length).toFixed(2)}ms
                        </div>
                      </div>
                      <div className="p-4 bg-black/20 rounded-2xl border border-slate-200">
                        <div className="text-[10px] font-bold text-text-muted uppercase mb-1">Avg Turnaround</div>
                        <div className="text-2xl font-black text-accent-secondary">
                          {(result.metrics.reduce((a, b) => a + (b.turnaroundTime || 0), 0) / result.metrics.length).toFixed(2)}ms
                        </div>
                      </div>
                    </div>
                    <div className="p-4 glass rounded-xl border-accent-success/20 overflow-hidden relative group">
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="text-accent-warning" size={18} />
                          <span className="text-sm font-bold">Optimization Score</span>
                        </div>
                        <span className="text-xl font-black text-accent-success">A+</span>
                      </div>
                      <div className="absolute top-0 left-0 h-1 bg-accent-success transition-all duration-1000 w-[92%]" />
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {result && !showComplexity && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <button
                onClick={() => setShowComplexity(true)}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-accent-primary flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <BarChart3 size={18} className="group-hover:rotate-12 transition-transform" />
                Analyze Time Complexity
              </button>
            </motion.div>
          )}
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-accent-secondary" />
              <h3 className="font-bold font-accent">Comparative Analysis</h3>
            </div>
            <div className="h-[300px]">
              {comparisonData ? (
                <Bar 
                  data={comparisonData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { 
                        display: true, 
                        position: 'bottom',
                        labels: { color: '#6b6f8a', boxWidth: 10, font: { size: 10, weight: 'bold' } } 
                      } 
                    },
                    scales: {
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b6f8a', font: { size: 10 } } },
                      x: { grid: { display: false }, ticks: { color: '#6b6f8a', font: { size: 10 } } }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-center space-y-4 px-6 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Clock className="opacity-20" size={48} />
                  <p className="text-xs font-semibold uppercase tracking-wider leading-relaxed">
                    Execute a simulation to see multi-algorithm performance mapping
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="bg-accent-warning/5 border-accent-warning/20">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-accent-warning" />
              <h4 className="font-bold text-sm tracking-tight">Technical Advisory</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {algorithm === 'SJF' 
                ? 'Shortest Job First (SJF) is non-preemptive. It minimizes average waiting time by prioritizing the fastest tasks among those available at the start or completion of a job.'
                : algorithm === 'SRTF'
                ? 'Shortest Remaining Time First (SRTF) is the preemptive version of SJF. It context-switches whenever a new process arrives with a shorter remaining time than the current one, providing minimal possible average wait time.'
                : algorithm === 'RR' 
                ? 'Round Robin (RR) ensures fair CPU shares using preemption. The performance curve is highly sensitive to the Time Quantum; too large becomes FCFS, too small increases overhead.'
                : algorithm === 'Priority'
                ? 'Priority Scheduling assigns each process a priority level. The CPU is allocated to the process with the highest priority (lowest numerical value). High-priority tasks execute first, but low-priority ones may suffer from starvation.'
                : 'First-Come First-Serve (FCFS) follows a literal queue architecture. It is non-preemptive and can suffer from the "Convoy Effect" where small tasks wait indefinitely behind monolithic ones.'}
            </p>
          </GlassCard>

          {/* Complexity Analyzer */}
          <ComplexityAnalyzer algorithm={algorithm} triggered={result !== null} />
        </div>
      </div>

      {/* Time Complexity Analysis Section */}
      <ComplexityBenchmark 
        category="SCHEDULING" 
        selectedAlgorithm={algorithm} 
        triggered={showComplexity} 
      />

      {/* Learning Resources */}
      <LearningResources topic="scheduling" />
    </div>
  );
};

export default SchedulingSimulator;
