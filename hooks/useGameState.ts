
import { useState, useEffect, useCallback } from 'react';
import { GameState, Group, GameStatus, User, GameEvent } from '../types';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const INITIAL_STATE: GameState = {
  activeGroupId: 'g1',
  groups: [
    {
      id: 'g1',
      name: 'חברים מהצבא',
      status: GameStatus.ACTIVE,
      members: [
        { id: 'u1', name: 'יוסי', city: 'תל אביב', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1' },
        { id: 'u2', name: 'דני', city: 'חיפה', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2' },
        { id: 'u3', name: 'מיכל', city: 'ירושלים', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3' }
      ],
      currentHolderId: 'u1',
      timerStart: Date.now(),
      duration: 3 * DAY_IN_MS,
    }
  ],
  currentUser: null,
  history: [
    { id: 'h1', type: 'PASS', timestamp: Date.now() - 100000, from: 'u2', to: 'u1', message: 'דני העביר את התפוח ליוסי!' }
  ]
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('hot_potato_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('hot_potato_state', JSON.stringify(state));
  }, [state]);

  const login = (name: string, city: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      city,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name + Date.now()}`
    };
    setState(prev => ({
      ...prev,
      currentUser: newUser,
      // Add user to the default group if it exists
      groups: prev.groups.map(g => g.id === 'g1' ? { ...g, members: [...g.members, newUser] } : g)
    }));
  };

  const activeGroup = state.groups.find(g => g.id === state.activeGroupId) || state.groups[0];

  const passPotato = useCallback((toUserId: string) => {
    setState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === prev.activeGroupId) {
          return {
            ...g,
            currentHolderId: toUserId,
            timerStart: Date.now()
          };
        }
        return g;
      });

      const newEvent: GameEvent = {
        id: Math.random().toString(36),
        type: 'PASS',
        timestamp: Date.now(),
        from: prev.currentUser?.id,
        to: toUserId,
        message: `${prev.currentUser?.name} העביר את התפוח!`
      };

      return {
        ...prev,
        groups: updatedGroups,
        history: [newEvent, ...prev.history]
      };
    });
  }, []);

  const createGroup = useCallback((name: string, durationMs: number) => {
    if (!state.currentUser) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const newGroup: Group = {
      id: newId,
      name,
      status: GameStatus.ACTIVE,
      members: [state.currentUser],
      currentHolderId: state.currentUser.id,
      timerStart: Date.now(),
      duration: durationMs
    };
    setState(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      activeGroupId: newId
    }));
  }, [state.currentUser]);

  const switchGroup = (id: string) => {
    setState(prev => ({ ...prev, activeGroupId: id }));
  };

  const getLeaderboard = () => {
    const scores: Record<string, {name: string, passes: number, avatar: string}> = {};
    state.history.forEach(e => {
      if (e.type === 'PASS' && e.from) {
        if (!scores[e.from]) {
          const user = state.groups.flatMap(g => g.members).find(m => m.id === e.from);
          scores[e.from] = { name: user?.name || 'משתמש לא ידוע', passes: 0, avatar: user?.avatar || '' };
        }
        scores[e.from].passes++;
      }
    });
    return Object.values(scores).sort((a, b) => b.passes - a.passes);
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    localStorage.removeItem('hot_potato_state');
  };

  return {
    state,
    activeGroup,
    passPotato,
    createGroup,
    switchGroup,
    currentUser: state.currentUser,
    login,
    logout,
    getLeaderboard
  };
}
