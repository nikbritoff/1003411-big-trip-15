const SortType = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time',
};

const EventFormMode = {
  edit: 'Delete',
  add: 'Cancel',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  // Обновление только данных: установка избранного
  MINOR: 'MINOR',
  // Обновление только одного события: тип события, опции, сортировка
  MAJOR: 'MAJOR',
  // Обновление всей страницы: цена, пункт назначения, дата начала/конца, удаление, добавление
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuItem = {
  EVENTS: 'EVENTS',
  STATISTICS: 'STATISTICS',
};

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FormState = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export {SortType, Mode, EventFormMode, UserAction, UpdateType, FilterType, MenuItem, EVENT_TYPES, FormState};
