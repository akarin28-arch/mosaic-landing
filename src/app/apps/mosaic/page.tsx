"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// ─── UI用定数 ───
const COLORS = {
    bg: "#0D1B2A",
    card: "#0D1B2A",
    cardBorder: "#1B2D45",
    text: "#E0E6ED",
    textMuted: "#8899AA",
    increase: "#10B981",
    keep: "#3B82F6",
    freedom: "#8B5CF6",
    employment: "#3B82F6",
    asset: "#8B5CF6",
    content: "#10B981",
    network: "#F59E0B",
    ownership: "#EC4899",
};

const GOAL_COLOR = {
    increase_income: COLORS.increase,
    keep_income_change_style: COLORS.keep,
    prioritize_freedom: COLORS.freedom,
} as const;

const INCOME_STYLE_COLOR = {
    skill_labour: COLORS.employment,
    asset_investing: COLORS.asset,
    creative_content: COLORS.content,
    relationship_network: COLORS.network,
    ownership_utilization: COLORS.ownership,
} as const;

const CATEGORY_COLOR = {
    employment_contract: COLORS.employment,
    asset_income: COLORS.asset,
    content_income: COLORS.content,
    network_income: COLORS.network,
    ownership_income: COLORS.ownership,
} as const;

const CATEGORY_LABEL = {
    employment_contract: "雇用・業務受託",
    asset_income: "資産収入",
    content_income: "コンテンツ収入",
    network_income: "紹介・ネットワーク収入",
    ownership_income: "所有活用収入",
} as const;

const INCOME_STYLE_LABEL = {
    skill_labour: "スキル型",
    asset_investing: "資産型",
    creative_content: "クリエイティブ型",
    relationship_network: "ネットワーク型",
    ownership_utilization: "所有活用型",
} as const;

const LIFE_STYLE_LABEL = {
    security_first: "安定優先",
    freedom_expand: "自由拡張",
    fulfilment_seek: "充実追求",
    social_connection: "つながり重視",
    asset_building: "資産形成",
} as const;

const INCOME_STYLE_ICON = {
    skill_labour: "🧑‍💻",
    asset_investing: "📈",
    creative_content: "🎨",
    relationship_network: "🤝",
    ownership_utilization: "🏠",
} as const;

const LIFE_STYLE_ICON = {
    security_first: "🛡️",
    freedom_expand: "🕊️",
    fulfilment_seek: "✨",
    social_connection: "☕",
    asset_building: "🌱",
} as const;

const ACTION_LINKS = {
    employment_contract: "/apps/mosaic/guides/employment-contract",
    asset_income: "/apps/mosaic/guides/asset-income",
    content_income: "/apps/mosaic/guides/content-income",
    network_income: "/apps/mosaic/guides/network-income",
    ownership_income: "/apps/mosaic/guides/ownership-income",
} as const;

const QUESTIONS = [
    {
        id: "q0",
        text: "今、一番変えたいことは？",
        role: "goalMode判定",
        options: [
            { value: "more_money", label: "とにかく収入を増やしたい" },
            { value: "change_style", label: "収入は維持しながら働き方を変えたい" },
            { value: "more_freedom", label: "収入より自由や充実を優先したい" },
        ],
    },
    {
        id: "q1",
        text: "今の働き方は？",
        role: "constraint補正",
        options: [
            { value: "fulltime", label: "フルタイム会社員" },
            { value: "parttime", label: "パート・アルバイト" },
            { value: "freelance", label: "フリーランス・自営" },
            { value: "none", label: "働いていない・休職中" },
        ],
    },
    {
        id: "q2",
        text: "3年後の理想に近いのは？",
        role: "income + life両方",
        options: [
            { value: "stable_up", label: "安定収入を増やして安心したい" },
            { value: "multi_source", label: "複数の収入源を持っていたい" },
            { value: "creative_life", label: "好きなことで収入を得ていたい" },
            { value: "free_time", label: "自由な時間を確保しながら稼ぎたい" },
        ],
    },
    {
        id: "q3",
        text: "稼ぎ方として一番しっくりくるのは？",
        role: "収入スタイル（最重要）",
        options: [
            { value: "skill", label: "スキルや知識を使って稼ぐ" },
            { value: "create", label: "作品やコンテンツを作って稼ぐ" },
            { value: "invest", label: "お金に働いてもらって稼ぐ" },
            { value: "connect", label: "人とのつながりを活かして稼ぐ" },
            { value: "own", label: "持っているもの・場所・権利を活かして稼ぐ" },
        ],
    },
    {
        id: "q4",
        text: "新しい収入を作るとしたら？",
        role: "firstAction判定",
        options: [
            { value: "quick_start", label: "すぐ始められることからやりたい" },
            { value: "learn_first", label: "まず勉強してから始めたい" },
            { value: "small_invest", label: "少額でも投資から始めたい" },
            { value: "side_by_side", label: "今の仕事をしながら並行で育てたい" },
        ],
    },
    {
        id: "q5",
        text: "副業・新しい収入づくりに使える時間は？",
        role: "constraint補正",
        options: [
            { value: "under5", label: "週5時間未満" },
            { value: "5to10", label: "週5〜10時間" },
            { value: "10to20", label: "週10〜20時間" },
            { value: "over20", label: "週20時間以上" },
        ],
    },
    {
        id: "q6",
        text: "お金以外で一番大切にしたいことは？",
        role: "生き方スタイル（最重要）",
        options: [
            { value: "security", label: "将来の安心・安定" },
            { value: "freedom", label: "場所や時間の自由" },
            { value: "fulfilment", label: "やりがい・成長の実感" },
            { value: "connection", label: "人とのつながり・感謝" },
        ],
    },
    {
        id: "q7",
        text: "新しい収入を作るときのスタンスは？",
        role: "生き方スタイル（最重要）",
        options: [
            { value: "low_risk", label: "リスクは最小限にしたい" },
            { value: "balanced", label: "多少のリスクは取れる" },
            { value: "challenge", label: "挑戦してでも大きく変えたい" },
        ],
    },
];

