import { Component, HostListener, input, output } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.html',
})
export class DetailUser {
  user = input.required<User>();

  accept = output<void>();

  onBackdropClick() {
    this.accept.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.accept.emit();
  }
}
