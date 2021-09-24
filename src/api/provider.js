import EventsModel from '../model/events.js';
import { isOnline } from '../utils/common.js';

const getSyncedEvents = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getData() {
    if(isOnline()) {
      return this._api.getData()
        .then((serverData) => {
          const items = createStoreStructure(serverData.events.map((EventsModel.adaptToServer)));
          this._store.setItems(items);
          return serverData;
        });
    }

    const storeEvents = Object.values(this._store.getItems());
    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));
    return Promise.resolve(event);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error('Add event failed'));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    return Promise.reject(new Error('Delete event failed'));
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());
      return this._api.sync(storeEvents)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const updatedEvents = getSyncedEvents(response.updated);
          const createdEvents = getSyncedEvents(response.created);
          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
