import dayjs from 'dayjs';

const sortDurationUp = (eventA, eventB) => {
  const durationOfEventA = dayjs(eventA.dateTo).diff(eventA.dateFrom, 'minute');
  const durationOfEventB = dayjs(eventB.dateTo).diff(eventB.dateFrom, 'minute');
  return Number(durationOfEventB) - Number(durationOfEventA);
};

const getEventDuration = (start, end) => {
  let duration = dayjs(end).diff(start, 'minute');
  if (duration  > 60) {
    duration = dayjs(end).diff(start, 'hour');
  }
  return duration;
};

const sortPriceUp = (eventA, eventB) => Number(eventB.basePrice) - Number(eventA.basePrice);

export {sortPriceUp, sortDurationUp};
