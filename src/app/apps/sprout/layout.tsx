import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPROUT | いまの自分、どのフェーズ？キャリア診断',
  description: '6つの質問に答えるだけ。今のあなたのキャリアフェーズと、最初の3日間でできる小さなアクションをお届けします。約1分・無料。',
  icons: {
    icon: '/sprout-icon.svg',
  },
  openGraph: {
    title: 'SPROUT | いまの自分、どのフェーズ？キャリア診断',
    description: '6つの質問に答えるだけ。今のあなたのキャリアフェーズと、最初の3日間でできる小さなアクションをお届けします。',
    url: 'https://www.mosaic-design.jp/apps/sprout',
    siteName: 'SPROUT by Mosaic Design',
  },
};

export default function SproutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
