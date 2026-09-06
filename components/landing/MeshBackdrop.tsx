/** Three blurred gradient fields drifting on coprime durations (19s / 26s / 34s)
 *  so the loop never visibly repeats. Pure CSS, GPU-composited, no JS. */
export function MeshBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="drift-a absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full opacity-50 blur-[90px]"
        style={{ background: "radial-gradient(circle, #E8B694 0%, transparent 68%)" }}
      />
      <div
        className="drift-b absolute -top-24 right-[-12rem] h-[34rem] w-[34rem] rounded-full opacity-45 blur-[90px]"
        style={{ background: "radial-gradient(circle, #E0A06B 0%, transparent 68%)" }}
      />
      <div
        className="drift-c absolute bottom-[-16rem] left-1/3 h-[36rem] w-[36rem] rounded-full opacity-35 blur-[90px]"
        style={{ background: "radial-gradient(circle, #A9B6CE 0%, transparent 70%)" }}
      />
    </div>
  );
}
