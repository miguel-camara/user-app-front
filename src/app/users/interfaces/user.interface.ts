export interface UserPage {
  content:          User[];
  pageable:         Pageable;
  last:             boolean;
  totalElements:    number;
  totalPages:       number;
  first:            boolean;
  numberOfElements: number;
  size:             number;
  number:           number;
  sort:             Sort;
  empty:            boolean;
}

export interface User {
  id?:       string;
  name:     string;
  lastname: string;
  email:    string;
  username: string;
  password: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  sort:       Sort;
  offset:     number;
  unpaged:    boolean;
  paged:      boolean;
}

export interface Sort {
  unsorted: boolean;
  empty:    boolean;
  sorted:   boolean;
}


