import type { Metadata } from "next";
import HomeLanding from "@/components/HomeLanding";

const title = "収入ポートフォリオ診断（無料） | MOSAIC – 副業・資産・キャリアの最適収入設計";
const description =
  "無料の収入ポートフォリオ診断ツール。8つの質問に答えるだけで、副業・資産・キャリアのバランスからあなたに合う収入スタイルと次のアクションを提案します。";
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MOSAIC",
  url: "https://mosaic-design.jp/",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  inLanguage: "ja-JP",
  description,
  featureList: [
    "8つの質問で収入ポートフォリオを診断",
    "副業・資産・キャリアのバランスを可視化",
    "自分に合う収入スタイルと次のアクションを提案",
  ],
};

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "MOSAIC",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeLanding />
    </>
  );
}
