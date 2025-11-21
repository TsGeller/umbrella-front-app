import { Stock } from './stock.model';

export class Portfolio {
  private stock_composition: Stock[]= [];
  private portfolio_value: number= 0;
  owners: string[]= ["Antoine","Arthur"];

  constructor() {
  }

  setStockComposition(holdings: Stock []) {
    this.stock_composition = holdings;
  }
  updatePriceOfTicker(ticker: string, newPrice: number, pnl?: number): boolean {
    const stock = this.stock_composition.find(s => s.ticker === ticker);
    if (stock) {
      stock.price = newPrice;
      if (typeof pnl === 'number') {
        stock.pnl = pnl;
      }
      return true;
    }
    return false;
  }
  setPortfolioValue(value: number) {
    this.portfolio_value = value;
  }
  getStcokComposition(): Stock[] {
    return this.stock_composition;
  }
  updateNameOfTicker(ticker: string, name: string): boolean {
    const stock = this.stock_composition.find(s => s.ticker === ticker);
    if (stock) {
      stock.name = name;
      return true;
    }
    return false;
  }
  getPortfolioValue(): number {
    return this.portfolio_value;
  }
  getOwners(): string[] {
    return this.owners;
  }
  setOwners(owners: string[]) {
    this.owners = owners;
  }
}
