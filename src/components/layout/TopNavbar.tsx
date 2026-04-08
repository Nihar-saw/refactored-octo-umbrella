import React from 'react';
import { Bell, Search, User } from 'lucide-react';


const TopNavbar: React.FC = () => {
  


  return (
    <header className="h-20 glass border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-secondary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search missions, docs..." 
            className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-accent-secondary/50 focus:bg-slate-100 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">


        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">


          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-text-muted hover:text-text-primary relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-danger rounded-full border-2 border-bg-primary" />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-primary group-hover:text-accent-secondary transition-colors">Admin User</p>
              <p className="text-xs text-text-muted font-medium">Scholar Status</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent-primary/20 to-accent-secondary/20 border border-slate-200 flex items-center justify-center group-hover:border-accent-secondary/50 transition-all overflow-hidden relative">
              <User size={22} className="text-accent-secondary" />
              <div className="absolute inset-0 bg-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
