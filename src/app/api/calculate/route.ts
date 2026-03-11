import { NextResponse } from 'next/server';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOSAIC 収入設計エンジン v3.3 - Backend Logic
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CATEGORY_LABEL = {
    employment_contract: "雇用・業務受託",
    asset_income: "資産収入",
    content_income: "コンテンツ収入",
    network_income: "紹介・ネットワーク収入",
    ownership_income: "所有活用収入",
};

const INCOME_STYLE_LABEL = {
    skill_labour: "スキル型",
    asset_investing: "資産型",
    creative_content: "クリエイティブ型",
    relationship_network: "ネットワーク型",
    ownership_utilization: "所有活用型",
};

const LIFE_STYLE_LABEL = {
    security_first: "安定優先",
    freedom_expand: "自由拡張",
    fulfilment_seek: "充実追求",
    social_connection: "つながり重視",
    asset_building: "資産形成",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// スコアテーブル (Backend Only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const INCOME_SCORE_TABLE = {
    q2: {
        stable_up: { skill_labour: 5, asset_investing: 3, creative_content: 0, relationship_network: 1, ownership_utilization: 1 },
        multi_source: { skill_labour: 2, asset_investing: 3, creative_content: 2, relationship_network: 2, ownership_utilization: 2 },
        creative_life: { skill_labour: 1, asset_investing: 0, creative_content: 7, relationship_network: 1, ownership_utilization: 1 },
        free_time: { skill_labour: 1, asset_investing: 4, creative_content: 2, relationship_network: 0, ownership_utilization: 3 },
    },
    q3: {
        skill: { skill_labour: 7, asset_investing: 0, creative_content: 1, relationship_network: 1, ownership_utilization: 0 },
        create: { skill_labour: 1, asset_investing: 0, creative_content: 7, relationship_network: 1, ownership_utilization: 0 },
        invest: { skill_labour: 0, asset_investing: 7, creative_content: 0, relationship_network: 1, ownership_utilization: 2 },
        connect: { skill_labour: 1, asset_investing: 0, creative_content: 1, relationship_network: 7, ownership_utilization: 0 },
        own: { skill_labour: 0, asset_investing: 1, creative_content: 0, relationship_network: 0, ownership_utilization: 7 },
    },
    q4: {
        quick_start: { skill_labour: 4, asset_investing: 0, creative_content: 2, relationship_network: 3, ownership_utilization: 1 },
        learn_first: { skill_labour: 3, asset_investing: 2, creative_content: 3, relationship_network: 0, ownership_utilization: 1 },
        small_invest: { skill_labour: 0, asset_investing: 6, creative_content: 0, relationship_network: 0, ownership_utilization: 3 },
        side_by_side: { skill_labour: 2, asset_investing: 2, creative_content: 3, relationship_network: 1, ownership_utilization: 2 },
    },
};

const LIFE_SCORE_TABLE = {
    q2: {
        stable_up: { security_first: 5, freedom_expand: 0, fulfilment_seek: 1, social_connection: 1, asset_building: 3 },
        multi_source: { security_first: 2, freedom_expand: 3, fulfilment_seek: 1, social_connection: 1, asset_building: 3 },
        creative_life: { security_first: 0, freedom_expand: 3, fulfilment_seek: 5, social_connection: 2, asset_building: 0 },
        free_time: { security_first: 1, freedom_expand: 6, fulfilment_seek: 2, social_connection: 0, asset_building: 1 },
    },
    q6: {
        security: { security_first: 7, freedom_expand: 0, fulfilment_seek: 0, social_connection: 1, asset_building: 3 },
        freedom: { security_first: 0, freedom_expand: 7, fulfilment_seek: 2, social_connection: 0, asset_building: 1 },
        fulfilment: { security_first: 0, freedom_expand: 1, fulfilment_seek: 7, social_connection: 2, asset_building: 0 },
        connection: { security_first: 1, freedom_expand: 1, fulfilment_seek: 1, social_connection: 7, asset_building: 0 },
    },
    q7: {
        low_risk: { security_first: 5, freedom_expand: 1, fulfilment_seek: 0, social_connection: 1, asset_building: 3 },
        balanced: { security_first: 2, freedom_expand: 3, fulfilment_seek: 2, social_connection: 1, asset_building: 2 },
        challenge: { security_first: 0, freedom_expand: 4, fulfilment_seek: 4, social_connection: 1, asset_building: 1 },
    },
};

