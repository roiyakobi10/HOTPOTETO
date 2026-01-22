
import React from 'react';
import { motion } from 'framer-motion';
import { POTATO_SVG } from '../constants';

interface PotatoIconProps {
  isHot?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PotatoIcon: React.FC<PotatoIconProps> = ({ isHot = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Intense Radial Glow */}
      {isHot && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 rounded-full blur-[60px]"
        />
      )}

      {/* Main Potato Container */}
      <motion.div
        animate={isHot ? {
          rotate: [0, -3, 3, -3, 3, 0],
          y: [0, -8, 0],
          scale: [1, 1.05, 1],
        } : {}}
        transition={isHot ? {
          rotate: { repeat: Infinity, duration: 0.15 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          scale: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
        } : {}}
        className="relative z-10 w-full h-full drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]"
      >
        <div className="relative w-full h-full">
          {POTATO_SVG}
          {/* Inner Heat Glow Effect */}
          {isHot && (
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 bg-orange-500 mix-blend-overlay rounded-full blur-sm"
            />
          )}
        </div>
      </motion.div>

      {/* Dynamic Steam & Sparks */}
      {isHot && (
        <div className="absolute top-0 w-full h-full pointer-events-none z-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0, scale: 0.2 }}
              animate={{ 
                y: -140, 
                opacity: [0, 1, 0], 
                scale: [0.2, 1.2, 2.5],
                x: Math.sin(i * 1.5) * 40
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-16 bg-white/30 blur-xl rounded-full"
            />
          ))}
          {/* Sparks */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={`spark-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
              }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.3 }}
              className="absolute left-1/2 top-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PotatoIcon;
