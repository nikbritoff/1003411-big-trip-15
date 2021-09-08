import { FILTER_TYPE } from '../utils/const';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const filter = {
  [FILTER_TYPE.EVERYTHING]: (events) => events,
  [FILTER_TYPE.FUTURE]: (events) => events.filter((event) => {
    const eventStart = dayjs(event.dateFrom);
    const now = dayjs();
    if (dayjs(eventStart).isSameOrAfter(now, 'day')) {
      return event;
    }
  }),
  [FILTER_TYPE.PAST]: (events) => events.filter((event) => {
    const eventStart = dayjs(event.dateFrom);
    const now = dayjs();
    if (!dayjs(eventStart).isSameOrAfter(now, 'day')) {
      return event;
    }
  }),
};

export {filter};
