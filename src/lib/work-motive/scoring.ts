import {
  AxisScores,
  Contradiction,
  MainType,
  SubTraitKey,
  WorkMotiveAnswers,
  WorkMotiveResultCore,
} from '@/lib/work-motive/types';

const SCORE_MAP: Record<string, Record<string, Partial<AxisScores>>> = {
  Q1: { A: { S: 3 }, B: { M: 2 }, C: { S: 1, F: 1 }, D: { F: 1, S: -1 } },
  Q2: { A: { S: 3 }, B: { F: 1, M: 1 }, C: { M: 2 }, D: { M: 3, F: 1 } },
  Q3: { A: { A: 3, P: 1 }, B: { A: 3 }, C: { R: 2, A: 1 }, D: { M: 2 }, E: { A: -1, M: 1 } },
  Q4: { A: { F: -2, R: 1 }, B: { F: 0 }, C: { F: 2 }, D: { F: 3 }, E: { F: 2, T: 1 } },
  Q5: { A: { R: 3 }, B: { R: 1, A: 1 }, C: { R: 1 }, D: { F: 1, R: -1 }, E: { R: 2, F: 1 } },
  Q6: { A: { T: 2 }, B: { F: 1 }, C: { M: 1 }, D: { M: 2, T: 1 }, E: { T: 3 } },
  Q7: { A: { S: 3 }, B: { S: 2 }, C: { S: 0 }, D: { S: 0 } },
  Q8: { A: { A: 3, P: 1 }, B: { A: 1 }, C: { A: -1 }, D: {} },
  Q9: { A: { M: 3 }, B: { S: 3 }, C: { M: 1, S: 1 }, D: { M: -1 } },
  Q10: { A: { F: 3 }, B: { S: 2 }, C: {}, D: { R: 1 } },
  Q12: { A: { T: 3 }, B: { T: 2 }, C: { T: 1 }, D: { F: 1, T: -1 }, E: { T: 3 } },
  Q13: { A: { S: 2 }, B: { T: 2 }, C: { R: 2 }, D: { S: 1 }, E: { T: 3 } },
  Q14: { A: { M: 3 }, B: { A: 3 }, C: {}, D: { M: 1, A: 1 } },
  Q15: { A: { F: 3 }, B: { F: 2 }, C: { S: 2 }, D: { R: 2 }, E: { F: 3, M: 1 } },
  Q16: { A: { M: 3 }, B: { M: 1, A: 1 }, C: { A: 3 }, D: { A: 2, M: -1 }, E: { F: 2 } },
  Q17: { A: { A: 3, P: 1 }, B: { S: 1 }, C: { A: 1, S: 1 }, D: { A: -1 } },
  Q18: { A: { M: 2 }, B: { F: 1, M: 1 }, C: { R: 1, F: 1 }, D: { F: 2 }, E: { T: 3 } },
  Q19: { A: { M: 2, A: 1 }, B: { S: 3 }, C: { M: 1, S: 1 }, D: { A: -1, M: -1 } },
  Q20: { A: { S: 3, T: 1 }, B: { M: 3, F: 2 }, C: { F: 1, S: 1 }, D: { M: 2, A: -1 }, E: { T: 3, M: -1 } },
  Q21: { A: { A: 3 }, B: { M: 3 }, C: { A: 1, M: 1 }, D: {} },
  Q22: { A: { P: 2 }, B: { M: 1, F: 1 }, C: { R: 1, M: 1 } },
  Q23: { A: { P: 2 }, B: {}, C: { P: -1 }, D: { P: 1 } },
};

function createEmptyScores(): AxisScores {
  return { S: 0, A: 0, M: 0, F: 0, R: 0, T: 0, P: 0 };
}

