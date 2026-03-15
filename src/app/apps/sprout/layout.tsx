import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPROUT | キャリアフェーズ診断",
  description:
    "6つの質問に答えるだけで、今のキャリアフェーズと3日で始められるアクションを提案するSPROUT診断です。",
  icons: {
    icon: [
      { url: "/sprout-icon-v2.svg", type: "image/svg+xml" },
      { url: "/sprout-favicon-v2-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/sprout-icon-v2-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/sprout-favicon-v2-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/sprout-apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "SPROUT | キャリアフェーズ診断",
    description:
      "6つの質問に答えるだけで、今のキャリアフェーズと3日で始められるアクションを提案するSPROUT診断です。",
    url: "https://www.mosaic-design.jp/apps/sprout",
    siteName: "SPROUT by Mosaic Design",
  },
};

export default function SproutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
