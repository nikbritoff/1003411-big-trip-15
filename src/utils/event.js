import dayjs from 'dayjs';

const sortDurationUp = (eventA, eventB) => {
  const durationOfEventA = dayjs(eventA.dateTo).diff(eventA.dateFrom, 'minute');
  const durationOfEventB = dayjs(eventB.dateTo).diff(eventB.dateFrom, 'minute');
  return Number(durationOfEventB) - Number(durationOfEventA);
};

const sortPriceUp = (eventA, eventB) => Number(eventB.basePrice) - Number(eventA.basePrice);

export {sortPriceUp, sortDurationUp};
