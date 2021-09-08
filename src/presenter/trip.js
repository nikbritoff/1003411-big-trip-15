import { RenderPosition, render, remove } from '../utils/render.js';
import SiteMenuView from '../view/site-menu';
import SiteEventsListView from '../view/trip-events-list';
import TripInfoView from '../view/trip-info';
import SiteSortingView from '../view/site-sorting';
import NoEventView from '../view/no-events';
import EventPresenter from './event.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION, FILTER_TYPE } from '../utils/const.js';
import { sortDurationUp, sortPriceUp } from '../utils/event.js';
import { filter } from '../utils/filter.js';
import EventNewPresenter from './event-new.js';


export default class Trip {
  constructor(siteTripMainElement, tripEventsElement, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._siteTripMainComponent = siteTripMainElement;
    this._tripEventsComponent = tripEventsElement;
    this._siteNavigationComponent = this._siteTripMainComponent.querySelector('.trip-controls__navigation');
    this._filterModel = filterModel;
    this._tripInfoComponent = null;
    this._siteMenuComponent = new SiteMenuView();
    this._tripSortingComponent = null;
    this._eventsListComponent = new SiteEventsListView();

    //

    this._eventPresenter = new Map();
    this._filterType = FILTER_TYPE.EVERYTHING;
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._noEventsComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._EventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._handleViewAction);
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this.crateEvent = this.crateEvent.bind(this);
  }

  init() {
    // Отрисовка компонентов на странице
    render(this._siteNavigationComponent, this._siteMenuComponent, RenderPosition.BEFOREEND);
    this._renderSort();
    render(this._tripEventsComponent, this._eventsListComponent, RenderPosition.BEFOREEND);
    this._renderInfo();
    this._renderEvents();
  }

  _renderInfo() {
    if (this._tripInfoComponent !== null) {
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

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _renderEvents() {
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
    // console.log('biew action', this._eventsModel);
    switch (actionType) {
      case USER_ACTION.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case USER_ACTION.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case USER_ACTION.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
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
        this._clearAllEvents({resetSortType: true, resetTripInfo: true});
        this._renderInfo();
        this._renderSort();
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

  _clearAllEvents({resetSortType = false, resetTripInfo = false} = {}) {
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

    if (resetTripInfo) {
      remove(this._tripInfoComponent);
    }
  }

  crateEvent() {
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this._EventNewPresenter.init();
    // console.log('create ', this._EventNewPresenter);
  }
}
