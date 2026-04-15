import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, PlayCircle, HelpCircle } from 'lucide-react';
import { learningContent } from '../data/learningContent';

interface LearningResourcesProps {
  topic: 'scheduling' | 'page-replacement' | 'deadlock';
}

// Inline YouTube SVG (lucide-react version may not include it)
const YtIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LearningResources: React.FC<LearningResourcesProps> = ({ topic }) => {
  const content = learningContent[topic];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!content) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="space-y-8 pt-4 pb-12 border-t border-slate-200 mt-4">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="w-1 h-10 rounded-full bg-linear-to-b from-accent-primary to-accent-secondary" />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Learning <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-text-secondary text-sm font-medium">
            Deepen your understanding with Q&amp;A and curated videos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ── Q&A Panel ───────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={18} className="text-accent-primary" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">
              Frequently Asked Questions
            </h3>
          </div>

          {content.qna.map((item, i) => (
            <motion.div
              key={i}
              layout
              className={`glass rounded-2xl border overflow-hidden transition-all duration-200 ${
                openIndex === i
                  ? 'border-accent-primary/30 shadow-[0_4px_24px_rgba(124,77,255,0.08)]'
                  : 'border-slate-200 hover:border-accent-primary/20'
              }`}
            >
              {/* Question row */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === i
                        ? 'bg-accent-primary text-white'
                        : 'bg-slate-200 text-text-muted'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-text-primary leading-snug">
                    {item.question}
                  </span>
                </div>
                <span className="mt-0.5 flex-shrink-0 text-text-muted">
                  {openIndex === i
                    ? <ChevronUp size={16} />
                    : <ChevronDown size={16} />
                  }
                </span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-200 bg-accent-primary/3">
                      <p className="text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ── YouTube Videos Panel ─────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <YtIcon size={18} className="text-red-500" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">
              Recommended Videos
            </h3>
          </div>

          {content.videos.map((video, i) => (
            <motion.a
              key={i}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl border border-slate-200 hover:border-red-400/40 hover:shadow-[0_4px_24px_rgba(255,0,0,0.06)] transition-all duration-200 flex gap-0 overflow-hidden group block"
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-[120px] sm:w-[140px]">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '90px' }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={32} className="text-white drop-shadow-lg" />
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-accent-primary transition-colors">
                    {video.title}
                  </h4>
                  <ExternalLink size={13} className="flex-shrink-0 text-text-muted mt-0.5" />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 mb-2">
                  <YtIcon size={11} className="text-red-500" />
                  <span className="text-[11px] font-bold text-red-500">{video.channel}</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.a>
          ))}

          {/* More resources link */}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              topic === 'scheduling'
                ? 'CPU Scheduling Algorithms OS'
                : topic === 'page-replacement'
                ? 'Page Replacement Algorithms Operating System'
                : 'Bankers Algorithm Deadlock OS'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-red-300/40 text-red-500 text-xs font-bold hover:bg-red-500/5 transition-colors"
          >
            <YtIcon size={14} />
            Search more on YouTube
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Bottom study tip */}
      <div className="glass rounded-2xl p-5 border border-accent-secondary/20 bg-accent-secondary/5 flex items-start gap-4">
        <BookOpen size={20} className="text-accent-secondary flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm mb-1">Study Tip</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            {topic === 'scheduling'
              ? 'Practice drawing Gantt charts by hand for each algorithm. Start with 3–4 processes, then work up to more complex examples. The best way to internalize scheduling is to simulate it yourself before relying on tools.'
              : topic === 'page-replacement'
              ? 'Try tracing through page reference strings manually with small frame sizes (3–4 frames). Compare FIFO and LRU side by side on the same string to see the difference in page faults clearly.'
              : 'Build the Allocation and Max matrices from scratch for a small example (3 processes, 3 resources). Manually compute the Need matrix and run the Safety Algorithm step by step — this is the most common exam question format.'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default LearningResources;
