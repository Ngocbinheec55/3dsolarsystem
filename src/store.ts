import { create } from 'zustand';

export type QuestionType = 'math' | 'spelling';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface SolarSystemState {
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;

  // Game state
  selectedPlanet: string | null;
  gameStatus: 'idle' | 'playing' | 'won';
  currentQuestion: Question | null;
  progress: number;
  totalQuestions: number;
  
  selectPlanet: (planetId: string, totalQuestions: number) => void;
  submitAnswer: (answer: string) => void;
  quitGame: () => void;
}

const generateQuestion = (): Question => {
  const isMath = Math.random() > 0.5;
  if (isMath) {
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * (10 - a + 1));
      const ans = a + b;
      const options = new Set<number>([ans]);
      while(options.size < 4) {
        options.add(Math.floor(Math.random() * 11));
      }
      return {
        id: Math.random().toString(),
        type: 'math',
        text: `${a} + ${b} = ?`,
        options: Array.from(options).sort(() => Math.random() - 0.5).map(String),
        correctAnswer: String(ans)
      };
    } else {
      const a = Math.floor(Math.random() * 11);
      const b = Math.floor(Math.random() * (a + 1));
      const ans = a - b;
      const options = new Set<number>([ans]);
      while(options.size < 4) {
        options.add(Math.floor(Math.random() * 11));
      }
      return {
        id: Math.random().toString(),
        type: 'math',
        text: `${a} - ${b} = ?`,
        options: Array.from(options).sort(() => Math.random() - 0.5).map(String),
        correctAnswer: String(ans)
      };
    }
  } else {
    const words = [
      { word: 'c_n mèo', missing: 'o', options: ['o', 'ô', 'ơ', 'a'] },
      { word: 'b_n học', missing: 'à', options: ['à', 'a', 'á', 'ả'] },
      { word: 'ng_i sao', missing: 'ô', options: ['ô', 'o', 'ơ', 'u'] },
      { word: 'm_t trời', missing: 'ặ', options: ['ặ', 'a', 'ă', 'â'] },
      { word: 'c_y xanh', missing: 'â', options: ['â', 'a', 'ă', 'e'] },
      { word: 'h_c sinh', missing: 'ọ', options: ['ọ', 'o', 'ô', 'ơ'] },
      { word: 'tr_ờng học', missing: 'ư', options: ['ư', 'u', 'o', 'ô'] },
      { word: 'q_ả bóng', missing: 'u', options: ['u', 'o', 'ô', 'a'] },
      { word: 'x_ đạp', missing: 'e', options: ['e', 'ê', 'a', 'i'] },
      { word: 'c_n chó', missing: 'o', options: ['o', 'ô', 'ơ', 'a'] },
    ];
    const q = words[Math.floor(Math.random() * words.length)];
    return {
      id: Math.random().toString(),
      type: 'spelling',
      text: `Điền chữ cái thích hợp: ${q.word}`,
      options: [...q.options].sort(() => Math.random() - 0.5),
      correctAnswer: q.missing
    };
  }
};

export const useStore = create<SolarSystemState>((set, get) => ({
  speedMultiplier: 1,
  setSpeedMultiplier: (speedMultiplier) => set({ speedMultiplier }),
  showOrbits: true,
  setShowOrbits: (showOrbits) => set({ showOrbits }),
  showLabels: true,
  setShowLabels: (showLabels) => set({ showLabels }),

  selectedPlanet: null,
  gameStatus: 'idle',
  currentQuestion: null,
  progress: 0,
  totalQuestions: 0,

  selectPlanet: (planetId, totalQuestions) => {
    set({
      selectedPlanet: planetId,
      gameStatus: 'playing',
      totalQuestions,
      progress: 0,
      currentQuestion: generateQuestion()
    });
  },

  submitAnswer: (answer) => {
    const state = get();
    if (state.gameStatus !== 'playing' || !state.currentQuestion) return;

    const isCorrect = answer === state.currentQuestion.correctAnswer;
    let newProgress = state.progress;
    
    if (isCorrect) {
      newProgress += 1;
    } else {
      newProgress = Math.max(0, newProgress - 1);
    }

    if (newProgress >= state.totalQuestions) {
      set({ progress: newProgress, gameStatus: 'won', currentQuestion: null });
    } else {
      set({ progress: newProgress, currentQuestion: generateQuestion() });
    }
  },

  quitGame: () => {
    set({ selectedPlanet: null, gameStatus: 'idle', currentQuestion: null, progress: 0, totalQuestions: 0 });
  }
}));
