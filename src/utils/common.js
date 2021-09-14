const updateArrayElement = (array, update) => {
  const index = array.findIndex((element) => element.id === update.id);

  if (index === -1) {
    return array;
  }

  return [
    ...array.slice(0, index),
    update,
    ...array.slice(index + 1),
  ];
};

const convertTimeFromMiliseconds = (miliseconds) => {
  const calculateDays = Math.floor(miliseconds / (1000 * 60 * 60 * 24) % 30);
  let lostTime = miliseconds - (calculateDays * (1000 * 60 * 60 * 24));
  const calculateHours = Math.floor((lostTime / (1000 * 60 * 60)) % 24);
  lostTime = miliseconds -  (calculateHours * (1000 * 60 * 60));
  const calculateMinutes = Math.floor((lostTime / (1000 * 60)) % 60);

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

export {updateArrayElement, convertTimeFromMiliseconds, compareNumbericMoney, compareNumbericTime, compareNumbericAmount};
