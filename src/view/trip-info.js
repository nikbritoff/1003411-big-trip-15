import dayjs from 'dayjs';

const setRouteName = (data) => {
  let route = '';
  if (data.length <= 3) {
    data.forEach((point, index) => {
      if (index === 0) {
        route += `${point.destination.name}`;
      } else {
        route += ` &mdash; ${point.destination.name}`;
      }
    });
  } else {
    route += `${data[0].destination.name} —... — ${data[data.length - 1].destination.name}`;
  }

  return route;
};

const setRouteDates = (data) => {
  const dates = `${dayjs(data[0].dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(data[data.length - 1].dateTo).format('DD MMM')}`;
  return dates;
};

const setRouteTotalPrice = (data) => data.reduce((sum, point) => sum + point.basePrice, 0);

const createTripInfoTemplate = (data) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${setRouteName(data)}</h1>

      <p class="trip-info__dates">${setRouteDates(data)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${setRouteTotalPrice(data)}</span>
    </p>
  </section>`
);

export {createTripInfoTemplate};
