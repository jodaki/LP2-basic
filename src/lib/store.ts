import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyDoc, sampleDoc } from "./workshop-data";
import type { WorkshopDoc } from "./types";

export {
  PRODUCTS,
  PACKS,
  QUALITY,
  APPROVAL,
  CUST_TYPES,
  EXPENSE_TYPES,
  PAY_METHODS,
  CITIES,
  REGIONS,
} from "./workshop-data";

export type WorkshopState = WorkshopDoc & {
  hydrated: boolean;
  hydrate: (doc: WorkshopDoc) => void;
  resetLocalSample: () => void;
};

export const useWorkshop = create<WorkshopState>()(
  persist(
    (set) => ({
      ...emptyDoc(),
      hydrated: false,
      hydrate: (doc) => set({ ...doc, hydrated: true }),
      resetLocalSample: () => set({ ...sampleDoc(), hydrated: true }),
    }),
    {
      name: "poldokhtar-workshop-v2",
      partialize: (s) => {
        const { hydrate, resetLocalSample, hydrated, ...doc } = s;
        void hydrate;
        void resetLocalSample;
        void hydrated;
        return doc;
      },
    },
  ),
);
