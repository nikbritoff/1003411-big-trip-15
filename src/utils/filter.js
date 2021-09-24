import { FilterType } from '../const/const';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => {
    const eventStart = dayjs(event.dateFrom);
    const now = dayjs();
    if (dayjs(eventStart).isSameOrAfter(now, 'day')) {
      return event;
    }
  }),
  [FilterType.PAST]: (events) => events.filter((event) => {
    const eventStart = dayjs(event.dateFrom);
    const now = dayjs();
    if (!dayjs(eventStart).isSameOrAfter(now, 'day')) {
      return event;
    }
  }),
};

export {filter};
