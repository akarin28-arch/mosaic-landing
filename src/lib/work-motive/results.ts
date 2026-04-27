import {
  AXIS_LABELS,
  AxisKey,
  CONSISTENCY_LABELS,
  MainType,
  RESULT_CATCH_COPY,
  RESULT_TYPE_LABELS,
  SUB_TRAIT_LABELS,
} from '@/lib/work-motive/types';
import { WorkMotiveAnswers, WorkMotiveResult, WorkMotiveResultCore } from '@/lib/work-motive/types';

const SIGNAL_LABELS = {
  money: 'お金',
  approval: '承認',
  meaning: '意味',
  freedom: '自由',
  relation: '関係性',
  time: '時間への依存',
  inertia: '惰性',
  prestige: 'ステータス',
} as const;

function buildNarrative(key: keyof typeof SIGNAL_LABELS, evidence: string[]) {
  if (evidence.length === 0) return null;
  const quoted = evidence.slice(0, 3).map((item) => `『${item}』`).join('、');
  const templates: Record<keyof typeof SIGNAL_LABELS, string> = {
    money: `お金の話になると、回答のトーンがはっきり変わる癖が出ていました。${quoted}といった回答が並んでおり、やりがいや意味の話の奥で、財布が判断を支えている構造が見えます。`,
    approval: `他者からの反応が、自覚している以上に動力になっています。${quoted}という回答の組み合わせは、承認を気にしていないつもりでも、反応がゼロになる環境を避けている姿を映しています。`,
    meaning: `「なぜやるか」が腹落ちしているかどうかを、判断の物差しに置いている癖が見えました。${quoted}といった回答が揃っており、条件より意味を優先する姿勢が複数の場面で一貫しています。`,
    freedom: `裁量を奪われることへの過敏さが、いくつもの回答に顔を出していました。${quoted}という反応の仕方からは、仕事内容そのものより「自分で決められるか」が効いている様子が見えます。`,
    relation: `「誰と働くか」「気まずくならないか」の感覚が、判断に織り込まれていました。${quoted}といった回答からは、業務とは別のレイヤーで人間関係が判断を動かしているのが分かります。`,
    time: `止まることへの弱さが、複数の回答に残っていました。${quoted}が並ぶのは、仕事が「やること」というより、時間の枠を保つ装置として機能しているサインです。`,
    inertia: `動けない理由が、不満の深さより「動くコスト」の側に寄っていました。${quoted}という回答の連なりは、辞める力より続ける慣性の方が強くなっている状態を示しています。`,
    prestige: `「どう見られるか」より一歩踏み込んだ「どこに所属しているか」への感度が、はっきり出ていました。${quoted}という回答は、自分で認めるより強く、社会的な位置づけを気にしていることを示しています。承認欲求とは別の、ブランド志向に近い動機が動いています。`,
  };
  return templates[key];
}

function getChips(result: WorkMotiveResultCore) {
  const chips: string[] = [
    RESULT_TYPE_LABELS[result.mainType],
    AXIS_LABELS[result.summary.dominantAxis],
  ];
  if (result.summary.secondAxis) {
    chips.push(`副軸:${AXIS_LABELS[result.summary.secondAxis]}`);
  }
  chips.push(CONSISTENCY_LABELS[result.summary.consistencyLevel]);
  if (result.subTraits.includes('prestige_oriented')) {
    chips.push(SUB_TRAIT_LABELS.prestige_oriented);
  }
  return chips.filter((value, index, arr) => arr.indexOf(value) === index);
}

