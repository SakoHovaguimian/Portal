import { useState } from 'react';

import type { MediaDeckProps } from '../models/mediaDeckProps';

export function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

export function useMediaDeck({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
}: MediaDeckProps) {

  const [selected, setSelected] = useState(defaultActiveId);
  const currentId = activeId ?? selected;
  const currentIndex = Math.max(0, items.findIndex((item) => item.id === currentId));

  function select(index: number) {

    const item = items[wrapIndex(index, items.length)];
    if (!item || item.id === items[currentIndex]?.id) { return; }
    if (activeId === undefined) { setSelected(item.id); }
    onActiveChange?.(item.id);

  }

  return { currentIndex, select };

}
