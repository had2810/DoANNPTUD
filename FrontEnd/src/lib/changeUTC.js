const toLocalDatetimeString = (utcString) => {
  if (!utcString) return "";
  const date = new Date(utcString);
  const offset = date.getTimezoneOffset(); // phút
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const fromLocalDatetimeInput = (localString) => {
  // localString: "2025-05-09T12:40"
  return new Date(localString).toISOString(); // convert thành UTC ISO để lưu DB
};

export { toLocalDatetimeString, fromLocalDatetimeInput };
