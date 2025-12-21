
import React from 'react';
import { Mark } from './Mark';

interface LogoProps {
  className?: string;
  mode?: 'dark' | 'light';
  showMark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", mode = 'light', showMark = true }) => {
  const textColor = mode === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white';
  
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {showMark && <Mark className="text-[#FF0000]" size={28} />}
      <div className={`flex flex-col leading-none select-none ${textColor}`}>
        <span className="font-extrabold text-lg tracking-tight">
          Spons<span className="text-[#FF0000]">Tube</span>
        </span>
      </div>
    </div>
  );
};