function getSummaryText(result: WorkMotiveResultCore) {
  const sub = result.summary.secondAxis ? AXIS_LABELS[result.summary.secondAxis] : null;
  const scores = result.scores;
  const summaryMap: Record<MainType, string> = {
    survival_driven: 'あなたの意思決定の中心には、常に「生活を守れるか」があります。やりがいや理想が頭にないわけではありませんが、最終的な判断は収入と安定に引き寄せられます。',
    approval_driven: 'あなたの行動を動かしているのは、自分の納得よりも「他者からどう見られているか」です。評価が得られる環境では高いパフォーマンスを出しますが、反応が返ってこない環境では急激にモチベーションを失いやすい構造です。',
    meaning_driven: 'あなたは「この仕事に意味があるか」を基準に動いています。条件が多少悪くても、納得さえできれば続けられる強さがあります。一方で、意味を感じられなくなった瞬間に一気にエネルギーが切れるリスクもあります。',
    freedom_driven: 'あなたにとって最も重要なのは「自分で決められるかどうか」です。仕事の内容そのものより、裁量と選択権のほうが行動を左右します。指示されること自体がストレス源になりやすいタイプです。',
    mixed: 'あなたの動機は一つに収束していません。複数の要素が拮抗しており、状況によって判断軸がブレやすい状態です。これは悪いことではありませんが、整理されていないまま選択を迫られると後悔しやすいです。',
  };
  let base = summaryMap[result.mainType];

  if (sub && result.mainType !== 'mixed') {
    if (result.summary.secondAxis === 'T') {
      base += '\nまた、仕事が生活のリズムを支えている傾向があり、動機とは別に「仕事がないと落ち着かない」という構造が同居しています。';
    } else if (result.summary.secondAxis === 'P') {
      base += '\nさらに、会社名や肩書きといった社会的ポジションへの感度も高く、選択の裏側でブランド志向が効いています。';
    } else {
      base += `\nただし「${sub}」も無視できない強さで出ており、単純なタイプ分類では捉えきれない複雑さがあります。`;
    }
  }

  if (result.summary.dominantAxis === 'T') {
    base += '\n※ 「時間依存」が最も強く出ていますが、これは本音の動機というより、仕事が生活構造の一部に組み込まれている傾向です。「なぜ働くか」の答えは、その下に隠れている別の軸に宿っています。';
  }

  if (result.subTraits.includes('prestige_oriented')) {
    if (scores.A >= 5 && scores.P >= 4) {
      base += '\n承認欲求に加えて、所属や肩書きへの感度も高いタイプです。「認められたい」と「良い場所にいたい」の両方が動機として動いています。';
    } else if (scores.A < 3 && scores.P >= 4) {
      base += '\n他者からのフィードバックへの関心は低いのに、会社名や肩書きへの感度は高い——承認ではなくブランド志向に近い動機が効いています。';
    }
  }

  return base;
}

function getPersonalityText(result: WorkMotiveResultCore) {
  const personalityMap: Record<MainType, string[]> = {
    survival_driven: [
      'このタイプの人は、現実認識が正確で、損益計算に強いです。',
      '「やりたいこと」より「やらなきゃいけないこと」を先に片付ける傾向があります。',
      '「好きなことを仕事にしたい」と語る人を、どこか冷めた目で見ることがあります。',
    ],
    approval_driven: [
      'このタイプの人は、場の空気を読むのが得意で、評価される行動を無意識に選んでいます。',
      '成果が出ても、誰かに認知されないと「やった実感」が湧きにくいです。',
      '「別に評価なんて気にしてない」と自分では思っていても、反応がゼロになると途端に不安になります。',
    ],
    meaning_driven: [
      'このタイプの人は、「なぜやるのか」が腹落ちしないと動けません。',
      '作業効率より「意義の有無」を優先するため、周囲からは非効率に見えることがあります。',
      '意味を感じる仕事には異常な集中力を発揮しますが、意味を失うとテコでも動きません。',
    ],
    freedom_driven: [
      'このタイプの人は、管理や報告義務が極端にストレスになります。',
      '「自分で選んだ」という感覚がないと、どんなに良い条件でも不満が出ます。',
      '裁量がある環境では驚くほどの成果を出しますが、拘束されると最低限しかやりません。',
    ],
    mixed: [
      'このタイプの人は、判断基準が状況によって変わるため、周囲から「気分屋」に見られることがあります。',
      '複数の動機を持っているため、どの選択肢にもメリットとデメリットが見えてしまい、動けなくなりがちです。',
      '「何がしたいの？」と聞かれたときに即答できない自分に、ストレスを感じやすいです。',
    ],
  };
  const base = personalityMap[result.mainType];

  const addons: string[] = [];
  const subAxis = result.summary.secondAxis;
  if (result.mainType !== 'mixed' && subAxis) {
    const axisAddonMap: Partial<Record<AxisKey, string>> = {
      S: '一方で、金銭的な安定感も判断の奥で効いており、冒険的な選択は避ける傾向があります。',
      A: '同時に、他者からの評価にも意外と反応しており、反応が返ってくる場では動きが良くなります。',
      M: 'ただし「意味がある」と感じられると、条件を多少譲ってでも引き受ける柔軟さも持っています。',
      F: '加えて、裁量を奪われる場面では明らかにパフォーマンスが落ちる傾向があります。',
      R: 'さらに、人間関係の質が動機の土台になっており、「誰と」が行動に強く影響します。',
      T: 'また、仕事が生活のリズムと一体化しており、完全に手を離すことへの抵抗が出やすいです。',
      P: '加えて、社会的なポジションや会社のブランドが、自分でも思っている以上に判断に効いています。',
    };
    const axisAddon = axisAddonMap[subAxis];
    if (axisAddon) addons.push(axisAddon);
  }

  if (result.subTraits.includes('relationship_oriented')) addons.push('人との関係が、満足度の最後の一押しになっていることが多いです。');
  if (result.subTraits.includes('time_structure_dependent')) addons.push('予定のない時間を苦手としており、「何かしている状態」に安心を感じやすいです。');
  if (result.subTraits.includes('inertia_prone')) addons.push('動きたい気持ちより、動くコストの方を重く感じやすく、現状維持に流れる癖があります。');
  if (result.subTraits.includes('high_contradiction')) addons.push('自分が語る動機と、実際に行動を変えているトリガーは、意外とズレていることが多いです。');
  if (result.subTraits.includes('prestige_oriented')) addons.push('評価そのものより「どこに所属しているか」への感度が高く、ブランド・肩書きが動機の一部を占めています。');

  return [...base, ...addons.slice(0, 2)].join('\n');
}

