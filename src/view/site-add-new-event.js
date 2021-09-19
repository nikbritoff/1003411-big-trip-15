import AbstractView from './abstract';

const createAddNewButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class AddNewEvent extends AbstractView {
  constructor() {
    super();

    this._addNewButtonClickHandler = this._addNewButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createAddNewButtonTemplate();
  }

  _addNewButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  setAddNewButtonClickHabdler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener('click', this._addNewButtonClickHandler);
  }
}