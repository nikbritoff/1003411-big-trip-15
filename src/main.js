import SiteMenuView from './view/site-menu.js';
import SiteFilterView from './view/site-filter.js';
import SiteSortingView from './view/site-sorting.js';
import TripInfoView from './view/trip-info.js';
import SiteEventsListView from './view/trip-events-list.js';
import TripEventItemView from './view/trip-event-item.js';
import TripEventFormView from './view/trip-event-form';
import { generateEvents } from './mock/event.js';
import { RenderPosition, render } from './utils.js';

const TRIP_EVENTS_AMOUNT = 25;

const EVENT_FORM_BUTTON_RESET_TEXT = {
  edit: 'Delete',
  cancel: 'Cancel',
};

// const ADD_FORM_BUTTON_RESET_TEXT = 'Cancel';
// const EDIT_FORM_BUTTON_RESET_TEXT ='Delete';

const data = generateEvents(TRIP_EVENTS_AMOUNT);

const siteTripMainElement = document.querySelector('.trip-main');
const siteMainElementControls = siteTripMainElement.querySelector('.trip-controls');
const siteMainElementNavigation = siteMainElementControls.querySelector('.trip-controls__navigation');
const siteMainElementFilters = siteMainElementControls.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEvents = siteMainElement.querySelector('.trip-events');
const eventsListComponent = new SiteEventsListView();

const renderEvent = (eventListElement, event) => {
  const eventItemComponent = new TripEventItemView(event);
  const eventFormComponent = new TripEventFormView(event, EVENT_FORM_BUTTON_RESET_TEXT.edit);

  const replaceItemToForm = () => {
    eventsListComponent.getElement().replaceChild(eventFormComponent.getElement(), eventItemComponent.getElement());
  };

  const replaceFormToCard = (evt) => {
    evt.preventDefault();
    eventsListComponent.getElement().replaceChild(eventItemComponent.getElement(), eventFormComponent.getElement());
  };

  // 1. Подписываемся на событие клика кнопки редактирования
  eventItemComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => replaceItemToForm());
  // 2. Подписываемся на событие отправки формы редактирования
  eventFormComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => replaceFormToCard(evt));

  render(eventListElement, eventItemComponent.getElement(), RenderPosition.BEFOREEND);


};

// Отрисовка хэдера
render(siteTripMainElement, new TripInfoView(data).getElement(), RenderPosition.AFTERBEGIN);
render(siteMainElementNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElementFilters, new SiteFilterView().getElement(), RenderPosition.BEFOREEND);

// Отрисовка main
render(siteTripEvents, new SiteSortingView().getElement(), RenderPosition.BEFOREEND);
render(siteTripEvents, eventsListComponent.getElement(), RenderPosition.BEFOREEND);

data.forEach((event) => {
  renderEvent(eventsListComponent.getElement(), event);
});
