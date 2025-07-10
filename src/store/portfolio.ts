import { create } from 'zustand';

interface PortfolioState {
  currentSection: string;
  isMenuOpen: boolean;
  theme: 'light' | 'dark';
  setCurrentSection: (section: string) => void;
  toggleMenu: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentSection: 'home',
  isMenuOpen: false,
  theme: 'light',
  setCurrentSection: (section) => set({ currentSection: section }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setTheme: (theme) => set({ theme }),
}));