function getFeatureText(result: WorkMotiveResultCore, answers: WorkMotiveAnswers) {
  const sig = { money: 0, approval: 0, meaning: 0, freedom: 0, relation: 0, time: 0, inertia: 0, prestige: 0 };
  const ev = { money: [] as string[], approval: [] as string[], meaning: [] as string[], freedom: [] as string[], relation: [] as string[], time: [] as string[], inertia: [] as string[], prestige: [] as string[] };

  if (answers.Q1 === 'A') { sig.money++; ev.money.push('年収1.5倍なら向き不向きより金額'); }
  if (answers.Q7 === 'A') { sig.money++; ev.money.push('お金のために明確に我慢した'); }
  if (answers.Q7 === 'B') { sig.money += 0.5; ev.money.push('漠然とお金のために我慢がある'); }
  if (answers.Q9 === 'B') { sig.money++; ev.money.push('30%減では成り立たない'); }
  if (answers.Q10 === 'B') { sig.money++; ev.money.push('20%減は響きすぎる'); }
  if (answers.Q13 === 'A') { sig.money++; ev.money.push('収入を下げたくないから辞められない'); }
  if (answers.Q15 === 'C') { sig.money++; ev.money.push('独立のリスクが大きすぎる'); }
  if (answers.Q19 === 'B') { sig.money++; ev.money.push('半分では生きていけない'); }

  if (answers.Q3 === 'A') { sig.approval++; ev.approval.push('成功後すぐSNSで発信'); }
  if (answers.Q3 === 'B') { sig.approval++; ev.approval.push('成功後は評価・昇進を確認'); }
  if (answers.Q8 === 'A') { sig.approval++; ev.approval.push('肩書きをSNSに具体的に書いた'); }
  if (answers.Q14 === 'B') { sig.approval++; ev.approval.push('評価・感謝が動力'); }
  if (answers.Q16 === 'C') { sig.approval++; ev.approval.push('届かない仕事は3ヶ月で辞める'); }
  if (answers.Q16 === 'D') { sig.approval += 0.5; ev.approval.push('評価ゼロは仕事として成立しない'); }
  if (answers.Q17 === 'A') { sig.approval++; ev.approval.push('昇進は肩書きに価値'); }
  if (answers.Q21 === 'A') { sig.approval++; ev.approval.push('評価されない方がつらい'); }

  if (answers.Q1 === 'B') { sig.meaning += 0.5; ev.meaning.push('仕事内容が大事'); }
  if (answers.Q2 === 'C') { sig.meaning++; ev.meaning.push('お金の問題ではない'); }
  if (answers.Q2 === 'D') { sig.meaning++; ev.meaning.push('やりたい仕事に切り替える'); }
  if (answers.Q9 === 'A') { sig.meaning++; ev.meaning.push('30%減でも意味のある仕事'); }
  if (answers.Q14 === 'A') { sig.meaning++; ev.meaning.push('誰にも評価されなくても価値'); }
  if (answers.Q16 === 'A') { sig.meaning++; ev.meaning.push('届かなくても仕事の内容が好き'); }
  if (answers.Q18 === 'A') { sig.meaning++; ev.meaning.push('不可欠な部分を深める'); }
  if (answers.Q19 === 'A') { sig.meaning++; ev.meaning.push('半分でも唯一性のある仕事'); }
  if (answers.Q20 === 'B') { sig.meaning++; ev.meaning.push('1000万あってもやりたい仕事に'); }
  if (answers.Q21 === 'B') { sig.meaning++; ev.meaning.push('納得できない方がつらい'); }

  if (answers.Q4 === 'C') { sig.freedom++; ev.freedom.push('角度を変えて説得を繰り返す'); }
  if (answers.Q4 === 'D') { sig.freedom++; ev.freedom.push('表向き従い実質自分のやり方'); }
  if (answers.Q10 === 'A') { sig.freedom++; ev.freedom.push('20%減でも完全リモート'); }
  if (answers.Q15 === 'A') { sig.freedom++; ev.freedom.push('独立に今すぐ動ける'); }
  if (answers.Q15 === 'E') { sig.freedom++; ev.freedom.push('すでに独立・検討済み'); }
  if (answers.Q16 === 'E') { sig.freedom++; ev.freedom.push('誰もいない方が集中できる'); }
  if (answers.Q18 === 'D') { sig.freedom++; ev.freedom.push('AIが来たら独立準備'); }

  if (answers.Q4 === 'A') { sig.relation++; ev.relation.push('関係を壊したくないから従う'); }
  if (answers.Q5 === 'A') { sig.relation++; ev.relation.push('助けたいから担当外でも引き受ける'); }
  if (answers.Q5 === 'B') { sig.relation += 0.5; ev.relation.push('気まずいから引き受ける'); }
  if (answers.Q13 === 'C') { sig.relation++; ev.relation.push('辞めるのが気まずいから'); }
  if (answers.Q15 === 'D') { sig.relation++; ev.relation.push('一人は向いていないから動けない'); }
  if (typeof answers.Q11 === 'number' && answers.Q11 >= 3) { sig.relation++; ev.relation.push(`退職後も${answers.Q11}人と連絡`); }

  if (answers.Q6 === 'D') { sig.time++; ev.time.push('空白時間でも仕事のことを調べる'); }
  if (answers.Q6 === 'E') { sig.time++; ev.time.push('空白で何をすればいいか分からない'); }
  if (answers.Q12 === 'A') { sig.time++; ev.time.push('有給1日目から仕事が気になる'); }
  if (answers.Q12 === 'E') { sig.time++; ev.time.push('1週間休むこと自体に抵抗'); }
  if (answers.Q20 === 'E') { sig.time++; ev.time.push('辞めても戻りたくなる'); }

  if (answers.Q13 === 'B') { sig.inertia++; ev.inertia.push('転職活動が面倒'); }
  if (answers.Q13 === 'E') { sig.inertia++; ev.inertia.push('なんとなくズルズル'); }
  if (answers.Q18 === 'E') { sig.inertia++; ev.inertia.push('AI置き換えでも何もしない'); }
  if (answers.Q4 === 'A') { sig.inertia += 0.5; ev.inertia.push('指示に従ってしまう'); }

  if (answers.Q22 === 'A') { sig.prestige++; ev.prestige.push('同条件なら有名企業を選ぶ'); }
  if (answers.Q23 === 'A') { sig.prestige++; ev.prestige.push('会社名を聞かれると誇らしい'); }
  if (answers.Q23 === 'D') { sig.prestige += 0.5; ev.prestige.push('相手によって会社名の出し方を変える'); }
  if (answers.Q8 === 'A') { sig.prestige += 0.5; ev.prestige.push('肩書きをSNSに具体的に書いた'); }
  if (answers.Q17 === 'A') { sig.prestige += 0.5; ev.prestige.push('無給でも昇進は受ける'); }

  const sorted = Object.entries(sig).sort((a, b) => b[1] - a[1]) as [keyof typeof SIGNAL_LABELS, number][];
  const top = sorted[0];
  const second = sorted[1];
  const sentences: string[] = [];

  if (top && top[1] >= 2) {
    if (top[0] === 'prestige' && second && second[1] >= top[1] - 1 && (second[0] === 'approval' || second[0] === 'meaning')) {
      sentences.push(`「${SIGNAL_LABELS[second[0]]}」の動きが強く出ていますが、それに加えてステータスや所属ブランドへの感度も回答の端々に表れていました。『${ev.prestige.slice(0, 2).join('』『')}』といった回答が、評価や意味とは別の軸で判断を動かしている気配があります。`);
    } else {
      const narrative = buildNarrative(top[0], ev[top[0]]);
      if (narrative) sentences.push(narrative);
    }
  } else if (top && top[1] >= 1) {
    sentences.push('今回の回答は、一つの動機に強く引っ張られているというより、複数の方向にまんべんなく反応している印象でした。軸が定まりきっていない状態は、まだ自分の本音が整理されていないサインでもあります。');
  }

  if (second && second[1] >= 2 && second[0] !== top?.[0]) {
    if ((top?.[1] ?? 0) - second[1] <= 1) {
      sentences.push(`ただ、それと同じくらい「${SIGNAL_LABELS[second[0]]}」の気配も強く、『${ev[second[0]][0]}』のような回答が同居しています。あなたの中では、この2つが静かに引っ張り合っているようです。`);
    } else {
      const narrative = buildNarrative(second[0], ev[second[0]]);
      if (narrative) sentences.push(narrative);
    }
  }

  if (result.contradictionScore >= 5) {
    sentences.push('一方で、選ぶときの物語と、実際に動いているトリガーの間には段差があります。自分でも気づいていない動機が、判断の一部を持っていっている感触がありました。');
  } else if (result.contradictionScore >= 3) {
    sentences.push('全体は整合しているようでいて、細部にズレが残っています。大きな決断ほど、その小さなズレが効いてくる種類のものです。');
  } else if (result.subTraits.includes('inertia_prone') && sentences.length < 3) {
    sentences.push('回答全体から、動きたい気持ちより「動くコスト」の方を重く見積もる雰囲気が漂っていました。');
  } else if (result.contradictionScore <= 1 && top && top[1] >= 3 && sentences.length < 3) {
    sentences.push('全体を通して、自己認識と回答傾向のブレが少なく、自分の動機をかなり正確につかめている様子が伝わってきました。');
  }

  return sentences.length > 0
    ? sentences.join('\n\n')
    : '回答数が少なく、はっきりとした傾向は出ませんでした。もう一度、直感で答えてみてください。';
}

