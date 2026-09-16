export default function HomeLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E50914]" />
        <p className="text-sm text-white/60">Loading titles…</p>
      </div>
    </div>
  );
}
