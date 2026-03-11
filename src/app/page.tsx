"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    elementsRef.current.forEach(element => {
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setRef = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return (
    <>
      <style jsx>{`
        header {
          padding: 2rem 5%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
        }

        .logo {
          display: inline-flex;
          align-items: center;
        }
        .logo img {
          height: 32px;
          width: auto;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8rem 5% 4rem;
          position: relative;
        }

        /* Abstract background decorative blobs */
        .blob-1 {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: #3B82F6;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.10;
          z-index: 0;
        }

        .blob-2 {
          position: absolute;
          bottom: 10%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: #10B981;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.10;
          z-index: 0;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          width: 100%;
          text-align: center;
        }

        .hero {
          margin-bottom: 5rem;
        }

        .hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          letter-spacing: 0.02em;
        }

        .hero p {
          font-size: clamp(1rem, 2vw, 1.1rem);
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
          text-align: left;
        }

        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .feature-icon {
          font-size: 2rem;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .feature-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .cta-section {
          margin-bottom: 2rem;
        }

        .coming-soon-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          border: 1px solid rgba(59, 130, 246, 0.4);
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
        }

        footer {
          text-align: center;
          padding: 2rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-family: var(--font-en);
          position: relative;
          z-index: 1;
        }

        /* Animations */
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        :global(.fade-in.visible) {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.4s; }
        .delay-4 { transition-delay: 0.5s; }
        .delay-5 { transition-delay: 0.6s; }

        @media (max-width: 768px) {
          .hero h1 { margin-bottom: 1rem; }
          .features { gap: 1.5rem; }
          .feature-card { padding: 2rem 1.5rem; }
          .coming-soon-badge { padding: 0.8rem 2rem; font-size: 1rem; }
        }
      `}</style>
      <div className="blob-1"></div>
      <div className="blob-2"></div>

      <header>
        <div className="logo"><img src="/logo.svg" alt="MOSAIC" /></div>
      </header>

      <main>
        <div className="content-wrapper">
          <section className="hero">
            <h1 className="fade-in" ref={setRef}>自分だけの収入設計を、<br />見つけよう。</h1>
            <p className="fade-in delay-1" ref={setRef}>8つの質問に答えるだけで、あなたの「収入スタイル×生き方スタイル」を診断。今すぐ始められるアクションと具体的な収入目安を提示する、収入ポートフォリオ設計サービス。</p>
          </section>

          <section className="features">
            <div className="feature-card fade-in delay-2" ref={setRef}>
              <i className="fa-solid fa-stopwatch feature-icon"></i>
              <h3 className="feature-title">3分で診断完了</h3>
              <p className="feature-desc">直感的な8つの質問に答えるだけで、あなたに最適な収入ポートフォリオがすぐに分かります。</p>
            </div>
            <div className="feature-card fade-in delay-3" ref={setRef}>
              <i className="fa-solid fa-chart-pie feature-icon"></i>
              <h3 className="feature-title">生き方と直結する収入設計</h3>
              <p className="feature-desc">理想のライフスタイル実現に向けた、現実的な目標金額と到達までのロードマップを提示します。</p>
            </div>
            <div className="feature-card fade-in delay-4" ref={setRef}>
              <i className="fa-solid fa-users feature-icon"></i>
              <h3 className="feature-title">多様なライフスタイルに対応</h3>
              <p className="feature-desc">それぞれの一人ひとりの現状や価値観にフィットした柔軟な提案を行います。</p>
            </div>
          </section>

          <section className="cta-section fade-in delay-5" ref={setRef}>
            <div className="coming-soon-badge">
              2026年4月下旬 リリース予定
            </div>
          </section>
        </div>
      </main>

      <footer>
        &copy; 2026 MOSAIC
      </footer>
    </>
  );
}
