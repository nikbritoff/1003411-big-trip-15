import TripEventItemView from '../view/trip-event-item.js';
import TripEventFormView from '../view/trip-event-form.js';
import { EVENT_FORM_MODE, MODE } from '../utils/const.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';

export default class Event {
  constructor(eventsListElement, changeData, changeMode) {
    this._eventsListComponent = eventsListElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventItemComponent = null;
    this._eventFormComponent = null;

    this._mode = MODE.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
  }

  init(event) {
    this._event = event;

    // Переменные для запоминания предыдущие компоненты. Если они null, то есть не создавались, рендерим как раньше. Если они != null, то они уже создавались
    const prevItemComponent = this._eventItemComponent;
    const prevFormComponent = this._eventFormComponent;

    this._eventItemComponent = new TripEventItemView(this._event);
    this._eventFormComponent = new TripEventFormView(this._event, EVENT_FORM_MODE.edit);

    this._eventItemComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventItemComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    // this._eventFormComponent.setEditCloseCLickHandler(this._handleCloseEditClick);


    // Проверка создавались ли компоненты ранее.
    if (prevItemComponent === null || prevFormComponent === null) {
      render(this._eventsListComponent, this._eventItemComponent, RenderPosition.BEFOREEND);

      return;
    }

    if (this._mode === MODE.DEFAULT) {
      replace(this._eventItemComponent, prevItemComponent);
    }

    if (this._mode === MODE.EDITING) {
      replace(this._eventFormComponent, prevFormComponent);
    }

    remove(prevItemComponent);
    remove(prevFormComponent);
  }

  resetView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceFormToItem();
    }
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventFormComponent);
  }

  _replaceItemToForm() {
    replace(this._eventFormComponent, this._eventItemComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    // this._eventFormComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', this. _handleCloseEditClick);
    this._changeMode();
    this._mode = MODE.EDITING;
  }

  _replaceFormToItem() {
    replace(this._eventItemComponent, this._eventFormComponent);
    this._mode = MODE.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      document.removeEventListener('keydown', this._escKeyDownHandler);
      this._replaceFormToItem();
    }
  }

  _handleEditClick() {
    this._replaceItemToForm();
  }

  _handleCloseEditClick() {
    this._replaceFormToItem();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ));
  }

  _changeEventPrice() {
    this._event.basePrice = Number(this._eventFormComponent.getElement().querySelector('.event__input--price').value);
  }

  _changeEventDate() {
    this._event.dateFrom = this._eventFormComponent.getElement().querySelector('#event-start-time-1').value;
    this._event.dateTo = this._eventFormComponent.getElement().querySelector('#event-end-time-1').value;
  }

  _handleFormSubmit(event) {
    this._changeData(event);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._replaceFormToItem();
  }
}
