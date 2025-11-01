import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {

}
