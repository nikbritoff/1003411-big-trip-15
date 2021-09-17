import dayjs from 'dayjs';
import  duration  from 'dayjs/plugin/duration';
dayjs.extend(duration);
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Smart from './smart';
import { convertTimeFromMiliseconds, compareNumbericMoney, compareNumbericTime, compareNumbericAmount } from '../utils/common';

const BAR_HEIGHT = 55;

const renderTypeChart = (typeCtx, chartData) => {
  typeCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(compareNumbericAmount);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.amount),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderMoneyChart = (moneyCtx, chartData) => {
  moneyCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(compareNumbericMoney);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.money),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpentChart = (timeCtx, chartData) => {
  timeCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(compareNumbericTime);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.timeSpend),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => convertTimeFromMiliseconds(val),
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends Smart{
  constructor(eventsModel) {
    super();
    this.isHidden = true;
    this._eventsModel = eventsModel;
    this._events = this._eventsModel.getEvents();

    this._typeChart = null;
    this._moneyChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    // Отрисовка статистик
    if (this._typeChart !== null) {
      this._typeChart = null;
    }

    const typeCtx = this.getElement().querySelector('#type');
    const moneyCtx = this.getElement().querySelector('#money');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._uniqueTripEventsTypes = this._getUniqueTripEventsTypes();
    this._tripEventsChartData = this._getTripEventsChartData();

    this._typeChart = renderTypeChart(typeCtx, this._tripEventsChartData);
    this._moneyChart = renderMoneyChart(moneyCtx, this._tripEventsChartData);
    this._timeSpendChart = renderTimeSpentChart(timeCtx, this._tripEventsChartData);
  }

  _getUniqueTripEventsTypes() {
    const uniqueEventsTypes = [];

    this._events.forEach((event) => {
      if (uniqueEventsTypes.indexOf(event.type) === -1) {
        uniqueEventsTypes.push(event.type);
      }
    });

    return uniqueEventsTypes;
  }

  _filterEventsByType(event) {
    const eventsFilteredByType = this._events.filter((filterEvent) => event === filterEvent.type);
    return eventsFilteredByType;
  }

  _getMoneyValues(event) {
    const eventsFilteredByType = this._filterEventsByType(event);
    const totalMoneyValue = eventsFilteredByType.reduce((total, filteredEvent) => total + filteredEvent.basePrice, 0);

    return totalMoneyValue;
  }

  _getTripEventsChartData() {
    const tripEventsChartData = this._uniqueTripEventsTypes.map((event) => {
      const chartData = {
        type: event,
        money: this._getMoneyValues(event),
        amount: this._getAmountEventsOfType(event),
        timeSpend: this._getSpentTime(event),
      };

      return chartData;
    });

    return tripEventsChartData;
  }

  _getAmountEventsOfType(currentEvent) {
    const allEventTypes = [];
    this._events.forEach((event) => {
      if (currentEvent === event.type) {
        allEventTypes.push(event.type);
      }
    });

    return allEventTypes.length;
  }

  _getSpentTime(event) {
    const eventsFilteredByType = this._filterEventsByType(event);
    const totalSpentTime = eventsFilteredByType.reduce((timeDifference, filteredEvent) => {
      const start = new Date(filteredEvent.dateFrom);
      const end = new Date(filteredEvent.dateTo);
      return timeDifference + (end - start);
    }, 0);

    return totalSpentTime;
  }
}
