import AbstractView from './abstract';
import { FILTER_TYPE } from '../utils/const';

const NoEventTextType = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
  [FILTER_TYPE.PAST]: 'There are no past events now',
};

const createNoEventsTemplate = (filterType) => {
  const NoEventValue = NoEventTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${NoEventValue}
    </p>`
  );
};


export default class NoEvent extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoEventsTemplate(this._data);
  }
}
