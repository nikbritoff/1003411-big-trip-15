import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import Smart from './smart';
import { EVENT_DESTINATION_NAMES, OPTION_TITLES } from '../mock/event';
import { EVENT_FORM_MODE } from '../utils/const.js';
import he from 'he';
import { EVENT_TYPES } from '../mock/event';

const setOptions = (options) => {
  let avialableOptions = '';
  options.forEach((currentOption, index) => {
    avialableOptions += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${index}" type="checkbox" name="event-offer-comfort" ${currentOption.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-comfort-${index}">
        <span class="event__offer-title">${currentOption.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${currentOption.price}</span>
      </label>
    </div>`;
  });
  if (avialableOptions) {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${avialableOptions}
      </div>
    </section>`;
  }
  return avialableOptions;
};

const setDestinationList = (destinationList) => {
  let datalistOptions = '';
  destinationList.forEach((city) => {
    datalistOptions += `<option value="${city}"></option>`;
  });
  return `<datalist id="destination-list-1">${datalistOptions}</datalist>`;
};

const createEventTypeItemTemplate = (type, currentType) => `
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.split('').map((symbol, index) => index === 0 ? symbol.toUpperCase() : symbol.toLowerCase()).join('')}</label>
  </div>
`;

const createFormEventTypeTemplate = (types, currentType) => {
  const formEventTypesTemplate = types
    .map((type) => createEventTypeItemTemplate(type, currentType))
    .join('');

  return (`
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${formEventTypesTemplate}
      </fieldset>
    </div>
  `);
};

const createEventFormTemplate = (data, isNew) => {
  const {type, destination, options, basePrice, dateFrom, dateTo, isHasOptions, isHasPictures} = data;
  const setPictures = () => {
    let images = '';

    destination.pictures.forEach((image) => {
      images = `${images} <img class="event__photo" src="${image.src}" alt="${image.description}">`;
    });

    return `<div class="event__photos-container">
              <div class="event__photos-tape">
                ${images}
              </div>
            </div>`;
  };

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${createFormEventTypeTemplate(EVENT_TYPES, type)}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1">
        ${setDestinationList(EVENT_DESTINATION_NAMES)}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(dayjs(dateFrom).format('DD/MM/YY HH:mm'))}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(dayjs(dateTo).format('DD/MM/YY HH:mm'))}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(basePrice))}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isNew ? EVENT_FORM_MODE.add : EVENT_FORM_MODE.edit}</button>
      ${isNew ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
    </header>
    <section class="event__details">
      ${isHasOptions() ?  setOptions(options, type) : ''}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${he.encode(destination.name)}</h3>
        <p class="event__destination-description">${he.encode(destination.description)}</p>
          ${isHasPictures() ? setPictures(options, type) : ''}
      </section>
    </section>
  </form>
</li>`;
};

export default class TripEventForm extends Smart{
  constructor(event, isNew = false) {
    super();
    this._isNew = isNew;
    this._datepickerDateFrom = null;
    this._datepickerDateTo = null;
    this._data = TripEventForm.parseEventToData(event, this._resetButtonText);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._editCloseClickHandler = this._editCloseClickHandler.bind(this);
    this._eventTypeListClickHandler = this._eventTypeListClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangekHandler = this._dateToChangekHandler.bind(this);

    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerDateFrom();
    this._setDatepickerDateTo();
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._isNew);
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editSubmit(TripEventForm.parseDataToEvent(this._data));
  }

  setSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().addEventListener('submit', this._editSubmitHandler);
  }

  _editCloseClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditClickHandler();
  }

  setEditCloseCLickHandler(callback) {
    this._callback.closeEditClickHandler = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editCloseClickHandler);
  }

  // VIEW 6

  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        isHasOptions: function() {
          return event.options.length !== 0;
        },
        isHasPictures: function() {
          return event.destination.pictures.length !== 0;
        },
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isHasOptions;
    delete data.isHasPictures;

    return data;
  }

  _eventTypeListClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'LABEL') {
      const selectedType = evt.target.previousElementSibling.value;
      const newOptions = OPTION_TITLES[selectedType] !== undefined ? OPTION_TITLES[selectedType].options : [];
      this.updateData({
        type: selectedType,
        options: newOptions,
      }, false);
    }
  }

  _destinationInputHandler(evt) {
    const input = evt.target;
    evt.preventDefault();
    const selectedDestinationName = evt.target.value;
    input.blur();

    const description = this._data.destination.description;
    const pictures = this._data.destination.pictures;
    this.updateData({
      destination: {
        name: selectedDestinationName,
        description: description,
        pictures: pictures,
      },
    }, false);
  }

  // Этот метод добавлен, чтобы очищать инпут, так как иначе datalist не отображается.
  // С этим методом список отображается после 2 кликов по input с городом
  _destinationClickHandler(evt) {
    evt.preventDefault();
    evt.target.value = '';
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.editSubmit);
    this._setDatepickerDateFrom();
    this._setDatepickerDateTo();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._eventTypeListClickHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._destinationInputHandler);
    // Это обработчик для очистки по клику
    this.getElement().querySelector('.event__input--destination').addEventListener('click', this._destinationClickHandler);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      basePrice: Number(evt.target.value),
    }, true);
  }

  reset(event, justUpdating = false) {
    this.updateData(
      TripEventForm.parseDataToEvent(event),
      justUpdating,
    );
  }

  // Datepicker
  _dateFromChangeHandler([userData]) {
    this.updateData({
      dateFrom: dayjs([userData]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    }, true);
  }

  _dateToChangekHandler([userData]) {
    this.updateData({
      dateTo: dayjs([userData]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    }, true);
  }

  _setDatepickerDateFrom() {
    if (this._datepickerDateFrom) {
      this._datepickerDateFrom.destroy();
      this._datepickerDateFrom = null;
    }

    this._datepickerDateFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,enableTime: true,
        'time_24hr': true,
        maxDate: this._data.dateTo,
        onChange: this._dateFromChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _setDatepickerDateTo() {
    if (this._datepickerDateTo) {
      this._datepickerDateTo.destroy();
      this._datepickerDateTo = null;
    }

    this._datepickerDateTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,enableTime: true,
        'time_24hr': true,
        minDate: this._data.dateFrom,
        onChange: this._dateToChangekHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }


  // Model
  removeElement() {
    super.removeElement();

    if (this._datepickerDateFrom || this._datepickerDateTo) {
      this._datepickerDateTo.destroy();
      this._datepickerDateTo = null;
      this._datepickerDateFrom.destroy();
      this._datepickerDateFrom = null;
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripEventForm.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }
}
