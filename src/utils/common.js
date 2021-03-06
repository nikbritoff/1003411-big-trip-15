const MILISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const convertTimeFromMiliseconds = (miliseconds) => {
  const minuteFromMiliseconds = MILISECONDS_IN_SECOND * SECONDS_IN_MINUTE;
  const hourFromMinutes = minuteFromMiliseconds * MINUTES_IN_HOUR;
  const dayFromHours = hourFromMinutes * HOURS_IN_DAY;

  const calculateDays = Math.floor(miliseconds / dayFromHours);
  let lostTime = miliseconds - (calculateDays * dayFromHours);
  const calculateHours = Math.floor((lostTime / hourFromMinutes) % HOURS_IN_DAY);
  lostTime = miliseconds -  (calculateHours * hourFromMinutes);
  const calculateMinutes = Math.floor((lostTime / minuteFromMiliseconds) % SECONDS_IN_MINUTE);

  const days = calculateDays > 0 ? `${String(calculateDays).padStart(2, '0')}D ` : '';
  const spentTime = `${days}${String(calculateHours).padStart(2, '0')}H ${String(calculateMinutes).padStart(2, '0')}M`;

  return spentTime;
};

const compareNumbericMoney = (a, b) => {
  if (a.money > b.money) {
    return -1;
  }
  if (a.money === b.money) {
    return 0;
  }
  if (a.money < b.money) {
    return 1;
  }
};

const compareNumbericTime = (a, b) => {
  if (a.timeSpend > b.timeSpend) {
    return -1;
  }
  if (a.timeSpend === b.timeSpend) {
    return 0;
  }
  if (a.timeSpend < b.timeSpend) {
    return 1;
  }
};

const compareNumbericAmount = (a, b) => {
  if (a.amount > b.amount) {
    return -1;
  }
  if (a.amount === b.amount) {
    return 0;
  }
  if (a.amount < b.amount) {
    return 1;
  }
};

const isOnline = () => window.navigator.onLine;

export { convertTimeFromMiliseconds, compareNumbericMoney, compareNumbericTime, compareNumbericAmount, isOnline};
