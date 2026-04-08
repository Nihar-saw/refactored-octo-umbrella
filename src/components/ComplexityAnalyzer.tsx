import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, ChevronRight, CheckCircle2, XCircle, Zap, Activity, Lock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { complexityData, getComplexityCurve, type ComplexityType } from '../services/complexity';
import { addXP } from '../services/gamification';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ComplexityAnalyzerProps {
  algorithm: string;
  triggered: boolean; // becomes true when simulation runs
}

const COMPLEXITY_COLORS: Record<ComplexityType, { main: string; dim: string; label: string }> = {
  'O(1)':       { main: '#00e676', dim: 'rgba(0,230,118,0.12)',   label: 'Constant' },
  'O(log n)':   { main: '#00d4ff', dim: 'rgba(0,212,255,0.12)',   label: 'Logarithmic' },
  'O(n)':       { main: '#7c4dff', dim: 'rgba(124,77,255,0.12)',  label: 'Linear' },
  'O(n log n)': { main: '#ffc107', dim: 'rgba(255,193,7,0.12)',   label: 'Linearithmic' },
  'O(n^2)':     { main: '#ff1744', dim: 'rgba(255,23,68,0.12)',   label: 'Quadratic' },
};

const ALL_COMPLEXITIES: ComplexityType[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'];
const N_LABELS = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

type Phase = 'idle' | 'quiz' | 'correct' | 'wrong';

const ComplexityAnalyzer: React.FC<ComplexityAnalyzerProps> = ({ algorithm, triggered }) => {
  const info = complexityData[algorithm];
  const [inputSize, setInputSize] = useState(50);
  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedGuess, setSelectedGuess] = useState<ComplexityType | null>(null);

  // When simulation runs (triggered flips to true), show the quiz
  useEffect(() => {
    if (triggered) {
      setPhase('quiz');
      setSelectedGuess(null);
    } else {
      setPhase('idle');
      setSelectedGuess(null);
    }
  }, [triggered]);

  // Reset quiz when algorithm changes mid-session
  useEffect(() => {
    if (triggered) {
      setPhase('quiz');
      setSelectedGuess(null);
    }
  }, [algorithm]);

  if (!info) return null;

  const highlightType = info.type;
  const estimatedCost = getComplexityCurve(highlightType, inputSize);
  const maxCost = getComplexityCurve('O(n^2)', 100);
  const colors = COMPLEXITY_COLORS[highlightType];

  const chartData = {
    labels: N_LABELS,
    datasets: ALL_COMPLEXITIES.map(type => {
      const isHighlighted = type === highlightType;
      const c = COMPLEXITY_COLORS[type];
      return {
        label: type,
        data: N_LABELS.map(n => Math.min(getComplexityCurve(type, n), maxCost * 1.05)),
        borderColor: isHighlighted ? c.main : 'rgba(150,150,180,0.18)',
        borderWidth: isHighlighted ? 2.5 : 1,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
        backgroundColor: isHighlighted ? c.dim : 'transparent',
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1b2e',
        titleColor: '#b0b3c1',
        bodyColor: '#e0e3f0',
        borderColor: 'rgba(124,77,255,0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items: any[]) => `n = ${items[0]?.label}`,
          label: (item: any) => {
            const type = item.dataset.label as ComplexityType;
            const isH = type === highlightType;
            return `${isH ? '★ ' : ''}${type}: ${item.raw.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Input Size (n)', color: '#6b6f8a', font: { size: 10, weight: 'bold' as const } },
        grid: { color: 'rgba(124,77,255,0.06)' },
        ticks: { color: '#6b6f8a', font: { size: 9 } },
      },
      y: {
        title: { display: true, text: 'Execution Cost', color: '#6b6f8a', font: { size: 10, weight: 'bold' as const } },
        grid: { color: 'rgba(124,77,255,0.06)' },
        ticks: { color: '#6b6f8a', font: { size: 9 }, maxTicksLimit: 6 },
        max: maxCost * 1.1,
        min: 0,
      }
    }
  };

  const handleGuess = (guess: ComplexityType) => {
    if (phase !== 'quiz') return;
    setSelectedGuess(guess);
    if (guess === highlightType) {
      setPhase('correct');
      addXP(25);
    } else {
      setPhase('wrong');
    }
  };

  // ── IDLE STATE ─────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="glass rounded-2xl p-6 border border-slate-200 border-dashed">
        <div className="flex flex-col items-center justify-center text-center gap-3 py-4 opacity-50">
          <Lock size={32} className="text-text-muted" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">Complexity Analyzer</p>
            <p className="text-[11px] text-text-muted font-medium mt-1">Execute the simulation to unlock</p>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ STATE ─────────────────────────────────────────────────
  if (phase === 'quiz') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass rounded-2xl p-6 border border-accent-warning/30 bg-accent-warning/5"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-accent-warning/20">
              <Zap size={18} className="text-accent-warning" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Guess the Complexity</h3>
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-widest">Algorithm Challenge</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-medium mb-5">
            What is the <span className="font-black text-text-primary">worst-case time complexity</span> of{' '}
            <span className="font-black text-accent-secondary">{algorithm}</span>?
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {ALL_COMPLEXITIES.map(type => (
              <button
                key={type}
                onClick={() => handleGuess(type)}
                className="flex items-center justify-center px-3 py-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-black text-text-secondary hover:border-accent-warning/50 hover:bg-accent-warning/10 hover:text-accent-warning transition-all font-mono active:scale-95"
              >
                {type}
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-text-muted mt-4 font-medium italic">
            A correct guess earns +25 XP ⚡
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── REVEALED STATE (correct / wrong) ───────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="revealed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="space-y-5"
      >
        {/* Quiz result banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${
            phase === 'correct'
              ? 'bg-accent-success/10 border-accent-success/30'
              : 'bg-accent-danger/10 border-accent-danger/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${phase === 'correct' ? 'bg-accent-success/20' : 'bg-accent-danger/20'}`}>
              {phase === 'correct'
                ? <CheckCircle2 size={18} className="text-accent-success" />
                : <XCircle size={18} className="text-accent-danger" />
              }
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wider ${phase === 'correct' ? 'text-accent-success' : 'text-accent-danger'}`}>
                {phase === 'correct' ? 'Correct! +25 XP earned' : `Wrong! Correct answer: ${highlightType}`}
              </p>
              {selectedGuess && phase === 'wrong' && (
                <p className="text-[10px] text-text-muted mt-0.5">You guessed: <span className="font-black font-mono">{selectedGuess}</span></p>
              )}
            </div>
          </div>
          <button
            onClick={() => { setPhase('quiz'); setSelectedGuess(null); }}
            className="flex items-center gap-1 text-[10px] font-black text-text-muted hover:text-accent-primary transition-colors whitespace-nowrap"
          >
            Retry <ChevronRight size={12} />
          </button>
        </motion.div>

        {/* Complexity Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl" style={{ background: colors.dim }}>
              <Brain size={18} style={{ color: colors.main }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Complexity Analyzer</h3>
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-widest">Algorithm Intelligence</span>
            </div>
          </div>

          <div className="rounded-xl p-4 mb-4 border" style={{ background: colors.dim, borderColor: `${colors.main}33` }}>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Worst Case</div>
            <div className="text-3xl font-black tracking-tight" style={{ color: colors.main }}>
              {info.time.worst}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Best', value: info.time.best },
              { label: 'Average', value: info.time.average },
              { label: 'Space', value: info.space },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-100 rounded-xl p-3 text-center border border-slate-200">
                <div className="text-[9px] font-black text-text-muted uppercase mb-1">{label}</div>
                <div className="text-xs font-black text-text-primary font-mono">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Graph Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={16} className="text-accent-secondary" />
            <h4 className="font-bold text-sm">Growth Curve Visualization</h4>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_COMPLEXITIES.map(type => {
              const c = COMPLEXITY_COLORS[type];
              const isH = type === highlightType;
              return (
                <div
                  key={type}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all"
                  style={isH
                    ? { background: c.dim, borderColor: `${c.main}66`, color: c.main }
                    : { background: 'transparent', borderColor: 'rgba(150,150,180,0.15)', color: '#6b6f8a' }
                  }
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isH ? c.main : '#6b6f8a' }} />
                  {type}
                </div>
              );
            })}
          </div>

          <div className="h-[200px] mb-4">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Input Size</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-md" style={{ background: colors.dim, color: colors.main }}>
                n = {inputSize}
              </span>
            </div>
            <input
              type="range" min={1} max={100} value={inputSize}
              onChange={(e) => setInputSize(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: colors.main }}
            />
            <div className="flex justify-between text-[9px] text-text-muted font-bold">
              <span>n=1</span><span>n=50</span><span>n=100</span>
            </div>
          </div>

          {/* Estimated Cost */}
          <div className="mt-4 p-3 rounded-xl border" style={{ background: colors.dim, borderColor: `${colors.main}33` }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-text-muted uppercase mb-0.5">Est. Cost at n={inputSize}</div>
                <div className="text-lg font-black font-mono" style={{ color: colors.main }}>
                  {estimatedCost < 1000
                    ? estimatedCost.toFixed(1)
                    : (estimatedCost / 1000).toFixed(1) + 'k'} ops
                </div>
              </div>
              <Activity size={28} style={{ color: colors.main, opacity: 0.4 }} />
            </div>
          </div>
        </motion.div>

        {/* Educational Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5 border border-slate-200 bg-accent-primary/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded-full" style={{ background: colors.main }} />
            <h4 className="font-bold text-xs uppercase tracking-widest text-text-muted">Why {highlightType}?</h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">{info.reason}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplexityAnalyzer;
