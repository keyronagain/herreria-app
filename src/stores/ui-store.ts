import { create } from 'zustand';

interface UIState {
  proyectoIdParaCotizar: string | null;
  setProyectoIdParaCotizar: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  proyectoIdParaCotizar: null,
  setProyectoIdParaCotizar: (id) => set({ proyectoIdParaCotizar: id }),
}));
