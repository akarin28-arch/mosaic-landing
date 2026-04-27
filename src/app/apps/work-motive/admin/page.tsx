import type { Metadata } from 'next';
import { isSupabaseAdminConfigured, listWorkMotiveResults } from '@/lib/server/supabase-admin';
import { AXIS_LABELS, RESULT_TYPE_LABELS } from '@/lib/work-motive/types';

export const metadata: Metadata = {
  title: '働く動機診断 ダッシュボード | Mosaic Design',
  description: '働く動機診断の集計データを、タイプ・軸・矛盾レベルごとに確認できる管理画面です。',
};

type PageProps = {
  searchParams?: Promise<{
    year?: string;
    month?: string;
  }>;
};

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

function donutSegments(items: ChartItem[]) {
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

function DonutChart({ items, centerLabel }: { items: ChartItem[]; centerLabel: string }) {
  const segments = donutSegments(items);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '208px', height: '208px', flexShrink: 0 }}>
          <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#0f172a' }}>{total}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8' }}>
              {centerLabel}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                borderRadius: '18px',
                backgroundColor: '#f8fafc',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: item.color }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChart({ items }: { items: ChartItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        overflowX: 'auto',
        borderRadius: '24px',
        backgroundColor: '#f8fafc',
        padding: '16px',
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ minWidth: '72px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{item.value}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', height: '220px' }}>
            <div
              style={{
                width: '100%',
                height: `${Math.max(8, (item.value / max) * 100)}%`,
                borderTopLeftRadius: '18px',
                borderTopRightRadius: '18px',
                backgroundColor: item.color,
              }}
            />
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{item.label}</div>
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
  const params = (await searchParams) ?? {};
  const year = params.year ? Number.parseInt(params.year, 10) : undefined;
  const month = params.month ? Number.parseInt(params.month, 10) : undefined;

  const configured = isSupabaseAdminConfigured();
  const rows = configured
    ? await listWorkMotiveResults({
        year: Number.isFinite(year) ? year : undefined,
        month: Number.isFinite(month) ? month : undefined,
      })
    : [];
  const allRows = configured ? await listWorkMotiveResults() : [];
  const total = rows.length;

  const availableYears = [...new Set(allRows.map((row) => new Date(row.created_at).getUTCFullYear()))].sort((a, b) => b - a);
  const availableMonths =
    month || year
      ? [
          ...new Set(
            allRows
              .filter((row) => {
                const date = new Date(row.created_at);
                return Number.isFinite(year) ? date.getUTCFullYear() === year : true;
              })
              .map((row) => new Date(row.created_at).getUTCMonth() + 1),
          ),
        ].sort((a, b) => a - b)
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

  const typeChartItems: ChartItem[] = [
    { label: RESULT_TYPE_LABELS.survival_driven, value: typeCounts.survival_driven, color: '#10B981' },
    { label: RESULT_TYPE_LABELS.approval_driven, value: typeCounts.approval_driven, color: '#0F766E' },
    { label: RESULT_TYPE_LABELS.meaning_driven, value: typeCounts.meaning_driven, color: '#1D4ED8' },
    { label: RESULT_TYPE_LABELS.freedom_driven, value: typeCounts.freedom_driven, color: '#7C3AED' },
    { label: RESULT_TYPE_LABELS.mixed, value: typeCounts.mixed, color: '#F59E0B' },
  ];

  const contradictionChartItems: ChartItem[] = [
    { label: '低', value: contradictionBands.低, color: '#10B981' },
    { label: '中', value: contradictionBands.中, color: '#F59E0B' },
    { label: '高', value: contradictionBands.高, color: '#EF4444' },
  ];

  const axisBarItems: ChartItem[] = [
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 35%, #ffffff 100%)',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section
          style={{
            borderRadius: '32px',
            border: '1px solid #d1fae5',
            backgroundColor: '#ffffff',
            padding: '28px 24px',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#059669' }}>
                WORK MOTIVE ADMIN
              </p>
              <h1 style={{ margin: '12px 0 0', fontSize: '34px', lineHeight: 1.15, fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
                働く動機診断 ダッシュボード
              </h1>
              <p style={{ margin: '10px 0 0', fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
                回答データをタイプ・軸・矛盾レベルごとに確認できます。
              </p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '9999px',
                backgroundColor: '#ecfdf5',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 800,
                color: '#065f46',
              }}
            >
              総回答数: {total}
            </div>
          </div>

          {!configured && (
            <div
              style={{
                marginTop: '18px',
                borderRadius: '20px',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                padding: '16px 18px',
                fontSize: '14px',
                lineHeight: 1.8,
                color: '#991b1b',
              }}
            >
              Supabase の環境変数が本番環境に設定されていないため、集計データを読み込めていません。Vercel の
              `SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を確認してください。
            </div>
          )}

          <form style={{ marginTop: '22px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#475569' }}>
              年
              <select
                name="year"
                defaultValue={year ?? ''}
                style={{
                  minWidth: '120px',
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                <option value="">すべて</option>
                {availableYears.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#475569' }}>
              月
              <select
                name="month"
                defaultValue={month ?? ''}
                style={{
                  minWidth: '120px',
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                <option value="">すべて</option>
                {availableMonths.map((item) => (
                  <option key={item} value={item}>
                    {item}月
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              style={{
                border: 0,
                borderRadius: '9999px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '13px 18px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              集計する
            </button>
            <a
              href="/apps/work-motive/admin"
              style={{
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                padding: '13px 18px',
                fontSize: '14px',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              リセット
            </a>
            <a
              href={rawDownloadUrl}
              style={{
                borderRadius: '9999px',
                border: '1px solid #a7f3d0',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                padding: '13px 18px',
                fontSize: '14px',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              rawデータをDL
            </a>
          </form>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <article
            style={{
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '20px',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>タイプ別割合</h2>
            <div style={{ marginTop: '18px' }}>
              <DonutChart items={typeChartItems} centerLabel="answers" />
            </div>
          </article>

          <article
            style={{
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '20px',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>矛盾レベル</h2>
            <div style={{ marginTop: '18px' }}>
              <DonutChart items={contradictionChartItems} centerLabel="contradiction" />
            </div>
          </article>
        </section>

        <section
          style={{
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '20px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>軸別スコア</h2>
          <div style={{ marginTop: '18px' }}>
            <BarChart items={axisBarItems} />
          </div>
        </section>

        <section
          style={{
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '20px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>月別回答数</h2>
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: '#475569' }}>
              <thead style={{ borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#94a3b8' }}>
                <tr>
                  <th style={{ paddingBottom: '12px', paddingRight: '16px' }}>月</th>
                  <th style={{ paddingBottom: '12px' }}>回答数</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyCounts.entries()]
                  .sort((a, b) => (a[0] < b[0] ? 1 : -1))
                  .map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px 12px 0' }}>{key}</td>
                      <td style={{ padding: '12px 0' }}>{value}</td>
                    </tr>
                  ))}
                {monthlyCounts.size === 0 && (
                  <tr>
                    <td colSpan={2} style={{ padding: '16px 0', color: '#94a3b8' }}>
                      表示できるデータがありません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '20px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>最新回答</h2>
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: '#475569' }}>
              <thead style={{ borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#94a3b8' }}>
                <tr>
                  <th style={{ paddingBottom: '12px', paddingRight: '16px' }}>日時</th>
                  <th style={{ paddingBottom: '12px', paddingRight: '16px' }}>タイプ</th>
                  <th style={{ paddingBottom: '12px', paddingRight: '16px' }}>矛盾スコア</th>
                  <th style={{ paddingBottom: '12px' }}>サブ特性</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px 12px 0' }}>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                    <td style={{ padding: '12px 16px 12px 0' }}>
                      {RESULT_TYPE_LABELS[row.main_type as keyof typeof RESULT_TYPE_LABELS] ?? row.main_type}
                    </td>
                    <td style={{ padding: '12px 16px 12px 0' }}>{row.contradiction_score}</td>
                    <td style={{ padding: '12px 0' }}>{(row.sub_traits ?? []).join(', ') || '-'}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '16px 0', color: '#94a3b8' }}>
                      表示できるデータがありません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
