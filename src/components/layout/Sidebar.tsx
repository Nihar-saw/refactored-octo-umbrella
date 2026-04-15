import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Scheduling', icon: Terminal, path: '/scheduling' },
    { name: 'Page Replacement', icon: BarChart3, path: '/page-replacement' },
    { name: 'Deadlock Control', icon: ShieldAlert, path: '/deadlock' },
    { name: 'Complexity Lab', icon: Brain, path: '/complexity' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="glass border-r border-slate-200 flex flex-col h-screen sticky top-0 z-50 overflow-hidden transition-colors"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
              <Terminal size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gradient">OS Lab</span>
          </motion.div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted hover:text-text-primary"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-accent-primary/10 text-accent-secondary border border-accent-primary/20' 
                : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary border border-transparent'}
            `}
          >
            <item.icon size={22} className="shrink-0 transition-transform group-hover:scale-110" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>


    </motion.aside>
  );
};

export default Sidebar;