function getConflictText(result: WorkMotiveResultCore) {
  const contradictions = [...result.contradictions].sort((a, b) => b.severity - a.severity);

  if (contradictions.length === 0) {
    if (result.mainType === 'mixed') {
      return '回答同士の論理的な矛盾は検出されませんでした。ただし、動機が複数に分散して整理されていない状態そのものが、ある種の葛藤です。\n「何を大事にしているか」に一貫した答えが出にくいということは、判断のたびに複数の基準が競合しているということです。矛盾がないのではなく、まだ本音の優先順位が定まっていない——というのが、今の回答全体から見える状態です。';
    }
    return '今回の回答では、大きな矛盾は検出されませんでした。\n自分が「なぜ働いているか」の認識と、実際の行動傾向がかなり一致しています。これは珍しいことです。自己認識の精度が高く、自分の動機を正確につかめている状態です。\nただし、これには2つの可能性があります。本当に自分を深く理解しているか、あるいはまだ本音と建前が衝突するような選択を迫られていないか——です。大きな転機（転職・独立・昇進の打診）が来たとき、初めてズレが表面化するケースもあります。';
  }

  const lines: string[] = [];
  if (result.contradictionScore >= 6) {
    lines.push('あなたの自己認識と実際の動機には、はっきりしたズレがあります。「自分はこういう理由で働いている」という物語と、実際に行動を変えているトリガーが一致していません。');
  } else if (result.contradictionScore >= 3) {
    lines.push('表面的には一貫しているように見えますが、いくつかの回答で本音と建前のズレが出ています。自覚していない動機が行動に影響しているサインです。');
  } else {
    lines.push('小さなズレが見られます。致命的ではありませんが、特定の場面で「なぜか判断がブレる」原因になっている可能性があります。');
  }

  contradictions.forEach((item) => {
    lines.push(`■ ${item.title}\n${item.message}`);
  });
  return lines.join('\n\n');
}

