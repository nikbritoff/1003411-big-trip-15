import { RenderPosition, render } from '../utils/render.js';
import SiteFilterView from '../view/site-filter';
import SiteMenuView from '../view/site-menu';
import SiteEventsListView from '../view/trip-events-list';
import TripInfoView from '../view/trip-info';
import SiteSortingView from '../view/site-sorting';
import NoEventView from '../view/no-events';
import EventPresenter from './event.js';
import { updateArrayElement } from '../utils/common.js';

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
    this._handleEventeChange = this._handleEventeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    // Создание копии массива получаемых данных
    this._events = events.slice();

    // Отрисовка компонентов на странице
    render(this._siteNavigationComponent, this._siteMenuComponent, RenderPosition.BEFOREEND);
    render(this._siteFiltersComponent, this._siteFilterComponent, RenderPosition.BEFOREEND);
    render(this._tripEventsComponent, new SiteSortingView(), RenderPosition.BEFOREEND);

    render(this._tripEventsComponent, this._eventsListComponent, RenderPosition.BEFOREEND);
    this._renderInfo();
    this._renderEvents();
  }

  _renderInfo() {
    this._tripInfoComponent = new TripInfoView(this._events);
    render(this._siteTripMainComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
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
    this._eventPresenter.get(updateEvent.id).init(updateEvent);
  }
}
