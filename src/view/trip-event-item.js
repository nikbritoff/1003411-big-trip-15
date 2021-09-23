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
        offers +=
      `<li class="event__offer">
        <span class="event__offer-title">${option.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${option.price}</span>
      </li>`;
      });
    }

    return `<ul class="event__selected-offers">${offers}</ul>`;
  };

  const setEventFavoriteStatus = () => isFavorite ? 'event__favorite-btn--active' : '';

  const getEventDuration = (start, end) => {
    start = dayjs(start);
    end = dayjs(end);
    const eventDuration = dayjs.duration(end.diff(start));

    const days = eventDuration.days() > 0 ? `${eventDuration.format('DD')}D ` : '';
    const hours = `${String(eventDuration.hours()).padStart(2, '0')}H `;
    const minutes = `${String(eventDuration.minutes()).padStart(2, '0')}M`;

    return `${days}${hours}${minutes}`;
  };

  const getShortRenderTime = (date) => {
    const hour = String(dayjs(date).hour());
    const minute = String(dayjs(date).minute());

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
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
      &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
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

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }


  getTemplate() {
    return createTripItemTemplate(this._data);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn ').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