function getContradictions(answers: WorkMotiveAnswers): Contradiction[] {
  const get = (id: string) => answers[id];
  const q11 = typeof answers.Q11 === 'number' ? answers.Q11 : null;
  const contradictions: Contradiction[] = [];

  if (get('Q14') === 'A' && (get('Q16') === 'C' || get('Q16') === 'D')) {
    contradictions.push({
      title: '意味重視の自己認識が揺らいでいる',
      severity: 3,
      message: '価値ある仕事を選ぶ傾向がある一方で、承認や反応が完全に失われると継続が難しくなる傾向があります。',
    });
  }
  if (get('Q14') === 'A' && get('Q21') === 'A') {
    contradictions.push({
      title: '意味と承認の優先順位が逆転している',
      severity: 3,
      message: '選択場面では意味を重視していますが、痛みとしては「評価されないこと」の方が強く効いています。',
    });
  }
  if (get('Q10') === 'A' && get('Q15') === 'C') {
    contradictions.push({
      title: '自由志向だが、実際のリスク耐性は低め',
      severity: 3,
      message: '自由には価値を感じていますが、収入不安定という現実コストを払う局面では慎重さが勝ちやすいです。',
    });
  }
  if (get('Q1') === 'B' && (get('Q7') === 'A' || get('Q7') === 'B')) {
    contradictions.push({
      title: '内容重視の認識に対して、実態は収入影響が大きい',
      severity: 2,
      message: '仕事内容を大事にしている一方で、実際にはお金のための我慢がかなり行動に影響しています。',
    });
  }
  if (get('Q20') === 'A' && (get('Q6') === 'D' || get('Q6') === 'E' || get('Q12') === 'A' || get('Q12') === 'E')) {
    contradictions.push({
      title: '仕事を離れたいが、時間構造への依存も強い',
      severity: 3,
      message: '働かなくてもよい状況を望む一方で、仕事がない空白には不安や落ち着かなさが出やすいです。',
    });
  }
  if ((get('Q16') === 'A' || get('Q16') === 'E') && (get('Q3') === 'A' || get('Q3') === 'B' || get('Q8') === 'A')) {
    contradictions.push({
      title: '承認の影響を過小評価している',
      severity: 2,
      message: '他者評価が不要だと認識していても、実際の行動は成果の可視化や評価確認に向かいやすいです。',
    });
  }
  if ((get('Q5') === 'A' || get('Q5') === 'B') && q11 === 0) {
    contradictions.push({
      title: 'つながりの中心が「人」より「役割」に寄っている',
      severity: 2,
      message: '対人協力には応じやすい一方で、その関係は仕事の文脈が消えると続きにくい可能性があります。',
    });
  }
  if (get('Q9') === 'A' && get('Q19') === 'D') {
    contradictions.push({
      title: '社会的な意味と個人的な使命感が分離している',
      severity: 1,
      message: '社会に必要かどうかは重視していても、「自分にしかできない」という感覚にはあまり価値を感じていません。',
    });
  }
  if ((get('Q13') === 'B' || get('Q13') === 'E') && get('Q18') === 'E') {
    contradictions.push({
      title: '惰性継続パターンが強い',
      severity: 2,
      message: '不満や変化の必要性があっても、面倒さや慣性によって現状維持に流れやすい傾向があります。',
    });
  }
  if (get('Q17') === 'A' && (get('Q8') === 'C' || get('Q8') === 'D')) {
    contradictions.push({
      title: '承認欲求が外向きではなく制度内に向いている',
      severity: 1,
      message: '肩書きや役職には価値を感じる一方で、対外的に仕事を見せたい欲求はそこまで強くありません。',
    });
  }
  if (get('Q22') === 'A' && get('Q14') === 'A') {
    contradictions.push({
      title: '「意味」で選ぶと答えながら、会社名では有名どころを選んでいる',
      severity: 2,
      message: '意味を大事にしている自己像と、実際には社会的評価の高い場所を選ぶ行動の間にズレがあります。',
    });
  }
  if (get('Q23') === 'A' && (get('Q16') === 'A' || get('Q16') === 'E')) {
    contradictions.push({
      title: 'ステータスへの関心と、承認不要の自己認識が食い違っている',
      severity: 2,
      message: '会社名を誇らしく感じる一方で、評価ゼロ環境でも働けると答えており、自己像と本音の温度差が出ています。',
    });
  }
  if (get('Q22') === 'C' && get('Q23') === 'A') {
    contradictions.push({
      title: '会社名で選ばないと言いつつ、聞かれると誇らしい',
      severity: 1,
      message: '選択では会社名を基準にしないと答えていますが、実際に聞かれると誇らしさが出ています。無意識にステータスを楽しんでいる可能性があります。',
    });
  }

  return contradictions;
}