const LANE_FIT = {
    employment_contract: { quick: 95, growth: 50, asset: 10 },
    asset_income: { quick: 10, growth: 35, asset: 95 },
    content_income: { quick: 25, growth: 90, asset: 45 },
    network_income: { quick: 60, growth: 70, asset: 30 },
    ownership_income: { quick: 35, growth: 55, asset: 80 },
};

const STYLE_TO_CATEGORY = {
    skill_labour: "employment_contract",
    asset_investing: "asset_income",
    creative_content: "content_income",
    relationship_network: "network_income",
    ownership_utilization: "ownership_income",
};

const TIMELINE_LABELS = {
    increase_income: "初収入までの目安",
    keep_income_change_style: "移行の手応えが出るまでの目安",
    prioritize_freedom: "自由度改善を感じやすいまでの目安",
};

const CONSTRAINT_MAP = {
    q1: {
        fulltime: { freeTime: -2, riskTolerance: -1 },
        parttime: { freeTime: 1, riskTolerance: 0 },
        freelance: { freeTime: 2, riskTolerance: 1 },
        none: { freeTime: 3, riskTolerance: 0 },
    },
    q5: {
        under5: { freeTime: -2 },
        "5to10": { freeTime: 0 },
        "10to20": { freeTime: 2 },
        over20: { freeTime: 4 },
    },
};

const ACTION_TABLE = {
    skill_labour: {
        firstAction: {
            now: "ココナラの無料会員登録をして出品画面を開く",
            today: "『30分○○相談』など最小サービスを1つ、タイトル・説明文・価格まで下書きする",
            thisWeek: "ココナラにサービスを1件出品する",
        },
        support: [
            "自分が対価をもらえるスキルを3つ紙に書き出す",
            "Canvaでサービス紹介画像を1枚作る",
        ],
        avoid: "最初から高単価を狙って出品をためらい続けること",
    },
    asset_investing: {
        firstAction: {
            now: "SBI証券の口座開設ページを開いて申込を始める",
            today: "つみたてNISA対象のインデックスファンドを3つ比較し、1本に絞る",
            thisWeek: "月5,000円の積立設定を完了する",
        },
        support: [
            "毎月の固定費を1つ見直して投資原資を確保する",
            "マネーフォワードで月の収支を一度だけ確認する",
        ],
        avoid: "SNSの煽りに乗って個別株の短期売買に手を出すこと",
    },
    creative_content: {
        firstAction: {
            now: "noteのアカウントを作成してプロフィールを書く",
            today: "最初の記事のタイトルと見出し3つを下書きする",
            thisWeek: "noteに最初の1記事を公開する",
        },
        support: [
            "発信テーマを3つに絞って紙に書き出す",
            "Canvaでアイキャッチ画像を1枚作る",
        ],
        avoid: "完璧を求めて下書きのまま公開できずに終わること",
    },
    relationship_network: {
        firstAction: {
            now: "自分が実体験から人に勧められるサービス・商品・人を3つ書き出す",
            today: "そのうち1つについて「誰に・何を・なぜ勧めるか」を3行でまとめる",
            thisWeek: "noteまたはXで、実体験ベースの紹介投稿を1件公開する",
        },
        support: [
            "紹介用の短い自己紹介文を1つ作る",
            "A8.netなどのASPを比較し、紹介の幅を広げたければ登録する",
        ],
        avoid: "自分が使っていないものを報酬目的だけで無理に勧めること",
    },
    ownership_utilization: {
        firstAction: {
            now: "貸し出せそうな所有物・スペース・スキル資産を3つ紙に書き出す",
            today: "最も貸し出しやすい1つを選び、スペースマーケットなど該当プラットフォームに無料登録する",
            thisWeek: "写真・説明文・料金を設定して1件掲載・公開する",
        },
        support: [
            "掲載用の写真をスマホで3枚撮影する",
            "貸出時のルール・注意事項・価格帯を1ページにまとめる",
        ],
        avoid: "初期投資をかけすぎて回収の見通しが立たなくなること",
    },
};

