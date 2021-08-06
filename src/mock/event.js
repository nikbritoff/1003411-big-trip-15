import { getRandomIntOfRange } from './utils';
import dayjs from 'dayjs';

const DESTINATION_INFO_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const OPTION_TITLES = {
  taxi: {
    options: [
      {
        title: 'Upgrade to comfort class',
        price: 100,
      },
      {
        title: 'Upgrade to bussines class',
        price: 200,
      },
      {
        title: 'Driver in a suit',
        price: 300,
      },
      {
        title: 'Choose the radio station',
        price: 400,
      },
      {
        title: 'White car',
        price: 500,
      },
    ],
  },
  train: {
    options: [
      {
        title: 'Select seat',
        price: 10,
      },
      {
        title: 'Warm tea or coffee',
        price: 20,
      },
      {
        title: 'Female wagon',
        price: 30,
      },
      {
        title: 'Express',
        price: 40,
      },
      {
        title: 'Shower',
        price: 50,
      },
    ],
  },
  bus: {
    options: [
      {
        title: 'Select seat',
        price: 10,
      },
      {
        title: 'Window seat',
        price: 20,
      },
      {
        title: 'Warm tea or coffee',
        price: 30,
      },
      {
        title: 'Express bus',
        price: 40,
      },
      {
        title: 'No covid sertificate',
        price: 50,
      },
    ],
  },
  drive: {
    options: [
      {
        title: 'Baby seat',
        price: 12,
      },
      {
        title: 'Full tunk',
        price: 50,
      },
      {
        title: 'Snow tyres',
        price: 30,
      },
      {
        title: 'Technical assistance',
        price: 70,
      },
      {
        title: 'Full coverage',
        price: 250,
      },
    ],
  },
  flight: {
    options: [
      {
        title: 'Upgrade to bussines class',
        price: 50,
      },
      {
        title: 'Special food',
        price: 22,
      },
      {
        title: 'Online check-in',
        price: 35,
      },
      {
        title: 'Free taxi',
        price: 30,
      },
      {
        title: 'Alcohol',
        price: 60,
      },
    ],
  },
  restaurant: {
    options: [
      {
        title: 'Live music',
        price: 26,
      },
      {
        title: 'Special menu',
        price: 32,
      },
      {
        title: 'Select table',
        price: 55,
      },
      {
        title: 'Free driver',
        price: 30,
      },
      {
        title: 'Flowers',
        price: 10,
      },
    ],
  },
};
  // taxi: [
  //   'Upgrade to comfort class',
  //   'Upgrade to bussines class',
  //   'Driver in a suit',
  //   'Choose the radio station',
  //   'White car',
  // ],
  // bus: [
  //   'Select seat',
  //   'Warm tea or coffee',
  //   'Window seat',
  //   'Express bus',
  //   'No covid sertificate',
  // ],
  // drive: [
  //   'Full tunk',
  //   'Full coverage',
  //   'Technical assistance',
  //   'Baby seat',
  //   'Snow tyres',
  // ],
  // flight: [
  //   'Upgrade to bussines class',
  //   'Special food',
  //   'Online check-in',
  //   'Free taxi',
  //   'Alcohol',
  // ],
  // restaurant: [
  //   'Live music',
  //   'Special menu',
  //   'Select table',
  //   'Free driver',
  //   'Flowers',
  // ],
// };

const generateEventType = () => {
  // const types = ['taxi','train'];
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const typeIndex = getRandomIntOfRange(0, types.length);
  return types[typeIndex];
};

const generateEventDestination = () => {
  const cities = ['Rome', 'New York', 'Moscow', 'Tokyo', 'Paris', 'Stockholm', 'Oslo', 'Berlin ', 'Prague'];
  const cityIndex = getRandomIntOfRange(0, cities.length);
  return cities[cityIndex];
};

const generateEventOptions = (type) => {
  const options = [];

  const isValidType = () => OPTION_TITLES[type] !== undefined;

  const createOption = () => {
    const currentOption = OPTION_TITLES[type].options[getRandomIntOfRange(0, OPTION_TITLES[type].options.length)];
    return {
      title: currentOption.title,
      price: currentOption.price,
    };
  };

  const createOptions = (amount) => {
    for (let i = 0; i < amount; i++) {
      options.push(createOption());
    }
  };

  if (isValidType()) {
    const optionsAmount = getRandomIntOfRange(2, 6);
    createOptions(optionsAmount);
  }

  return options;
};

const generateEventDescription = () => {
  const sentenciesAmout = getRandomIntOfRange(1, 6);
  let description = '';

  for (let i = 0; i < sentenciesAmout; i++) {
    description = `${description} ${DESTINATION_INFO_DESCRIPTIONS[getRandomIntOfRange(0, DESTINATION_INFO_DESCRIPTIONS.length)]}`;
  }

  return description;
};

const generateEventPitures = () => {
  const photoDescriptions = [
    'Best place I have seen',
    'I shoud see this!',
    'What a lovely shoot',
    'Great!',
    'Modern style',
  ];
  const picturesAmount = getRandomIntOfRange(0, 10);
  const pictures = new Array(picturesAmount).fill('').map(() => ({
    src: `http://picsum.photos/248/152?r=${getRandomIntOfRange(1, 25)}`,
    description: photoDescriptions[getRandomIntOfRange(0, photoDescriptions.length)],
  }));
  return pictures;
};

const generateDateFrom = () => {
  const now = dayjs();
  const eventDate = now.add(getRandomIntOfRange(3, 3000), 'hour');
  return eventDate;
};

const generateEvent = () => {
  const eventPoint = {
    type: generateEventType(),
    destination: generateEventDestination(),
    description: generateEventDescription(),
    basePrice: getRandomIntOfRange(0, 3000),
    isFavorite: Boolean(getRandomIntOfRange(0, 2)),
    pictures: generateEventPitures(),
    dateFrom: generateDateFrom(),
  };

  eventPoint.options = generateEventOptions(eventPoint.type);
  eventPoint.dateTo = eventPoint.dateFrom.add(getRandomIntOfRange(1, 300), 'minute');

  return eventPoint;
};

const generateEvents = (amount) => {
  const events = new Array(amount).fill('').map(() => generateEvent());

  return events;
};

export {generateEvent, generateEvents, OPTION_TITLES};
