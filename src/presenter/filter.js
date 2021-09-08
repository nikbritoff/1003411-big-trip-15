import SiteFilterWiew from '../view/site-filter.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { FILTER_TYPE, UPDATE_TYPE } from '../utils/const.js';

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new SiteFilterWiew(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FILTER_TYPE.EVERYTHING,
        name: 'EVERYTHING',
      },
      {
        type: FILTER_TYPE.FUTURE,
        name: 'FUTURE',
      },
      {
        type: FILTER_TYPE.PAST,
        name: 'PAST',
      },
    ];
  }
}
