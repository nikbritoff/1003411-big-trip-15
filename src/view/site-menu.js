import AbstractView from './abstract.js';
// import { MENU_ITEM } from '../const/const.js';
import { MENU_ITEM } from '../const/const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MENU_ITEM.EVENTS}"">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item="${MENU_ITEM.STATISTICS}">Stats</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setActiveMenuItem(menuItem) {
    const activeItemElement = this.getElement().querySelector('.trip-tabs__btn--active');
    const checkedItemElement = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);

    activeItemElement.classList.remove('trip-tabs__btn--active');
    checkedItemElement.classList.add('trip-tabs__btn--active');
  }
}