const GOAL_MODE_MAP = {
    more_money: "increase_income",
    change_style: "keep_income_change_style",
    more_freedom: "prioritize_freedom",
} as const;

const TARGET_OPTIONS = {
    increase_income: [
        { value: 3, label: "月3万円" },
        { value: 5, label: "月5万円" },
        { value: 8, label: "月8万円" },
        { value: 10, label: "月10万円" },
        { value: 15, label: "月15万円" },
        { value: 20, label: "月20万円" },
    ],
    keep_income_change_style: [
        { value: 100, label: "今の収入をほぼ維持したい（100%）" },
        { value: 90, label: "1割ぐらい下がってもOK（90%）" },
        { value: 80, label: "2割ぐらい下がってもOK（80%）" },
    ],
    prioritize_freedom: [
        { value: 100, label: "できれば現状維持したい（100%）" },
        { value: 90, label: "1割減までなら許容できる（90%）" },
        { value: 70, label: "3割減までなら許容できる（70%）" },
    ],
};

const TARGET_QUESTION_LABEL = {
    increase_income: "目標の追加収入は？",
    keep_income_change_style: "維持したい収入の割合は？",
    prioritize_freedom: "収入の変動はどこまで許容できる？",
} as const;

const TILE_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"];

const RESULT_TYPE_MAP = {
    skill_labour: "skill",
    asset_investing: "invest",
    creative_content: "creative",
    relationship_network: "network",
    ownership_utilization: "asset",
} as const;

const SHARE_PLATFORM_MAP = {
    "x.com": "x",
    "twitter.com": "x",
    "line.me": "line",
    "facebook.com": "facebook",
    "www.facebook.com": "facebook",
    "m.facebook.com": "facebook",
} as const;

function getMosaicEntry() {
    if (typeof document === "undefined") return "direct";

    const referrer = document.referrer;
    if (!referrer) return "direct";

    try {
        const refUrl = new URL(referrer);
        return refUrl.origin === window.location.origin && refUrl.pathname === "/" ? "lp" : "direct";
    } catch {
        return "direct";
    }
}

function getMosaicResultType(primaryIncomeStyle: string | undefined) {
    if (!primaryIncomeStyle) return "asset";
    return RESULT_TYPE_MAP[primaryIncomeStyle as keyof typeof RESULT_TYPE_MAP] || "asset";
}

function getSharePlatform(url: string) {
    try {
        const hostname = new URL(url, window.location.origin).hostname.toLowerCase();
        return SHARE_PLATFORM_MAP[hostname as keyof typeof SHARE_PLATFORM_MAP] || "other";
    } catch {
        return "other";
    }
}

