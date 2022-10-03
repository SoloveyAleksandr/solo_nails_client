import { v4 } from "uuid";
import { ITimeItem } from "../../interfaces";

export class Time {
  id: string;
  isReserved: boolean;
  time: string;
  date: {
    full: string,
    formate: string
  };
  client: {
    uid: string,
    confirmed: boolean,
  };
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    phoneNumber: string,
    comment: string,
  }

  constructor(
    props: {
      id?: string,
      time: string,
      date: {
        full: string,
        formate: string
      },
      isReserved?: boolean,
      client?: {
        uid: string,
        confirmed: boolean,
      },
      isOffline?: {
        status: boolean,
        name: string,
        instagram: string,
        phoneNumber: string,
        comment: string,
      },
    }
  ) {
    this.id = props.id || v4().slice(0, 10);
    this.isReserved = props.isReserved || false;
    this.date = props.date
    this.time = props.time;
    this.client = props.client || {
      uid: '',
      confirmed: false,
    };
    this.isOffline = props.isOffline || {
      status: false,
      name: '',
      instagram: '',
      phoneNumber: '',
      comment: '',
    }
  }
}

export class TimeConverter {
  id: string;
  isReserved: boolean;
  time: string;
  date: {
    full: string,
    formate: string
  };
  client: {
    uid: string,
    confirmed: boolean,
  }
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    phoneNumber: string,
    comment: string,
  }
  constructor(time: ITimeItem) {
    this.id = time.id;
    this.isReserved = time.isReserved;
    this.date = time.date;
    this.time = time.time;
    this.client = time.client;
    this.isOffline = time.isOffline;
  }
}

export const timeConverter = {
  toFirestore: (time: ITimeItem) => {
    return {
      id: time.id,
      isReserved: time.isReserved,
      time: time.time,
      date: time.date,
      client: time.client,
      isOffline: time.isOffline
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: ITimeItem = snapshot.data(options);
    return new TimeConverter(data);
  }
};

export class Reserve {
  date: {
    full: string,
    formate: string
  };
  timeList: {
    [key: string]: ITimeItem
  };
  constructor(date: {
    full: string,
    formate: string,
  }) {
    this.date = date;
    this.timeList = {}
  }
}