const convertTimeFromMiliseconds = (miliseconds) => {
  const milisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const minuteFromMiliseconds = milisecondsInSecond * secondsInMinute;
  const hourFromMinutes = minuteFromMiliseconds * minutesInHour;
  const dayFromHours = hourFromMinutes * hoursInDay;

  const calculateDays = Math.floor(miliseconds / dayFromHours);
  let lostTime = miliseconds - (calculateDays * dayFromHours);
  const calculateHours = Math.floor((lostTime / hourFromMinutes) % 24);
  lostTime = miliseconds -  (calculateHours * hourFromMinutes);
  const calculateMinutes = Math.floor((lostTime / minuteFromMiliseconds) % 60);

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
