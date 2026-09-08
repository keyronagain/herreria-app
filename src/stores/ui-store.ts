import { create } from 'zustand';

export type ToastTipo = 'info' | 'success' | 'error';

export interface ToastData {
  mensaje: string;
  tipo: ToastTipo;
}

interface UIState {
  toast: ToastData | null;
  mostrarToast: (mensaje: string, tipo?: ToastTipo) => void;
  limpiarToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  mostrarToast: (mensaje, tipo = 'success') =>
    set({ toast: { mensaje, tipo } }),
  limpiarToast: () => set({ toast: null }),
}));
