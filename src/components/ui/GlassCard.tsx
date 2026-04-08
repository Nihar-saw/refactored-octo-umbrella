import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = true,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,77,255,0.08)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
