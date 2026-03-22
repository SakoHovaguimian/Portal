'use client';

import { create } from 'zustand';

type DashboardChromeState = {
  density: 'comfortable' | 'compact';
  modelExplorerOpen: boolean;
  setDensity: (density: 'comfortable' | 'compact') => void;
  setModelExplorerOpen: (open: boolean) => void;
};

export const useDashboardChromeStore = create<DashboardChromeState>((set) => ({
  density: 'comfortable',
  modelExplorerOpen: true,
  setDensity: (density) => set({ density }),
  setModelExplorerOpen: (modelExplorerOpen) => set({ modelExplorerOpen }),
}));
