"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GUIDE_DATA } from "@/data/guideData";

const COLORS = {
    bg: "#060E1A",
    card: "#0A1322",
    cardBorder: "#192841",
    text: "#F1F5F9",
    textMuted: "#8B9BB4",
    accent: "#38BDF8",
    danger: "#F43F5E",
    success: "#10B981",

    // Category specific colors from App.jsx
    employment: "#3B82F6",    // Blue
    asset: "#8B5CF6",         // Purple
    content: "#10B981",       // Green
    network: "#F59E0B",       // Orange
    ownership: "#EC4899",     // Pink
};

const CATEGORY_COLOR = {
    employment_contract: COLORS.employment,
    asset_income: COLORS.asset,
    content_income: COLORS.content,
    network_income: COLORS.network,
    ownership_income: COLORS.ownership,
} as const;

export default function GuidePage({ id }: { id: string }) {
    const router = useRouter();
    const data = GUIDE_DATA[id as keyof typeof GUIDE_DATA];

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
    }, [id]);

    if (!data) {
        return (
            <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, padding: 24, textAlign: "center" }}>
                <h2>ページが見つかりません</h2>
                <button onClick={() => router.push("/apps/mosaic")} style={{
                    marginTop: 20, padding: "10px 20px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer"
                }}>診断トップへ戻る</button>
            </div>
        );
    }

    const containerStyle = {
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
        padding: "24px 16px",
        maxWidth: 600,
        margin: "0 auto",
    };

    const cardStyle = {
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 16,
        padding: "20px",
        marginBottom: 20,
        animation: "fadeIn 0.5s ease",
    };

    const sectionTitleStyle = {
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.accent,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
    };

    const listStyle = {
        paddingLeft: 20,
        margin: 0,
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 1.8,
    };

    // Determine the active color based on the category using the same map as App.jsx
    // Default to COLORS.accent if category is somehow missing
    const ac = data ? CATEGORY_COLOR[data.category as keyof typeof CATEGORY_COLOR] || COLORS.accent : COLORS.accent;

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: 20 }}>
                <button
                    onClick={() => router.push("/apps/mosaic")}
                    style={{
                        background: "transparent", color: COLORS.textMuted, border: "none",
                        fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", padding: 0
                    }}
                >
                    <span style={{ marginRight: 4 }}>←</span> 診断へ戻る
                </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeIn 0.4s ease" }}>
                <div style={{ fontSize: 13, color: ac, fontWeight: 600, marginBottom: 8 }}>
                    ■ {data.subtitle} ■
                </div>
                <h1 style={{ fontSize: 24, margin: "0 0 16px 0", fontWeight: 800 }}>{data.title}</h1>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, textAlign: "left" }}>
                    {data.description}
                </p>
            </div>

            {/* 特徴 */}
            <div style={cardStyle}>
                <div style={sectionTitleStyle}>⚡ この収入の特徴</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                    <div style={{ background: COLORS.bg, padding: "10px", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}` }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>立ち上がり速度</div>
                        <div style={{ fontWeight: 600 }}>{data.traits.speed}</div>
                    </div>
                    <div style={{ background: COLORS.bg, padding: "10px", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}` }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>安定性</div>
                        <div style={{ fontWeight: 600 }}>{data.traits.stability}</div>
                    </div>
                    <div style={{ background: COLORS.bg, padding: "10px", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, gridColumn: "span 2" }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>自由度</div>
                        <div style={{ fontWeight: 600 }}>{data.traits.freedom}</div>
                    </div>
                </div>
            </div>

            {/* 向いている人・向いていない人 */}
            <div style={cardStyle}>
                <div style={sectionTitleStyle}>🎯 こんな人に向いています</div>
                <ul style={listStyle}>
                    {data.fitFor.map((item, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                    ))}
                </ul>
                <div style={{ height: 1, background: COLORS.cardBorder, margin: "16px 0" }} />
                <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600, marginBottom: 8 }}>⚠️ 逆に向いていない人</div>
                <ul style={{ ...listStyle, color: COLORS.textMuted }}>
                    {data.notFitFor.map((item, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* まずやること */}
            <div style={cardStyle}>
                <div style={{ ...sectionTitleStyle, color: ac }}>🚀 まずやること</div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ac, marginBottom: 4 }}>【今すぐ】</div>
                    <div style={{ fontSize: 14, background: ac + "15", borderLeft: `3px solid ${ac}`, padding: "8px 12px", borderRadius: "0 6px 6px 0" }}>
                        {data.firstSteps.now}
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>【今日中】</div>
                    <div style={{ fontSize: 14, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, padding: "8px 12px", borderRadius: 6 }}>
                        {data.firstSteps.today}
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>【今週中】</div>
                    <div style={{ fontSize: 14, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, padding: "8px 12px", borderRadius: 6 }}>
                        {data.firstSteps.thisWeek}
                    </div>
                </div>
            </div>

            {/* おすすめの始め方・サービス */}
            <div style={cardStyle}>
                <div style={sectionTitleStyle}>🔗 おすすめの始め方</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
                    まずは以下のサービス等を利用して小さく始めるのがおすすめです。
                </div>

                {data.primaryCta && (
                    <div style={{ marginBottom: 24 }}>
                        <a href={data.primaryCta.url} style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "100%", padding: "16px", background: ac, color: "#000",
                            fontWeight: 700, fontSize: 16, borderRadius: 12, border: "none",
                            cursor: "pointer", textDecoration: "none",
                            boxShadow: `0 4px 14px ${ac}40`, transition: "transform 0.2s"
                        }}>
                            {data.primaryCta.text}
                        </a>
                        {data.ctaSubText && (
                            <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 10, lineHeight: 1.4 }}>
                                {data.ctaSubText}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.services.map((svc, i) => (
                        <div key={i} style={{
                            background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`,
                            borderRadius: 12, padding: 16, display: "flex", flexDirection: "column"
                        }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: ac, marginBottom: 6 }}>{svc.name}</div>
                            <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 12, lineHeight: 1.5 }}>{svc.desc}</div>
                            {svc.fit && (
                                <div style={{
                                    fontSize: 12, color: COLORS.textMuted, background: COLORS.card,
                                    padding: "10px", borderRadius: 8, marginBottom: 16, border: `1px solid ${COLORS.cardBorder}`
                                }}>
                                    <span style={{ color: ac, fontWeight: 700, marginRight: 6 }}>💡 向いている人:</span><br />
                                    {svc.fit}
                                </div>
                            )}
                            <a href={svc.url} target="_blank" rel="noopener noreferrer" style={{
                                alignSelf: "flex-end", padding: "10px 18px", background: ac + "15",
                                color: ac, borderRadius: 8, fontSize: 13, fontWeight: 700,
                                textDecoration: "none", border: `1px solid ${ac}40`, transition: "background 0.2s"
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = ac + "25"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = ac + "15"; }}
                            >
                                見てみる <span style={{ fontSize: 11, marginLeft: 2 }}>↗</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* よくある失敗 */}
            <div style={cardStyle}>
                <div style={{ ...sectionTitleStyle, color: COLORS.danger }}>🔥 よくある失敗</div>
                <ul style={listStyle}>
                    {data.pitfalls.map((item, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Udemy セクション */}
            {data.udemySection && (
                <div style={{ ...cardStyle, border: `1px solid #F59E0B30` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 16 }}>📚</span>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B" }}>まず学んでから始めたいあなたへ</div>
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 14, whiteSpace: "pre-wrap" }}>
                        {data.udemySection.lead}
                    </div>
                    <a
                        href={data.udemySection.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "100%", padding: "12px", background: "#F59E0B18",
                            color: "#F59E0B", borderRadius: 10, fontSize: 13, fontWeight: 700,
                            textDecoration: "none", border: `1px solid #F59E0B40`, transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F59E0B28"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#F59E0B18"; }}
                    >
                        Udemyで入門講座を1つ学ぶ →
                    </a>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8, textAlign: "center" }}>
                        ※多くの講座はセール時1,000〜2,000円程度で受講できます
                    </div>
                </div>
            )}

            {/* 次のアクション */}

            <div style={{ marginTop: 40, padding: "24px 20px", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, textAlign: "center", marginBottom: 64 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
                    他の収入スタイルも見てみますか？
                </div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
                    診断結果に戻って、別のステップや選択肢を確認できます。
                </div>
                <button
                    onClick={() => router.push("/apps/mosaic")}
                    style={{
                        display: "inline-block", width: "100%", padding: "16px", background: "transparent",
                        color: COLORS.text, fontWeight: 600, fontSize: 15, borderRadius: 12,
                        border: `1px solid ${COLORS.cardBorder}`, cursor: "pointer", transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                    診断結果に戻る
                </button>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{
                        background: "none", border: "none", color: COLORS.textMuted,
                        fontSize: 13, marginTop: 16, cursor: "pointer", textDecoration: "underline"
                    }}
                >
                    ページの一番上へ
                </button>
            </div>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: COLORS.cardBorder }}>
                MOSAIC v3.3 ─ ガイドページ
            </div>

            <div style={{ textAlign: "center", paddingBottom: 20, paddingTop: 10, fontSize: 12, color: COLORS.textMuted }}>
                &copy; Mosaic Design
            </div>
        </div>
    );
}
