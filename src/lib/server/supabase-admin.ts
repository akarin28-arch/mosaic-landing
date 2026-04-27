function getEnv() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

async function rest(path: string, init: RequestInit = {}) {
  const env = getEnv();
  if (!env) return null;
  return fetch(`${env.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
}

export async function createWorkMotiveResult(params: {
  mainType: string;
  scores: Record<string, number>;
  answers: Record<string, unknown>;
  contradictionScore: number;
  subTraits: string[];
}) {
  const response = await rest('work_motive_results', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify([
      {
        main_type: params.mainType,
        scores: params.scores,
        answers: params.answers,
        contradiction_score: params.contradictionScore,
        sub_traits: params.subTraits,
      },
    ]),
  });
  return Boolean(response && response.ok);
}

export type WorkMotiveResultRow = {
  id: string;
  main_type: string;
  scores: Record<string, number>;
  answers: Record<string, unknown>;
  contradiction_score: number;
  sub_traits: string[] | null;
  created_at: string;
};

type WorkMotiveResultFilter = {
  year?: number;
  month?: number;
};

export async function listWorkMotiveResults(filters: WorkMotiveResultFilter = {}): Promise<WorkMotiveResultRow[]> {
  const response = await rest(
    'work_motive_results?select=id,main_type,scores,answers,contradiction_score,sub_traits,created_at&order=created_at.desc',
  );
  if (!response || !response.ok) return [];
  const rows = (await response.json()) as WorkMotiveResultRow[];

  if (!filters.year && !filters.month) return rows;

  return rows.filter((row) => {
    const date = new Date(row.created_at);
    if (Number.isNaN(date.getTime())) return false;
    const matchYear = filters.year ? date.getUTCFullYear() === filters.year : true;
    const matchMonth = filters.month ? date.getUTCMonth() + 1 === filters.month : true;
    return matchYear && matchMonth;
  });
}
