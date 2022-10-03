export interface IDayItem {
  date: {
    full: string,
    formate: string,
  }
  day: string,
  month: string,
  year: string,
  isWeekend: boolean,
  isPrevMonth: boolean,
  isNextMonth: boolean,
  isToday: boolean,
}

export interface IDay {
  date: {
    full: string,
    formate: string
  }
  timeList: {
    [key: string]: ITimeItem
  },
}

export interface ITimeItem {
  id: string,
  isReserved: boolean,
  time: string,
  date: {
    full: string,
    formate: string
  },
  client: {
    uid: string,
    confirmed: boolean,
  },
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    phoneNumber: string,
    comment: string,
  }
}

export interface ISelectedDate {
  full: string,
  formate: string,
}

export interface IUser {
  inviteKey: string,
  uid: string,
  name: string,
  phone: string,
  instagram: string,
  history: {
    [key: string]: IHistoryItem
  },
  refferals: string[],
  privateKey: string,
  description: string,
}

export interface IHistoryItem {
  id: string,
  time: string,
  date: {
    full: string,
    formate: string,
  },
  status: 'await' | 'success' | 'canceled',
}

export interface ICustomWindow extends Window {
  recaptchaVerifier: any;
  hellow: any;
}

export interface IReserveItem {
  date: {
    full: string,
    formate: string,
  },
  timeList: {
    [key: string]: ITimeItem
  },
}

export interface IService {
  id: string,
  title: string,
  price: string,
  servicesList: {
    id: string,
    value: string,
  }[],
}