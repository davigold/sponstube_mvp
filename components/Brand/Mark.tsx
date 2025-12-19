
import React from 'react';

interface MarkProps {
  className?: string;
  size?: number;
}

export const Mark: React.FC<MarkProps> = ({ className = "text-[#FF0000]", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Container Shape (Soft Rect like YouTube) */}
      <rect x="2" y="5" width="28" height="22" rx="6" fill="currentColor" fillOpacity="0.15" />
      
      {/* Border */}
      <rect x="2" y="5" width="28" height="22" rx="6" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Play Triangle / Match Arrow */}
      <path 
        d="M12.5 11L21.5 16L12.5 21V11Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
