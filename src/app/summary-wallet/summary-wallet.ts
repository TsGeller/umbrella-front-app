import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-wallet',
  imports: [],
  templateUrl: './summary-wallet.html',
  styleUrl: './summary-wallet.scss'
})
export class SummaryWallet {
  walletValue: number = 13223;
  totalInvest: number = 500;
}
