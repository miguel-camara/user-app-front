import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input<number>(1);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  router = inject(Router);

  next(): number {

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

  navigate(page: number) {
    this.activePage.set(page);

    this.router.navigate(['/users'], {
      queryParams: { page: this.activePage() },
    });
  }
}
