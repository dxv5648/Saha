import skyline from "../assets/Auckland-Skyline-Dark.jpg";

export default function Background() {
  return (
    <div className="w-full relative">
      <div className="absolute inset-0 h-[150vh]">
        <img
          src={skyline}
          alt="Auckland skyline"
          className="w-full h-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 60%, black 90%, black 100%)",
          }}
        />
      </div>
    </div>
  );
}
