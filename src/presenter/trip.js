import { RenderPosition, render, remove } from '../utils/render.js';
import SiteEventsListView from '../view/trip-events-list';
import TripInfoView from '../view/trip-info';
import SiteSortingView from '../view/site-sorting';
import NoEventView from '../view/no-events';
import EventPresenter from './event.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION, FILTER_TYPE } from '../utils/const.js';
import { sortDurationUp, sortPriceUp } from '../utils/event.js';
import { filter } from '../utils/filter.js';
import EventNewPresenter from './event-new.js';
import LoadingView from '../view/loading.js';

import { generateEvent, generateEvents, BACKEND_OFFERS, BACKEND_DESTINATIONS } from '../mock/event.js';

import AddNewEventView from '../view/site-add-new-event.js';


export default class Trip {
  constructor(siteTripMainElement, tripEventsElement, eventsModel, filterModel, api) {
    this._eventsModel = eventsModel;
    this._siteTripMainComponent = siteTripMainElement;
    this._tripEventsComponent = tripEventsElement;
    this._siteNavigationComponent = this._siteTripMainComponent.querySelector('.trip-controls__navigation');
    this._filterModel = filterModel;
    this._tripInfoComponent = null;
    this._tripSortingComponent = null;
    this._eventsListComponent = new SiteEventsListView();
    this._addNewEventButtonComponent = new AddNewEventView();

    // this._backendOffers = backendOffers;
    this._backendDestinations = [];
    // this._backendOffers = backendOffers;
    // this._backendDestinations = backendDestinations;

    this._eventPresenter = new Map();
    this._filterType = FILTER_TYPE.EVERYTHING;
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._noEventsComponent = null;
    this._isLoading = true;
    this._api = api;

    this._loadingComponent  = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._EventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._handleViewAction, BACKEND_DESTINATIONS);

    this.createEvent = this.createEvent.bind(this);
    this.isHidden = false;
  }

  init() {
    this.isHidden = false;
    this._backendDestinations = this._eventsModel.getDestinations();
    console.log(this._backendDestinations);
    this._renderSort();
    this._renderAddNewEvent();
    render(this._tripEventsComponent, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderEvents();
  }

  destroy() {
    this._clearAllEvents(({resetSortType: true}));

    remove(this._eventsListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this.isHidden = true;
  }

  _renderInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getEvents());
    render(this._siteTripMainComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._tripSortingComponent !== null) {
      this._tripSortingComponent = null;
    }

    this._tripSortingComponent = new SiteSortingView(this._currentSortType);
    this._tripSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsComponent, this._tripSortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAddNewEvent() {
    render(this._siteTripMainComponent, this._addNewEventButtonComponent, RenderPosition.BEFOREEND);
    this._addNewEventButtonComponent.setAddNewButtonClickHabdler(this.createEvent);
  }

  _renderEvent(event) {
    // const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange, this._backendDestinations, BACKEND_OFFERS);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _renderEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderNoEvents();
    } else {
      this._getEvents().forEach((event) => this._renderEvent(event));
    }
  }

  _renderNoEvents() {
    // Отрисовка заглушки на странице
    this._noEventsComponent = new NoEventView(this._filterType);
    render(this._eventsListComponent, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    this._EventNewPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case USER_ACTION.UPDATE_EVENT:
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        });
        break;
      case USER_ACTION.ADD_EVENT:
        // this._eventsModel.addEvent(updateType, update);
        this._api.addEvent(update).then((response) => {
          this._eventsModel.addEvent(updateType, response);
        });
        break;
      case USER_ACTION.DELETE_EVENT:
        // this._eventsModel.deleteEvent(updateType, update);
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch(updateType) {
      case UPDATE_TYPE.PATCH:
        // Обновиление части события
        this._eventPresenter.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        // Обновление списка
        this._clearAllEvents();
        this._renderEvents();
        break;
      case UPDATE_TYPE.MAJOR:
        // Обновление всей страницы
        this._clearAllEvents({resetSortType: true});
        if (this._getEvents().length > 0) {
          this._renderSort();
        }
        this._renderEvents();
        break;
      case UPDATE_TYPE.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEvents();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    // - Очищаем список
    this._clearAllEvents();
    // - Рендерим список заново
    this._renderEvents();
  }

  // Model
  _getEvents() {
    this._filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[this._filterType](events);

    switch (this._currentSortType) {
      case SORT_TYPE.TIME:
        return filteredEvents.slice().sort((eventA, eventB) => sortDurationUp(eventA, eventB));

      case SORT_TYPE.PRICE:
        return filteredEvents.slice().sort((eventA, eventB) => sortPriceUp(eventA, eventB));
    }

    return filteredEvents;
  }

  _clearAllEvents({resetSortType = false} = {}) {
    this._EventNewPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();


    if(this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    if (resetSortType) {
      remove(this._tripSortingComponent);
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  createEvent() {
    if (this.isHidden) {
      this.init();
    }

    this._currentSortType = SORT_TYPE.DEFAULT;
    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this._EventNewPresenter.init();
  }

  _renderLoading() {
    render(this._eventsListComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }
}
