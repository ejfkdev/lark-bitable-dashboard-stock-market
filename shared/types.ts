export interface IGetGanner {
  QueryID: string;
  ResultCode: string;
  Result: Result;
}

export interface Result {
  list: Item[];
  tabs: Tab[];
  curtab: string;
}

export interface Item {
  p: string;
  lastPrice: string;
  status: string;
  ratio: string;
  increase: string;
  code: string;
  name: string;
  market: string;
}

export interface Tab {
  text: string;
  market: string;
}

export interface ICustomConfig {
  code: string;
  color: string;
  interval: number;
}
