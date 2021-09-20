import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MENU_ITEM } from './utils/const.js';
import SiteMenuView from './view/site-menu.js';
import { RenderPosition, render, remove } from './utils/render.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';
import TripInfoPresenter from './presenter/trip-info.js';

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic 8k69hjl853avfr5590';
const api = new Api(END_POINT, AUTHORIZATION);

const pageBodyContainerElement = document.querySelector('main .page-body__container');
const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();

const filterModel = new FilterModel();
// Отрисовка хэдера

const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents, eventsModel, filterModel, api);
// tripPresenter.init();

const filterPresenter = new FilterPresenter(
  siteTripMainElement.querySelector('.trip-controls__filters'),
  filterModel);
filterPresenter.init();

let statiscticsComponent = null;

const siteMenuComponent = new SiteMenuView();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MENU_ITEM.EVENTS:
      // Показать все точки маршрута
      if (tripPresenter.isHidden) {
        tripPresenter.init();
        siteMenuComponent.setActiveMenuItem(menuItem);
        remove(statiscticsComponent);
      }

      break;
    case MENU_ITEM.STATISTICS:
      siteMenuComponent.setActiveMenuItem(menuItem);
      // Скрыть точки маршрута
      tripPresenter.destroy();
      // Показать статистику
      remove(statiscticsComponent);
      statiscticsComponent = new StatisticsView(eventsModel);
      render(pageBodyContainerElement, statiscticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
const tripInfoPresenter = new TripInfoPresenter(siteTripMainElement, eventsModel);
api.getData()
  .then((serverData) => {
    eventsModel.setDestinations(serverData.destinations);
    eventsModel.setOffers(serverData.offers);
    eventsModel.setEvents(null, serverData.events);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    eventsModel.setEvents(null, []);
    eventsModel.setDestinations([]);
    eventsModel.setOffers([]);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  })
  .then(() => {
    tripPresenter.init();
    tripInfoPresenter.init();
  });
