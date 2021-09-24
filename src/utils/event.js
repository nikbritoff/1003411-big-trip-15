import dayjs from 'dayjs';
import { UpdateType } from '../const/const';

const sortDurationUp = (eventA, eventB) => {
  const durationOfEventA = dayjs(eventA.dateTo).diff(eventA.dateFrom, 'minute');
  const durationOfEventB = dayjs(eventB.dateTo).diff(eventB.dateFrom, 'minute');
  return Number(durationOfEventB) - Number(durationOfEventA);
};

const getUpdateType = (minor, major) => {
  if (major) {
    return UpdateType.MAJOR;
  }

  if (minor) {
    return UpdateType.MINOR;
  }

  return UpdateType.PATCH;
};

const sortPriceUp = (eventA, eventB) => Number(eventB.basePrice) - Number(eventA.basePrice);

export {sortPriceUp, sortDurationUp, getUpdateType};
