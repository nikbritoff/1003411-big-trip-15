import TripEventFormView from '../view/trip-event-form.js';
import { nanoid } from 'nanoid';
import { remove, render, RenderPosition } from '../utils/render.js';
import { USER_ACTION, UPDATE_TYPE } from '../utils/const.js';
import dayjs from 'dayjs';
import { EVENT_FORM_MODE } from '../utils/const.js';
import { EVENT_DESTINATION_NAMES, EVENT_TYPES, DESTINATION_INFO_DESCRIPTIONS } from '../mock/event.js';
import { getRandomIntOfRange } from '../mock/utils.js';

const DEFAULT_EVENT = {
  type: EVENT_TYPES[getRandomIntOfRange(0, EVENT_TYPES.length - 1)],
  destination: {
    name: EVENT_DESTINATION_NAMES[getRandomIntOfRange(0, EVENT_DESTINATION_NAMES.length - 1)],
    description: DESTINATION_INFO_DESCRIPTIONS[getRandomIntOfRange(0, DESTINATION_INFO_DESCRIPTIONS.length - 1)],
    pictures: [],
  },
  basePrice: 0,
  isFavorite: false,
  dateFrom: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  options: [],
  dateTo: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
};

export default class EventNew {
  constructor(eventsListElement, changeData) {
    this._eventsListElement = eventsListElement;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new TripEventFormView(DEFAULT_EVENT, true);
    delete this._eventFormMode;
    this._eventEditComponent.setDeleteClickHandler(this._handleCancelClick);
    this._eventEditComponent.setSubmitHandler(this._handleFormSubmit);
    render(this._eventsListElement, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    // handle view action
    this._changeData(
      USER_ACTION.ADD_EVENT,
      UPDATE_TYPE.MAJOR,
      // Временное
      Object.assign({id: nanoid()}, event),
    );
    this._eventFormMode = EVENT_FORM_MODE.edit;
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
