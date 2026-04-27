import type { Metadata } from 'next';
import { listWorkMotiveResults } from '@/lib/server/supabase-admin';
import { AXIS_LABELS, RESULT_TYPE_LABELS } from '@/lib/work-motive/types';

export const metadata: Metadata = {
  title: '働く動機診断 ダッシュボード | Mosaic Design',
  description: '働く動機診断の回答データを、タイプ・軸・矛盾レベルごとに確認できる管理画面です。',
};

type PageProps = {
  searchParams?: {
    year?: string;
    month?: string;
  };
};

function donutSegments(items: Array<{ label: string; value: number; color: string }>) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return items.map((item) => {
    const length = total > 0 ? (item.value / total) * 100 : 0;
    const segment = {
      ...item,
      dashArray: `${length} ${100 - length}`,
      dashOffset: 25 - offset,
    };
    offset += length;
    return segment;
  });
}

function DonutChart({
  items,
  centerLabel,
}: {
  items: Array<{ label: string; value: number; color: string }>;
  centerLabel: string;
}) {
  const segments = donutSegments(items);

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
      <div className="relative h-52 w-52 shrink-0">
        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#E5E7EB" strokeWidth="6" />
          {segments.map((item) => (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={item.color}
              strokeWidth="6"
              strokeDasharray={item.dashArray}
              strokeDashoffset={item.dashOffset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-slate-900">{items.reduce((sum, item) => sum + item.value, 0)}</div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{centerLabel}</div>
        </div>
      </div>
      <div className="w-full space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ items }: { items: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="flex items-end gap-3 overflow-x-auto rounded-[24px] bg-slate-50 p-4">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-[72px] flex-1 flex-col items-center gap-2">
          <div className="text-sm font-bold text-slate-900">{item.value}</div>
          <div className="flex h-52 w-full items-end">
            <div
              className="w-full rounded-t-2xl transition-all"
              style={{
                height: `${Math.max(8, (item.value / max) * 100)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <div className="text-center text-xs font-bold text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function formatMonthKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

export default async function WorkMotiveAdminPage({ searchParams }: PageProps) {
  const year = searchParams?.year ? Number.parseInt(searchParams.year, 10) : undefined;
  const month = searchParams?.month ? Number.parseInt(searchParams.month, 10) : undefined;

  const rows = await listWorkMotiveResults({
    year: Number.isFinite(year) ? year : undefined,
    month: Number.isFinite(month) ? month : undefined,
  });

  const total = rows.length;
  const allRows = await listWorkMotiveResults();

  const availableYears = [...new Set(allRows.map((row) => new Date(row.created_at).getUTCFullYear()))].sort((a, b) => b - a);
  const availableMonths = month || year
    ? [...new Set(
        allRows
          .filter((row) => {
            const date = new Date(row.created_at);
            return Number.isFinite(year) ? date.getUTCFullYear() === year : true;
          })
          .map((row) => new Date(row.created_at).getUTCMonth() + 1),
      )].sort((a, b) => a - b)
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const typeCounts = Object.keys(RESULT_TYPE_LABELS).reduce<Record<string, number>>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  const axisScoreTotals = Object.keys(AXIS_LABELS).reduce<Record<string, number>>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  const contradictionBands = { 低: 0, 中: 0, 高: 0 };
  const monthlyCounts = new Map<string, number>();

  rows.forEach((row) => {
    typeCounts[row.main_type] = (typeCounts[row.main_type] ?? 0) + 1;

    Object.entries(row.scores ?? {}).forEach(([axis, value]) => {
      axisScoreTotals[axis] = (axisScoreTotals[axis] ?? 0) + Number(value ?? 0);
    });

    if (row.contradiction_score >= 6) contradictionBands.高 += 1;
    else if (row.contradiction_score >= 3) contradictionBands.中 += 1;
    else contradictionBands.低 += 1;

    const key = formatMonthKey(new Date(row.created_at));
    monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1);
  });

  const typeChartItems = [
    { label: RESULT_TYPE_LABELS.survival_driven, value: typeCounts.survival_driven, color: '#10B981' },
    { label: RESULT_TYPE_LABELS.approval_driven, value: typeCounts.approval_driven, color: '#0F766E' },
    { label: RESULT_TYPE_LABELS.meaning_driven, value: typeCounts.meaning_driven, color: '#1D4ED8' },
    { label: RESULT_TYPE_LABELS.freedom_driven, value: typeCounts.freedom_driven, color: '#7C3AED' },
    { label: RESULT_TYPE_LABELS.mixed, value: typeCounts.mixed, color: '#F59E0B' },
  ];

  const contradictionChartItems = [
    { label: '低', value: contradictionBands.低, color: '#10B981' },
    { label: '中', value: contradictionBands.中, color: '#F59E0B' },
    { label: '高', value: contradictionBands.高, color: '#EF4444' },
  ];

  const axisBarItems = [
    { label: AXIS_LABELS.S, value: axisScoreTotals.S, color: '#10B981' },
    { label: AXIS_LABELS.A, value: axisScoreTotals.A, color: '#14B8A6' },
    { label: AXIS_LABELS.M, value: axisScoreTotals.M, color: '#3B82F6' },
    { label: AXIS_LABELS.F, value: axisScoreTotals.F, color: '#6366F1' },
    { label: AXIS_LABELS.R, value: axisScoreTotals.R, color: '#8B5CF6' },
    { label: AXIS_LABELS.T, value: axisScoreTotals.T, color: '#F59E0B' },
    { label: AXIS_LABELS.P, value: axisScoreTotals.P, color: '#EC4899' },
  ];

  const rawDownloadUrl = `/api/work-motive/export?year=${year ?? ''}&month=${month ?? ''}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfdf5_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-emerald-100 bg-white px-6 py-7 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-600">WORK MOTIVE ADMIN</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">診断ダッシュボード</h1>
              <p className="mt-2 text-sm leading-7 text-slate-500">保存済みの回答データを、期間を絞って集計できます。</p>
            </div>
            <div className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              総回答数: {total}
            </div>
          </div>

          <form className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              年
              <select
                name="year"
                defaultValue={year ?? ''}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
              >
                <option value="">すべて</option>
                {availableYears.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              月
              <select
                name="month"
                defaultValue={month ?? ''}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
              >
                <option value="">すべて</option>
                {availableMonths.map((item) => (
                  <option key={item} value={item}>
                    {item}月
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                集計する
              </button>
              <a href="/apps/work-motive/admin" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
                リセット
              </a>
              <a href={rawDownloadUrl} className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800">
                rawデータをDL
              </a>
            </div>
          </form>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">タイプ別割合</h2>
            <div className="mt-5">
              <DonutChart items={typeChartItems} centerLabel="answers" />
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">矛盾レベル</h2>
            <div className="mt-5">
              <DonutChart items={contradictionChartItems} centerLabel="contradiction" />
            </div>
          </article>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">軸別スコア</h2>
          <div className="mt-5">
            <BarChart items={axisBarItems} />
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">月別回答数</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="pb-3 pr-4">月</th>
                  <th className="pb-3">回答数</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyCounts.entries()]
                  .sort((a, b) => (a[0] < b[0] ? 1 : -1))
                  .map(([key, value]) => (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="py-3 pr-4">{key}</td>
                      <td className="py-3">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">最新回答</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="pb-3 pr-4">日時</th>
                  <th className="pb-3 pr-4">タイプ</th>
                  <th className="pb-3 pr-4">矛盾</th>
                  <th className="pb-3">副特性</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4">{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                    <td className="py-3 pr-4">{RESULT_TYPE_LABELS[row.main_type as keyof typeof RESULT_TYPE_LABELS] ?? row.main_type}</td>
                    <td className="py-3 pr-4">{row.contradiction_score}</td>
                    <td className="py-3">{(row.sub_traits ?? []).join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
