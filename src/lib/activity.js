/**
 * @typedef {Object} DayCell
 * @property {string} date
 * @property {number} count
 * @property {number} level
 */

/**
 * @typedef {Object} CommitItem
 * @property {string} id
 * @property {string} title
 * @property {string} repo
 * @property {string} url
 * @property {string} date
 */

/**
 * @typedef {Object} ActivityBundle
 * @property {number} total
 * @property {DayCell[][]} weeks
 * @property {CommitItem[]} commits
 * @property {string} [error]
 */

/** @param {number} count */
function toLevel(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

/** @param {string} iso */
function startOfUtcDay(iso) {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d;
}

/**
 * Build GitHub-style weeks (Sun–Sat columns of weeks) from a date→count map.
 * @param {Record<string, number>} dayCounts
 * @returns {{ total: number; weeks: DayCell[][] }}
 */
function weeksFromDayCounts(dayCounts) {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  /** @type {DayCell[][]} */
  const weeks = [];
  /** @type {DayCell[]} */
  let week = [];
  let total = 0;

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10);
    const count = dayCounts[date] ?? 0;
    total += count;
    week.push({ date, count, level: toLevel(count) });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) weeks.push(week);
  return { total, weeks };
}

/**
 * @param {string} username
 * @param {string | undefined} token
 * @returns {Promise<{ total: number; weeks: DayCell[][] }>}
 */
async function fetchGithubCalendar(username, token) {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  if (token) {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-activity',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (res.ok) {
      const json = await res.json();
      const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (calendar) {
        const levelMap = {
          NONE: 0,
          FIRST_QUARTILE: 1,
          SECOND_QUARTILE: 2,
          THIRD_QUARTILE: 3,
          FOURTH_QUARTILE: 4,
        };
        /** @type {DayCell[][]} */
        const weeks = calendar.weeks.map((w) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            level: levelMap[d.contributionLevel] ?? toLevel(d.contributionCount),
          })),
        );
        return { total: calendar.totalContributions, weeks };
      }
    }
  }

  // Public fallback (no token required)
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
  if (!res.ok) throw new Error(`GitHub calendar fetch failed (${res.status})`);
  const json = await res.json();
  /** @type {Record<string, number>} */
  const dayCounts = {};
  for (const day of json.contributions ?? []) {
    dayCounts[day.date] = day.count;
  }
  const built = weeksFromDayCounts(dayCounts);
  return {
    total: json.total?.lastYear ?? built.total,
    weeks: built.weeks,
  };
}

/**
 * @param {string} username
 * @param {string | undefined} token
 * @param {number} limit
 * @returns {Promise<CommitItem[]>}
 */
async function fetchGithubCommits(username, token, limit) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-activity',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=30`,
    { headers },
  );
  if (!res.ok) throw new Error(`GitHub events fetch failed (${res.status})`);
  const events = await res.json();

  /** @type {CommitItem[]} */
  const commits = [];
  for (const event of events) {
    if (event.type !== 'PushEvent') continue;
    const repo = event.repo?.name ?? 'unknown';
    const payloads = event.payload?.commits ?? [];
    if (payloads.length === 0) {
      commits.push({
        id: String(event.id),
        title: 'Push',
        repo,
        url: `https://github.com/${repo}`,
        date: event.created_at,
      });
    } else {
      for (const commit of payloads) {
        commits.push({
          id: commit.sha ?? `${event.id}-${commits.length}`,
          title: commit.message?.split('\n')[0] ?? 'Commit',
          repo,
          url: commit.url
            ? commit.url.replace('api.github.com/repos', 'github.com').replace('/commits/', '/commit/')
            : `https://github.com/${repo}`,
          date: event.created_at,
        });
      }
    }
    if (commits.length >= limit) break;
  }
  return commits.slice(0, limit);
}

/**
 * @param {string} username
 * @returns {Promise<{ total: number; weeks: DayCell[][] }>}
 */
async function fetchInventCalendar(username) {
  const res = await fetch(`https://invent.kde.org/users/${username}/calendar.json`, {
    headers: { 'User-Agent': 'portfolio-activity' },
  });
  if (!res.ok) throw new Error(`invent.kde.org calendar failed (${res.status})`);
  /** @type {Record<string, number>} */
  const dayCounts = await res.json();
  return weeksFromDayCounts(dayCounts);
}

/**
 * @param {string} username
 * @param {number} limit
 * @returns {Promise<CommitItem[]>}
 */
async function fetchInventCommits(username, limit) {
  const userRes = await fetch(
    `https://invent.kde.org/api/v4/users?username=${encodeURIComponent(username)}`,
    { headers: { 'User-Agent': 'portfolio-activity' } },
  );
  if (!userRes.ok) throw new Error(`invent.kde.org user lookup failed (${userRes.status})`);
  const users = await userRes.json();
  const user = users[0];
  if (!user?.id) throw new Error(`invent.kde.org user not found: ${username}`);

  const eventsRes = await fetch(
    `https://invent.kde.org/api/v4/users/${user.id}/events?per_page=40`,
    { headers: { 'User-Agent': 'portfolio-activity' } },
  );
  if (!eventsRes.ok) throw new Error(`invent.kde.org events failed (${eventsRes.status})`);
  const events = await eventsRes.json();

  /** @type {CommitItem[]} */
  const commits = [];
  for (const event of events) {
    const isPush =
      event.action_name === 'pushed to' ||
      event.action_name === 'pushed new' ||
      event.push_data;
    if (!isPush) continue;

    const sha = event.push_data?.commit_to;
    const projectPath = event.project?.path_with_namespace;
    const title =
      event.push_data?.commit_title ??
      event.target_title ??
      'Push';
    const repo = event.target_title ?? projectPath ?? 'project';
    const url = sha && projectPath
      ? `https://invent.kde.org/${projectPath}/-/commit/${sha}`
      : `https://invent.kde.org/${username}`;

    commits.push({
      id: String(event.id),
      title,
      repo,
      url,
      date: event.created_at,
    });
    if (commits.length >= limit) break;
  }
  return commits;
}

/**
 * @param {{ username: string; commitLimit?: number }} opts
 * @returns {Promise<ActivityBundle>}
 */
export async function loadGithubActivity({ username, commitLimit = 8 }) {
  const token = import.meta.env.GITHUB_TOKEN;
  try {
    const [calendar, commits] = await Promise.all([
      fetchGithubCalendar(username, token),
      fetchGithubCommits(username, token, commitLimit).catch(() => []),
    ]);
    return { ...calendar, commits };
  } catch (error) {
    return {
      total: 0,
      weeks: [],
      commits: [],
      error: error instanceof Error ? error.message : 'Failed to load GitHub activity',
    };
  }
}

/**
 * @param {{ username: string; commitLimit?: number }} opts
 * @returns {Promise<ActivityBundle>}
 */
export async function loadInventActivity({ username, commitLimit = 8 }) {
  try {
    const [calendar, commits] = await Promise.all([
      fetchInventCalendar(username),
      fetchInventCommits(username, commitLimit).catch(() => []),
    ]);
    return { ...calendar, commits };
  } catch (error) {
    return {
      total: 0,
      weeks: [],
      commits: [],
      error: error instanceof Error ? error.message : 'Failed to load invent.kde.org activity',
    };
  }
}

/** @param {string} iso */
export function formatActivityDate(iso) {
  return startOfUtcDay(iso.slice(0, 10)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
