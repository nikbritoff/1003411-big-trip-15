import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, type} = filter;
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

const createSiteFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
// const createSiteFilterTemplate = () => (
//   `<form class="trip-filters" action="#" method="get">
//     <div class="trip-filters__filter">
//       <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
//       <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
//     </div>

//     <div class="trip-filters__filter">
//       <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
//       <label class="trip-filters__filter-label" for="filter-future">Future</label>
//     </div>

//     <div class="trip-filters__filter">
//       <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
//       <label class="trip-filters__filter-label" for="filter-past">Past</label>
//     </div>

//     <button class="visually-hidden" type="submit">Accept filter</button>
//   </form>`
// );

export default class SiteFilter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
