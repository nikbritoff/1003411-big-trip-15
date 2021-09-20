import TripEventFormView from '../view/trip-event-form.js';
import { remove, render, RenderPosition } from '../utils/render.js';
// import { USER_ACTION, UPDATE_TYPE } from '../const/const.js';
import { EVENT_FORM_MODE, USER_ACTION, UPDATE_TYPE } from '../const/const.js';

export default class EventNew {
  constructor(eventsListElement, changeData, eventsModel) {
    this._eventsListElement = eventsListElement;
    this._changeData = changeData;
    this._eventsModel = eventsModel;
    this._eventEditComponent = null;

    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new TripEventFormView(null, this._eventsModel.getDestinations(), this._eventsModel.getOffers());
    delete this._eventFormMode;
    this._eventEditComponent.setDeleteClickHandler(this._handleCancelClick);
    this._eventEditComponent.setSubmitHandler(this._handleFormSubmit);
    render(this._eventsListElement, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    // handle view action
    this._changeData(
      USER_ACTION.ADD_EVENT,
      UPDATE_TYPE.MAJOR,
      event,
    );
    this._eventFormMode = EVENT_FORM_MODE.edit;
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
