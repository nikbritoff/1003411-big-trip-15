import dayjs from 'dayjs';
import he from 'he';
import  duration  from 'dayjs/plugin/duration';
dayjs.extend(duration);
import AbstractView from './abstract';

const createTripItemTemplate = (event) => {
  const {type, options, destination, basePrice, isFavorite, dateFrom, dateTo} = event;
  const destinationName = destination.name;

  const createTripItemOffersList = () => {
    let offers = '';
    if (options.length > 0) {
      options.forEach((option) => {
        if (option.isChecked) {
          offers +=
        `<li class="event__offer">
          <span class="event__offer-title">${option.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${option.price}</span>
        </li>`;
        }
      });
    }

    return `<ul class="event__selected-offers">${offers}</ul>`;
  };

  const getFullEventPrice = () => {
    const result = options.reduce((sum, current) => sum + current.price, 0) + basePrice;
    return result;
  };

  const setEventFavoriteStatus = () => isFavorite ? 'event__favorite-btn--active' : '';

  const getEventDuration = (start, end) => {
    start = dayjs(start);
    end = dayjs(end);
    const eventDuration = dayjs.duration(end.diff(start));

    let result = '';
    if (eventDuration.days() > 0) {
      const days = `${eventDuration.format('DD')}D `;
      result += days;
    }

    if (eventDuration.hours() > 0) {
      const hours = `${eventDuration.hours()}H `;
      result += hours;
    }

    if (eventDuration.minutes() > 0) {
      const minutes = `${eventDuration.minutes()}M`;
      result += minutes;
    }
    return result;
  };

  const getShortRenderTime = (date) => {
    let hour = dayjs(date).hour();
    let minute = dayjs(date).minute();
    if (hour < 10) {
      hour = `0${hour}`;
    }

    if (minute < 10) {
      minute = `0${minute}`;
    }


    return `${hour}:${minute}`;
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('DD MMM')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${he.encode(destinationName)}</h3>
    <div class="event__schedule">
      <p class="event__time">

      <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDTHH:MM')}">${getShortRenderTime(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDTHH:MM')}">${getShortRenderTime(dateTo)}</time>
      </p>
      <p class="event__duration">${getEventDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${he.encode(String(getFullEventPrice()))}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    ${createTripItemOffersList()}
    <button class="event__favorite-btn ${setEventFavoriteStatus()}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class TripEventItem extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
    // Задается контекст объекта для обработчика событий
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }


  getTemplate() {
    return createTripItemTemplate(this._data);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn ').addEventListener('click', this._favoriteClickHandler);
  }
}
