import ProviderCard from "../components/ProviderCard";
import { providers } from "../data/providers";
export default function ComparePage() {
  return (
    <div className="min-h-screen px-6 py-20 flex flex-col items-center text-white bg-black">
      {" "}
      {/* Header */}{" "}
      <div className="flex justify-center mb-12">
        {" "}
        <div className="bg-zinc-900/80 backdrop-blur px-10 py-6 rounded-2xl text-center min-w-[360px]">
          {" "}
          <h1 className="text-2xl font-semibold">
            Compare Service Providers
          </h1>{" "}
          <p className="mt-2 text-sm text-zinc-400">
            {" "}
            Comparing 3 selected services{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Compare Container */}{" "}
      <div className="w-full max-w-6xl bg-zinc-900/60 rounded-3xl p-10">
        {" "}
        <div className="grid grid-cols-[160px_1fr] gap-8">
          {" "}
          {/* Left labels */}{" "}
          <div className="flex flex-col gap-20 text-sm text-zinc-400 pt-36">
            {" "}
            <span>Rating</span> <span>Hourly Rate</span>{" "}
            <span>Availability</span>{" "}
          </div>{" "}
          {/* Provider cards */}{" "}
          <div className="grid grid-cols-3 gap-6">
            {" "}
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
