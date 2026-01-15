export default function RatingStars({ value, max = 5 }) {
  const fullStars = Math.floor(value);
  const emptyStars = max - fullStars;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ color: "#facc15" }}>
        {"★".repeat(fullStars)}
        <span style={{ color: "#444" }}>
          {"★".repeat(emptyStars)}
        </span>
      </div>

      <span style={{ fontSize: 14, opacity: 0.7 }}>
        {value}
      </span>
    </div>
  );
}

