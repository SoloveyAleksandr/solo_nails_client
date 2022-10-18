import { v4 } from "uuid";
import { IHistoryItem, ITimeItem, IUser } from "../../interfaces";

export class User {
  inviteKey: string;
  uid: string;
  name: string;
  phone: string;
  instagram: string;
  history: {
    [key: string]: IHistoryItem
  };
  refferals: string[];
  privateKey: string;
  description: string;
  isAdmin: boolean;
  constructor(uid: string, phone: string) {
    this.uid = uid;
    this.name = '';
    this.phone = phone;
    this.instagram = '';
    this.refferals = [];
    this.history = {};
    this.privateKey = v4().slice(1, 7);
    this.inviteKey = '';
    this.description = '';
    this.isAdmin = false;
  }
}

export class UserConverter {
  inviteKey: string;
  uid: string;
  name: string;
  phone: string;
  instagram: string;
  history: {
    [key: string]: IHistoryItem
  };
  refferals: string[];
  privateKey: string;
  description: string;
  constructor(user: IUser) {
    this.uid = user.uid;
    this.name = user.name;
    this.phone = user.phone;
    this.instagram = user.instagram;
    this.refferals = user.refferals;
    this.history = user.history;
    this.privateKey = user.privateKey;
    this.inviteKey = user.description;
    this.description = user.inviteKey;
  }
}

export const userConverter = {
  toFirestore: (user: IUser) => {
    return {
      uid: user.uid,
      name: user.name,
      phone: user.phone,
      instagram: user.instagram,
      refferals: user.refferals,
      history: user.history,
      privateKey: user.privateKey,
      inviteKey: user.description,
      description: user.inviteKey,
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: IUser = snapshot.data(options);
    return new UserConverter(data);
  }
};

export class History {
  id: string;
  time: ITimeItem;
  status: 'await' | 'success' | 'canceled';
  constructor(time: ITimeItem) {
    this.id = time.id;
    this.time = time;
    this.status = 'await';
  }
}

export class UserReserve {
  id: string;
  uid: string;
  time: ITimeItem;
  isConfirmed: boolean;
  constructor(time: ITimeItem, status?: boolean) {
    this.id = time.id;
      this.uid = time.client.uid;
      this.time = time;
      this.isConfirmed = status || false;
  }
};