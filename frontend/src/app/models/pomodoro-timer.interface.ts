export interface PomodoroTimer {
    minutes: number;
    seconds: number;
    isRunning: boolean;
    interval: any;
    sessionCount: number;
    sessionMessage: string;
    workMinutes: number;
    shortBreakMinutes: number;
    selectedCycles: number;
    totalHours: number;
    totalMinutes: number;
    cycleProposals: string[];
    isWorkMode: boolean;
    isBreakMode: boolean;
  }
  