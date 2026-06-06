import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-cart-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-layout.html',
})
export class UserLayout {}
