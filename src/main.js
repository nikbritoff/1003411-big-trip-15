import { generateEvents } from './mock/event.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MENU_ITEM } from './utils/const.js';
import SiteMenuView from './view/site-menu.js';
import { RenderPosition, render, remove } from './utils/render.js';
import StatisticsView from './view/statistics.js';

const TRIP_EVENTS_AMOUNT = 5;
const data = generateEvents(TRIP_EVENTS_AMOUNT);

const pageBodyContainerElement = document.querySelector('main .page-body__container');
const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();
eventsModel.setEvents(data);
const siteMenuComponent = new SiteMenuView();

render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);

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

  if (tripPresenter.isHidden === true) {
    tripPresenter.init();
  }
  // Сюда передать коллбэк презентера трипа по созданию нового ивента
  tripPresenter.crateEvent();
});

let statiscticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MENU_ITEM.EVENTS:
      siteMenuComponent.setActiveMenuItem(menuItem);
      // Показать все точки маршрута
      tripPresenter.init();
      // Скрыть статистику
      remove(statiscticsComponent);

      break;
    case MENU_ITEM.STATISTICS:
      siteMenuComponent.setActiveMenuItem(menuItem);
      // Скрыть точки маршрута
      tripPresenter.destroy();
      // Показать статистику
      statiscticsComponent = new StatisticsView(eventsModel);
      render(pageBodyContainerElement, statiscticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
