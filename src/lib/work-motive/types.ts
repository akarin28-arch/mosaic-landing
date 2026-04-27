export const AXIS_LABELS = {
  S: '生存（収入）',
  A: '承認',
  M: '意味',
  F: '自由',
  R: '関係性',
  T: '時間依存',
  P: 'ステータス',
} as const;

export const SUB_TRAIT_LABELS = {
  relationship_oriented: '関係性重視',
  time_structure_dependent: '時間構造依存',
  inertia_prone: '惰性継続傾向',
  low_contradiction: '自己認識一貫',
  high_contradiction: '自己認識ズレ大',
  prestige_oriented: 'ステータス志向',
} as const;

export const CONSISTENCY_LABELS = {
  high: '一貫性高め',
  medium: 'ややズレあり',
  low: 'ズレ大きめ',
} as const;

export const RESULT_TYPE_LABELS = {
  survival_driven: '現実優先型',
  approval_driven: '評価依存型',
  meaning_driven: '意味追求型',
  freedom_driven: '自由最優先型',
  mixed: '未整理バランス型',
} as const;

export const RESULT_CATCH_COPY = {
  survival_driven: '理想より先に、現実を取りにいくタイプです。',
  approval_driven: '納得よりも、『どう見られるか』が動きを変えています。',
  meaning_driven: '条件よりも、『意味があるか』で動いています。',
  freedom_driven: '仕事内容よりも、『自分で選べるか』が重要です。',
  mixed: '動機が複数あり、まだ整理されていません。',
} as const;

export type AxisKey = keyof typeof AXIS_LABELS;
export type SubTraitKey = keyof typeof SUB_TRAIT_LABELS;
export type ConsistencyLevel = keyof typeof CONSISTENCY_LABELS;
export type MainType = keyof typeof RESULT_TYPE_LABELS;

export type QuestionChoiceValue = 'A' | 'B' | 'C' | 'D' | 'E';

export type QuizQuestion =
  | {
      id: string;
      text: string;
      ch: [QuestionChoiceValue, string][];
      num?: false;
    }
  | {
      id: string;
      text: string;
      num: true;
      ch?: never;
    };

export type WorkMotiveAnswers = Record<string, QuestionChoiceValue | number | undefined>;

export type AxisScores = Record<AxisKey, number>;

export type Contradiction = {
  title: string;
  severity: number;
  message: string;
};

export type WorkMotiveResultCore = {
  scores: AxisScores;
  contradictionScore: number;
  contradictions: Contradiction[];
  mainType: MainType;
  subTraits: SubTraitKey[];
  summary: {
    dominantAxis: AxisKey;
    secondAxis: AxisKey | null;
    consistencyLevel: ConsistencyLevel;
  };
};

export type WorkMotiveResultSections = {
  chips: string[];
  summaryText: string;
  personalityText: string;
  featureText: string;
  conflictText: string;
  fit: string[];
  trap: string[];
  title: string;
  catchCopy: string;
};

export type WorkMotiveResult = WorkMotiveResultCore & WorkMotiveResultSections;
