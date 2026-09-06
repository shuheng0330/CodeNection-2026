/** One turbulence filter at 3.5%. This single element is most of why the page
 *  reads as "designed" rather than "Tailwind defaults". Hidden below 640px —
 *  it is the cheapest thing to drop for mobile paint cost. */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 hidden sm:block opacity-[0.035] mix-blend-overlay"
    >
      <svg className="h-full w-full">
        <filter id="pikul-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pikul-grain)" />
      </svg>
    </div>
  );
}