const CATEGORY_DAYS = {
    employment_contract: 14,
    asset_income: 180,
    content_income: 60,
    network_income: 30,
    ownership_income: 45,
};

const LANE_ACTIONS = {
    employment_contract: {
        quick: "ココナラやクラウドワークスで、今のスキルで受けられる案件に1件応募する",
        growth: "実績を積みながら単価交渉できるポートフォリオを整備する",
        asset: "継続案件や月額顧問契約の形を作り、安定収入化する",
    },
    asset_income: {
        quick: "SBI証券や楽天証券でつみたてNISAの積立を今月から開始する",
        growth: "毎月の積立額を段階的に増やし、ボーナス月に追加投資する",
        asset: "配当株やETFを組み合わせて、インカムゲインの仕組みを構築する",
    },
    content_income: {
        quick: "noteやブログで、自分の経験をベースにした記事を1本公開する",
        growth: "週1本ペースで記事を積み上げ、収益化設定（有料記事・広告）を有効にする",
        asset: "記事群をまとめて有料マガジンや電子書籍にパッケージ化する",
    },
    network_income: {
        quick: "自分が実体験から勧められるサービスを1つ、noteやXで紹介する",
        growth: "紹介コンテンツを定期的に発信し、ASP経由のアフィリエイト導線を整える",
        asset: "紹介実績をもとに相談窓口やコミュニティ運営につなげる",
    },
    ownership_income: {
        quick: "スペースマーケットやフリマアプリで、遊休資産を1つ掲載する",
        growth: "稼働率を見ながら掲載数を増やし、レビューと実績を蓄積する",
        asset: "複数資産の運用を仕組み化し、管理コストを下げて利益率を高める",
    },
};

const LEARNING_HINTS = {
    skill_labour: {
        text: "まずスキルを磨いてから始めたいあなたへ\nUdemyで実務スキルの入門講座を1つ学び、今週中に小さな案件に挑戦してみましょう。",
        service: "Udemy",
        action: "Udemyで入門講座を1つ学ぶ →",
    },
    asset_investing: {
        text: "投資の基礎を理解してから始めたいあなたへ\nUdemyの入門講座で「NISA」や「インデックス投資」の基本を学ぶと、安心して最初の一歩を踏み出せます。",
        service: "Udemy",
        action: "Udemyで入門講座を1つ学ぶ →",
    },
    creative_content: {
        text: "発信スキルを身につけてから始めたいあなたへ\nUdemyのライティングや動画編集の入門講座で基礎を学び、そのままコンテンツ制作に挑戦してみましょう。",
        service: "Udemy",
        action: "Udemyで入門講座を1つ学ぶ →",
    },
    relationship_network: {
        text: "紹介ビジネスの仕組みを理解してから始めたいあなたへ\nUdemyでマーケティングやアフィリエイトの基礎を学ぶと、信頼される紹介コンテンツを作りやすくなります。",
        service: "Udemy",
        action: "Udemyで入門講座を1つ学ぶ →",
    },
    ownership_utilization: {
        text: "資産活用の方法を学んでから始めたいあなたへ\nUdemyで不動産活用やスペース運用の基礎を学ぶと、トラブルを避けながら収益化を進めやすくなります。",
        service: "Udemy",
        action: "Udemyで入門講座を1つ学ぶ →",
    },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// コアロジック関数群 (Backend Only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calcScores(answers: any, table: any, questionIds: string[]) {
    const keys = Object.keys(Object.values(Object.values(table)[0] as any)[0] as any);
    const scores: any = {};
    keys.forEach((k) => (scores[k] = 0));
    questionIds.forEach((qid) => {
        const val = answers[qid];
        if (val && table[qid] && table[qid][val]) {
            const row = table[qid][val];
            keys.forEach((k) => { scores[k] += row[k] || 0; });
        }
    });
    return scores;
}

