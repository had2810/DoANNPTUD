const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} phút`;
};

const formatDateTimeFull = (dateString) => {
  if (!dateString) return "Không xác định";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Không hợp lệ";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export {
  formatDate,
  formatTime,
  formatCurrency,
  formatDuration,
  formatDateTimeFull,
};
