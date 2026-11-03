'use client';

import { create } from 'zustand';
import type { DashboardChromeState } from '@/models/dashboardChromeState';

export const useDashboardChromeStore = create<DashboardChromeState>((set) => {

  const state: DashboardChromeState = {
    density: 'comfortable',
    modelExplorerOpen: true,
    setDensity: (density) => set({ density }),
    setModelExplorerOpen: (modelExplorerOpen) => set({ modelExplorerOpen }),
  };

  return state;

});
