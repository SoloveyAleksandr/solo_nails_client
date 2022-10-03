import { IDay, ITimeItem } from "../../interfaces";

export class Day {
  date: {
    full: string,
    formate: string
  };
  timeList: {
    [key: string]: ITimeItem
  };

  constructor(
    date: {
      full: string,
      formate: string
    },
    timeList: {
      [key: string]: ITimeItem
    } = {}
  ) {
    this.date = date;
    this.timeList = timeList;
  }
}

export const sortByTime = (a: ITimeItem, b: ITimeItem) => {
  const prev = Number(a.time.slice(0, 2) + a.time.slice(3));
  const next = Number(b.time.slice(0, 2) + b.time.slice(3));
  return prev - next;
};

export const sortTimesList = (day: IDay) => {
  const newList = Object.values(day.timeList);
  const newDay = JSON.parse(JSON.stringify(day));
  newDay.workList = newList.sort((a, b) => sortByTime(a, b));;

  return newDay;
};

export const sortByDate = (a: ITimeItem, b: ITimeItem) => {
  return Number(a.date.full) - Number(b.date.full);
};

export const sortReserves = (a: ITimeItem, b: ITimeItem) => {
  if (a.date.full === b.date.full) {
    return sortByTime(a, b);
  } return sortByDate(a, b);
}

export const dayConverter = {
  toFirestore: (day: IDay) => {
    return {
      date: day.date,
      timeList: day.timeList,
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: IDay = snapshot.data(options);
    return new Day(data.date, data.timeList);
  }
};
