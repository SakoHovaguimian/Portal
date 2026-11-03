import type { DashboardDensity } from './dashboardDensity';

export interface DashboardChromeState {
  density: DashboardDensity;
  modelExplorerOpen: boolean;
  setDensity: (density: DashboardDensity) => void;
  setModelExplorerOpen: (open: boolean) => void;
}
