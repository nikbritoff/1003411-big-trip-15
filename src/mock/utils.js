const getRandomIntOfRange = (min, max) => {
  if (min < 0 || max < min) {
    throw new Error('Min can not be less than zero and max');
  } else {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

export {getRandomIntOfRange};
