export interface SheetDragState {
  pointerId: number;
  startY: number;
  lastY: number;
  lastTime: number;
  distance: number;
  velocity: number;
}