function topTwo(scores: Record<string, number>) {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return { primary: sorted[0][0], secondary: sorted[1] ? sorted[1][0] : sorted[0][0] };
}

function buildConstraintProfile(answers: any) {
    let freeTime = 0;
    let riskTolerance = 0;
    const c1 = (CONSTRAINT_MAP.q1 as any)[answers.q1];
    if (c1) { freeTime += c1.freeTime || 0; riskTolerance += c1.riskTolerance || 0; }
    const c5 = (CONSTRAINT_MAP.q5 as any)[answers.q5];
    if (c5) { freeTime += c5.freeTime || 0; }
    if (answers.q7 === "low_risk") riskTolerance -= 2;
    if (answers.q7 === "challenge") riskTolerance += 2;
    return { freeTime, riskTolerance };
}

function buildRevenueMix(goalMode: string, lifeStyle: string, constraintProfile: any, primaryIncomeStyle: string, secondaryIncomeStyle: string, target: number) {
    const BASE: any = {
        increase_income: {
            security_first: { employment_contract: 40, asset_income: 15, content_income: 15, network_income: 15, ownership_income: 15 },
            freedom_expand: { employment_contract: 25, asset_income: 20, content_income: 25, network_income: 10, ownership_income: 20 },
            fulfilment_seek: { employment_contract: 20, asset_income: 10, content_income: 35, network_income: 20, ownership_income: 15 },
            social_connection: { employment_contract: 25, asset_income: 10, content_income: 15, network_income: 35, ownership_income: 15 },
            asset_building: { employment_contract: 20, asset_income: 35, content_income: 10, network_income: 10, ownership_income: 25 },
        },
        keep_income_change_style: {
            security_first: { employment_contract: 50, asset_income: 15, content_income: 10, network_income: 15, ownership_income: 10 },
            freedom_expand: { employment_contract: 30, asset_income: 20, content_income: 20, network_income: 10, ownership_income: 20 },
            fulfilment_seek: { employment_contract: 30, asset_income: 10, content_income: 30, network_income: 20, ownership_income: 10 },
            social_connection: { employment_contract: 35, asset_income: 10, content_income: 10, network_income: 35, ownership_income: 10 },
            asset_building: { employment_contract: 30, asset_income: 30, content_income: 10, network_income: 10, ownership_income: 20 },
        },
        prioritize_freedom: {
            security_first: { employment_contract: 35, asset_income: 25, content_income: 15, network_income: 10, ownership_income: 15 },
            freedom_expand: { employment_contract: 15, asset_income: 25, content_income: 25, network_income: 10, ownership_income: 25 },
            fulfilment_seek: { employment_contract: 15, asset_income: 15, content_income: 35, network_income: 20, ownership_income: 15 },
            social_connection: { employment_contract: 20, asset_income: 15, content_income: 15, network_income: 35, ownership_income: 15 },
            asset_building: { employment_contract: 15, asset_income: 35, content_income: 10, network_income: 10, ownership_income: 30 },
        },
    };

    const mix = { ...(BASE[goalMode]?.[lifeStyle] || BASE.increase_income.security_first) };

    const primaryCat = (STYLE_TO_CATEGORY as any)[primaryIncomeStyle];
    const secondaryCat = (STYLE_TO_CATEGORY as any)[secondaryIncomeStyle];
    if (primaryCat && mix[primaryCat] !== undefined) mix[primaryCat] += 10;
    if (secondaryCat && mix[secondaryCat] !== undefined) mix[secondaryCat] += 5;

    if (goalMode === "keep_income_change_style") {
        if (target === 100) { mix.employment_contract += 8; }
        else if (target === 90) { mix.content_income += 3; mix.ownership_income += 3; mix.network_income += 2; }
        else if (target === 80) { mix.asset_income += 4; mix.ownership_income += 3; mix.content_income += 3; mix.employment_contract -= 4; }
    } else if (goalMode === "prioritize_freedom") {
        if (target === 100) { mix.employment_contract += 6; }
        else if (target === 90) { mix.asset_income += 4; mix.content_income += 3; mix.ownership_income += 2; }
        else if (target === 70) { mix.employment_contract -= 8; mix.asset_income += 4; mix.content_income += 4; mix.ownership_income += 4; }
    } else if (goalMode === "increase_income") {
        if (target >= 15) { mix.content_income += 3; mix.network_income += 2; }
        else if (target >= 8) { mix.content_income += 2; }
    }

    if (constraintProfile.freeTime <= -2) { mix.employment_contract += 5; mix.content_income -= 2; }
    else if (constraintProfile.freeTime >= 3) { mix.content_income += 3; mix.employment_contract -= 3; }
    if (constraintProfile.riskTolerance <= -2) { mix.asset_income -= 3; mix.employment_contract += 3; }
    else if (constraintProfile.riskTolerance >= 2) { mix.asset_income += 3; }

    Object.keys(mix).forEach((k) => { if (mix[k] < 0) mix[k] = 0; });
    const sum = Object.values(mix).reduce((a: any, b: any) => a + b, 0) || 1;
    const result = Object.entries(mix).map(([category, raw]: [string, any]) => ({ category, ratio: Math.round((raw / (sum as number)) * 100) }));

    const rSum = result.reduce((a, b) => a + b.ratio, 0);
    if (rSum !== 100) {
        result.sort((a, b) => b.ratio - a.ratio);
        result[0].ratio += 100 - rSum;
    }
    return result.sort((a, b) => b.ratio - a.ratio);
}

