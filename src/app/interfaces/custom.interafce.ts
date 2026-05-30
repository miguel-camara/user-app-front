export interface ModalConfig {
  title?: string;

  message?: string;

  type?: 'success' | 'error' | 'warning' | 'info' | 'question';

  confirmText?: string;

  cancelText?: string;

  showCancelButton?: boolean;

  closeOnBackdrop?: boolean;

  showConfirmButton?: boolean;

  autoClose?: boolean;

  timer?: number;

  position?: 'row' | 'column';
}
