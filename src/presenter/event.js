import TripEventItemView from '../view/trip-event-item.js';
import TripEventFormView from '../view/trip-event-form.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { UserAction, UpdateType, Mode, FormState } from '../const/const.js';

export default class Event {
  constructor(eventsListElement, changeData, changeMode, destinations, offers) {
    this._eventsListComponent = eventsListElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventItemComponent = null;
    this._eventFormComponent = null;

    this._offers = offers;
    this._destinations = destinations;

    this._mode = Mode.DEFAULT;

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
    this._eventFormComponent = new TripEventFormView(this._event, this._destinations, this._offers);

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

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItemComponent, prevItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventItemComponent, prevFormComponent);
    }

    remove(prevItemComponent);
    remove(prevFormComponent);
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToItem();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case FormState.SAVING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case FormState.DELETING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case FormState.ABORTING:
        this._eventFormComponent.shake(resetFormState);
        this._eventItemComponent.shake(resetFormState);

    }
  }

  setSaving() {
    this._eventFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  _replaceItemToForm() {
    this._eventFormComponent.setEditCloseCLickHandler(this._handleCloseEditClick);
    replace(this._eventFormComponent, this._eventItemComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._eventFormComponent.restoreHandlers();
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToItem() {
    replace(this._eventItemComponent, this._eventFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._eventFormComponent.removeHandlers();
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event, false);
      document.removeEventListener('keydown', this._escKeyDownHandler);
      this._replaceFormToItem();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit event offline');
      return;
    }

    this._replaceItemToForm();
  }

  _handleCloseEditClick() {
    this._replaceFormToItem();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
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

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save event offline');
      return;
    }

    // Здесь вызывается метод _handleViewAction
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MAJOR,
      update,
    );
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _deleteClickHandler(event) {
    if (!isOnline()) {
      toast('You can\'t delete event offline');
      return;
    }

    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MAJOR,
      event,
    );
  }
}
