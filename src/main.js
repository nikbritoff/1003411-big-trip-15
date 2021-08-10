import SiteMenuView from './view/site-menu.js';
import SiteFilterView from './view/site-filter.js';
import { createSiteSortingTemplate } from './view/site-sorting.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripItemTemplate, createTripListTemplate } from './view/trip-events-list.js';
import { createAddTripEventTemplate, createEditTripEventTemplate } from './view/trip-event-form';
import { generateEvents } from './mock/event.js';
import { renderTemplate, RenderPosition, renderElement } from './utils.js';


const TRIP_EVENTS_AMOUNT = 25;

const siteTripMainElement = document.querySelector('.trip-main');
const siteMainElementControls = siteTripMainElement.querySelector('.trip-controls');
const siteMainElementNavigation = siteMainElementControls.querySelector('.trip-controls__navigation');
const siteMainElementFilters = siteMainElementControls.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEvents = siteMainElement.querySelector('.trip-events');

// Отрисовка хэдера
renderTemplate(siteTripMainElement, createTripInfoTemplate(), 'afterbegin');
renderElement(siteMainElementNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElementFilters, new SiteFilterView().getElement(), RenderPosition.BEFOREEND);

// Отрисовка main
renderTemplate(siteTripEvents, createSiteSortingTemplate(), 'beforeend');
renderTemplate(siteTripEvents, createTripListTemplate(), 'beforeend');
const siteTripEventsList = siteTripEvents.querySelector('.trip-events__list');

const data = generateEvents(TRIP_EVENTS_AMOUNT);

data.forEach((event,index) => {
  if (index === 0) {
    renderTemplate(siteTripEventsList, createEditTripEventTemplate(event), 'afterbegin');
  }
  if (index === data.length - 1) {
    renderTemplate(siteTripEventsList, createAddTripEventTemplate(event), 'beforeend');
  }
  if (index !== 0 && index !== data.length - 1) {
    renderTemplate(siteTripEventsList, createTripItemTemplate(event), 'beforeend');
  }
});
