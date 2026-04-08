import React from 'react';
import { 
  Terminal, 
  BarChart3, 
  Lock, 
  ShieldAlert, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from './ui/GlassCard';

const MissionCard: React.FC<{
  title: string;
  description: string;
  id: string;
  icon: React.ElementType;
  unlocked: boolean;
  path: string;
  index: number;
}> = ({ title, description, icon: Icon, unlocked, path, index }) => {
  // Helper for class merging
  const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
  const clsx = cn;

  return (
    <GlassCard 
      delay={index * 0.12}
      className={clsx(
        "flex flex-col h-full",
        !unlocked && "opacity-60 grayscale-[0.5] border-dashed border-slate-200"
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "p-3 rounded-2xl",
          unlocked ? "bg-accent-primary/10 text-accent-secondary" : "bg-slate-100 text-text-muted"
        )}>
          <Icon size={28} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-secondary transition-colors truncate">
          {title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
          {description}
        </p>
      </div>

      <Link
        to={unlocked ? path : '#'}
        onClick={(e) => !unlocked && e.preventDefault()}
        className={cn(
          "flex items-center justify-between p-4 rounded-xl font-bold transition-all group",
          unlocked 
            ? "bg-slate-100 hover:bg-accent-primary hover:text-white" 
            : "bg-slate-200 text-text-muted cursor-not-allowed"
        )}
      >
        <span>{unlocked ? 'Start Mission' : 'Locked'}</span>
        {unlocked ? (
          <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
        ) : (
          <Lock size={18} />
        )}
      </Link>
    </GlassCard>
  );
};

const Dashboard: React.FC = () => {
  const missions = [
    {
      id: 'scheduling',
      title: 'CPU Scheduling',
      description: 'Master FCFS, SJF, and Round Robin algorithms. Predict process flows and optimize performance.',
      icon: Terminal,
      path: '/scheduling'
    },
    {
      id: 'page-replacement',
      title: 'Page Replacement',
      description: 'Optimize memory hits using FIFO and LRU. Learn how OS manages limited frame capacity.',
      icon: BarChart3,
      path: '/page-replacement'
    },
    {
      id: 'deadlock',
      title: 'Deadlock Control',
      description: 'Explore Banker\'s Algorithm to ensure system safety and resource allocation.',
      icon: ShieldAlert,
      path: '/deadlock'
    }
  ];

  return (
    <div className="animate-fade-in space-y-12 pb-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Mission <span className="text-gradient">Control</span>
          </h1>
          <p className="text-text-secondary max-w-2xl font-medium">
            Welcome back. Your OS training environment is ready. Master the core algorithms to deepen your understanding of system internals.
          </p>
        </div>
      </section>

      {/* Missions Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-accent-secondary rounded-full" />
            <h2 className="text-2xl font-bold tracking-tight">Active Training Modules</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {missions.map((mission, i) => (
            <MissionCard
              key={mission.id}
              index={i}
              {...mission}
              unlocked={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
