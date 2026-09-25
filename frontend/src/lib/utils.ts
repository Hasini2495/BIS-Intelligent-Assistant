export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

  return formatDate(d);
}

export function groupByDate<T extends { createdAt: string }>(
  items: T[]
): Record<string, T[]> {
  const groups: {
    today: T[];
    yesterday: T[];
    last7days: T[];
    last30days: T[];
    older: T[];
  } = {
    today: [],
    yesterday: [],
    last7days: [],
    last30days: [],
    older: []
  };

  const now = new Date();

  items.forEach(item => {
    const d = new Date(item.createdAt);
    const diffInDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) groups.today.push(item);
    else if (diffInDays === 1) groups.yesterday.push(item);
    else if (diffInDays < 7) groups.last7days.push(item);
    else if (diffInDays < 30) groups.last30days.push(item);
    else groups.older.push(item);
  });

  return groups;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function parseQueryString(
  queryString: string
): Record<string, string> {
  const searchParams = new URLSearchParams(queryString);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}