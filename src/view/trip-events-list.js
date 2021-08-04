const createTripListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

const createTripItemTemplate = (data) => {
  const {type, destination, options, basePrice, isFavorite, dateFrom, dateTo} = data;

  const createTripItemOffersList = () => {
    let list = '';
    let offers = '';
    if (options.length > 0) {
      options.forEach((option) => {
        offers = `${offers}
        <li class="event__offer">
          <span class="event__offer-title">${option.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${option.price}</span>
        </li>`;
      });
    }

    list = `<ul class="event__selected-offers">${offers}</ul>`;

    return list;
  };

  const getFullEventPrice = () => {
    const result = options.reduce((sum, current) => sum + current.price, 0) + basePrice;
    return result;
  };

  const setEventFavoriteStatus = () => isFavorite ? 'event__favorite-btn--active' : '';

  const getEventDuration = () => dateTo.diff(dateFrom, 'minute');

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFrom.format('YYYY-MM-DD')}">${dateFrom.format('MMM DD')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom.format('YYYY-MM-DD')}T${dateFrom.format('HH:mm')}">${dateFrom.format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo.format('YYYY-MM-DD')}T${dateTo.format('HH:mm')}">${dateTo.format('HH:mm')}</time>
      </p>
      <p class="event__duration">${getEventDuration()}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${getFullEventPrice()}</span>
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

export {createTripListTemplate, createTripItemTemplate};
