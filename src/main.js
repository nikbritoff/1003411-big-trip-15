import { generateEvents } from './mock/event.js';

import TripPresenter from './presenter/trip.js';

const TRIP_EVENTS_AMOUNT = 25;

const data = generateEvents(TRIP_EVENTS_AMOUNT);

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');

// Отрисовка хэдера
const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents);
tripPresenter.init(data);

