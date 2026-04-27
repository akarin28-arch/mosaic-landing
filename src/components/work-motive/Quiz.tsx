'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { ResultView } from '@/components/work-motive/ResultView';
import { WORK_MOTIVE_QUESTIONS } from '@/lib/work-motive/questions';
import { QuestionChoiceValue, WorkMotiveAnswers, WorkMotiveResult } from '@/lib/work-motive/types';

type SubmitResponse =
  | { ok: true; result: WorkMotiveResult; saved: boolean }
  | { ok: false; message: string };

const INTRO_TITLE = 'あなたはなぜ\n働いているのか？';
const INTRO_DESCRIPTION = '23問の質問で\n「本音の動機構造」を炙り出します';
const TRANSITION_MS = 180;

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100vh',
    width: '100%',
    background: 'radial-gradient(circle at top, #ecfdf5 0%, #f8fafc 45%, #f8fafc 100%)',
  },
  page: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '32px 16px 20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  introWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: '32px',
    border: '1px solid #d1fae5',
    backgroundColor: '#ffffff',
    padding: '40px 24px',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
  },
  eyebrow: {
    margin: 0,
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#059669',
  },
  title: {
    margin: '16px 0 0',
    whiteSpace: 'pre-line',
    fontSize: 'clamp(32px, 6vw, 52px)',
    lineHeight: 1.12,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#0f172a',
  },
  description: {
    margin: '20px 0 0',
    whiteSpace: 'pre-line',
    fontSize: '15px',
    lineHeight: 1.9,
    color: '#475569',
  },
  helper: {
    margin: '12px 0 0',
    fontSize: '12px',
    fontWeight: 700,
    color: '#94a3b8',
  },
  primaryButton: {
    marginTop: '28px',
    border: 0,
    borderRadius: '9999px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.16)',
  },
  topPanel: {
    position: 'sticky',
    top: 16,
    zIndex: 10,
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: '16px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
  },
  progressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 800,
    color: '#64748b',
  },
  progressBar: {
    marginTop: '12px',
    height: '8px',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: '#e2e8f0',
  },
  questionCard: {
    marginTop: '16px',
    borderRadius: '28px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    padding: '24px',
    boxShadow: '0 12px 26px rgba(15, 23, 42, 0.06)',
  },
  questionTitle: {
    margin: 0,
    whiteSpace: 'pre-line',
    fontSize: '24px',
    lineHeight: 1.7,
    fontWeight: 800,
    color: '#0f172a',
  },
  options: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionButton: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    gap: '12px',
    borderRadius: '18px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    padding: '16px',
    textAlign: 'left',
    cursor: 'pointer',
  },
  optionButtonSelected: {
    border: '1px solid #0f172a',
    backgroundColor: '#0f172a',
    color: '#ffffff',
  },
  choiceBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 900,
    flexShrink: 0,
  },
  choiceBadgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    color: '#ffffff',
  },
  optionText: {
    fontSize: '15px',
    lineHeight: 1.8,
    fontWeight: 700,
  },
  numberInput: {
    width: '100%',
    borderRadius: '18px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    padding: '18px 16px',
    textAlign: 'center',
    fontSize: '30px',
    fontWeight: 900,
    color: '#0f172a',
    outline: 'none',
  },
  inputHelper: {
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#94a3b8',
  },
  inputAction: {
    marginTop: '10px',
    display: 'block',
    width: '100%',
    border: 0,
    background: 'transparent',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
  },
  error: {
    marginTop: '16px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#e11d48',
  },
  bottomActions: {
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    padding: '16px 0',
    background: 'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,0.92) 30%, rgba(248,250,252,1) 100%)',
  },
  secondaryButton: {
    borderRadius: '9999px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
  },
  resetLink: {
    marginLeft: 'auto',
    alignSelf: 'center',
    border: 0,
    background: 'transparent',
    padding: 0,
    fontSize: '12px',
    fontWeight: 400,
    color: '#64748b',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
  },
  footer: {
    paddingTop: '30px',
    paddingBottom: '16px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 400,
    color: '#94a3b8',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  fadeShell: {
    transition: 'opacity 220ms ease, transform 220ms ease',
    willChange: 'opacity, transform',
  },
};

