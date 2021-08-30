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

export {SORT_TYPE, MODE, EVENT_FORM_MODE, USER_ACTION, UPDATE_TYPE};