export function calculateWorkMotiveResult(answers: WorkMotiveAnswers): WorkMotiveResultCore {
  const scores = createEmptyScores();

  Object.entries(SCORE_MAP).forEach(([questionId, choiceScores]) => {
    const answer = answers[questionId];
    if (!answer || typeof answer === 'number') return;
    const diff = choiceScores[answer];
    if (!diff) return;
    Object.entries(diff).forEach(([axis, value]) => {
      scores[axis as keyof AxisScores] += value ?? 0;
    });
  });

  if (typeof answers.Q11 === 'number') {
    const relationBonus = answers.Q11 <= 0 ? -1 : answers.Q11 <= 2 ? 1 : answers.Q11 <= 5 ? 2 : 3;
    scores.R += relationBonus;
  }

  (Object.keys(scores) as (keyof AxisScores)[]).forEach((key) => {
    scores[key] = Math.max(0, scores[key]);
  });

  const contradictions = getContradictions(answers);
  const contradictionScore = contradictions.reduce((sum, item) => sum + item.severity, 0);
  const sorted = Object.entries(scores as Record<keyof AxisScores, number>).sort((a, b) => b[1] - a[1]) as Array<
    [keyof AxisScores, number]
  >;
  const coreAxes: Array<[keyof AxisScores, number]> = [
    ['S', scores.S] as [keyof AxisScores, number],
    ['A', scores.A] as [keyof AxisScores, number],
    ['M', scores.M] as [keyof AxisScores, number],
    ['F', scores.F] as [keyof AxisScores, number],
  ].sort((a, b) => b[1] - a[1]);

  let mainType: MainType = 'mixed';
  if (coreAxes[0][1] > 0 && coreAxes[0][1] - coreAxes[1][1] > 1) {
    if (coreAxes[0][0] === 'S') mainType = 'survival_driven';
    if (coreAxes[0][0] === 'A') mainType = 'approval_driven';
    if (coreAxes[0][0] === 'M') mainType = 'meaning_driven';
    if (coreAxes[0][0] === 'F') mainType = 'freedom_driven';
  }

  const subTraits: SubTraitKey[] = [];
  if (scores.R >= 5) subTraits.push('relationship_oriented');
  if (scores.T >= 6) subTraits.push('time_structure_dependent');
  if ((answers.Q13 === 'B' || answers.Q13 === 'E') && answers.Q18 === 'E') subTraits.push('inertia_prone');
  if (scores.P >= 4) subTraits.push('prestige_oriented');
  if (contradictionScore <= 2 && mainType !== 'mixed') subTraits.push('low_contradiction');
  if (contradictionScore >= 6) subTraits.push('high_contradiction');

  return {
    scores,
    contradictionScore,
    contradictions,
    mainType,
    subTraits,
    summary: {
      dominantAxis: sorted[0]?.[0] ?? 'S',
      secondAxis: sorted[1]?.[0] ?? null,
      consistencyLevel: mainType === 'mixed'
        ? contradictionScore <= 5
          ? 'medium'
          : 'low'
        : contradictionScore <= 2
          ? 'high'
          : contradictionScore <= 5
            ? 'medium'
            : 'low',
    },
  };
}
