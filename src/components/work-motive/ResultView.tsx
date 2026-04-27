'use client';

import { CSSProperties } from 'react';
import { AXIS_LABELS, WorkMotiveResult } from '@/lib/work-motive/types';

type ResultViewProps = {
  result: WorkMotiveResult;
  shareUrl: string;
  onRetry: () => void;
};

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #ecfdf5 0%, #f8fafc 45%, #ffffff 100%)',
  },
  page: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '24px 16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  panel: {
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    padding: '20px',
    boxShadow: '0 12px 26px rgba(15, 23, 42, 0.06)',
  },
  heroPanel: {
    border: '1px solid #d1fae5',
    borderRadius: '28px',
    backgroundColor: '#ffffff',
    padding: '28px 20px',
    textAlign: 'center',
    boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
  },
  eyebrow: {
    margin: 0,
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.28em',
    color: '#059669',
  },
  title: {
    margin: '12px 0 0',
    fontSize: 'clamp(30px, 6vw, 48px)',
    lineHeight: 1.12,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#0f172a',
  },
  catchCopy: {
    margin: '12px 0 0',
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: 1.8,
    color: '#64748b',
  },
  chipWrap: {
    marginTop: '18px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  chip: {
    borderRadius: '9999px',
    backgroundColor: '#f1f5f9',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 800,
    color: '#475569',
  },
  label: {
    margin: 0,
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#94a3b8',
  },
  body: {
    margin: '12px 0 0',
    whiteSpace: 'pre-line',
    fontSize: '14px',
    lineHeight: 1.9,
    color: '#334155',
  },
  axisRow: {
    display: 'grid',
    gridTemplateColumns: '88px 1fr 32px',
    alignItems: 'center',
    gap: '12px',
  },
  axisLabel: {
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: 800,
    color: '#64748b',
  },
  axisBarTrack: {
    height: '12px',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: '#e2e8f0',
  },
  axisValue: {
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 800,
    color: '#334155',
  },
  grid: {
    display: 'grid',
    gap: '16px',
  },
  accentGreen: {
    border: '1px solid #a7f3d0',
    backgroundColor: '#ecfdf5',
  },
  accentAmber: {
    border: '1px solid #fde68a',
    backgroundColor: '#fffbeb',
  },
  accentRose: {
    border: '1px solid #fecdd3',
    backgroundColor: '#fff1f2',
  },
  ul: {
    margin: '12px 0 0',
    paddingLeft: '20px',
    fontSize: '14px',
    lineHeight: 1.9,
    color: '#334155',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  primaryButton: {
    border: 0,
    borderRadius: '9999px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.16)',
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
    <div style={styles.shell}>
      <div style={styles.page}>
        <section style={styles.heroPanel}>
          <p style={styles.eyebrow}>YOUR TYPE</p>
          <h2 style={styles.title}>{result.title}</h2>
          <p style={styles.catchCopy}>{result.catchCopy}</p>
          <div style={styles.chipWrap}>
            {result.chips.map((chip) => (
              <span key={chip} style={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <p style={styles.label}>SUMMARY</p>
          <p style={styles.body}>{result.summaryText}</p>
        </section>

        <section style={styles.panel}>
          <p style={styles.label}>SCORES</p>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {axes.map((axis) => {
              const percent = Math.round((result.scores[axis] / maxScore) * 100);
              return (
                <div key={axis} style={styles.axisRow}>
                  <span style={styles.axisLabel}>{AXIS_LABELS[axis]}</span>
                  <div style={styles.axisBarTrack}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        borderRadius: '9999px',
                        backgroundColor: '#10b981',
                      }}
                    />
                  </div>
                  <span style={styles.axisValue}>{result.scores[axis]}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ ...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={styles.panel}>
            <p style={styles.label}>PERSONALITY</p>
            <p style={styles.body}>{result.personalityText}</p>
          </article>
          <article style={{ ...styles.panel, ...styles.accentGreen }}>
            <p style={{ ...styles.label, color: '#047857' }}>FEATURE</p>
            <p style={{ ...styles.body, color: '#064e3b' }}>{result.featureText}</p>
          </article>
        </section>

        <section style={{ ...styles.panel, ...styles.accentAmber }}>
          <p style={{ ...styles.label, color: '#b45309' }}>CONFLICT</p>
          <p style={{ ...styles.body, color: '#78350f' }}>{result.conflictText}</p>
        </section>

        <section style={{ ...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={styles.panel}>
            <p style={styles.label}>FIT</p>
            <ul style={styles.ul}>
              {result.fit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article style={{ ...styles.panel, ...styles.accentRose }}>
            <p style={{ ...styles.label, color: '#be123c' }}>TRAP</p>
            <ul style={{ ...styles.ul, color: '#881337' }}>
              {result.trap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section style={styles.panel}>
          <div style={styles.actions}>
            <button type="button" onClick={handleShare} style={styles.primaryButton}>
              結果をシェアする
            </button>
            <button type="button" onClick={onRetry} style={styles.secondaryButton}>
              もう一度診断する
            </button>
          </div>
        </section>

        <footer style={styles.footer}>
          Operated by{' '}
          <a href="https://www.mosaic-design.jp/" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Mosaic Design
          </a>
        </footer>
      </div>
    </div>
  );
}
