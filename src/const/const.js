const SORT_TYPE = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time',
};

const EVENT_FORM_MODE = {
  edit: 'Delete',
  add: 'Cancel',
};

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const USER_ACTION = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  // Обновление только данных: установка избранного
  MINOR: 'MINOR',
  // Обновление только одного события: тип события, опции, сортировка
  MAJOR: 'MAJOR',
  // Обновление всей страницы: цена, пункт назначения, дата начала/конца, удаление, добавление
};

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MENU_ITEM = {
  EVENTS: 'EVENTS',
  STATISTICS: 'STATISTICS',
};

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const TRANSPORT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight'];

export {SORT_TYPE, MODE, EVENT_FORM_MODE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE, MENU_ITEM, EVENT_TYPES, TRANSPORT_TYPES};
