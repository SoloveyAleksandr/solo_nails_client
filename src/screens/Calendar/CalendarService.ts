import axios from 'axios';
import moment from 'moment';
import { IDayItem } from '../../interfaces';

const GLITCH_URL = 'https://verbose-remarkable-lumber.glitch.me';
const CYCLIC_URL = 'https://calendar-api.cyclic.app'

export const getServerMonth = async (selMonth: number, selYear: number) => {
  const query: {
    data: {
      calendarDays: IDayItem[],
      month: number,
      year: number,
    }
  } = await axios.get(CYCLIC_URL, {
    params: {
      month: selMonth,
      year: selYear
    },
  });
  return query.data;
};

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export const getMonth = (selMonth: number, selYear: number) => {
  const dateIsActual = Number(selYear) > 0;

  // const getNetDate = async () => {
  //   const query = await axios.get('http://worldclockapi.com/api/json/est/now');
  //   const data = query.data.currentDateTime;
  //   return data;
  // };

  // const netDate = await getNetDate();

  const year = dateIsActual ? selYear : moment().year();
  const month = dateIsActual ?
    selMonth > 2 ? selMonth : `0${selMonth}`
    : Number(moment().month()) + 1;

  const startOfWeek = moment(`01.${month}.${year}`, 'DD.MM.YYYY').startOf('month').startOf('week').subtract(1, 'day');
  const calendarDays = [...Array(42)].map(() => {
    const day = startOfWeek.add(1, 'day').clone();
    const dayFormat = day.format('DD.MM.YYYY');
    const dayMonth = day.month() + 1;
    const isWeekend = day.day() === 6 || day.day() === 0 ? true : false;

    const isNextMonth = (dayMonth > Number(month) && day.year() >= year) ||
      (day.year() > year) ? true : false;

    const isPrevMonth = (isNextMonth === false && dayMonth !== Number(month)) ? true : false;

    const isToday = moment().format('DD.MM.YYYY') === dayFormat ? true : false;
    return {
      date: {
        full: Number(day.format('x')),
        formate: dayFormat,
      },
      day: dayFormat.slice(0, 2),
      month: dayFormat.slice(3, 5),
      year: dayFormat.slice(6),
      isWeekend,
      isPrevMonth,
      isNextMonth,
      isToday,
    }
  });

  return {
    calendarDays,
    year: Number(year),
    month: Number(month),
  }
};
