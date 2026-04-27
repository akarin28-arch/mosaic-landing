import type { Metadata } from 'next';
import { Quiz } from '@/components/work-motive/Quiz';

export const metadata: Metadata = {
  title: '働く動機診断 | Mosaic Design',
  description: '23の質問から、あなたが働く理由と本音の動機構造を可視化する診断アプリです。',
};

export default function WorkMotivePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf5_0%,#f8fafc_45%,#f8fafc_100%)]">
      <Quiz />
    </div>
  );
}
