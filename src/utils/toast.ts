export interface ToastEventDetail {
  id: string;
  type: 'error' | 'success' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export const toast = {
  error: (message: string, title?: string, duration: number = 4500) => {
    if (typeof window === 'undefined') return;
    const detail: ToastEventDetail = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'error',
      title: title || 'Error',
      message,
      duration,
    };
    window.dispatchEvent(new CustomEvent('typlix-app-toast', { detail }));
  },
  success: (message: string, title?: string, duration: number = 4000) => {
    if (typeof window === 'undefined') return;
    const detail: ToastEventDetail = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'success',
      title: title || 'Success',
      message,
      duration,
    };
    window.dispatchEvent(new CustomEvent('typlix-app-toast', { detail }));
  },
  info: (message: string, title?: string, duration: number = 4000) => {
    if (typeof window === 'undefined') return;
    const detail: ToastEventDetail = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'info',
      title: title || 'Notice',
      message,
      duration,
    };
    window.dispatchEvent(new CustomEvent('typlix-app-toast', { detail }));
  },
};
