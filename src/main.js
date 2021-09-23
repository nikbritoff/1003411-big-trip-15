import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import TripInfoPresenter from './presenter/trip-info.js';
import FilterPresenter from './presenter/filter.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import AddNewEventView from './view/site-add-new-event.js';
import { MENU_ITEM } from './const/const.js';
import { RenderPosition, render, remove } from './utils/render.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';


const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic 8k6936776av3fr5554';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pageBodyContainerElement = document.querySelector('main .page-body__container');
const siteTripMainElement = document.querySelector('.trip-main');
const siteTripEvents = document.querySelector('.trip-events');
// Model
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

// Отрисовка хэдера
const filterPresenter = new FilterPresenter(
  siteTripMainElement.querySelector('.trip-controls__filters'),
  filterModel);

filterPresenter.init();

let statiscticsComponent = null;
const tripPresenter = new TripPresenter(siteTripMainElement, siteTripEvents, eventsModel, filterModel, apiWithProvider, statiscticsComponent);

const siteMenuComponent = new SiteMenuView();

const handleAddNewEventButtonClick = () => {
  siteMenuComponent.setActiveMenuItem(MENU_ITEM.EVENTS);
  if (!isOnline()) {
    toast('You can\'t create new trip event offline');
    return;
  }
  tripPresenter.createEvent();
  remove(statiscticsComponent);
};

const addNewEventButtonComponent = new AddNewEventView();
render(siteTripMainElement, addNewEventButtonComponent, RenderPosition.BEFOREEND);
addNewEventButtonComponent.setAddNewButtonClickHandler(handleAddNewEventButtonClick);

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

apiWithProvider.getData()
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
