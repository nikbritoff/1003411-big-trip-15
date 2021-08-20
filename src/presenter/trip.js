import { RenderPosition, render } from '../utils/render.js';
import SiteFilterView from '../view/site-filter';
import SiteMenuView from '../view/site-menu';
import SiteEventsListView from '../view/trip-events-list';
import TripInfoView from '../view/trip-info';
import SiteSortingView from '../view/site-sorting';
import NoEventView from '../view/no-events';
import EventPresenter from './event.js';
import { updateArrayElement } from '../utils/common.js';
import { SORT_TYPE } from '../utils/const.js';
import { sortDurationUp, sortPriceUp } from '../utils/event.js';

export default class Trip {
  constructor(siteTripMainElement, tripEventsElement) {
    this._siteTripMainComponent = siteTripMainElement;
    this._tripEventsComponent = tripEventsElement;
    this._siteNavigationComponent = this._siteTripMainComponent.querySelector('.trip-controls__navigation');
    this._siteFiltersComponent = this._siteTripMainComponent.querySelector('.trip-controls__filters');
    this._tripInfoComponent = null;
    this._siteMenuComponent = new SiteMenuView();
    this._tripSortingComponent = new SiteSortingView();
    this._siteFilterComponent = new SiteFilterView();

    this._eventsListComponent = new SiteEventsListView();
    this._noEventsComponent = new NoEventView();

    this._eventPresenter = new Map();
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._handleEventeChange = this._handleEventeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    // Создание копии массива получаемых данных
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    // Отрисовка компонентов на странице
    render(this._siteNavigationComponent, this._siteMenuComponent, RenderPosition.BEFOREEND);
    render(this._siteFiltersComponent, this._siteFilterComponent, RenderPosition.BEFOREEND);
    this._renderSort();
    //
    // console.log(this._eventsListComponent )
    render(this._tripEventsComponent, this._eventsListComponent, RenderPosition.BEFOREEND);
    this._renderInfo();
    this._renderEvents();
  }

  _renderInfo() {
    this._tripInfoComponent = new TripInfoView(this._events);
    render(this._siteTripMainComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._tripEventsComponent, this._tripSortingComponent, RenderPosition.BEFOREEND);
    this._tripSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    // this._tripSortingComponent.setSortTypeChangeHandler();
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleEventeChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _renderEvents() {
    if (this._events.length === 0) {
      this._renderNoEvents();
    } else {
      this._events.forEach((event) => this._renderEvent(event));
    }
  }

  _clearEvents() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _renderNoEvents() {
    // Отрисовка заглушки на странице
    render(this._eventsListComponent, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleEventeChange(updateEvent) {
    this._events = updateArrayElement(this._events, updateEvent);
    this._sourcedEvents = updateArrayElement(this._sourcedEvents, updateEvent);
    this._eventPresenter.get(updateEvent.id).init(updateEvent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SORT_TYPE.PRICE:
        this._events.sort((eventA, eventB) => sortPriceUp(eventA, eventB));
        break;
      case SORT_TYPE.TIME:
        this._events.sort((eventA, eventB) => sortDurationUp(eventA, eventB));
        break;
      default:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);

    // - Очищаем список
    this._clearEvents();
    // - Рендерим список заново
    this._renderEvents();
  }
}
