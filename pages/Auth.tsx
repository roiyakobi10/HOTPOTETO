
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { CITIES } from '../constants';
import { Flame, MapPin, ArrowLeft } from 'lucide-react';
import PotatoIcon from '../components/PotatoIcon';

const Auth: React.FC = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const { login } = useGameState();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name, city);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12"
      >
        <PotatoIcon isHot size="lg" />
      </motion.div>

      <div className="glass w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl relative z-10 text-right">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-orange-600 mb-6 shadow-xl shadow-orange-600/20">
            <Flame size={32} className="text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">תפוח חם ישראל</h1>
          <p className="text-slate-400 font-semibold tracking-wide">אל תיתקע עם התפוח ביד!</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">איך קוראים לך?</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הכנס שם..."
              className="w-full bg-white/5 border-2 border-white/5 rounded-[1.5rem] p-5 text-xl font-bold text-white focus:border-orange-500 focus:bg-white/10 transition-all text-right outline-none placeholder:text-slate-700"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">איפה אתה נמצא?</label>
            <div className="relative">
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/5 rounded-[1.5rem] p-5 text-xl font-bold text-white focus:border-orange-500 focus:bg-white/10 transition-all text-right outline-none appearance-none"
              >
                {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
              <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
            </div>
          </div>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-6 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] text-2xl tracking-tighter border-t border-white/20 flex items-center justify-center gap-4"
          >
            <ArrowLeft className="animate-bounce-x" />
            <span>בוא נשחק</span>
          </motion.button>
        </form>

        <footer className="mt-10 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Hot Potato Israel v2.0 • 2024</p>
        </footer>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Auth;
