
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import PotatoIcon from '../components/PotatoIcon';
import CountdownTimer from '../components/CountdownTimer';
import IsraelMap from '../components/IsraelMap';
import BottomNav, { TabType } from '../components/BottomNav';
import { GoogleGenAI } from '@google/genai';
import { Plus, QrCode, Bell, ChevronDown, MapPin, Zap, Flame, Target, Trophy, Users, ShieldCheck, Settings, Clock, LogOut } from 'lucide-react';

const Index: React.FC = () => {
  const { state, activeGroup, currentUser, passPotato, createGroup, switchGroup, getLeaderboard, logout } = useGameState();
  const [activeTab, setActiveTab] = useState<TabType>('game');
  const [narration, setNarration] = useState("המשחק התחיל! אל תיתקע עם התפוח...");
  const [isScanning, setIsScanning] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState("");
  const [days, setDays] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  const isHolder = activeGroup?.currentHolderId === currentUser?.id;

  const handleBurn = async () => {
    setIsBurned(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a very funny, short Hebrew message (1 sentence) for ${currentUser?.name} who lost a game of Hot Potato in Israel and got burned. Use slang like "פיתה" or "שרוף". Mention they failed to pass it.`,
      });
      setNarration(response.text || "נשרפת! היה לך את כל הזמן שבעולם...");
    } catch (e) {
      setNarration("אאוץ'! יצאת פיתה שרופה! היו לך ימים להעביר...");
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Mock passing to someone else in the group
      const others = activeGroup.members.filter(m => m.id !== currentUser?.id);
      const targetUser = others[Math.floor(Math.random() * others.length)];
      if (targetUser) {
        passPotato(targetUser.id);
        setNarration(`הצלחת! התפוח טס ל${targetUser.name}. עכשיו הם בלחץ!`);
      } else {
        setNarration("אין אף אחד בסביבה! שלח קישור הצטרפות.");
      }
      setIsScanning(false);
    }, 1200);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const durationMs = days * 24 * 60 * 60 * 1000;
    createGroup(newGroupName, durationMs);
    setIsCreating(false);
    setNewGroupName("");
    setDays(1);
    setNarration(`בום! קבוצת "${newGroupName}" באוויר. סיבוב של ${days} ימים התחיל!`);
  };

  if (!currentUser) return null;

  // --- RENDERING VIEWS ---

  const renderGameView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={narration}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="glass rounded-[2rem] p-6 mb-10 border-white/10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]" />
          <div className="flex gap-5 items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 border border-orange-500/30">
               <Zap className="text-orange-500 animate-pulse" size={24} fill="currentColor" />
            </div>
            <p className="text-xl font-bold text-white leading-tight tracking-tight">"{narration}"</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative mb-14 flex flex-col items-center w-full">
        <PotatoIcon isHot={isHolder} size="lg" />
        
        <div className="mt-12 w-full max-w-xs relative">
          {isHolder ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">זמן שנותר להעברה</span>
                </div>
                <CountdownTimer 
                  startTime={activeGroup?.timerStart || Date.now()} 
                  duration={activeGroup?.duration || (3 * 24 * 60 * 60 * 1000)}
                  onFinish={handleBurn}
                />
              </div>
              <motion.button
                onClick={handleScan}
                disabled={isScanning}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full relative py-6 px-10 rounded-[2.5rem] bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold text-2xl shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] border-t border-white/30 overflow-hidden group"
              >
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <QrCode size={28} className="group-hover:rotate-12 transition-transform" />
                  <span className="tracking-tighter">{isScanning ? 'סורק...' : 'תעביר את זה!'}</span>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/5 p-8 rounded-[4rem] border border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group relative">
                 <div className="w-56 h-56 bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center rounded-[3.5rem] relative shadow-2xl border border-white/5 overflow-hidden">
                    <QrCode size={140} className="text-slate-500 group-hover:text-orange-400 transition-all duration-500" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[11px] font-bold px-6 py-2 rounded-full shadow-[0_10px_20px_rgba(234,88,12,0.4)] border-2 border-slate-900 tracking-widest whitespace-nowrap">סרוק אותי לקבלת התפוח</div>
                 </div>
              </motion.div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-slate-900/40 px-5 py-2 rounded-full border border-white/5">
                  <Target size={14} className="text-orange-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ממתין להעברה</span>
                </div>
                <p className="font-bold text-white text-2xl tracking-tight leading-tight">התפוח כרגע אצל <br/><span className="text-orange-500 text-3xl font-bold">{activeGroup?.members.find(m => m.id === activeGroup.currentHolderId)?.name}</span></p>
                <div className="text-[10px] text-slate-500 font-bold">הסיבוב הוגדר ל-{Math.round((activeGroup?.duration || 0) / (24 * 60 * 60 * 1000))} ימים</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full mt-6">
        <IsraelMap />
        <div className="glass rounded-[2.5rem] p-8 border-white/10 shadow-2xl text-right relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
             <span className="flex items-center gap-2 text-[10px] bg-white/5 text-orange-400 px-4 py-2 rounded-full font-bold border border-white/5 uppercase tracking-widest">
              <Zap size={10} fill="currentColor" /> Live Feed
             </span>
             <h3 className="font-bold text-white text-lg tracking-tight">עדכונים אחרונים</h3>
          </div>
          <div className="space-y-6 relative z-10">
            {state.history.filter(e => e.type === 'PASS').slice(0, 3).map((event, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={event.id} className="flex items-start gap-5 group/item">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <img src={state.groups.flatMap(g => g.members).find(m => m.id === event.from)?.avatar} className="w-8 h-8 rounded-lg" alt="" />
                </div>
                <div className="flex-1 border-b border-white/5 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{new Date(event.timestamp).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</span>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-500/70 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10"><MapPin size={8} /> {state.groups.flatMap(g => g.members).find(m => m.id === event.from)?.city || 'ישראל'}</div>
                  </div>
                  <p className="text-white font-semibold text-sm leading-relaxed tracking-tight">{event.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderGroupsView = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Users className="text-orange-500" /> הקבוצות שלי
      </h2>
      <div className="grid gap-4">
        {state.groups.map(group => (
          <motion.div 
            key={group.id} 
            onClick={() => { switchGroup(group.id); setActiveTab('game'); }}
            whileHover={{ scale: 1.02 }}
            className={`glass p-6 rounded-[2rem] border border-white/10 flex justify-between items-center cursor-pointer transition-all ${state.activeGroupId === group.id ? 'ring-2 ring-orange-500 bg-white/10' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Users size={28} />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-white text-xl">{group.name}</h3>
                <p className="text-slate-400 text-xs font-semibold">{group.members.length} חברים • סבב של {Math.round((group.duration || 0) / (24 * 60 * 60 * 1000))} ימים</p>
              </div>
            </div>
            <div className="text-left">
              {group.currentHolderId === currentUser?.id ? (
                <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">התפוח אצלך!</span>
              ) : (
                <span className="text-xs bg-white/5 text-slate-400 px-3 py-1 rounded-full font-bold">פעיל</span>
              )}
            </div>
          </motion.div>
        ))}
        <motion.button 
          onClick={() => setIsCreating(true)}
          className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-white/30 transition-all"
        >
          <Plus size={32} />
          <span className="font-bold">קבוצה חדשה</span>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderLeaderboardView = () => {
    const leaderboard = getLeaderboard();
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-8">
        <div className="text-center space-y-2">
          <Trophy className="mx-auto text-yellow-500" size={48} />
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">היכל התהילה</h2>
          <p className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">מי מעביר הכי מהר?</p>
        </div>
        
        <div className="glass rounded-[2.5rem] overflow-hidden border-white/10">
          {leaderboard.length > 0 ? leaderboard.map((player, i) => (
            <div key={i} className={`flex items-center gap-4 p-5 border-b border-white/5 last:border-0 ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
              <div className="w-8 text-center font-bold text-slate-500">{i + 1}</div>
              <img src={player.avatar} className="w-12 h-12 rounded-2xl border border-white/10" alt="" />
              <div className="flex-1 text-right">
                <h4 className="font-bold text-white text-lg">{player.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">מסירות מוצלחות</p>
              </div>
              <div className="text-2xl font-bold text-orange-500">{player.passes}</div>
            </div>
          )) : (
            <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">אין נתונים עדיין... תתחילו להעביר!</div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderProfileView = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-8">
      <div className="glass p-10 rounded-[3rem] border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <img src={currentUser?.avatar} className="w-24 h-24 rounded-[2rem] mx-auto border-4 border-white/10 mb-4 shadow-2xl" alt="" />
          <h2 className="text-3xl font-bold text-white tracking-tighter">{currentUser?.name}</h2>
          <p className="text-orange-500 font-semibold flex items-center justify-center gap-2 mt-1">
            <MapPin size={14} /> {currentUser?.city}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[2rem] border-white/10 text-center">
          <span className="block text-3xl font-bold text-white">{state.history.filter(e => e.from === currentUser?.id).length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">מסירות</span>
        </div>
        <div className="glass p-6 rounded-[2rem] border-white/10 text-center">
          <span className="block text-3xl font-bold text-white">{isBurned ? 1 : 0}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">כוויות</span>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={logout} className="w-full glass py-4 rounded-2xl flex items-center justify-between px-6 text-red-500 font-semibold hover:bg-white/10 transition-all border-red-500/20">
          <LogOut size={18} />
          <div className="flex items-center gap-3">
            <span>התנתקות</span>
          </div>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-32 px-5 pt-8 max-w-lg mx-auto relative overflow-x-hidden">
      <header className="flex justify-between items-center mb-10">
        <div className="flex flex-col">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
               <Flame size={20} className="text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-none">תפוח חם</h1>
          </motion.div>
          
          {activeTab === 'game' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
              <div className="relative inline-flex items-center group">
                <select 
                  value={activeGroup?.id} 
                  onChange={(e) => switchGroup(e.target.value)}
                  className="appearance-none bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 pl-9 pr-4 rounded-full text-xs transition-all border border-white/10 cursor-pointer outline-none backdrop-blur-md"
                >
                  {state.groups.map(g => (
                    <option key={g.id} value={g.id} className="text-slate-900 font-semibold">{g.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute left-3 text-orange-500" />
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-2xl glass flex items-center justify-center text-white border-white/10 shadow-xl">
            <Bell size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsCreating(true)} className="w-11 h-11 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg border border-white/20">
            <Plus size={24} />
          </motion.button>
        </div>
      </header>

      <main className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          {activeTab === 'game' && <div key="game" className="w-full">{renderGameView()}</div>}
          {activeTab === 'groups' && <div key="groups" className="w-full">{renderGroupsView()}</div>}
          {activeTab === 'leaderboard' && <div key="leaderboard" className="w-full">{renderLeaderboardView()}</div>}
          {activeTab === 'profile' && <div key="profile" className="w-full">{renderProfileView()}</div>}
        </AnimatePresence>
      </main>

      {/* Burned Overlay */}
      <AnimatePresence>
        {isBurned && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-red-950/95 flex flex-col items-center justify-center p-10 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <Flame size={120} className="text-red-500 mb-8" fill="currentColor" />
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">יצאת פיתה!</h2>
            <p className="text-red-200 text-xl font-bold mb-12 italic leading-relaxed tracking-tight">"{narration}"</p>
            <button 
              onClick={() => setIsBurned(false)}
              className="bg-white text-red-600 px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-slate-100 transition-all"
            >
              נסה שוב (אם יש לך אומץ)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ y: "100%", scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.9 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-slate-900 w-full max-w-md rounded-t-[3.5rem] sm:rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-orange-600 to-red-600" />
              <div className="text-right mb-10">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">קבוצה חדשה</h2>
                <p className="text-slate-400 font-semibold text-sm">התחל הרפתקה חדשה עם החברים</p>
              </div>
              <form onSubmit={handleCreateGroup} className="space-y-10 text-right">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">שם הקבוצה</label>
                  <input 
                    type="text" 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/5 rounded-[1.5rem] p-5 text-xl font-bold text-white focus:border-orange-500 focus:bg-white/10 transition-all text-right outline-none placeholder:text-slate-700"
                    placeholder="הפרלמנט של יום שישי"
                    required
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col items-start">
                       <span className="text-xs font-bold text-orange-500 uppercase mb-1">משך זמן</span>
                       <span className="text-5xl font-bold text-white leading-none tracking-tighter">{days}<span className="text-lg text-slate-600 ml-1">ימים</span></span>
                    </div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">זמן סיבוב</label>
                  </div>
                  <input 
                    type="range" min="1" max="7" step="1" value={days} onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-4 pt-6">
                  <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-6 rounded-[2rem] shadow-2xl text-2xl tracking-tighter border-t border-white/20">
                    התחלנו!
                  </motion.button>
                  <button type="button" onClick={() => setIsCreating(false)} className="w-full py-2 text-slate-500 font-semibold hover:text-white transition-colors text-sm uppercase tracking-widest">ביטול פעולה</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
