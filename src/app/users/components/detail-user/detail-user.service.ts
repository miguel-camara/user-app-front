import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { DetailUser } from './detail-user';

@Injectable({
  providedIn: 'root',
})
export class DetailUserService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  open(user: User): void {
    const componentRef = createComponent(DetailUser, {
      environmentInjector: this.injector,
    });

    componentRef.setInput('user', user);

    componentRef.instance.accept.subscribe(() => {
      this.close(componentRef);
    });

    this.appRef.attachView(componentRef.hostView);

    document.body.appendChild(componentRef.location.nativeElement);
  }

  private close(componentRef: any) {
    this.appRef.detachView(componentRef.hostView);

    componentRef.destroy();
  }
}