function getFitAndTrap(result: WorkMotiveResultCore, answers: WorkMotiveAnswers) {
  const fitBaseMap: Record<MainType, string[]> = {
    survival_driven: [
      '報酬体系が明確で、成果と収入が連動する環境に強いです。条件交渉を厭わないため、成果報酬型や歩合のある仕事で実力が発揮されやすいです。',
      '数字で判断するのが得意なので、KPI・業績評価が可視化されている組織と相性が良いです。',
    ],
    approval_driven: [
      'フィードバックが頻繁に返ってくる環境で力を発揮します。営業成績の可視化、顧客の声が届く仕事、SNSで反応がもらえる領域が向いています。',
      'チームの中で役割が明確で、貢献が目に見える形で認知されるポジションで力が出ます。',
    ],
    meaning_driven: [
      'ミッションが明確な組織・プロジェクトで最も力を発揮します。「なぜこの仕事が必要か」が腹落ちすれば、条件の悪さも乗り越えられます。',
      '自分で課題を定義し、解決策を設計できるポジションが向いています。指示待ちの仕事では本来の力の半分も出ません。',
    ],
    freedom_driven: [
      'リモートワーク、フリーランス、裁量の大きいポジションで最もパフォーマンスが出ます。',
      '管理者が「目標だけ渡して口を出さない」スタイルの組織と相性が良いです。',
    ],
    mixed: [
      '複数の動機を持っているため、変化の多い環境や多角的な役割で力を発揮しやすいです。',
      '一つの正解を押し付けられない環境、選択肢が多い状況に向いています。',
    ],
  };

  const trapBaseMap: Record<MainType, string[]> = {
    survival_driven: [
      '「条件が良いから」だけで選んだ仕事で、5年後に意味の空洞化が起きやすいです。金額の比較だけで転職を重ねると、どこに行っても同じ我慢が続きます。',
      '収入を下げることへの恐怖が強すぎると、現状維持バイアスから抜けられず、本当はやりたいことへの扉がずっと閉じたままになります。',
    ],
    approval_driven: [
      '評価が得られない環境に長くいると、実力とは無関係に自信を喪失します。評価が遅い組織・フィードバックが乏しい職場とは、特に相性が悪いです。',
      '「承認を得るための仕事」を無意識に選び続け、本当にやりたいことが何だったか見えなくなる危険があります。',
    ],
    meaning_driven: [
      '「意味がある仕事」を追い求めすぎて、経済的な持続可能性を軽視しがちです。情熱で始めても、生活が破綻すれば続きません。',
      '意味の正体が実は「承認」だった場合、それに気づかないまま判断を誤るリスクが高いです。',
    ],
    freedom_driven: [
      '自由を求めるあまり、孤立しやすいです。自由と孤独はセットで来ることが多く、そこで耐えられないと逆戻りします。',
      '「自由じゃないから嫌だ」が口癖になると、どの環境にも適応できなくなります。',
    ],
    mixed: [
      '基準が定まっていないため、転職を繰り返しても満足感が得られない「青い鳥症候群」に陥りやすいです。',
      '「自分は何がしたいのか」を考えすぎて動けなくなる、分析麻痺が最大のリスクです。',
    ],
  };
  const fitBase = fitBaseMap[result.mainType];
  const trapBase = trapBaseMap[result.mainType];

  const fitExtra: string[] = [];
  const trapExtra: string[] = [];

  if (answers.Q15 === 'A' || answers.Q15 === 'E') fitExtra.push('すでに独立を選び取れる・選んでいる状態なので、フリーランスや自営業の適性が高いです。組織内で消耗するより、自分で器を作る側に回った方が本来の力が出ます。');
  if (answers.Q10 === 'A') fitExtra.push('収入より自由度を取れるタイプなので、フルリモート・場所非依存の働き方で力が発揮されやすいです。');
  if (answers.Q18 === 'A') fitExtra.push('専門性を深める動きが強いので、スペシャリストとして替えの効かない領域を持つ方向が合っています。広く浅くより、狭く深くです。');
  if (answers.Q18 === 'B' || answers.Q18 === 'D') fitExtra.push('環境変化への適応が早いタイプです。固定されたルールの中で淡々とより、新しいスキルを継続的に取り込める変化の多い環境が向いています。');
  if (typeof answers.Q11 === 'number' && answers.Q11 >= 5) fitExtra.push('職場の関係が役割を越えて続くタイプなので、チーム密度の高い小〜中規模組織や、顧客と長期関係を築く仕事で持ち味が出ます。');
  if (answers.Q5 === 'A' && (answers.Q13 === 'C' || (typeof answers.Q11 === 'number' && answers.Q11 >= 3))) fitExtra.push('協力や助け合いが自然に出るタイプなので、個人プレー型より、チームで成果を作る仕事の方が満足度が高くなります。');
  if (answers.Q14 === 'A' && answers.Q16 === 'A') fitExtra.push('誰にも見られなくても続けられる強さがあるので、研究職・職人仕事・執筆など、短期の反応に依存しない領域が向いています。');
  if (answers.Q4 === 'C' && answers.Q18 !== 'E') fitExtra.push('譲らずに交渉できる粘り強さがあるので、裁量のあるリーダー職やプロジェクト推進役が合っています。');

  if (answers.Q1 === 'A' && (answers.Q7 === 'A' || answers.Q7 === 'B')) trapExtra.push('年収だけで転職先を決めると、次の職場でも同じ「お金のための我慢」を繰り返す確率がかなり高いです。条件だけで選ぶと、3〜5年後に今とそっくりな不満を抱えることになります。');
  if (answers.Q13 === 'B' || answers.Q13 === 'E') trapExtra.push('「面倒」「なんとなく」で続けている状態は、時間が経つほど抜けにくくなります。動く気力があるうちに小さな一歩を踏み出さないと、数年単位で固定化します。');
  if (answers.Q14 === 'A' && (answers.Q16 === 'C' || answers.Q21 === 'A')) trapExtra.push('「意味で選ぶ」と答えながら、反応ゼロ環境では続かない矛盾があります。自分の使命だと思い込んでいる仕事が、実は承認で成立していた——という構図に気づけなくなる危険があります。');
  if (answers.Q10 === 'A' && answers.Q15 === 'C') trapExtra.push('自由は欲しいが、リスクは取れない——この組み合わせは、一番動けないパターンです。理想を口にしながら、現職に留まる理由を集め続ける時間が長くなります。');
  if (answers.Q17 === 'A' && (answers.Q8 === 'C' || answers.Q8 === 'D')) trapExtra.push('外向きの発信は控えめなのに、組織内の肩書きには敏感——この承認の向き先は、環境が変わると途端に機能しません。転職・独立の場面で、拠り所を一気に失うリスクがあります。');
  if (answers.Q20 === 'A' && (answers.Q12 === 'A' || answers.Q12 === 'E' || answers.Q6 === 'D' || answers.Q6 === 'E')) trapExtra.push('「辞められるなら辞めたい」と答えながら、実は休みが続くと不安になるタイプです。実際に辞めたとき、思っていたような解放感は得られず、別の形で仕事に戻ることになりやすいです。');
  if (typeof answers.Q11 === 'number' && answers.Q11 === 0 && (answers.Q5 === 'A' || answers.Q5 === 'B')) trapExtra.push('職場では協力的でも、職場を離れると人間関係がほぼ残らないタイプです。退職・転職・定年の節目で、想像以上の喪失感に襲われる可能性があります。');
  if (answers.Q13 === 'D') trapExtra.push('「次が見つかる自信がない」は、放っておくほど実体化します。スキル不安は行動でしか解消されないのに、不安だから動けないループに入っている状態です。');
  if (answers.Q9 === 'A' && answers.Q19 === 'D') trapExtra.push('「社会的に必要」には惹かれるが「自分にしかできない」には関心が薄い——この組み合わせだと、誰でもできる仕事に使命感を乗せてしまい、後から虚しさが残りやすいです。');

  if (result.subTraits.includes('time_structure_dependent')) trapExtra.push('仕事を減らす前に空白時間の使い方を決めておかないと、「辞めた後に崩れる」パターンに入りやすいです。');
  if (result.subTraits.includes('inertia_prone')) trapExtra.push('大きな決断で動こうとすると、重さに負けて止まります。小さな行動の単位に分解してからでないと、前進しません。');
  if (result.subTraits.includes('relationship_oriented')) fitExtra.push('「誰と働くか」を軸に環境を選べると、業務内容の満足度も一緒に上がります。業界より人で選ぶ発想が合っています。');

  if (result.mainType !== 'mixed' && result.summary.secondAxis) {
    const axisMap: Partial<Record<AxisKey, { fit?: string; trap?: string }>> = {
      S: { trap: '副軸に「生存」が効いているため、理想を追う場面で金銭不安がブレーキになる瞬間があります。踏み切れない時は、たいていここが引っかかっています。' },
      A: { fit: '副軸に「承認」があり、評価される手応えが加わると、主軸だけで動く時より明らかに力が出ます。' },
      M: { fit: '副軸に「意味」が効いており、納得感さえあれば条件の多少の悪さは乗り越えられます。' },
      F: { fit: '副軸に「自由」があり、裁量が保たれている限り高いパフォーマンスを維持できます。逆に裁量を奪われた瞬間にエネルギーが切れます。' },
      R: { fit: '副軸に「関係性」があるため、信頼できる仲間と組めると本来以上の成果が出ます。孤立した環境では逆に伸びません。' },
      T: { trap: '副軸に「時間依存」があり、手を離すほど不安になる構造が主軸と併走しています。これが主軸の望みを無言で打ち消している可能性があります。' },
      P: { trap: '副軸に「ステータス」があり、会社名や肩書きが条件判断に無意識に入り込みやすいです。本当に内容で選んでいるつもりでも、ブランドが選択を歪めている場面が出てきます。' },
    };
    const axisMeta = axisMap[result.summary.secondAxis];
    if (axisMeta?.fit) fitExtra.push(axisMeta.fit);
    if (axisMeta?.trap) trapExtra.push(axisMeta.trap);
  }

  if (result.contradictionScore >= 6) trapExtra.push('自己認識と行動のズレが大きいため、「自分はこう考えている」を基準に選ぶと、実際の自分の反応と食い違って消耗します。選ぶ前に、過去の行動パターンを棚卸した方が精度が上がります。');
  if (result.subTraits.includes('high_contradiction') && result.contradictionScore < 6) trapExtra.push('建前と本音が少しズレているため、自己分析だけで意思決定すると、後から「思っていた理由と違った」となりやすいです。');
  if (result.subTraits.includes('low_contradiction')) fitExtra.push('自己認識の精度が高いタイプなので、自分の判断基準を信じて動いて大丈夫です。他人の意見に流される必要はありません。');
  if (result.subTraits.includes('prestige_oriented')) {
    fitExtra.push('ブランド力のある環境・肩書きのある役職に置かれると、実力以上のパフォーマンスを発揮できるタイプです。会社の看板を「借りる」形の働き方が合います。');
    trapExtra.push('肩書きや会社の知名度が、自分の実力と一体化して見えている可能性があります。看板を外した時に「自分には何が残るか」を見誤ると、独立や転職で想定外の喪失感に襲われます。');
  }

  return {
    fit: [fitBase[0], ...fitExtra, ...fitBase.slice(1)].slice(0, 4),
    trap: [trapBase[0], ...trapExtra, ...trapBase.slice(1)].slice(0, 4),
  };
}

export function buildWorkMotiveResult(result: WorkMotiveResultCore, answers: WorkMotiveAnswers): WorkMotiveResult {
  const fitAndTrap = getFitAndTrap(result, answers);
  return {
    ...result,
    chips: getChips(result),
    summaryText: getSummaryText(result),
    personalityText: getPersonalityText(result),
    featureText: getFeatureText(result, answers),
    conflictText: getConflictText(result),
    fit: fitAndTrap.fit,
    trap: fitAndTrap.trap,
    title: RESULT_TYPE_LABELS[result.mainType],
    catchCopy: RESULT_CATCH_COPY[result.mainType],
  };
}
