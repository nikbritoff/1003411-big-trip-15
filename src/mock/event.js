import { getRandomIntOfRange } from './utils';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const EVENT_DESTINATION_NAMES = ['Rome', 'New York', 'Moscow', 'Tokyo', 'Paris', 'Stockholm', 'Oslo', 'Berlin', 'Prague'];
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
const PICTURE_DESCRIPTIONS = [
  'Best place I have seen',
  'I shoud see this!',
  'What a lovely shoot',
  'Great!',
  'Modern style',
];

const BACKEND_OFFERS = [
  {
    type: 'taxi',
    offers: [
      {
        title: 'Upgrade to comfort class',
        price: 100,
        isChecked: true,
      },
      {
        title: 'Upgrade to bussines class',
        price: 200,
        isChecked: false,
      },
      {
        title: 'Driver in a suit',
        price: 300,
        isChecked: true,
      },
      {
        title: 'Choose the radio station',
        price: 400,
        isChecked: false,
      },
      {
        title: 'White car',
        price: 500,
        isChecked: true,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        title: 'Select seat',
        price: 10,
        isChecked: true,
      },
      {
        title: 'Warm tea or coffee',
        price: 20,
        isChecked: true,
      },
      {
        title: 'Female wagon',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Express',
        price: 40,
        isChecked: false,
      },
      {
        title: 'Shower',
        price: 50,
        isChecked: true,
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        title: 'Select seat',
        price: 10,
        isChecked: true,
      },
      {
        title: 'Window seat',
        price: 20,
        isChecked: true,
      },
      {
        title: 'Warm tea or coffee',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Express bus',
        price: 40,
        isChecked: false,
      },
      {
        title: 'No covid sertificate',
        price: 50,
        isChecked: true,
      },
    ],
  },
];

const BACKEND_DESTINATIONS = [
  {
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building 1',
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163314',
        'description': 'Chamonix parliament building 2',
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163312',
        'description': 'Chamonix parliament building 3',
      },
    ],
  },
  {
    'description': 'Moscow is Best',
    'name': 'Moscow',
    'pictures': [],
  },
  {
    'description': '',
    'name': 'London',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163321',
        'description': 'London',
      },
    ],
  },
];

const OPTION_TITLES = {
  taxi: {
    options: [
      {
        title: 'Upgrade to comfort class',
        price: 100,
        isChecked: true,
      },
      {
        title: 'Upgrade to bussines class',
        price: 200,
        isChecked: false,
      },
      {
        title: 'Driver in a suit',
        price: 300,
        isChecked: true,
      },
      {
        title: 'Choose the radio station',
        price: 400,
        isChecked: false,
      },
      {
        title: 'White car',
        price: 500,
        isChecked: true,
      },
    ],
  },
  train: {
    options: [
      {
        title: 'Select seat',
        price: 10,
        isChecked: true,
      },
      {
        title: 'Warm tea or coffee',
        price: 20,
        isChecked: true,
      },
      {
        title: 'Female wagon',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Express',
        price: 40,
        isChecked: false,
      },
      {
        title: 'Shower',
        price: 50,
        isChecked: true,
      },
    ],
  },
  bus: {
    options: [
      {
        title: 'Select seat',
        price: 10,
        isChecked: true,
      },
      {
        title: 'Window seat',
        price: 20,
        isChecked: true,
      },
      {
        title: 'Warm tea or coffee',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Express bus',
        price: 40,
        isChecked: false,
      },
      {
        title: 'No covid sertificate',
        price: 50,
        isChecked: true,
      },
    ],
  },
  drive: {
    options: [
      {
        title: 'Baby seat',
        price: 12,
        isChecked: true,
      },
      {
        title: 'Full tunk',
        price: 50,
        isChecked: true,
      },
      {
        title: 'Snow tyres',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Technical assistance',
        price: 70,
        isChecked: false,
      },
      {
        title: 'Full coverage',
        price: 250,
        isChecked: true,
      },
    ],
  },
  flight: {
    options: [
      {
        title: 'Upgrade to bussines class',
        price: 50,
        isChecked: true,
      },
      {
        title: 'Special food',
        price: 22,
        isChecked: true,
      },
      {
        title: 'Online check-in',
        price: 35,
        isChecked: true,
      },
      {
        title: 'Free taxi',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Alcohol',
        price: 60,
        isChecked: false,
      },
    ],
  },
  restaurant: {
    options: [
      {
        title: 'Live music',
        price: 26,
        isChecked: false,
      },
      {
        title: 'Special menu',
        price: 32,
        isChecked: true,
      },
      {
        title: 'Select table',
        price: 55,
        isChecked: false,
      },
      {
        title: 'Free driver',
        price: 30,
        isChecked: false,
      },
      {
        title: 'Flowers',
        price: 10,
        isChecked: false,
      },
    ],
  },
};

