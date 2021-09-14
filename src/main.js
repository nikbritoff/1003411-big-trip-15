import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MENU_ITEM, UPDATE_TYPE } from './utils/const.js';
import SiteMenuView from './view/site-menu.js';
import { RenderPosition, render, remove } from './utils/render.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic 8k69hjl853avfr559';
const api = new Api(END_POINT, AUTHORIZATION);

const pageBodyContainerElement = document.querySelector('main .page-body__container');
const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();

const filterModel = new FilterModel();
// Отрисовка хэдера
const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents, eventsModel, filterModel, api);
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

const siteMenuComponent = new SiteMenuView();

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

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(UPDATE_TYPE.INIT, events);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    eventsModel.setEvents(UPDATE_TYPE.INIT, []);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  });