function buildIncomePlan(revenueMix: any[], goalMode: string, target: number) {
    const lanes = ["quick", "growth", "asset"];
    const laneLabels: any = { quick: "quickWin", growth: "growthLane", asset: "assetLane" };
    const laneAmountRatio: any = { quick: 0.50, growth: 0.30, asset: 0.20 };
    const plan: any = {};
    const used = new Set();

    lanes.forEach((lane) => {
        let bestCat: string | null = null;
        let bestScore = -1;
        revenueMix.forEach(({ category, ratio }) => {
            if (used.has(category)) return;
            const fit = (LANE_FIT as any)[category]?.[lane] || 0;
            const score = ratio * fit;
            if (score > bestScore) { bestScore = score; bestCat = category; }
        });
        if (bestCat) {
            used.add(bestCat);
            const amount = goalMode === "increase_income" ? Math.round(target * laneAmountRatio[lane] * 10) / 10 : null;
            const action = (LANE_ACTIONS as any)[bestCat]?.[lane] || "";
            plan[laneLabels[lane]] = { category: bestCat, label: (CATEGORY_LABEL as any)[bestCat], amount, action };
        }
    });
    return plan;
}

function generateExplanation(goalMode: string, primaryIncomeStyle: string, primaryLifeStyle: string, revenueMix: any[], target: number) {
    const styleName = (INCOME_STYLE_LABEL as any)[primaryIncomeStyle];
    const lifeName = (LIFE_STYLE_LABEL as any)[primaryLifeStyle];
    const topCat = revenueMix[0];
    const secondCat = revenueMix[1];
    const topLabel = (CATEGORY_LABEL as any)[topCat?.category] || "";
    const secondLabel = (CATEGORY_LABEL as any)[secondCat?.category] || "";

    const modeIntro: any = {
        increase_income: `あなたの目標は月${target}万円の追加収入。`,
        keep_income_change_style: `あなたは収入を${target}%維持しながら働き方を変えたいと考えています。`,
        prioritize_freedom: `あなたは収入${target}%以上を保ちつつ、自由度を高めたいと考えています。`,
    };

    const styleDesc: any = {
        skill_labour: "スキルや専門知識を直接対価に変える力が強く",
        asset_investing: "お金を運用し、時間から切り離した収入を作る適性があり",
        creative_content: "作品やコンテンツを通じて価値を届ける素養があり",
        relationship_network: "人とのつながりから信頼ベースの収益を生む力があり",
        ownership_utilization: "所有する資産やリソースを活かして収益化する発想があり",
    };

    const mixReason = `そのため${topLabel}を${topCat?.ratio}%と厚めに設計し、${secondLabel}（${secondCat?.ratio}%）で${secondCat?.category === "asset_income" ? "中長期の資産性を補強" :
        secondCat?.category === "content_income" ? "成長ストックを育成" :
            secondCat?.category === "network_income" ? "紹介経由の広がりを確保" :
                secondCat?.category === "ownership_income" ? "所有リソースの収益化を並行" :
                    "安定基盤を確保"
        }しています。`;

    return `${modeIntro[goalMode]} 収入スタイルは「${styleName}」、生き方は「${lifeName}」を重視する傾向です。${styleDesc[primaryIncomeStyle]}${mixReason}`;
}

