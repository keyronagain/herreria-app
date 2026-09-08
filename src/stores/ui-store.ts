import { create } from 'zustand';

interface UIState {
  proyectoIdParaCotizar: string | null;
  setProyectoIdParaCotizar: (id: string | null) => void;
  toast: string | null;
  mostrarToast: (mensaje: string) => void;
  limpiarToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  proyectoIdParaCotizar: null,
  setProyectoIdParaCotizar: (id) => set({ proyectoIdParaCotizar: id }),
  toast: null,
  mostrarToast: (mensaje) => set({ toast: mensaje }),
  limpiarToast: () => set({ toast: null }),
}));
