import { Component, HostListener, input, output } from '@angular/core';
import { ModalConfig } from '../../interfaces/custom.interafce';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
})
export class Alert {
  config = input.required<ModalConfig>();

  confirm = output<void>();

  cancel = output<void>();

  onBackdropClick() {
    if (this.config()?.closeOnBackdrop) {
      this.cancel.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.cancel.emit();
  }
}
