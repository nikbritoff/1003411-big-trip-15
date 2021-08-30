import { generateEvents } from './mock/event.js';

import TripPresenter from './presenter/trip.js';

import EventsModel from './model/events.js';
const TRIP_EVENTS_AMOUNT = 5;

const data = generateEvents(TRIP_EVENTS_AMOUNT);

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();
eventsModel.setEvents(data);

// Отрисовка хэдера
const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents, eventsModel);
// tripPresenter.init(data);
tripPresenter.init();
