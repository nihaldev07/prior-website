"use client";

import { createContext, useContext, useState } from "react";

interface PageState {
  scrollPosition: number;
  filterData: Record<string, any>; // Extend this to include other state
  currentPage: number;
}

interface PageStateContextType {
  state: PageState;
  setState: React.Dispatch<React.SetStateAction<PageState>>;
}

const PageStateContext = createContext<PageStateContextType | undefined>(
  undefined
);

export const PageStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<PageState>({
    scrollPosition: 0,
    filterData: {}, // Default filter data
    currentPage: 1, // Default to the first page
  });

  return (
    <PageStateContext.Provider value={{ state, setState }}>
      {children}
    </PageStateContext.Provider>
  );
};

export const usePageState = () => {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within a PageStateProvider");
  }
  return context;
};
