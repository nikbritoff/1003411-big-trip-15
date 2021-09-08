import { generateEvents } from './mock/event.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';

const TRIP_EVENTS_AMOUNT = 1;

const data = generateEvents(TRIP_EVENTS_AMOUNT);

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();
eventsModel.setEvents(data);

const filterModel = new FilterModel();

// Отрисовка хэдера
const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents, eventsModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(
  siteTripMainElement.querySelector('.trip-controls__filters'),
  filterModel);
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn ').addEventListener('click', (evt) => {
  evt.preventDefault();
  // Сюда передать коллбэк презентера трипа по созданию нового ивента
  tripPresenter.crateEvent();
});
