import { NextRequest, NextResponse } from 'next/server';
import { listWorkMotiveResults } from '@/lib/server/supabase-admin';

function escapeCsv(value: unknown) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const normalized = text ?? '';
  if (normalized.includes(',') || normalized.includes('"') || normalized.includes('\n')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export async function GET(req: NextRequest) {
  const yearValue = req.nextUrl.searchParams.get('year');
  const monthValue = req.nextUrl.searchParams.get('month');
  const year = yearValue ? Number.parseInt(yearValue, 10) : undefined;
  const month = monthValue ? Number.parseInt(monthValue, 10) : undefined;

  const rows = await listWorkMotiveResults({
    year: Number.isFinite(year) ? year : undefined,
    month: Number.isFinite(month) ? month : undefined,
  });

  const header = ['id', 'created_at', 'main_type', 'contradiction_score', 'sub_traits', 'scores', 'answers'];
  const lines = rows.map((row) =>
    [
      row.id,
      row.created_at,
      row.main_type,
      row.contradiction_score,
      row.sub_traits ?? [],
      row.scores,
      row.answers,
    ]
      .map(escapeCsv)
      .join(','),
  );

  const csv = [header.join(','), ...lines].join('\n');
  const suffix = `${yearValue ?? 'all'}-${monthValue ?? 'all'}`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="work-motive-raw-${suffix}.csv"`,
    },
  });
}
