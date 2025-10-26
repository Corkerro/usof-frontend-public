export const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();

  // date.setTime(date.getTime() + 2 * 60 * 60 * 1000); // to fix

  const diffMs = Date.now() - date.getTime(); // разница в миллисекундах

  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  if (mins >= 1) return `${mins}m ago`;
  return "just now";
};
