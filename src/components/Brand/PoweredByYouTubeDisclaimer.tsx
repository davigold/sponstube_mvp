
import React from 'react';
import { Youtube } from 'lucide-react';

export const PoweredByYouTubeDisclaimer = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity ${className}`}>
      <Youtube size={14} className="text-slate-500 dark:text-slate-400" />
      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        Integrates with YouTube Data API. Not endorsed by Google/YouTube.
      </span>
    </div>
  );
};
