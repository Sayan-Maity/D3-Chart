function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function formatFinalDate(dateString, days) {
  const date = new Date(dateString);

  while (days > 0) {
    date.setDate(date.getDate() - 1);

    // Check if the current day is not a Saturday (6) or Sunday (0)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      days--;
    }
  }

  // if not February 29 and it's not a leap year, adjust to February 28
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    date.setDate(28);
  }

  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

