// LoadingContext.tsx
import React, { createContext, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const value = { loading, setLoading };
  console.log("loading", loading);

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
