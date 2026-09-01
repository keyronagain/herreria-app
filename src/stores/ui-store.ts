import { create } from 'zustand';

interface UIState {
  modalMaterialAbierto: boolean;
  setModalMaterialAbierto: (abierto: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modalMaterialAbierto: false,
  setModalMaterialAbierto: (abierto) => set({ modalMaterialAbierto: abierto }),
}));
