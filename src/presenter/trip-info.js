import TripInfoView from '../view/trip-info';
import { RenderPosition, render, remove } from '../utils/render.js';

export default class TripInfo {
  constructor(siteTripMainElement, eventsModel) {
    this._eventsModel = eventsModel;
    this._siteTripMainComponent = siteTripMainElement;
    this._tripInfoComponent  = null;


    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    if( this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }
    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());
    render(this._siteTripMainComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