function calcFulfilScore(lifeStyleScores: Record<string, number>, primaryLifeStyle: string) {
    const max = Math.max(...Object.values(lifeStyleScores)) || 1;
    const primary = lifeStyleScores[primaryLifeStyle] || 0;
    const base = Math.round((primary / max) * 70) + 30;
    return Math.min(100, base);
}

function calcResult(answers: any, target: number, goalMode: string) {
    const incomeStyleScores = calcScores(answers, INCOME_SCORE_TABLE, ["q2", "q3", "q4"]);
    const lifeStyleScores = calcScores(answers, LIFE_SCORE_TABLE, ["q2", "q6", "q7"]);
    const { primary: primaryIncomeStyle, secondary: secondaryIncomeStyle } = topTwo(incomeStyleScores);
    const { primary: primaryLifeStyle } = topTwo(lifeStyleScores);
    const constraintProfile = buildConstraintProfile(answers);

    const revenueMix = buildRevenueMix(goalMode, primaryLifeStyle, constraintProfile, primaryIncomeStyle, secondaryIncomeStyle, target);
    const incomePlan = buildIncomePlan(revenueMix, goalMode, target);
    const explanation = generateExplanation(goalMode, primaryIncomeStyle, primaryLifeStyle, revenueMix, target);
    const fulfilScore = calcFulfilScore(lifeStyleScores, primaryLifeStyle);

    const rawDays = revenueMix.reduce((sum, item) => sum + ((CATEGORY_DAYS as any)[item.category] || 30) * (item.ratio / 100), 0);
    const timeFactor = constraintProfile.freeTime <= -2 ? 1.2 : constraintProfile.freeTime >= 3 ? 0.9 : 1.0;
    const firstIncomeDaysEstimate = Math.round(rawDays * timeFactor);
    const timelineLabel = (TIMELINE_LABELS as any)[goalMode] || "目安期間";

    const actions = (ACTION_TABLE as any)[primaryIncomeStyle] || ACTION_TABLE.skill_labour;
    const firstAction = actions.firstAction;
    const supportActions = actions.support;
    const avoidPattern = actions.avoid;

    const actionStyle = answers.q4 || null;
    const learningHint = actionStyle === "learn_first" ? ((LEARNING_HINTS as any)[primaryIncomeStyle] || null) : null;

    return {
        incomeStyleScores,
        lifeStyleScores,
        primaryIncomeStyle,
        secondaryIncomeStyle,
        primaryLifeStyle,
        revenueMix,
        incomePlan,
        explanation,
        fulfilScore,
        firstIncomeDaysEstimate,
        timelineLabel,
        firstAction,
        supportActions,
        avoidPattern,
        learningHint,
        actionStyle,
        constraintProfile,
        goalMode,
        target,
    };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Vercel Serverless Function Handler -> Next.js Route Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function POST(req: Request) {
    try {
        const { answers, target, goalMode } = await req.json();

        if (!answers || target === undefined || !goalMode) {
            return NextResponse.json({ error: 'Bad Request: Missing parameters' }, { status: 400 });
        }

        const result = calcResult(answers, target, goalMode);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Calculation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
