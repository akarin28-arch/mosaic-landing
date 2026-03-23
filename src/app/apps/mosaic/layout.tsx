import type { Metadata } from "next";

const title =
  "収入ポートフォリオ診断（無料） | MOSAIC – 副業・資産・キャリアの最適収入設計";
const description =
  "無料の収入ポートフォリオ診断ツール。8つの質問に答えるだけで、副業・資産・キャリアのバランスからあなたに合う収入スタイルと次のアクションを提案します。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/apps/mosaic",
    siteName: "MOSAIC",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/apps/mosaic/opengraph-image",
        width: 1200,
        height: 630,
        alt: "収入ポートフォリオ診断（無料） | MOSAIC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "収入ポートフォリオ診断（無料） | MOSAIC",
    description:
      "8つの質問に答えるだけで、副業・資産・キャリアのバランスから自分に合う収入スタイルと次のアクションを提案。",
    images: ["/apps/mosaic/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MosaicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
