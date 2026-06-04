import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserPage } from '../../interfaces/user.interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input<number>(1);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  router = inject(Router);

  next(): number {
    console.log('Next');

    if (this.activePage() === this.pages()) return this.activePage();
    this.activePage.update((val) => val + 1);

    this.router.navigate(['/users'], {
      queryParams: { page: this.activePage() },
    });

    return this.activePage();
  }

  before(): number {
    if (this.activePage() === 1) return this.activePage();
    this.activePage.update((val) => val - 1);

    this.router.navigate(['/users'], {
      queryParams: { page: this.activePage() },
    });

    return this.activePage();
  }
}
