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
  metadataBase: new URL("https://mosaic-design.jp"),
  title: "MOSAIC",
  description:
    "MOSAICは、収入ポートフォリオ診断を通じて自分に合う収入スタイルと次のアクションを知るためのサービスです。",
  applicationName: "MOSAIC",
  icons: {
    icon: [
      { url: "/mosaic-icon-v2.svg", type: "image/svg+xml" },
      { url: "/favicon-v2-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-v2-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-v2-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }],
  },
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
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
