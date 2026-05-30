import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import { ModalConfig } from '../interfaces/custom.interafce';
import { Alert } from '../shared/alert/alert';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  open(config: ModalConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const componentRef = createComponent(Alert, {
        environmentInjector: this.injector,
      });

      componentRef.setInput('config', {
        type: 'info',

        closeOnBackdrop: true,

        showConfirmButton: true,

        showCancelButton: false,

        timer: 3000,

        position: 'column',

        ...config,
      });

      componentRef.instance.confirm.subscribe(() => {
        resolve(true);

        this.close(componentRef);
      });

      componentRef.instance.cancel.subscribe(() => {
        resolve(false);

        this.close(componentRef);
      });

      this.appRef.attachView(componentRef.hostView);

      document.body.appendChild(componentRef.location.nativeElement);

      if (config.autoClose) {
        setTimeout(() => {
          resolve(true);

          this.close(componentRef);
        }, config.timer);
      }
    });
  }

  private close(componentRef: any) {
    this.appRef.detachView(componentRef.hostView);

    componentRef.destroy();
  }
}