export function Quiz() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<WorkMotiveAnswers>({});
  const [result, setResult] = useState<WorkMotiveResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const transitionTimerRef = useRef<number | null>(null);

  const question = WORK_MOTIVE_QUESTIONS[currentIndex];
  const currentAnswer = answers[question?.id];
  const progress = useMemo(() => Math.round((currentIndex / WORK_MOTIVE_QUESTIONS.length) * 100), [currentIndex]);

  const setAnswer = (questionId: string, value: QuestionChoiceValue | number | undefined) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const runTransition = (callback: () => void) => {
    setIsVisible(false);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      callback();
      window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, TRANSITION_MS);
  };

  const moveForward = (nextAnswers: WorkMotiveAnswers) => {
    if (currentIndex === WORK_MOTIVE_QUESTIONS.length - 1) {
      void handleSubmit(nextAnswers);
      return;
    }

    runTransition(() => {
      setCurrentIndex((prev) => prev + 1);
    });
  };

  const handleChoiceAnswer = (questionId: string, value: QuestionChoiceValue) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    void moveForward(nextAnswers);
  };

  const reset = () => {
    runTransition(() => {
      setPhase('intro');
      setCurrentIndex(0);
      setAnswers({});
      setResult(null);
      setError(null);
    });
  };

  const footer = (
    <footer style={styles.footer}>
      Operated by{' '}
      <a href="https://www.mosaic-design.jp/" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
        Mosaic Design
      </a>
    </footer>
  );

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [phase, currentIndex]);

  const handleSubmit = async (nextAnswers?: WorkMotiveAnswers) => {
    setSubmitting(true);
    setError(null);

    try {
      const payloadAnswers = nextAnswers ?? answers;
      const response = await fetch('/api/work-motive/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers }),
      });
      const data = (await response.json()) as SubmitResponse;

      if (!response.ok || !data.ok) {
        setError(data.ok ? '診断結果の生成に失敗しました。' : data.message);
        return;
      }

      runTransition(() => {
        setResult(data.result);
        setPhase('result');
      });
    } catch {
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === 'result' && result) {
    const shareUrl = typeof window === 'undefined' ? '' : window.location.href;
    return (
      <div
        style={{
          ...styles.fadeShell,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <ResultView result={result} shareUrl={shareUrl} onRetry={reset} />
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div
        style={{
          ...styles.shell,
          ...styles.fadeShell,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <div style={{ ...styles.page, ...styles.introWrap }}>
          <div style={styles.card}>
            <p style={styles.eyebrow}>WORK MOTIVE DIAGNOSTIC</p>
            <h1 style={styles.title}>{INTRO_TITLE}</h1>
            <p style={styles.description}>{INTRO_DESCRIPTION}</p>
            <p style={styles.helper}>所要時間：約3〜5分</p>
            <button type="button" onClick={() => runTransition(() => setPhase('quiz'))} style={styles.primaryButton}>
              診断をはじめる
            </button>
          </div>
          {footer}
        </div>
      </div>
    );
  }

  const isAnswered = currentAnswer !== undefined;
  const canAdvanceNumber = question.num && typeof currentAnswer === 'number';

  return (
    <div
      style={{
        ...styles.shell,
        ...styles.fadeShell,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <div style={styles.page}>
        <div style={styles.topPanel}>
          <div style={styles.progressMeta}>
            <span>
              Q{currentIndex + 1} / {WORK_MOTIVE_QUESTIONS.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '9999px',
                backgroundColor: '#10b981',
                transition: 'width 180ms ease',
              }}
            />
          </div>
        </div>

        <div style={styles.questionCard}>
          <h2 style={styles.questionTitle}>{question.text}</h2>
          <div style={styles.options}>
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
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    if (typeof currentAnswer !== 'number') return;
                    const nextAnswers = { ...answers, [question.id]: currentAnswer };
                    setAnswers(nextAnswers);
                    moveForward(nextAnswers);
                  }}
                  style={styles.numberInput}
                  placeholder="人数を入力"
                />
                <p style={styles.inputHelper}>0人でも入力できます。入力後 Enter で次へ進みます。</p>
                {canAdvanceNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextAnswers = { ...answers, [question.id]: currentAnswer };
                      setAnswers(nextAnswers);
                      moveForward(nextAnswers);
                    }}
                    style={styles.inputAction}
                  >
                    入力内容で進む
                  </button>
                )}
              </div>
            ) : (
              question.ch.map(([choice, label]) => {
                const selected = currentAnswer === choice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleChoiceAnswer(question.id, choice)}
                    style={{
                      ...styles.optionButton,
                      ...(selected ? styles.optionButtonSelected : {}),
                    }}
                  >
                    <span style={{ ...styles.choiceBadge, ...(selected ? styles.choiceBadgeSelected : {}) }}>{choice}</span>
                    <span style={styles.optionText}>{label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.bottomActions}>
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={() =>
                runTransition(() => {
                  setCurrentIndex((prev) => prev - 1);
                })
              }
              style={styles.secondaryButton}
            >
              戻る
            </button>
          )}
          {submitting && <span style={{ alignSelf: 'center', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>診断中...</span>}
          <button type="button" onClick={reset} style={styles.resetLink}>
            最初からやり直す
          </button>
        </div>
        {footer}
      </div>
    </div>
  );
}
