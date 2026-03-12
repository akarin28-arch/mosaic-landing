import type { Metadata } from "next";
import { Noto_Sans_JP, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "MOSAIC | 自分だけの収入設計を、見つけよう。",
  description: "8つの質問に答えるだけで、あなたの「収入スタイル×生き方スタイル」を診断。今すぐ始められるアクションと具体的な収入目安を提示する、収入ポートフォリオ設計サービス。",
  other: {
    "impact-site-verification": "3c2b4438-eb0b-45bd-86fb-4e46306197e0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${notoSansJP.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-9E670842Z7" />
    </html>
  );
}
