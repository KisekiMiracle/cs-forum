import { create } from "zustand";

interface ThreadEditState {
  title: string;
  tags: string;
  markdownContent: string;

  // Actions
  setFields: (
    fields: Partial<
      Pick<ThreadEditState, "title" | "tags" | "markdownContent">
    >,
  ) => void;
  reset: () => void;
}

export const useThreadEditStore = create<ThreadEditState>((set) => ({
  title: "",
  tags: "",
  markdownContent: "",

  setFields: (fields) => set((state) => ({ ...state, ...fields })),
  reset: () => set({ title: "", tags: "", markdownContent: "" }),
}));
