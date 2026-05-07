import { create } from "zustand";

type ModalType =
  | "confirm_delete"
  | "edit_employee"
  | "add_customer"
  | "transfer"
  | "leave_approval"
  | null;

interface ModalData {
  title?: string;
  entityId?: string;
  [key: string]: unknown;
}

interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalType;
  modalData: ModalData | null;
  isLoading: boolean;
  loadingMessage: string;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState & UIActions>()((set) => ({
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  isLoading: false,
  loadingMessage: "",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (modal, data) =>
    set({ activeModal: modal, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setLoading: (loading, message = "") =>
    set({ isLoading: loading, loadingMessage: message }),
}));
