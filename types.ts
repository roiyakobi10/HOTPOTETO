
export enum GameStatus {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  GAMEOVER = 'GAMEOVER'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  city: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  currentHolderId?: string;
  status: GameStatus;
  timerStart?: number;
  duration?: number;
}

export interface GameState {
  activeGroupId: string | null;
  groups: Group[];
  currentUser: User | null;
  history: GameEvent[];
}

export interface GameEvent {
  id: string;
  type: 'PASS' | 'BURN' | 'JOIN';
  timestamp: number;
  from?: string;
  to?: string;
  message: string;
}
