import SiteMenuView from './view/site-menu.js';
import SiteFilterView from './view/site-filter.js';
import SiteSortingView from './view/site-sorting.js';
import TripInfoView from './view/trip-info.js';
import SiteEventsListView from './view/trip-events-list.js';
import TripEventItemView from './view/trip-event-item.js';
import TripEventFormView from './view/trip-event-form';
import { generateEvents } from './mock/event.js';
import { RenderPosition, renderElement } from './utils.js';

const TRIP_EVENTS_AMOUNT = 25;
const ADD_FORM_BUTTON_RESET_TEXT = 'Cancel';
const EDIT_FORM_BUTTON_RESET_TEXT ='Delete';

const data = generateEvents(TRIP_EVENTS_AMOUNT);

const siteTripMainElement = document.querySelector('.trip-main');
const siteMainElementControls = siteTripMainElement.querySelector('.trip-controls');
const siteMainElementNavigation = siteMainElementControls.querySelector('.trip-controls__navigation');
const siteMainElementFilters = siteMainElementControls.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEvents = siteMainElement.querySelector('.trip-events');

// Отрисовка хэдера
renderElement(siteTripMainElement, new TripInfoView(data).getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteMainElementNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElementFilters, new SiteFilterView().getElement(), RenderPosition.BEFOREEND);

// Отрисовка main
renderElement(siteTripEvents, new SiteSortingView().getElement(), RenderPosition.BEFOREEND);
const eventsListComponent = new SiteEventsListView();
renderElement(siteTripEvents, eventsListComponent.getElement(), RenderPosition.BEFOREEND);

data.forEach((event,index) => {
  if (index === 0) {
    renderElement(eventsListComponent.getElement(), new TripEventFormView(event, EDIT_FORM_BUTTON_RESET_TEXT).getElement(), RenderPosition.BEFOREEND);
    return;
  }
  if (index === data.length - 1) {
    renderElement(eventsListComponent.getElement(), new TripEventFormView(event, ADD_FORM_BUTTON_RESET_TEXT).getElement(), RenderPosition.BEFOREEND);
    return;
  }

  renderElement(eventsListComponent.getElement(), new TripEventItemView(event).getElement(), RenderPosition.BEFOREEND);
});
