
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Radio } from 'lucide-react';

const IsraelMap: React.FC = () => {
  return (
    <div className="glass rounded-[2.5rem] p-6 border-white/10 shadow-2xl overflow-hidden relative group transition-all hover:bg-white/10">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Radio size={16} className="text-orange-500 animate-pulse" />
          </div>
          <h3 className="font-bold text-white text-base tracking-tight">מיקום התפוח</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ea580c]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/10"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8 bg-black/20 rounded-[2rem] border border-white/5 relative shadow-inner">
        <div className="relative w-32 h-64">
          <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <defs>
              <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <path 
              d="M45,10 L55,10 L60,30 L60,60 L55,100 L50,150 L55,190 L45,190 L40,150 L45,100 L40,60 L40,30 Z" 
              fill="url(#cyberGradient)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
            />
            
            {/* Active Player Marker */}
            <motion.g
              initial={{ x: 50, y: 70 }}
              animate={{ 
                y: [70, 72, 70],
                filter: ["drop-shadow(0 0 5px #ea580c)", "drop-shadow(0 0 15px #ea580c)", "drop-shadow(0 0 5px #ea580c)"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="0" cy="0" r="10" className="fill-orange-500/10" />
              <circle cx="0" cy="0" r="4" className="fill-orange-500" />
              <motion.circle 
                cx="0" cy="0" r="15" 
                stroke="#ea580c" 
                strokeWidth="1"
                fill="none"
                animate={{ scale: [0.8, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.g>
          </svg>
        </div>
        
        <div className="absolute top-4 left-4 p-3 glass rounded-2xl border border-white/5 text-left">
           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</div>
           <div className="text-xs text-green-400 font-semibold flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
             LIVE_FEED
           </div>
        </div>

        <div className="absolute bottom-6 right-6 text-right">
          <div className="flex items-center gap-2 justify-end text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-tighter">Current Host</span>
            <MapPin size={10} />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">תל אביב <span className="text-orange-500 text-xs">Jaffa</span></div>
        </div>
      </div>
    </div>
  );
};

export default IsraelMap;
