import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSiteFilterTemplate } from './view/site-filter.js';
import { createSiteSortingTemplate } from './view/site-sorting.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripItemTemplate, createTripListTemplate } from './view/trip-events-list.js';
import { createAddTripItemTemplate } from './view/add-trip-item.js';
import { createEditTripItemTemplate } from './view/edit-trip-item.js';

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
render(siteTripEventsList, createTripItemTemplate(), 'beforeend');
render(siteTripEventsList, createTripItemTemplate(), 'beforeend');
render(siteTripEventsList, createTripItemTemplate(), 'beforeend');
render(siteTripEventsList, createAddTripItemTemplate(), 'beforeend');
render(siteTripEventsList, createEditTripItemTemplate(), 'afterbegin');
