import TripEventItemView from '../view/trip-event-item.js';
import TripEventFormView from '../view/trip-event-form.js';
import { EVENT_FORM_MODE, MODE } from '../utils/const.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { USER_ACTION, UPDATE_TYPE } from '../utils/const.js';
import { getUpdateType } from '../utils/event.js';

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
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
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
    this._eventFormComponent.setEditCloseCLickHandler(this._handleCloseEditClick);
    this._eventFormComponent.setDeleteClickHandler(this._deleteClickHandler);


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
      USER_ACTION.UPDATE_EVENT,
      UPDATE_TYPE.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ));
  }

  _changeEventPrice() {
    // this._event.basePrice = Number(this._eventFormComponent.getElement().querySelector('.event__input--price').value);
    this._event.basePrice = Number(this._eventFormComponent.getElement().querySelector('.event__input--price').value);
  }

  _changeEventDate() {
    this._event.dateFrom = this._eventFormComponent.getElement().querySelector('#event-start-time-1').value;
    this._event.dateTo = this._eventFormComponent.getElement().querySelector('#event-end-time-1').value;
  }

  // _handleFormSubmit(event) {
  //   this._changeData(event);
  //   document.removeEventListener('keydown', this._escKeyDownHandler);
  //   this._replaceFormToItem();
  // }
  _handleFormSubmit(update) {
    // Здесь вызывает метод _handleViewAction
    const isMajorUpdate =
      this._event.dateFrom !== update.dateFrom ||
      this._event.dateTo !== update.dateTo ||
      this._event.basePrice !== update.basePrice ||
      this._event.destination.name !== update.destination.name;

    const isMinorUpdate = this._event.type !== update.type;

    console.log(isMinorUpdate);

    // this._changeData(event);
    this._changeData(
      USER_ACTION.UPDATE_EVENT,
      // isMinorUpdate ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH,
      getUpdateType(isMinorUpdate, isMajorUpdate),
      update,
    );
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._replaceFormToItem();
  }

  _deleteClickHandler(event) {
    this._changeData(
      USER_ACTION.DELETE_EVENT,
      UPDATE_TYPE.MAJOR,
      event,
    );
  }
}
