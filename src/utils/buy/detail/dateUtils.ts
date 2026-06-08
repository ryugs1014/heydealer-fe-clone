export function getTimeAgo(dateString: string): string {
  const past = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays < 30) return `${diffDays}일 전`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}년 전`;
}
