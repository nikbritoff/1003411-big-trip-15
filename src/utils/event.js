import dayjs from 'dayjs';
import { UPDATE_TYPE } from './const';

const sortDurationUp = (eventA, eventB) => {
  const durationOfEventA = dayjs(eventA.dateTo).diff(eventA.dateFrom, 'minute');
  const durationOfEventB = dayjs(eventB.dateTo).diff(eventB.dateFrom, 'minute');
  return Number(durationOfEventB) - Number(durationOfEventA);
};

const getUpdateType = (minor, major) => {
  if (major) {
    return UPDATE_TYPE.MAJOR;
  }

  if (minor) {
    return UPDATE_TYPE.MINOR;
  }

  return UPDATE_TYPE.PATCH;
};

const sortPriceUp = (eventA, eventB) => Number(eventB.basePrice) - Number(eventA.basePrice);

export {sortPriceUp, sortDurationUp, getUpdateType};
