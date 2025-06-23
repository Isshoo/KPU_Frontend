const showFormattedDate = (date, locale = 'ID') => {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = now - inputDate;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (locale === 'ID') {
    // if (seconds < 60) return 'baru saja';
    // if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `Hari ini`;
    if (days < 30) return `${days}h lalu`;
    if (months < 12) return `${months}bln lalu`;
    return `${years}thn lalu`;
  }

  // if (seconds < 60) return 'just now';
  // if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}yr ago`;
};

// format iso date
const formatISODate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

// format unix timestamp
const formatUnixTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

const timeAgo = (date) => {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = now - inputDate;
  return showFormattedDate(diff);
};

export { showFormattedDate, formatISODate, formatUnixTimestamp, timeAgo };

