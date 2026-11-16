import { animateMotion } from './motionPreferences';

const particleCount = 14;

const ringFrames: Keyframe[] = [
  { transform: 'scale(0.4)', opacity: 0.6 },
  { transform: 'scale(1.9)', opacity: 0 },
];

const particles = Array.from({ length: particleCount }, (_, index) => {

  const angle = (index / particleCount) * Math.PI * 2;
  const distance = 30 + (index % 3) * 12;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const frames: Keyframe[] = [
    { transform: 'translate(0, 0) scale(0)', opacity: 0 },
    {
      transform: `translate(${x * 0.55}px, ${y * 0.55}px) scale(1.15)`,
      opacity: 1,
      offset: 0.35,
    },
    {
      transform: `translate(${x}px, ${y + 10}px) scale(0.3) rotate(${index * 37}deg)`,
      opacity: 0,
    },
  ];
  return { frames, delay: (index % 3) * 18 };

});

export function playReactionParticles(layer: HTMLSpanElement, duration: number, easing: string) {

  const { ownerDocument } = layer;
  const ring = ownerDocument.createElement('span');
  ring.dataset.reactionRing = '';
  ring.className = 'absolute inset-0 rounded-full border-control border-brand opacity-0';

  const nodes = particles.map((_, index) => {

    const particle = ownerDocument.createElement('span');
    particle.dataset.reactionParticle = '';
    particle.className = index % 2
      ? 'absolute top-1/2 left-1/2 -mt-0.5 -ml-0.5 h-1.5 w-1 rounded-control bg-brand-400 opacity-0'
      : 'absolute top-1/2 left-1/2 -mt-0.5 -ml-0.5 size-1.5 rounded-full bg-brand-solid opacity-0';
    return particle;

  });
  layer.replaceChildren(ring, ...nodes);
  const animations = [
    animateMotion(ring, ringFrames, { duration, easing }),
    ...nodes.map((node, index) => {

      const { frames, delay } = particles[index];
      return animateMotion(node, frames, { duration, easing, delay });

    }),
  ].filter((animation) => animation !== null);

  const remove = () => {

    // An interrupted burst can settle after the next one has started.
    if (ring.parentNode === layer) { layer.replaceChildren(); }

  };
  void Promise.allSettled(animations.map((animation) => animation.finished)).then(remove);

  const cleanup = () => {

    for (const animation of animations) { animation.cancel(); }
    remove();

  };

  return cleanup;

}
