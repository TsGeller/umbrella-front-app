import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './risk.html',
  styleUrl: './risk.scss'
})
export class RiskComponent {

}
