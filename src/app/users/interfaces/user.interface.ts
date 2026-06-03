export interface UserPage {
  content: User[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface User {
  id?: string;
  name: string;
  lastname: string;
  email?: string;
  username: string;
  password?: string;
  roles: Role[];
  admin?: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}