const generateEventType = () => {
  const typeIndex = getRandomIntOfRange(0, EVENT_TYPES.length);
  return EVENT_TYPES[typeIndex];
};

const generateEventDestinationName = () => {
  const cityIndex = getRandomIntOfRange(0, EVENT_DESTINATION_NAMES.length);
  return EVENT_DESTINATION_NAMES[cityIndex];
};

const generateEventOptions = (type) => {
  const options = [];

  if (OPTION_TITLES[type] !== undefined) {
    const optionsAmount = getRandomIntOfRange(2, 6);
    for (let i = 0; i < optionsAmount; i++) {
      const currentOption = OPTION_TITLES[type].options[getRandomIntOfRange(0, OPTION_TITLES[type].options.length)];
      options.push({
        title: currentOption.title,
        price: currentOption.price,
        isChecked: currentOption.isChecked,
      });
    }
  }

  return options;
};

const generateEventDestinationDescription = () => {
  const sentenciesAmout = getRandomIntOfRange(1, 6);
  let description = '';

  for (let i = 0; i < sentenciesAmout; i++) {
    description = `${description} ${DESTINATION_INFO_DESCRIPTIONS[getRandomIntOfRange(0, DESTINATION_INFO_DESCRIPTIONS.length)]}`;
  }

  return description;
};

const generateEventDestinationPitures = () => {
  const picturesAmount = getRandomIntOfRange(0, 10);
  const pictures = new Array(picturesAmount).fill('').map(() => ({
    src: `http://picsum.photos/248/152?r=${getRandomIntOfRange(1, 25)}`,
    description: PICTURE_DESCRIPTIONS[getRandomIntOfRange(0, PICTURE_DESCRIPTIONS.length)],
  }));
  return pictures;
};

const generateDateFrom = () => {
  const now = dayjs();
  const eventDate = now.add(getRandomIntOfRange(3, 3000), 'hour').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return eventDate;
};

const generateEvent = () => {
  // const type = generateEventType();
  const type = BACKEND_OFFERS[getRandomIntOfRange(0,3)];
  const dateFrom = generateDateFrom();
  const destination = BACKEND_DESTINATIONS[0];

  return {
    basePrice: getRandomIntOfRange(0, 3000),
    dateFrom,
    dateTo: dayjs(dateFrom).add(getRandomIntOfRange(1, 300), 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),

    // destination: {
    //   name: generateEventDestinationName(),
    //   description: generateEventDestinationDescription(),
    //   pictures: generateEventDestinationPitures(),
    // },
    destination,

    id: nanoid(),
    isFavorite: Boolean(getRandomIntOfRange(0, 2)),
    options: type.offers,
    type: type.type,
  };
};

const generateEvents = (amount) => {
  const events = new Array(amount).fill('').map(() => generateEvent());

  return events;
};

export {generateEvent, generateEvents, OPTION_TITLES, EVENT_DESTINATION_NAMES, EVENT_TYPES, DESTINATION_INFO_DESCRIPTIONS, PICTURE_DESCRIPTIONS, BACKEND_DESTINATIONS, BACKEND_OFFERS};
