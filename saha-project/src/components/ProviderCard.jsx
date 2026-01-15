function Divider() {
  return <div className="w-[180px] h-px bg-zinc-500/20 mx-auto" />;
}

export default function ProviderCard({ provider }) {
  return (
    <div
      className="
        h-[740px]
        bg-zinc-800/60
        backdrop-blur-md
        rounded-3xl
        px-10
        flex flex-col
        items-center
        text-center
      "
    >
      {/* ───────── Header (fixed) ───────── */}
      <div className="h-[260px] flex flex-col items-center justify-end pb-6">
        <img
          src={provider.avatar}
          alt={provider.name}
          className="w-28 h-28 rounded-2xl object-cover mb-5"
        />

        <h3 className="text-2xl font-semibold tracking-tight text-white/95">
          {provider.name}
        </h3>

        <p className="mt-1 text-base text-zinc-400">{provider.title}</p>
      </div>

      <Divider />

      {/* ───────── Rating (equal block) ───────── */}
      <div className="h-[135px] flex flex-col items-center justify-center">
        <div className="flex gap-1 text-yellow-400 text-2xl">★★★★★</div>
        <span className="mt-2 text-sm text-zinc-400">{provider.rating}/5</span>
      </div>

      <Divider />

      {/* ───────── Price (equal block) ───────── */}
      <div className="h-[135px] flex items-center justify-center text-2xl font-medium">
        ${provider.rate}
        <span className="ml-2 text-base text-zinc-400">/hr</span>
      </div>

      <Divider />

      {/* ───────── Availability (equal block) ───────── */}
      <div className="h-[135px] flex items-center justify-center">
        <span
          className="
            px-5 py-2
            rounded-full
            bg-emerald-500/15
            text-emerald-400
            text-sm
          "
        >
          {provider.available}
        </span>
      </div>

      <Divider />

      {/* ───────── Action (equal block) ───────── */}
      <div className="h-[135px] flex items-center justify-center">
        <button
          className="
            bg-white/95
            text-black
            rounded-full
            px-14
            py-3.5
            text-base
            font-medium
            hover:bg-white
            transition
          "
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
