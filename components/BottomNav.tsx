
import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Trophy, User } from 'lucide-react';

export type TabType = 'game' | 'groups' | 'leaderboard' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { icon: any, label: string, id: TabType }[] = [
    { icon: Gamepad2, label: 'משחק', id: 'game' },
    { icon: Users, label: 'קבוצות', id: 'groups' },
    { icon: Trophy, label: 'דירוג', id: 'leaderboard' },
    { icon: User, label: 'פרופיל', id: 'profile' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
      <nav className="glass-dark rounded-full px-4 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto max-w-md w-full border border-white/20">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 flex flex-col items-center py-2 px-3 rounded-full transition-all relative ${
              activeTab === item.id ? 'text-orange-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="navGlow"
                className="absolute inset-0 bg-white/5 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2 : 1.5} />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
