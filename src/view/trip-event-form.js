import dayjs from 'dayjs';
import Smart from './smart';
import { EVENT_DESTINATION_NAMES, OPTION_TITLES } from '../mock/event';
import { EVENT_FORM_MODE } from '../utils/const.js';

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

const createEventFormTemplate = (data, resetButtonText) => {
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

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        ${setDestinationList(EVENT_DESTINATION_NAMES)}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonText}</button>
      ${data.isEditMode() ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
    </header>
    <section class="event__details">
      ${isHasOptions() ?  setOptions(options, type) : ''}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
        <p class="event__destination-description">${destination.description}</p>
          ${isHasPictures() ? setPictures(options, type) : ''}
      </section>
    </section>
  </form>
</li>`;
};

export default class TripEventForm extends Smart{
  constructor(event, mode) {
    super();
    this._resetButtonText = mode;
    this._data = TripEventForm.parseEventToData(event, this._resetButtonText);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._eventTypeListClickHandler = this._eventTypeListClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._destinationInputHandler = this._destinationInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._resetButtonText);
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editSubmit(TripEventForm.parseDataToEvent(this._data));
  }

  setSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().addEventListener('submit', this._editSubmitHandler);
  }

  // VIEW 6

  static parseEventToData(event, mode) {
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
        isEditMode: function() {
          return mode === EVENT_FORM_MODE.edit;
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
    const selectedType = evt.target.previousElementSibling.value;
    const newOptions = OPTION_TITLES[selectedType] !== undefined ? OPTION_TITLES[selectedType].options : [];
    this.updateData({
      type: selectedType,
      options: newOptions,
    }, false);
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

  reset(event) {
    this.updateData(
      TripEventForm.parseDataToEvent(event),
    );
  }
}
