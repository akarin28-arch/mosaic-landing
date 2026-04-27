'use client';

import { AXIS_LABELS, WorkMotiveResult } from '@/lib/work-motive/types';

type ResultViewProps = {
  result: WorkMotiveResult;
  shareUrl: string;
  onRetry: () => void;
};

export function ResultView({ result, shareUrl, onRetry }: ResultViewProps) {
  const axes = Object.keys(AXIS_LABELS) as Array<keyof typeof AXIS_LABELS>;
  const maxScore = Math.max(1, ...axes.map((axis) => result.scores[axis]));

  const handleShare = async () => {
    const text = `仕事動機診断の結果は「${result.title}」でした。`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '仕事動機診断',
          text,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
      <section className="rounded-[28px] border border-emerald-100 bg-white px-5 py-7 text-center shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-600">YOUR TYPE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{result.title}</h2>
        <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">{result.catchCopy}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {result.chips.map((chip) => (
            <span key={chip} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">総評</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{result.summaryText}</p>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">スコア</p>
        <div className="mt-4 space-y-3">
          {axes.map((axis) => {
            const percent = Math.round((result.scores[axis] / maxScore) * 100);
            return (
              <div key={axis} className="grid grid-cols-[88px_1fr_32px] items-center gap-3">
                <span className="text-right text-xs font-bold text-slate-500">{AXIS_LABELS[axis]}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-right text-sm font-bold text-slate-700">{result.scores[axis]}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">このタイプの人は</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{result.personalityText}</p>
        </article>
        <article className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">今回の回答から見える特徴</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-emerald-950">{result.featureText}</p>
        </article>
      </section>

      <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">矛盾とズレ</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-amber-950">{result.conflictText}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">向いている働き方</p>
          <ul className="mt-3 space-y-3 pl-5 text-sm leading-7 text-slate-700">
            {result.fit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700">ハマりやすい罠</p>
          <ul className="mt-3 space-y-3 pl-5 text-sm leading-7 text-rose-950">
            {result.trap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            結果をシェアする
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            もう一度診断する
          </button>
        </div>
      </section>

      <footer className="pb-4 pt-[30px] text-center text-[11px] font-normal text-slate-400">
        Operated by{' '}
        <a
          href="https://www.mosaic-design.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Mosaic Design
        </a>
      </footer>
    </div>
  );
}
