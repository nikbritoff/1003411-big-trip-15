import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSiteFilterTemplate } from './view/site-filter.js';
import { createSiteSortingTemplate } from './view/site-sorting.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripItemTemplate, createTripListTemplate } from './view/trip-events-list.js';
import { createAddTripEventTemplate, createEditTripEventTemplate } from './view/trip-event-form';
import { generateEvents } from './mock/event.js';

const TRIP_EVENTS_AMOUNT = 25;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripMainElement = document.querySelector('.trip-main');
const siteMainElementControls = siteTripMainElement.querySelector('.trip-controls');
const siteMainElementNavigation = siteMainElementControls.querySelector('.trip-controls__navigation');
const siteMainElementFilters = siteMainElementControls.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const siteTripEvents = siteMainElement.querySelector('.trip-events');

// Отрисовка хэдера
render(siteTripMainElement, createTripInfoTemplate(), 'afterbegin');
render(siteMainElementNavigation, createSiteMenuTemplate(), 'beforeend');
render(siteMainElementFilters, createSiteFilterTemplate(), 'beforeend');

// Отрисовка main
render(siteTripEvents, createSiteSortingTemplate(), 'beforeend');
render(siteTripEvents, createTripListTemplate(), 'beforeend');
const siteTripEventsList = siteTripEvents.querySelector('.trip-events__list');

const data = generateEvents(TRIP_EVENTS_AMOUNT);

data.forEach((event,index) => {
  if (index === 0) {
    render(siteTripEventsList, createEditTripEventTemplate(event), 'afterbegin');
  }
  if (index === data.length - 1) {
    render(siteTripEventsList, createAddTripEventTemplate(event), 'beforeend');
  }
  if (index !== 0 && index !== data.length - 1) {
    render(siteTripEventsList, createTripItemTemplate(event), 'beforeend');
  }
});
