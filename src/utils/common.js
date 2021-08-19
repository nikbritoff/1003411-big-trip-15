const updateArrayElement = (array, update) => {
  const index = array.findIndex((element) => element.id === update.id);

  if (index === -1) {
    return array;
  }

  return [
    ...array.slice(0, index),
    update,
    ...array.slice(index + 1),
  ];
};

export {updateArrayElement};
