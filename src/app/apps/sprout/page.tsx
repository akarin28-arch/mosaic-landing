'use client';

import { useState } from 'react';

// ─── 質問定義（UIのみ、スコア計算はAPIに隠蔽）───
const QUESTIONS = [
  { emoji: "😮‍💨", text: "最近、仕事について感じていることは？", choices: ["今のままで十分満足している","特に不満はないけど、なんとなくモヤっとする","やりがいが少し薄れてきた気がする","もっと自分らしい働き方がしたい"] },
  { emoji: "🕐", text: "キャリアについて考える頻度は？", choices: ["ほとんど考えていない","たまに考える程度","週に数回は考える","毎日のように頭にある"] },
  { emoji: "💪", text: "自分のスキルや経験、整理できていますか？", choices: ["考えたことがなかった","自信がない部分も多い","なんとなくはわかってる","ちゃんと言語化できている"] },
  { emoji: "🔭", text: "1年後の理想のイメージは？", choices: ["あまり考えていない","考え中でまだぼんやり","なんとなくのイメージはある","具体的にイメージできている"] },
  { emoji: "🔍", text: "求人や他社の情報を見ることはありますか？", choices: ["まったく見ていない","たまに気になったときだけ","月に数回チェックしている","定期的にチェックしている"] },
  { emoji: "🗣", text: "キャリアについて、人に話したり相談したことは？", choices: ["まったくない","家族や友人にちらっと話したことがある","信頼できる人に相談したことがある","複数人に相談したり情報収集している"] },
];

type ResultData = {
  phaseName: string;
  phaseEmoji: string;
  phaseReason: string;
  phaseAdvice: string;
  actions: { action: string; hint: string }[];
  links: { name: string; service: string; desc: string; btn: string; url: string }[];
};

type Screen = 'top' | 'quiz' | 'loading' | 'result';

