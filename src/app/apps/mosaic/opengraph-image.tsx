import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #10243a 45%, #132f4c 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 64,
            color: "#93c5fd",
            fontSize: 28,
            letterSpacing: 2,
          }}
        >
          MOSAIC
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            maxWidth: 940,
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.15 }}>
            無料収入ポートフォリオ診断
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 34,
              lineHeight: 1.45,
              color: "#cbd5e1",
            }}
          >
            <span>8つの質問に答えるだけで、</span>
            <span>副業・資産・キャリアから自分に合う収入設計を提案</span>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["8つの質問", "無料", "収入診断"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 9999,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(52,211,153,0.28)",
                  fontSize: 26,
                  color: "#d1fae5",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
