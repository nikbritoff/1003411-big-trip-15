import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MENU_ITEM, UPDATE_TYPE } from './utils/const.js';
import SiteMenuView from './view/site-menu.js';
import { RenderPosition, render, remove } from './utils/render.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';
import TripInfoPresenter from './presenter/trip-info.js';

import { generateEvent, generateEvents, BACKEND_OFFERS, BACKEND_DESTINATIONS } from './mock/event.js';
// const data = generateEvents(10);
// console.log(data);

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic 8k69hjl853avfr5590';
const api = new Api(END_POINT, AUTHORIZATION);
// Test
api.getDestinations()
  .then((destinations) => {
    const backendDestinations = destinations;
    console.log(backendDestinations);
  })
  .catch(() => {
    const backendDestinations = [];
  });

api.getOptions()
  .then((offers) => {
    // backendOffers = offers;
    // const backendOffers = offers;
  })
  .catch(() => {
    const backendOffers = [];
  });

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

api.getEvents()
  .then((events) => {
    // console.log(events);
    eventsModel.setEvents(UPDATE_TYPE.INIT, events);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    eventsModel.setEvents(UPDATE_TYPE.INIT, []);
    render(siteTripMainElement.querySelector('.trip-controls__navigation'), siteMenuComponent, RenderPosition.BEFOREEND);
  });

const tripInfoPresenter = new TripInfoPresenter(siteTripMainElement, eventsModel);
tripInfoPresenter.init();




// console.log(backendDestinations);
