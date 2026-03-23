"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomeLanding() {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elementsRef.current.forEach((element) => {
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
          height: 48px;
          width: auto;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: calc(8rem - 10px) 5% 4rem;
          position: relative;
        }

        .blob-1 {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: #3b82f6;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.1;
          z-index: 0;
        }

        .blob-2 {
          position: absolute;
          bottom: 10%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: #10b981;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.1;
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
          margin-bottom: 3rem;
        }

        .hero h1 {
          font-size: clamp(0.875rem, 1.8vw, 1rem);
          font-weight: 700;
          margin-bottom: 0.9rem;
          line-height: 1.4;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .hero-lead {
          font-size: clamp(1.875rem, 5vw, 3.375rem);
          font-weight: 700;
          margin: 0 0 1.5rem;
          line-height: 1.3;
          letter-spacing: 0.02em;
          color: var(--text-main);
        }

        .hero p:not(.hero-lead) {
          font-size: clamp(1rem, 2vw, 1.1rem);
          color: var(--text-muted);
          max-width: 750px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          text-align: left;
        }

        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: calc(2.5rem - 5px) 2rem;
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
          margin-bottom: calc(1.5rem - 5px);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 0;
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

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          border: none;
          cursor: pointer;
          margin-top: 1rem;
        }

        .coming-soon-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
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

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
            transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        :global(.fade-in.visible) {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-1 {
          transition-delay: 0.1s;
        }
        .delay-2 {
          transition-delay: 0.2s;
        }
        .delay-3 {
          transition-delay: 0.4s;
        }
        .delay-4 {
          transition-delay: 0.5s;
        }
        .delay-5 {
          transition-delay: 0.6s;
        }

        @media (max-width: 768px) {
          .hero h1 {
            margin-bottom: 0.75rem;
          }
          .hero-lead {
            margin-bottom: 1rem;
          }
          .features {
            gap: 1.5rem;
          }
          .feature-card {
            padding: 2rem 1.5rem;
          }
          .coming-soon-badge {
            padding: 0.8rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="blob-1"></div>
      <div className="blob-2"></div>

      <header>
        <div className="logo">
          <Image src="/logo.svg" alt="MOSAIC" width={156} height={48} priority />
        </div>
      </header>

      <main>
        <div className="content-wrapper">
          <section className="hero">
            <h1 className="fade-in" ref={setRef}>
              収入ポートフォリオ診断
            </h1>
            <p className="hero-lead fade-in delay-1" ref={setRef}>
              自分だけの収入設計を
              <br />
              見つけよう。
            </p>
            <p className="fade-in delay-2" ref={setRef}>
              8つの質問に答えるだけで、あなたに合った「収入スタイル×生き方スタイル」を診断。副業・資産・キャリアのバランスをもとに、今すぐ始められる次のアクションを提案します。
            </p>
            <div className="fade-in delay-3" ref={setRef}>
              <Link href="/apps/mosaic?reset=true" className="cta-button">
                無料で診断する（1分）
              </Link>
            </div>
          </section>

          <section className="features">
            <div className="feature-card fade-in delay-2" ref={setRef}>
              <i className="fa-solid fa-stopwatch feature-icon"></i>
              <h3 className="feature-title">8つの質問で無料診断</h3>
              <p className="feature-desc">
                短時間で答えられる質問から、あなたに合う収入ポートフォリオと次の一歩を整理できます。
              </p>
            </div>
            <div className="feature-card fade-in delay-3" ref={setRef}>
              <i className="fa-solid fa-chart-pie feature-icon"></i>
              <h3 className="feature-title">副業・資産・キャリアを横断</h3>
              <p className="feature-desc">
                収入源をひとつに絞らず、副業や資産形成、働き方の選択肢を含めてバランスを見直せます。
              </p>
            </div>
            <div className="feature-card fade-in delay-4" ref={setRef}>
              <i className="fa-solid fa-users feature-icon"></i>
              <h3 className="feature-title">次アクションまで具体化</h3>
              <p className="feature-desc">
                診断結果だけで終わらず、いまの状況に合わせて始めやすい行動と収入設計の方向性を提示します。
              </p>
            </div>
          </section>

          <section className="cta-section fade-in delay-5" ref={setRef}>
            <Link href="/apps/mosaic?reset=true" className="cta-button">
              無料で診断する（1分）
            </Link>
          </section>
        </div>
      </main>

      <footer>&copy; 2026 MOSAIC</footer>
    </>
  );
}
