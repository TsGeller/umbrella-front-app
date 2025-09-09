export class Stock {
  ticker: string;
  price: number;
  name: string ;
  quantity: number;

  constructor(ticker : string, price : number,name: string, quantity: number) {
    this.ticker = ticker;
    this.price = price;
    this.name = name;
    this.quantity = quantity;

  }
}