'use client';

import { useMemo, useState } from 'react';
import { ResultView } from '@/components/work-motive/ResultView';
import { WORK_MOTIVE_QUESTIONS } from '@/lib/work-motive/questions';
import { QuestionChoiceValue, WorkMotiveAnswers, WorkMotiveResult } from '@/lib/work-motive/types';

type SubmitResponse =
  | { ok: true; result: WorkMotiveResult; saved: boolean }
  | { ok: false; message: string };

const INTRO_TITLE = 'あなたはなぜ\n働いているのか？';
const INTRO_DESCRIPTION = '23問の質問で\n「本音の動機構造」を炙り出します';

export function Quiz() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<WorkMotiveAnswers>({});
  const [result, setResult] = useState<WorkMotiveResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = WORK_MOTIVE_QUESTIONS[currentIndex];
  const currentAnswer = answers[question?.id];
  const progress = useMemo(
    () => Math.round((currentIndex / WORK_MOTIVE_QUESTIONS.length) * 100),
    [currentIndex],
  );

  const setAnswer = (questionId: string, value: QuestionChoiceValue | number | undefined) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const reset = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const footer = (
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
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/work-motive/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = (await response.json()) as SubmitResponse;

      if (!response.ok || !data.ok) {
        setError(data.ok ? '診断結果の生成に失敗しました。' : data.message);
        return;
      }

      setResult(data.result);
      setPhase('result');
    } catch {
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === 'result' && result) {
    const shareUrl = typeof window === 'undefined' ? '' : window.location.href;
    return <ResultView result={result} shareUrl={shareUrl} onRetry={reset} />;
  }

  if (phase === 'intro') {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-8 sm:px-6">
        <div className="w-full rounded-[32px] border border-emerald-100 bg-white px-6 py-10 shadow-sm sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-emerald-600">WORK MOTIVE DIAGNOSTIC</p>
          <h1 className="mt-4 whitespace-pre-line text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {INTRO_TITLE}
          </h1>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">{INTRO_DESCRIPTION}</p>
          <p className="mt-3 text-xs font-semibold text-slate-400">所要時間：約3〜5分</p>
          <button
            type="button"
            onClick={() => setPhase('quiz')}
            className="mt-8 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            診断をはじめる
          </button>
        </div>
        {footer}
      </div>
    );
  }

  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-4 sm:px-6">
      <div className="sticky top-0 z-10 rounded-[24px] border border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Q{currentIndex + 1} / {WORK_MOTIVE_QUESTIONS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="whitespace-pre-line text-lg font-bold leading-8 text-slate-900">{question.text}</h2>
        <div className="mt-5 space-y-3">
          {question.num ? (
            <div>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={typeof currentAnswer === 'number' ? currentAnswer : ''}
                onChange={(event) => {
                  const nextValue = Number.parseInt(event.target.value, 10);
                  setAnswer(question.id, Number.isNaN(nextValue) ? undefined : nextValue);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-black text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="人数を入力"
              />
              <p className="mt-2 text-center text-xs font-semibold text-slate-400">0人でも入力できます</p>
            </div>
          ) : (
            question.ch.map(([choice, label]) => {
              const selected = currentAnswer === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setAnswer(question.id, choice)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                    selected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      selected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {choice}
                  </span>
                  <span className="text-sm font-semibold leading-7">{label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p>}

      <div className="sticky bottom-0 mt-auto flex gap-3 py-4">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            戻る
          </button>
        )}
        <button
          type="button"
          disabled={!isAnswered || submitting}
          onClick={() => {
            if (currentIndex === WORK_MOTIVE_QUESTIONS.length - 1) {
              void handleSubmit();
              return;
            }
            setCurrentIndex((prev) => prev + 1);
          }}
          className="flex-1 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? '診断中...' : currentIndex === WORK_MOTIVE_QUESTIONS.length - 1 ? '結果を見る' : '次へ'}
        </button>
      </div>
      {footer}
    </div>
  );
}
