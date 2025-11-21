export class Stock {
  ticker: string;
  price: number;
  name: string ;
  quantity: number;
  pnl: number;

  constructor(ticker : string, price : number,name: string, quantity: number, pnl: number = 0) {
    this.ticker = ticker;
    this.price = price;
    this.name = name;
    this.quantity = quantity;
    this.pnl = pnl;

  }
}
