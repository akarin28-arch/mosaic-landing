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
            "radial-gradient(circle at top left, #1d4ed8 0%, #0d1b2a 55%, #08111b 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 56,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 9999,
            padding: "12px 20px",
            color: "#93c5fd",
            fontSize: 28,
            letterSpacing: 2,
          }}
        >
          MOSAIC
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
            <div style={{ color: "#60a5fa", fontSize: 30 }}>無料診断</div>
            <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.15 }}>
              無料収入ポートフォリオ診断
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 32,
                lineHeight: 1.5,
                color: "#cbd5e1",
              }}
            >
              <span>8つの質問で、副業・資産・キャリアから</span>
              <span>自分に合う収入スタイルと次のアクションを提案</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["副業", "資産", "キャリア", "次アクション"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 9999,
                  background: "rgba(59,130,246,0.14)",
                  border: "1px solid rgba(96,165,250,0.28)",
                  fontSize: 26,
                  color: "#dbeafe",
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