export default function SproutPage() {
  const [screen, setScreen] = useState<Screen>('top');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState('');

  function handleStart() {
    setScreen('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  }

  function handlePick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers, idx];
    setTimeout(async () => {
      if (currentQ < QUESTIONS.length - 1) {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setScreen('loading');
        try {
          const res = await fetch('/api/sprout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scores: newAnswers }),
          });
          if (!res.ok) throw new Error('診断処理に失敗しました');
          const data = await res.json();
          setResult(data);
          setScreen('result');
        } catch (e: any) {
          setError(e.message || '予期せぬエラーが発生しました');
          setScreen('result');
        }
      }
    }, 320);
  }

  function handleRetry() {
    setScreen('top');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
    setError('');
  }

  async function handleShare() {
    if (!result) return;
    const text = `【SPROUT診断】\n私のキャリアフェーズは「${result.phaseEmoji} ${result.phaseName}」でした！\n\nあなたも診断してみては？`;
    const url = 'https://www.mosaic-design.jp/apps/sprout';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'SPROUT キャリア診断', text, url });
        return;
      } catch {
        // キャンセルや非対応の場合はXへフォールバック
      }
    }
    // フォールバック：X（Twitter）でシェア
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + '\n')}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  }

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <>
      <style>{STYLES}</style>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="app">

        {/* ─── トップ ─── */}
        {screen === 'top' && (
          <div className="screen active">
            <div className="app-badge">sprout</div>
            <div className="hero-icon">🌱</div>
            <div className="top-title">今の自分、<br /><span>どのフェーズ？</span></div>
            <div className="top-desc">6つの質問に答えるだけ。今のあなたに合った、3日分のアクションをお届けします。</div>
            <div className="tag-row">
              <span className="tag">⏱ 約1分</span>
              <span className="tag">🎯 6問だけ</span>
              <span className="tag">✨ 無料</span>
            </div>
            <button className="start-btn" onClick={handleStart}>診断スタート →</button>
            <div className="time-note">📋 回答はすべて選択式です</div>
          </div>
        )}

        {/* ─── クイズ ─── */}
        {screen === 'quiz' && (
          <div className="screen active">
            <div className="quiz-top">
              <span className="step-label">{currentQ + 1} / {QUESTIONS.length}</span>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="q-card" key={currentQ}>
              <span className="q-emoji">{q.emoji}</span>
              <div className="q-text">{q.text}</div>
            </div>
            <div className="choices">
              {q.choices.map((c, i) => (
                <button
                  key={i}
                  className={`choice-btn${selected === i ? ' selected' : ''}`}
                  onClick={() => handlePick(i)}
                >
                  <span className="choice-dot">{selected === i && <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>✓</span>}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── ローディング ─── */}
        {screen === 'loading' && (
          <div className="screen active" style={{ textAlign: 'center' }}>
            <div className="loading-card">
              <div className="loading-plant">🌿</div>
              <div className="loading-title">あなたのフェーズを診断中…</div>
              <div className="loading-sub">回答をもとに最適なアクションを選んでいます</div>
              <div className="loading-dots">
                <div className="ld" /><div className="ld" /><div className="ld" />
              </div>
            </div>
          </div>
        )}

        {/* ─── 結果 ─── */}
        {screen === 'result' && (
          <div className="screen active">
            {error ? (
              <div className="phase-card">
                <div style={{ color: '#e05a5a', fontWeight: 700, marginBottom: 8 }}>エラーが発生しました</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{error}</div>
                <button className="btn-retry" style={{ marginTop: 16, width: '100%' }} onClick={handleRetry}>もう一度試す</button>
              </div>
            ) : result && (
              <>
                <div className="result-badge">✨ 診断結果</div>
                {/* フェーズカード */}
                <div className="phase-card">
                  <span className="phase-label">あなたの今のキャリアフェーズ</span>
                  <div className="phase-name">{result.phaseEmoji} <em>{result.phaseName}</em></div>
                  <div className="phase-reason">{result.phaseReason}</div>
                  <div className="phase-advice">{result.phaseAdvice}</div>
                </div>
                {/* 3日間アクション */}
                <div className="days-title">3日間のアクション</div>
                <div className="days-desc">まずは大きな決断をする必要はありません。最初の3日間でできる、小さな行動を提案します。</div>
                {result.actions.map((d, i) => (
                  <div key={i} className="day-card">
                    <div className="day-num-badge">
                      <span style={{ fontSize: 9, fontWeight: 700 }}>DAY</span>
                      <strong>{i + 1}</strong>
                    </div>
                    <div className="day-content">
                      <div className="day-action">{d.action}</div>
                      <div className="day-hint">{d.hint}</div>
                    </div>
                  </div>
                ))}
                {/* 参考リンク */}
                <div className="ref-section">
                  <div className="ref-title-bar">参考リンク</div>
                  <div className="ref-intro">キャリアや働き方について考え始めた人向けに、参考になりそうな情報をいくつか置いておきます。気になるものがあれば、軽く覗いてみてください。</div>
                  {result.links.map((l, i) => (
                    <div key={i} className="ref-card">
                      <div className="ref-card-name">{l.name}</div>
                      <div className="ref-card-service">{l.service}</div>
                      <div className="ref-card-desc">{l.desc}</div>
                      <a className="ref-btn" href={l.url} target="_blank" rel="noopener noreferrer">{l.btn}（外部サイト）</a>
                    </div>
                  ))}
                  <div className="ref-disclosure">※一部リンクは紹介リンクを含みます</div>
                </div>
                {/* シェア・リトライ */}
                <div className="result-actions">
                  <button className="btn-share" onClick={handleShare}>📤 結果をシェアする</button>
                  <button className="btn-retry" onClick={handleRetry}>もう一度</button>
                </div>
                <div className="share-note">「これ当たってた」ってなったらぜひシェアを 🌱</div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="global-footer">Operated by <a href="https://mosaic-design.jp">Mosaic Design</a></div>
    </>
  );
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #f0faf4; --mint: #3ecf8e; --mint-light: #d0f4e5; --mint-dark: #1fa86d;
  --sage: #a8d5b5; --yellow: #ffe566; --text: #1a2e24; --text-mid: #4a6858;
  --text-light: #8aab97; --white: #ffffff; --radius: 20px; --radius-sm: 12px;
}
html, body { min-height: 100vh; background: var(--bg); font-family: 'Zen Maru Gothic', sans-serif; color: var(--text); overflow-x: hidden; }
body::before { content:''; position:fixed; inset:0; z-index:0;
  background: radial-gradient(circle 500px at 90% 10%, rgba(62,207,142,0.12) 0%, transparent 70%),
              radial-gradient(circle 400px at 10% 80%, rgba(168,213,181,0.2) 0%, transparent 60%),
              radial-gradient(circle 300px at 50% 50%, rgba(255,229,102,0.07) 0%, transparent 60%);
  pointer-events: none; }
.blob { position:fixed; z-index:0; border-radius:50%; filter:blur(60px); opacity:0.18; pointer-events:none; }
.blob-1 { width:300px; height:300px; background:var(--mint); top:-80px; right:-60px; }
.blob-2 { width:200px; height:200px; background:var(--yellow); bottom:10%; left:-40px; }
.blob-3 { width:180px; height:180px; background:var(--sage); top:40%; right:-30px; }
.app { position:relative; z-index:1; max-width:420px; margin:0 auto; min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:48px 24px 60px; }
.screen { width:100%; display:none; flex-direction:column; align-items:center; }
.screen.active { display:flex; animation:popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes popIn { from{opacity:0;transform:scale(0.94) translateY(10px);} to{opacity:1;transform:scale(1) translateY(0);} }
.app-badge { color:var(--mint-dark); font-size:13px; font-weight:700; letter-spacing:0.12em; margin-bottom:32px; }
.hero-icon { width:96px; height:96px; background:var(--white); border-radius:28px; display:flex; align-items:center; justify-content:center; font-size:44px; margin-bottom:28px; box-shadow:0 8px 32px rgba(62,207,142,0.2),0 2px 8px rgba(0,0,0,0.06); }
.top-title { font-size:28px; font-weight:900; line-height:1.4; text-align:center; margin-bottom:12px; }
.top-title span { background:linear-gradient(135deg, var(--mint-dark), var(--mint)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.top-desc { font-size:14px; color:var(--text-mid); line-height:1.8; text-align:center; margin-bottom:40px; max-width:300px; }
.tag-row { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:40px; }
.tag { background:var(--mint-light); color:var(--mint-dark); font-size:12px; font-weight:700; padding:6px 14px; border-radius:99px; }
.start-btn { width:100%; background:var(--mint); color:white; border:none; padding:18px; border-radius:var(--radius); font-family:'Zen Maru Gothic',sans-serif; font-size:16px; font-weight:700; cursor:pointer; letter-spacing:0.05em; box-shadow:0 6px 24px rgba(62,207,142,0.35); transition:all 0.2s; }
.start-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(62,207,142,0.45); }
.time-note { margin-top:14px; font-size:12px; color:var(--text-light); }
.quiz-top { width:100%; margin-bottom:28px; display:flex; align-items:center; justify-content:space-between; }
.step-label { font-size:12px; color:var(--text-light); font-weight:700; letter-spacing:0.1em; white-space:nowrap; }
.prog-track { flex:1; height:6px; background:var(--mint-light); border-radius:99px; margin:0 14px; overflow:hidden; }
.prog-fill { height:100%; background:linear-gradient(90deg, var(--mint-dark), var(--mint)); border-radius:99px; transition:width 0.4s cubic-bezier(0.34,1.2,0.64,1); }
.q-card { width:100%; background:var(--white); border-radius:var(--radius); padding:28px 24px; margin-bottom:16px; box-shadow:0 4px 20px rgba(0,0,0,0.06); animation:popIn 0.4s ease both; }
.q-emoji { font-size:32px; margin-bottom:12px; display:block; }
.q-text { font-size:17px; font-weight:700; line-height:1.55; }
.choices { width:100%; display:flex; flex-direction:column; gap:10px; }
.choice-btn { width:100%; background:var(--white); border:2px solid transparent; border-radius:var(--radius-sm); padding:15px 18px; font-family:'Zen Maru Gothic',sans-serif; font-size:14px; font-weight:500; color:var(--text); cursor:pointer; text-align:left; display:flex; align-items:center; gap:12px; transition:all 0.15s; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
.choice-dot { width:20px; height:20px; min-width:20px; border:2px solid var(--mint-light); border-radius:50%; transition:all 0.15s; display:flex; align-items:center; justify-content:center; }
.choice-btn:hover { border-color:var(--mint); background:var(--mint-light); transform:translateX(4px); }
.choice-btn:hover .choice-dot { border-color:var(--mint); background:var(--mint); }
.choice-btn.selected { border-color:var(--mint); background:var(--mint-light); }
.choice-btn.selected .choice-dot { border-color:var(--mint-dark); background:var(--mint-dark); }
.loading-card { background:var(--white); border-radius:var(--radius); padding:48px 32px; width:100%; box-shadow:0 4px 20px rgba(0,0,0,0.06); display:flex; flex-direction:column; align-items:center; }
.loading-plant { font-size:56px; margin-bottom:24px; animation:grow 1.2s ease-in-out infinite alternate; }
@keyframes grow { from{transform:scale(0.9);} to{transform:scale(1.1);} }
.loading-title { font-size:18px; font-weight:700; margin-bottom:8px; }
.loading-sub { font-size:13px; color:var(--text-mid); margin-bottom:28px; }
.loading-dots { display:flex; gap:8px; }
.ld { width:10px; height:10px; border-radius:50%; background:var(--mint-light); }
.ld:nth-child(1){animation:bounce 1s 0s infinite;} .ld:nth-child(2){animation:bounce 1s 0.15s infinite;} .ld:nth-child(3){animation:bounce 1s 0.3s infinite;}
@keyframes bounce { 0%,80%,100%{background:var(--mint-light);transform:scale(1);} 40%{background:var(--mint);transform:scale(1.4);} }
.result-badge { background:var(--yellow); color:var(--text); font-size:12px; font-weight:700; padding:6px 16px; border-radius:99px; margin-bottom:20px; }
.phase-card { width:100%; background:var(--white); border-radius:var(--radius); padding:28px 24px; margin-bottom:14px; box-shadow:0 4px 20px rgba(0,0,0,0.06); position:relative; overflow:hidden; }
.phase-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--mint-dark), var(--mint), var(--yellow)); }
.phase-label { font-size:11px; color:var(--text-light); font-weight:700; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:10px; display:block; }
.phase-name { font-size:22px; font-weight:900; color:var(--mint-dark); margin-bottom:14px; line-height:1.3; }
.phase-name em { font-style:normal; background:var(--mint-light); padding:2px 8px; border-radius:6px; }
.phase-reason { font-size:13px; font-weight:700; color:var(--text-mid); margin-bottom:12px; line-height:1.5; }
.phase-advice { font-size:14px; color:var(--text-mid); line-height:1.85; padding:14px 16px; background:var(--bg); border-radius:var(--radius-sm); border-left:3px solid var(--mint); }
.days-title { width:100%; font-size:13px; font-weight:700; color:var(--text-mid); letter-spacing:0.1em; text-transform:uppercase; margin:6px 0 12px; display:flex; align-items:center; gap:8px; }
.days-title::after { content:''; flex:1; height:1px; background:var(--mint-light); }
.days-desc { font-size:13px; color:var(--text-mid); line-height:1.6; margin-bottom:16px; width:100%; }
.day-card { width:100%; background:var(--white); border-radius:var(--radius-sm); padding:18px 20px; margin-bottom:10px; display:flex; gap:16px; align-items:flex-start; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
.day-num-badge { min-width:40px; height:40px; background:var(--mint-light); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:var(--mint-dark); line-height:1.2; }
.day-num-badge strong { font-size:16px; }
.day-content { flex:1; }
.day-action { font-size:14px; font-weight:700; line-height:1.5; margin-bottom:4px; }
.day-hint { font-size:12px; color:var(--text-light); line-height:1.6; }
.ref-section { width:100%; margin-top:16px; margin-bottom:16px; }
.ref-title-bar { width:100%; font-size:13px; font-weight:700; color:var(--text-mid); letter-spacing:0.1em; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.ref-title-bar::after { content:''; flex:1; height:1px; background:var(--mint-light); }
.ref-intro { font-size:13px; color:var(--text-mid); line-height:1.6; margin-bottom:16px; }
.ref-card { width:100%; background:var(--white); border-radius:var(--radius-sm); padding:16px; margin-bottom:10px; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
.ref-card-name { font-size:14px; font-weight:700; margin-bottom:4px; }
.ref-card-service { font-size:11px; color:var(--mint-dark); font-weight:700; margin-bottom:6px; }
.ref-card-desc { font-size:12px; color:var(--text-light); line-height:1.5; margin-bottom:12px; }
.ref-btn { background:var(--mint-light); color:var(--mint-dark); text-align:center; text-decoration:none; padding:12px; border-radius:8px; font-size:13px; font-weight:700; transition:all 0.2s; display:block; }
.ref-btn:hover { background:var(--mint); color:var(--white); }
.ref-disclosure { font-size:10px; color:var(--text-light); text-align:right; margin-top:8px; }
.result-actions { width:100%; display:flex; gap:10px; margin-top:16px; }
.btn-share { flex:1.6; background:var(--mint); color:white; border:none; padding:16px; border-radius:var(--radius-sm); font-family:'Zen Maru Gothic',sans-serif; font-size:14px; font-weight:700; cursor:pointer; box-shadow:0 4px 16px rgba(62,207,142,0.3); transition:all 0.2s; }
.btn-share:hover { transform:translateY(-2px); }
.btn-retry { flex:1; background:transparent; color:var(--text-mid); border:2px solid var(--mint-light); padding:16px; border-radius:var(--radius-sm); font-family:'Zen Maru Gothic',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; }
.btn-retry:hover { border-color:var(--mint); color:var(--mint-dark); background:var(--mint-light); }
.share-note { font-size:11px; color:var(--text-light); text-align:center; margin-top:10px; }
.global-footer { position:fixed; bottom:0; left:0; right:0; text-align:center; padding:12px 20px; font-size:11px; color:var(--text-light); background:linear-gradient(to top, var(--bg) 60%, transparent); z-index:10; }
.global-footer a { color:var(--mint-dark); text-decoration:none; font-weight:500; }
`;
