type PouchSize = "A" | "B" | "C" | "D" | "E" | "F";

export type PouchPriceMap = {
  [key in PouchSize]: number;
};

export type Cat = {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: PouchSize;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
};
