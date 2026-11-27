export interface SheetDragState {
  pointerId: number;
  startY: number;
  startOffset: number;
  moved: boolean;
  lastY: number;
  lastTime: number;
  distance: number;
  velocity: number;
}
