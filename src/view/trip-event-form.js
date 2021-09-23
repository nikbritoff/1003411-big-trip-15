import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import Smart from './smart';
import { EVENT_TYPES } from '../const/const.js';
import he from 'he';

const DEFAULT_EVENT = {
  type: 'drive',
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  basePrice: 0,
  isFavorite: false,
  dateFrom: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  options: [],
  dateTo: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
};

const setResetFormButtonText = (isNew, isDeleting) => {
  if (isNew && isDeleting) {
    return 'Canceling...';
  }

  if (!isNew && isDeleting) {
    return 'Deleting...';
  }

  if (isNew && !isDeleting) {
    return 'Cancel';
  }

  return 'Delete';
};

const setPictures = (pictures) => {
  let images = '';

  pictures.forEach((image) => {
    images += `<img class="event__photo" src="${image.src}" alt="${image.description}">`;
  });

  return `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${images}
            </div>
          </div>`;
};

const setEventDescription = (destination, isHasPictures) => {
  if (!destination.description && isHasPictures === 0) {
    return '';
  } else {
    const destinationDescription = destination.description ? `<p class="event__destination-description">${he.encode(destination.description)}</p>'` : '';
    const destinationPictures = setPictures(destination.pictures);
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${he.encode(destination.name)}</h3>
        ${destinationDescription}
        ${destinationPictures}
    </section>`
    );
  }
};

const setOptions = (options, selectedType, offers, isDisabled) => {
  if (!offers) {
    return '';
  }

  const targetOffer = offers.find((offer) => offer.type === selectedType);

  if (!offers || !targetOffer) {
    return '';
  }

  let avialableOptions = '';
  targetOffer.offers.forEach((currentOption, index) => {
    const isChecked = options.some((option) => option.title === currentOption.title);
    avialableOptions += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${index}" type="checkbox" name="event-offer-comfort" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
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

const setDestinationList = (destinations) => {
  let datalistOptions = '';
  destinations.forEach((destination) => {
    datalistOptions += `<option value="${destination.name}"></option>`;
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

const createEventFormTemplate = (data, isNew, destinations, offers) => {
  const {type, destination, options, basePrice, dateFrom, dateTo, isDisabled, isSaving, isDeleting} = data;
  const targetOffer = offers.find((offer) => offer.type === type).offers;
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        ${createFormEventTypeTemplate(EVENT_TYPES, type)}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        ${setDestinationList(destinations)}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(dayjs(dateFrom).format('DD/MM/YY HH:mm'))}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(dayjs(dateTo).format('DD/MM/YY HH:mm'))}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">
        ${isSaving ? 'Saving...' : 'Save'}
      </button>
      <button class="event__reset-btn" type="reset">${setResetFormButtonText(isNew, isDeleting)}</button>
      ${isNew ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
    </header>
    <section class="event__details">
      ${targetOffer.length > 0 ?  setOptions(options, type, offers, isDisabled) : ''}
      ${setEventDescription(destination, destination.pictures)}
    </section>
  </form>
</li>`;
};

export default class TripEventForm extends Smart{
  constructor(event, destinations, offers) {
    super();
    DEFAULT_EVENT.options = [];
    const eventData = event || DEFAULT_EVENT;
    this._offers = offers;
    this._destinations = destinations;
    this._isNew = !event;
    this._datepickerDateFrom = null;
    this._datepickerDateTo = null;
    this._data = TripEventForm.parseEventToData(eventData);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._editCloseClickHandler = this._editCloseClickHandler.bind(this);
    this._eventTypeListClickHandler = this._eventTypeListClickHandler.bind(this);

    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangekHandler = this._dateToChangekHandler.bind(this);

    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._eventEndTimeInputHandler = this._eventEndTimeInputHandler.bind(this);
    this._eventStartTimeInputHandler = this._eventStartTimeInputHandler.bind(this);
    this._offersClickHandler = this._offersClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerDateFrom();
    this._setDatepickerDateTo();
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._isNew, this._destinations, this._offers);
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();
    if (this._checkPriceValidity() && this._checkDestinationValidity()) {
      this._callback.editSubmit(TripEventForm.parseDataToEvent(this._data));
    }
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
        isHasOptions: event.options.length,
        isHasPictures: event.destination.pictures.length,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isHasOptions;
    delete data.isHasPictures;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  _eventTypeListClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'LABEL') {
      const selectedType = evt.target.previousElementSibling.value;
      this.updateData({
        type: selectedType,
        options: [],
      }, false);
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const selectedDestinationName = evt.target.value;

    if (this._checkDestinationValidity()) {
      const destinationInfo = this._destinations.find((destination) => destination.name === selectedDestinationName);
      const description = destinationInfo.description;
      const pictures = destinationInfo.pictures;
      this.updateData({
        destination: {
          name: selectedDestinationName,
          description: description,
          pictures: pictures,
        },
      }, false);
    }
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
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);

    this.getElement().querySelector('#event-end-time-1').addEventListener('input', this._eventEndTimeInputHandler);
    this.getElement().querySelector('#event-start-time-1').addEventListener('input', this._eventStartTimeInputHandler);

    if (this.getElement().querySelector('.event__section--offers') !== null) {
      this.getElement().querySelector('.event__section--offers').addEventListener('change', this._offersClickHandler);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (this._checkPriceValidity()) {
      // Все нечисловые символы удаляются при сохранении
      this.updateData({
        basePrice: Number(evt.target.value.replace(/[^\d]/g, '')),
      }, true);
    }
  }

  reset(event, justUpdating) {
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

    this._setDatepickerDateFrom();
  }

  _eventEndTimeInputHandler() {
    this._setDatepickerDateFrom();
  }

  _eventStartTimeInputHandler() {
    this._setDatepickerDateTo();
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

  _checkPriceValidity() {
    const priceInputElement = this.getElement().querySelector('.event__input--price');
    priceInputElement.setCustomValidity('');
    if (priceInputElement.value > 0) {
      priceInputElement.setCustomValidity('');
      priceInputElement.reportValidity();
      return true;
    } else {
      priceInputElement.setCustomValidity('Стоимость должна быть целым положительным числом.');
      priceInputElement.reportValidity();
      return false;
    }
  }

  _checkDestinationValidity() {
    // Проверка на наличие города в списке назначений
    const destinationInputElement = this.getElement().querySelector('.event__input--destination');
    const selectedDestinationName = destinationInputElement.value;
    const isInDestinations = this._destinations.some((destination) => destination.name === selectedDestinationName);
    destinationInputElement.setCustomValidity('');
    if (isInDestinations) {
      destinationInputElement.setCustomValidity('');
      destinationInputElement.reportValidity();
      return true;
    } else {
      destinationInputElement.setCustomValidity('Пункт назначения не сооотвествует ни одному из указанным в списке');
      destinationInputElement.reportValidity();
      return false;
    }
  }

  _offersClickHandler(evt) {
    const targetOffer = this._offers.find((offer) => offer.type === this._data.type);
    const offerTitle = evt.target.nextElementSibling.querySelector('.event__offer-title').textContent;
    const selectedOffer = targetOffer.offers.find((offer) => offer.title === offerTitle);

    if (evt.target.checked) {
      this._data.options.push(selectedOffer);
    } else {
      const selectedOfferIndex = this._data.options.findIndex((option) => option.title === selectedOffer.title);

      this._data.options = [
        ...this._data.options.slice(0, selectedOfferIndex),
        ...this._data.options.slice(selectedOfferIndex + 1),
      ];
    }
  }
}
