import { NextRequest, NextResponse } from 'next/server';
import { WORK_MOTIVE_QUESTIONS } from '@/lib/work-motive/questions';
import { buildWorkMotiveResult } from '@/lib/work-motive/results';
import { calculateWorkMotiveResult } from '@/lib/work-motive/scoring';
import { WorkMotiveAnswers } from '@/lib/work-motive/types';
import { createWorkMotiveResult } from '@/lib/server/supabase-admin';

type SubmitBody = {
  answers?: WorkMotiveAnswers;
};

function validateAnswers(answers: WorkMotiveAnswers) {
  for (const question of WORK_MOTIVE_QUESTIONS) {
    const value = answers[question.id];
    if (question.num) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return `${question.id} の回答が不正です。`;
      }
      continue;
    }

    if (!value || typeof value !== 'string') {
      return `${question.id} の回答が不足しています。`;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;

  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, message: '送信データを読み取れませんでした。' }, { status: 400 });
  }

  const answers = body.answers ?? {};
  const validationError = validateAnswers(answers);
  if (validationError) {
    return NextResponse.json({ ok: false, message: validationError }, { status: 400 });
  }

  const core = calculateWorkMotiveResult(answers);
  const result = buildWorkMotiveResult(core, answers);

  const saved = await createWorkMotiveResult({
    mainType: result.mainType,
    scores: result.scores,
    answers,
    contradictionScore: result.contradictionScore,
    subTraits: result.subTraits,
  });

  return NextResponse.json({ ok: true, result, saved });
}
