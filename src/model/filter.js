import AbstractObserver from '../utils/abstract-observer';
import { FILTER_TYPE } from '../const/const';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FILTER_TYPE.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