function MosaicTileGrid() {
    const size = 4;
    const total = size * size;
    const tiles = Array.from({ length: total }, (_, i) => i);
    return (
        <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${size}, 22px)`, gap: 4 }}>
            {tiles.map((i) => {
                const color = TILE_COLORS[i % TILE_COLORS.length];
                // Build bottom-to-top: tiles in the last row appear first
                const row = Math.floor(i / size);
                const reversedRow = (size - 1) - row;
                const col = i % size;
                const delay = ((reversedRow * size + col) * 0.07).toFixed(2);
                return (
                    <div
                        key={i}
                        className="mosaic-tile"
                        style={{ background: color + "CC", animationDelay: `${delay}s` }}
                    />
                );
            })}
        </div>
    );
}

export default function MOSAICDesignEngine() {
    const router = useRouter();
    const hasTrackedStart = useRef(false);
    const hasTrackedCompletion = useRef(false);

    // Use state without full localStorage initialization on the server to prevent hydration mismatch.
    const [isMounted, setIsMounted] = useState(false);
    const [phase, setPhase] = useState("input"); // input | target | calculating | result | error
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [goalMode, setGoalMode] = useState<string | null>(null);
    const [target, setTarget] = useState<number | null>(null);
    const [tab, setTab] = useState("result"); // result | detail
    const [expandedLane, setExpandedLane] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hoveredBtn, setHoveredBtn] = useState<any>(null);
    const [showFirstHint, setShowFirstHint] = useState(false);
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const params = new URLSearchParams(window.location.search);
        if (params.get("reset") === "true") {
            handleReset();
            // Clear URL param to avoid reset on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        } else {
            // Load from sessionStorage safely on client
            setPhase(sessionStorage.getItem("mosaic_phase") || "input");
            setCurrentQ(Number(sessionStorage.getItem("mosaic_currentQ")) || 0);
            setAnswers(JSON.parse(sessionStorage.getItem("mosaic_answers") || "{}"));
            setGoalMode(sessionStorage.getItem("mosaic_goalMode") || null);
            setTarget(Number(sessionStorage.getItem("mosaic_target")) || null);
            setResult(JSON.parse(sessionStorage.getItem("mosaic_result") || "null"));
        }

        const mq = window.matchMedia("(hover: hover)");
        setCanHover(mq.matches);
        const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (isTransitioning) setHoveredBtn(null);
    }, [isTransitioning]);

    useEffect(() => {
        setHoveredBtn(null);
        // Brief highlight on first option to signal new question loaded
        if (currentQ > 0 && phase === "input") {
            setShowFirstHint(true);
            const t = setTimeout(() => setShowFirstHint(false), 700);
            return () => clearTimeout(t);
        }
    }, [currentQ, phase]);

    useEffect(() => {
        if (!isMounted) return;
        sessionStorage.setItem("mosaic_phase", phase);
        sessionStorage.setItem("mosaic_currentQ", currentQ.toString());
        sessionStorage.setItem("mosaic_answers", JSON.stringify(answers));
        if (goalMode) sessionStorage.setItem("mosaic_goalMode", goalMode);
        if (target) sessionStorage.setItem("mosaic_target", target.toString());
        if (result) sessionStorage.setItem("mosaic_result", JSON.stringify(result));
    }, [phase, currentQ, answers, goalMode, target, result, isMounted]);

    useEffect(() => {
        if (!isMounted || hasTrackedStart.current) return;

        const hasExistingState = Boolean(
            sessionStorage.getItem("mosaic_answers") ||
            sessionStorage.getItem("mosaic_result") ||
            sessionStorage.getItem("mosaic_currentQ")
        );

        if (phase === "input" && currentQ === 0 && !hasExistingState) {
            trackEvent("mosaic_start", { entry: getMosaicEntry() });
            hasTrackedStart.current = true;
        }
    }, [currentQ, isMounted, phase]);

    useEffect(() => {
        if (phase !== "result" || !result || hasTrackedCompletion.current) return;

        const resultType = getMosaicResultType(result.primaryIncomeStyle);
        trackEvent("mosaic_complete");
        trackEvent("mosaic_result", { result_type: resultType });
        hasTrackedCompletion.current = true;
    }, [phase, result]);

    useEffect(() => {
        if (phase !== "result") return;

        const listener = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
            if (!anchor) return;

            const platform = getSharePlatform(anchor.href);
            if (platform === "other" && !/share|intent|tweet/i.test(anchor.href)) return;

            trackEvent("mosaic_share_click", {
                platform,
                result_type: getMosaicResultType(result?.primaryIncomeStyle),
            });
        };

        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    }, [phase, result]);

    function handleAnswer(qid: string, value: string) {
        // 状態を先に更新してボタンのハイライトを即座に反映
        const next = { ...answers, [qid]: value };
        setAnswers(next);
        if (qid === "q0") {
            setGoalMode(GOAL_MODE_MAP[value as keyof typeof GOAL_MODE_MAP]);
        }

        // ふわっと消えるトランジションを開始
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentQ < QUESTIONS.length - 1) {
                setCurrentQ(currentQ + 1);
            } else {
                setPhase("target");
            }
            setIsTransitioning(false);
        }, 450); // 450ms待機して次へ
    }

    async function handleTarget(val: number) {
        setTarget(val);
        setPhase("calculating");
        setErrorMsg("");

        try {
            const res = await fetch("/api/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, target: val, goalMode }),
            });

            if (!res.ok) {
                throw new Error("計算処理に失敗しました (Status: " + res.status + ")");
            }

            const data = await res.json();
            setResult(data);
            setPhase("result");
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "予期せぬエラーが発生しました");
            setPhase("error");
        }
    }

    function handleBack() {
        if (phase === "target") {
            setPhase("input");
            setCurrentQ(QUESTIONS.length - 1);
        } else if (phase === "input" && currentQ > 0) {
            setCurrentQ(currentQ - 1);
        } else if (phase === "error") {
            setPhase("target");
        }
    }

    function handleReset() {
        sessionStorage.removeItem("mosaic_phase");
        sessionStorage.removeItem("mosaic_currentQ");
        sessionStorage.removeItem("mosaic_answers");
        sessionStorage.removeItem("mosaic_goalMode");
        sessionStorage.removeItem("mosaic_target");
        sessionStorage.removeItem("mosaic_result");

        setPhase("input");
        setCurrentQ(0);
        setAnswers({});
        setGoalMode(null);
        setTarget(null);
        setTab("result");
        setExpandedLane(null);
        setResult(null);
        setErrorMsg("");
        hasTrackedStart.current = false;
        hasTrackedCompletion.current = false;
    }

    // Render nothing until mounted to avoid hydration error
    if (!isMounted) return null;

    const gc = goalMode ? GOAL_COLOR[goalMode as keyof typeof GOAL_COLOR] : "#3B82F6";
    const resultColor = result ? INCOME_STYLE_COLOR[result.primaryIncomeStyle as keyof typeof INCOME_STYLE_COLOR] || gc : gc;
    const ac = phase === "result" ? resultColor : gc;

    function renderBreadcrumbs() {
        const answered = QUESTIONS.filter((q, i) => answers[q.id] && i < currentQ);
        if (answered.length === 0) return null;
        return (
            <div style={{ marginTop: 20, padding: "12px 14px", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>これまでの回答</div>
                    <button
                        onClick={handleReset}
                        style={{
                            background: "none", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 4,
                            padding: "2px 8px", fontSize: 10, color: COLORS.textMuted, cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = ac; e.currentTarget.style.color = ac; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorder; e.currentTarget.style.color = COLORS.textMuted; }}
                    >
                        最初からやり直す
                    </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {answered.map((q, i) => {
                        const opt = q.options.find((o) => o.value === answers[q.id]);
                        if (!opt) return null;
                        return (
                            <button
                                key={q.id}
                                onClick={() => { setCurrentQ(i); }}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 4,
                                    padding: "4px 10px", borderRadius: 6, fontSize: 11, lineHeight: 1.4,
                                    background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`,
                                    color: COLORS.textMuted, cursor: "pointer",
                                    transition: "border-color 0.2s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ac; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorder; }}
                            >
                                <span style={{ color: ac, fontWeight: 700, fontSize: 10 }}>Q{i + 1}</span>
                                <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    function renderTargetBreadcrumbs() {
        const answered = QUESTIONS.filter((q) => answers[q.id]);
        if (answered.length === 0) return null;
        return (
            <div style={{ marginTop: 20, padding: "12px 14px", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>これまでの回答</div>
                    <button
                        onClick={handleReset}
                        style={{
                            background: "none", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 4,
                            padding: "2px 8px", fontSize: 10, color: COLORS.textMuted, cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = ac; e.currentTarget.style.color = ac; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorder; e.currentTarget.style.color = COLORS.textMuted; }}
                    >
                        最初からやり直す
                    </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {answered.map((q, i) => {
                        const opt = q.options.find((o) => o.value === answers[q.id]);
                        if (!opt) return null;
                        return (
                            <div
                                key={q.id}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 4,
                                    padding: "4px 10px", borderRadius: 6, fontSize: 11, lineHeight: 1.4,
                                    background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`,
                                    color: COLORS.textMuted,
                                }}
                            >
                                <span style={{ color: ac, fontWeight: 700, fontSize: 10 }}>Q{i + 1}</span>
                                <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const containerStyle: React.CSSProperties = {
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
        padding: "24px 0", // Reduced horizontal padding for full width on mobile
        maxWidth: 600,
        width: "100%",
        margin: "0 auto",
    };

    const cardStyle: React.CSSProperties = {
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 12,
        padding: "20px",
        marginBottom: 16,
        marginRight: 16, // Add margin to avoid sticking to screen edge when width < 600
        marginLeft: 16,
    };

    const btnBase: React.CSSProperties = {
        display: "block",
        width: "100%",
        padding: "14px 16px",
        marginBottom: 10,
        borderRadius: 10,
        border: `1px solid ${COLORS.cardBorder}`,
        background: COLORS.card,
        color: COLORS.text,
        fontSize: 15,
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.2s",
    };

    if (phase === "calculating") {
        return (
            <div style={containerStyle}>
                <style>{`
          @keyframes mosaicPop {
            0%   { opacity: 0; transform: scale(0.5); }
            60%  { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          .mosaic-tile {
            width: 22px; height: 22px; border-radius: 4px;
            animation: mosaicPop 0.5s ease forwards;
            opacity: 0;
          }
        `}</style>
                <div style={{ textAlign: "center", marginTop: 100 }}>
                    <MosaicTileGrid />
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 20 }}>設計中...</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10 }}>あなたの回答に基づいて収入設計を作成しています</div>
                </div>
            </div>
        );
    }

    if (phase === "error") {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "#F87171", marginBottom: 12 }}>エラーが発生しました</div>
                    <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 20 }}>{errorMsg}</div>
                    <button onClick={handleBack} style={{ ...btnBase, textAlign: "center" }}>戻る</button>
                    <button onClick={handleReset} style={{ ...btnBase, textAlign: "center", background: "none", border: "none" }}>最初からやり直す</button>
                </div>
            </div>
        );
    }

    if (phase === "input") {
        const q = QUESTIONS[currentQ];
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.textMuted, marginBottom: 4 }}>MOSAIC</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4, opacity: 0.8 }}>自分だけの収入設計を、見つけよう。</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>収入ポートフォリオ診断</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 4, justifyContent: "center" }}>
                        {QUESTIONS.map((_, i) => (
                            <div key={i} style={{
                                width: 28, height: 4, borderRadius: 2,
                                background: i <= currentQ ? ac : COLORS.cardBorder,
                                transition: "background 0.3s",
                            }} />
                        ))}
                    </div>
                </div>

                <div style={{
                    ...cardStyle,
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? "translateY(10px)" : "translateY(0)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    pointerEvents: isTransitioning ? "none" : "auto", // トランジション中の連続クリック防止
                }}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
                        Q{currentQ + 1} / {QUESTIONS.length}
                        <span style={{ opacity: 0.1, marginLeft: 8 }}>─ {q.role}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>{q.text}</div>
                    {q.options.map((opt, idx) => {
                        const isFirstHint = idx === 0 && showFirstHint && !answers[q.id];
                        const isHovered = canHover && hoveredBtn === opt.value;
                        const isSelected = answers[q.id] === opt.value;

                        return (
                            <button
                                key={opt.value}
                                style={{
                                    ...btnBase,
                                    borderColor: (isFirstHint || isHovered || isSelected) ? ac : COLORS.cardBorder,
                                    background: isSelected ? ac + "18" : (isFirstHint || isHovered) ? ac + "0A" : COLORS.card,
                                    transition: "all 0.3s",
                                }}
                                onPointerEnter={(e) => {
                                    if (canHover && e.pointerType !== "touch") setHoveredBtn(opt.value);
                                }}
                                onPointerLeave={() => {
                                    if (canHover) setHoveredBtn(null);
                                }}
                                onClick={() => {
                                    setHoveredBtn(null);
                                    handleAnswer(q.id, opt.value);
                                }}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                {currentQ > 0 && (
                    <button
                        onClick={handleBack}
                        style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 13, cursor: "pointer", marginTop: 4 }}
                    >
                        ← 前の質問に戻る
                    </button>
                )}

                {renderBreadcrumbs()}

                <div style={{ textAlign: "center", paddingBottom: 20, paddingTop: 40, fontSize: 12, color: COLORS.textMuted }}>
                    Operated by <a href="https://mosaic-design.jp" style={{ color: COLORS.textMuted, textDecoration: "underline" }}>Mosaic Design</a>
                </div>
            </div>
        );
    }

    if (phase === "target" && goalMode) {
        const opts = TARGET_OPTIONS[goalMode as keyof typeof TARGET_OPTIONS] || [];
        const label = TARGET_QUESTION_LABEL[goalMode as keyof typeof TARGET_QUESTION_LABEL] || "目標を選んでください";
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.textMuted, marginBottom: 4 }}>MOSAIC</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4, opacity: 0.8 }}>自分だけの収入設計を、見つけよう。</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>収入ポートフォリオ診断</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>最後の質問</div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>{label}</div>
                    {opts.map((opt) => (
                        <button
                            key={opt.value}
                            style={{ ...btnBase }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = ac; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorder; }}
                            onClick={() => handleTarget(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleBack}
                    style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}
                >
                    ← 前に戻る
                </button>

                {renderTargetBreadcrumbs()}

                <div style={{ textAlign: "center", paddingBottom: 20, paddingTop: 40, fontSize: 12, color: COLORS.textMuted }}>
                    Operated by <a href="https://mosaic-design.jp" style={{ color: COLORS.textMuted, textDecoration: "underline" }}>Mosaic Design</a>
                </div>
            </div>
        );
    }

    if (phase === "result" && result) {
        const {
            revenueMix, explanation, primaryIncomeStyle, secondaryIncomeStyle,
            primaryLifeStyle, firstAction, supportActions, avoidPattern,
            fulfilScore, firstIncomeDaysEstimate, timelineLabel,
            incomePlan, incomeStyleScores, lifeStyleScores,
            learningHint,
        } = result;

        const sectionNum = (n: number | string) => ({
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 24, height: 24, borderRadius: "50%", background: ac, color: "#fff",
            fontSize: 12, fontWeight: 700, marginRight: 8, flexShrink: 0,
        } as const);

        return (
            <div style={containerStyle}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.textMuted }}>MOSAIC</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>あなたの収入設計</div>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {[
                        { key: "result", label: "収入設計結果" },
                        { key: "detail", label: "スコア詳細" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                border: tab === t.key ? `1px solid ${ac}` : `1px solid ${COLORS.cardBorder}`,
                                background: tab === t.key ? ac + "20" : COLORS.card,
                                color: tab === t.key ? ac : COLORS.textMuted,
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "result" && (
                    <>
                        <div style={{ ...cardStyle, border: `1px solid ${ac}40` }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: ac, marginBottom: 14 }}>
                                おすすめ収入構成
                            </div>
                            <div style={{ display: "flex", height: 48, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                                {revenueMix.filter((r: any) => r.ratio > 0).map(({ category, ratio }: { category: string, ratio: number }) => (
                                    <div
                                        key={category}
                                        style={{
                                            width: `${ratio}%`,
                                            background: CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR],
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: ratio >= 12 ? 13 : 10, fontWeight: 700, color: "#fff",
                                            transition: "width 0.5s",
                                        }}
                                    >
                                        {ratio >= 8 ? `${ratio}%` : ""}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
                                {revenueMix.filter((r: any) => r.ratio > 0).map(({ category, ratio }: { category: string, ratio: number }) => (
                                    <div key={category} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR], flexShrink: 0 }} />
                                        <span style={{ color: COLORS.textMuted }}>{CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL]}</span>
                                        <span style={{ fontWeight: 700 }}>{ratio}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                <span style={sectionNum(1)}>1</span>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>あなたの生き方スタイル</span>
                            </div>
                            <div style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted }}>
                                収入スタイル：<strong style={{ color: ac, fontSize: 15 }}>
                                    <span style={{ marginRight: 4 }}>{INCOME_STYLE_ICON[primaryIncomeStyle as keyof typeof INCOME_STYLE_ICON]}</span>
                                    {INCOME_STYLE_LABEL[primaryIncomeStyle as keyof typeof INCOME_STYLE_LABEL]}
                                </strong>
                                <span style={{ fontSize: 12, marginLeft: 6 }}>（副軸：{INCOME_STYLE_LABEL[secondaryIncomeStyle as keyof typeof INCOME_STYLE_LABEL]}）</span>
                                <br />
                                <div style={{ marginTop: 8 }}>
                                    生き方スタイル：<strong style={{ color: ac, fontSize: 15 }}>
                                        <span style={{ marginRight: 4 }}>{LIFE_STYLE_ICON[primaryLifeStyle as keyof typeof LIFE_STYLE_ICON]}</span>
                                        {LIFE_STYLE_LABEL[primaryLifeStyle as keyof typeof LIFE_STYLE_LABEL]}
                                    </strong>
                                </div>
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.cardBorder}` }}>
                                    充実度スコア：<span style={{ color: ac, fontWeight: 700, fontSize: 18 }}>{fulfilScore}</span> / 100
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                <span style={sectionNum(2)}>2</span>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>この構成をおすすめする理由</span>
                            </div>
                            <div style={{ fontSize: 14, lineHeight: 1.8, color: COLORS.textMuted }}>{explanation}</div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                                <span style={sectionNum(3)}>3</span>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>最初の一歩</span>
                            </div>
                            {[
                                { key: "now", label: "今すぐ", sub: "5分", icon: "⚡" },
                                { key: "today", label: "今日中", sub: "1〜2h", icon: "📝" },
                                { key: "thisWeek", label: "今週", sub: "成果へ", icon: "🚀" },
                            ].map((step, idx) => (
                                <div key={step.key} style={{ position: "relative", paddingLeft: 32, marginBottom: idx < 2 ? 0 : 0 }}>
                                    {idx < 2 && (
                                        <div style={{
                                            position: "absolute", left: 11, top: 28, width: 2, height: "calc(100% - 8px)",
                                            background: `linear-gradient(to bottom, ${ac}60, ${ac}15)`,
                                        }} />
                                    )}
                                    <div style={{
                                        position: "absolute", left: 4, top: 6,
                                        width: 16, height: 16, borderRadius: "50%",
                                        background: ac + "25", border: `2px solid ${ac}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 8,
                                    }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ac }} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: ac }}>{step.label}</span>
                                        <span style={{ fontSize: 11, color: COLORS.textMuted }}>（{step.sub}）</span>
                                    </div>
                                    <div style={{
                                        fontSize: 14, lineHeight: 1.6, color: COLORS.text,
                                        background: ac + (idx === 0 ? "15" : "08"),
                                        padding: "10px 12px", borderRadius: 8,
                                        border: idx === 0 ? `1px solid ${ac}35` : `1px solid ${COLORS.cardBorder}`,
                                        marginBottom: 14,
                                    }}>
                                        {firstAction[step.key]}
                                    </div>
                                </div>
                            ))}
                            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, paddingLeft: 32 }}>
                                {timelineLabel}：約{firstIncomeDaysEstimate}日
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                <span style={sectionNum(4)}>4</span>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>補完策</span>
                            </div>
                            {supportActions.map((a: string, i: number) => (
                                <div key={i} style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 6, paddingLeft: 8, borderLeft: `2px solid ${ac}40` }}>
                                    {a}
                                </div>
                            ))}
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                <span style={sectionNum(5)}>5</span>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>避けるべき行動</span>
                            </div>
                            <div style={{ fontSize: 14, color: "#F87171", background: "#F8717112", padding: "12px 14px", borderRadius: 8, border: "1px solid #F8717130" }}>
                                {avoidPattern}
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: ac, marginBottom: 12 }}>収入づくりのステップ</div>
                            {["quickWin", "growthLane", "assetLane"].map((lane) => {
                                const p = incomePlan[lane];
                                if (!p) return null;
                                const laneInfo: Record<string, any> = {
                                    quickWin: { name: "まず収入にする", desc: "すぐ収入になる行動" },
                                    growthLane: { name: "育てて広げる", desc: "中期的な育成" },
                                    assetLane: { name: "将来の基盤にする", desc: "長期的なストック構築" },
                                };
                                const info = laneInfo[lane];
                                const isOpen = expandedLane === lane;
                                const catColor = CATEGORY_COLOR[p.category as keyof typeof CATEGORY_COLOR] || ac;
                                const linkUrl = ACTION_LINKS[p.category as keyof typeof ACTION_LINKS] || "#";

                                return (
                                    <div
                                        key={lane}
                                        style={{
                                            marginBottom: 10, padding: "10px 12px", borderRadius: 8,
                                            background: COLORS.bg,
                                            border: `1px solid ${isOpen ? catColor + "60" : COLORS.cardBorder}`,
                                            transition: "border-color 0.2s",
                                        }}
                                    >
                                        <div
                                            onClick={() => setExpandedLane(isOpen ? null : lane)}
                                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                                        >
                                            <div>
                                                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>
                                                    {info.name}<span style={{ marginLeft: 6, opacity: 0.6 }}>─ {info.desc}</span>
                                                </div>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>
                                                    <span style={{ color: catColor }}>{p.label}</span>
                                                    {p.amount && <span style={{ color: COLORS.textMuted, fontWeight: 400, marginLeft: 8 }}>目標 月{p.amount}万円</span>}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: 11, color: COLORS.textMuted, flexShrink: 0, marginLeft: 8 }}>
                                                {isOpen ? "▲" : "▼ 見る"}
                                            </span>
                                        </div>
                                        {isOpen && p.action && (
                                            <div style={{ marginTop: 10, animation: "fadeIn 0.3s ease" }}>
                                                <div style={{
                                                    padding: "10px 12px", borderRadius: 6,
                                                    background: catColor + "10", border: `1px solid ${catColor}25`,
                                                    fontSize: 13, lineHeight: 1.7, color: COLORS.text,
                                                }}>
                                                    {p.action}
                                                </div>
                                                <Link
                                                    href={linkUrl}
                                                    style={{
                                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                        marginTop: 10, width: "100%", padding: "10px 14px",
                                                        borderRadius: 6, border: `1px solid ${catColor}40`,
                                                        background: catColor + "15", color: catColor,
                                                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                                                        transition: "background 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = catColor + "25"; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = catColor + "15"; }}
                                                >
                                                    この進め方を詳しく見る <span style={{ marginLeft: 4, fontSize: 11 }}>→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {learningHint && (
                            <div style={{ ...cardStyle, border: `1px solid #F59E0B30` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <span style={{ fontSize: 16 }}>📚</span>
                                    <span style={{ fontWeight: 600, fontSize: 14, color: "#F59E0B" }}>まず学んでから始めたいあなたへ</span>
                                </div>
                                <div style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted, marginBottom: 14, whiteSpace: "pre-wrap" }}>
                                    {learningHint.text}
                                </div>
                                <a
                                    href="https://www.udemy.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        trackEvent("mosaic_external_click", {
                                            location: "result",
                                            service: "udemy",
                                        });
                                    }}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                        width: "100%", padding: "12px", background: "#F59E0B18",
                                        color: "#F59E0B", borderRadius: 10, fontSize: 13, fontWeight: 700,
                                        textDecoration: "none", border: "1px solid #F59E0B40", transition: "background 0.2s",
                                        boxSizing: "border-box", textAlign: "center",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F59E0B28"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#F59E0B18"; }}
                                >
                                    {learningHint.action}
                                </a>
                                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8, textAlign: "center" }}>
                                    ※多くの講座はセール時1,000〜2,000円程度で受講できます
                                </div>
                            </div>
                        )}
                    </>
                )}

                {tab === "detail" && (
                    <>
                        <div style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>収入スタイルスコア</div>
                            {Object.entries(incomeStyleScores as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
                                const maxVal = Math.max(...Object.values(incomeStyleScores as Record<string, number>)) || 1;
                                return (
                                    <div key={key} style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                                            <span style={{ color: key === primaryIncomeStyle ? ac : COLORS.textMuted }}>
                                                <span style={{ marginRight: 4 }}>{INCOME_STYLE_ICON[key as keyof typeof INCOME_STYLE_ICON]}</span>
                                                {INCOME_STYLE_LABEL[key as keyof typeof INCOME_STYLE_LABEL]}
                                                {key === primaryIncomeStyle && " ◆"}
                                            </span>
                                            <span style={{ fontWeight: 600 }}>{val}</span>
                                        </div>
                                        <div style={{ height: 6, background: COLORS.bg, borderRadius: 3 }}>
                                            <div style={{ height: 6, borderRadius: 3, background: key === primaryIncomeStyle ? ac : COLORS.cardBorder, width: `${(val / maxVal) * 100}%`, transition: "width 0.5s" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>生き方スタイルスコア</div>
                            {Object.entries(lifeStyleScores as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
                                const maxVal = Math.max(...Object.values(lifeStyleScores as Record<string, number>)) || 1;
                                return (
                                    <div key={key} style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                                            <span style={{ color: key === primaryLifeStyle ? ac : COLORS.textMuted }}>
                                                <span style={{ marginRight: 4 }}>{LIFE_STYLE_ICON[key as keyof typeof LIFE_STYLE_ICON]}</span>
                                                {LIFE_STYLE_LABEL[key as keyof typeof LIFE_STYLE_LABEL]}
                                                {key === primaryLifeStyle && " ◆"}
                                            </span>
                                            <span style={{ fontWeight: 600 }}>{val}</span>
                                        </div>
                                        <div style={{ height: 6, background: COLORS.bg, borderRadius: 3 }}>
                                            <div style={{ height: 6, borderRadius: 3, background: key === primaryLifeStyle ? ac : COLORS.cardBorder, width: `${(val / maxVal) * 100}%`, transition: "width 0.5s" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>制約プロファイル</div>
                            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.8 }}>
                                自由時間スコア：{result.constraintProfile.freeTime}<br />
                                リスク許容度：{result.constraintProfile.riskTolerance}<br />
                                goalMode：{result.goalMode}<br />
                                target：{result.target}
                            </div>
                        </div>
                    </>
                )}

                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                        onClick={handleReset}
                        style={{
                            background: "none", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8,
                            color: COLORS.textMuted, padding: "10px 24px", fontSize: 13, cursor: "pointer",
                        }}
                    >
                        もう一度やり直す
                    </button>
                </div>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: COLORS.cardBorder }}>
                    MOSAIC v3.3 ─ 収入ポートフォリオ診断
                </div>

                <div style={{ textAlign: "center", paddingBottom: 20, paddingTop: 10, fontSize: 12, color: COLORS.textMuted }}>
                    Operated by <a href="https://mosaic-design.jp" style={{ color: COLORS.textMuted, textDecoration: "underline" }}>Mosaic Design</a>
                </div>
            </div>
        );
    }

    return null;
}
